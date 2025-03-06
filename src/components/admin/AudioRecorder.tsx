'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AudioRecorderProps {
  onAudioRecorded: (url: string, fileName: string) => void;
  topic?: string;
}

export default function AudioRecorder({ onAudioRecorded, topic }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Fonction pour démarrer l'enregistrement
  const startRecording = async () => {
    try {
      // Réinitialiser l'état
      audioChunksRef.current = [];
      setAudioBlob(null);
      setAudioUrl(null);
      setError(null);
      
      // Demander l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Configurer l'analyseur audio pour la visualisation
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Configurer le MediaRecorder avec une haute qualité
      const options = { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 128000 };
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      
      // Collecter les données audio
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      // Quand l'enregistrement est arrêté
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        
        // Arrêter le timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        // Arrêter la visualisation
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      // Démarrer l'enregistrement
      recorder.start(100); // Collecter les données toutes les 100ms
      setIsRecording(true);
      setIsPaused(false);
      
      // Démarrer le timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Démarrer la visualisation
      drawVisualizer();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'accès au microphone');
      console.error('Erreur d\'enregistrement:', err);
    }
  };
  
  // Fonction pour mettre en pause/reprendre l'enregistrement
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    
    if (isPaused) {
      // Reprendre l'enregistrement
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Reprendre le timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      // Mettre en pause l'enregistrement
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      // Mettre en pause le timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  // Fonction pour arrêter l'enregistrement
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsPaused(false);
  };
  
  // Fonction pour dessiner la visualisation audio
  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!isRecording) return;
      
      requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      canvasCtx.fillStyle = 'rgb(20, 20, 20)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        canvasCtx.fillStyle = `rgb(102, 102, 255)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
  };
  
  // Fonction pour normaliser les chaînes (supprimer les accents, etc.)
  const normalizeString = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
      .trim()
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .toLowerCase();
  };

  // Fonction pour uploader l'audio enregistré
  const uploadAudio = async () => {
    if (!audioBlob) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // Créer un FormData pour l'upload
      const formData = new FormData();
      
      // Convertir le blob en fichier avec extension .m4a
      const fileName = `recording_${Date.now()}.m4a`;
      const file = new File([audioBlob], fileName, { type: 'audio/mp4' });
      
      formData.append('file', file);
      
      if (topic) {
        // Normaliser le topic pour éviter les problèmes avec les caractères spéciaux
        const normalizedTopic = normalizeString(topic);
        formData.append('topic', normalizedTopic);
      }
      
      // Utiliser l'API pour uploader le fichier
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }
      
      const data = await response.json();
      
      // Appeler le callback avec l'URL
      onAudioRecorded(data.url, data.fileName);
      
      // Réinitialiser l'état
      setAudioBlob(null);
      setAudioUrl(null);
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue lors de l\'upload');
      console.error('Erreur d\'upload:', error);
    } finally {
      setUploading(false);
    }
  };
  
  // Formater le temps d'enregistrement (secondes -> MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Nettoyer les ressources lors du démontage du composant
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  return (
    <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Enregistrement audio</h3>
      
      {/* Visualiseur audio */}
      <div className="mb-4 bg-gray-900 rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={100}
          className="w-full h-24"
        />
      </div>
      
      {/* Contrôles d'enregistrement */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white"
              title="Démarrer l'enregistrement"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="6" />
              </svg>
            </button>
          ) : (
            <>
              <button
                onClick={togglePause}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                title={isPaused ? "Reprendre l'enregistrement" : "Mettre en pause"}
              >
                {isPaused ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 hover:bg-gray-700 text-white"
                title="Arrêter l'enregistrement"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <rect x="6" y="6" width="8" height="8" />
                </svg>
              </button>
            </>
          )}
        </div>
        
        <div className="text-sm font-mono">
          {formatTime(recordingTime)}
        </div>
      </div>
      
      {/* Lecteur audio et bouton d'upload */}
      {audioUrl && (
        <div className="space-y-3">
          <audio 
            src={audioUrl} 
            controls 
            className="w-full"
          />
          
          <div className="flex justify-end">
            <button
              onClick={uploadAudio}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Upload en cours...' : 'Utiliser cet enregistrement'}
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
