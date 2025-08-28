'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface PDFUploaderProps {
  onPDFUploaded: (url: string, fileName: string) => void;
  topic?: string;
}

export default function PDFUploader({ onPDFUploaded, topic }: PDFUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);

    try {
      // Créer un FormData pour l'upload
      const formData = new FormData();
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
      onPDFUploaded(data.url, data.fileName);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'upload';
      setError(errorMessage);
      console.error('Erreur d\'upload:', error);
    } finally {
      setUploading(false);
    }
  }, [onPDFUploaded, topic]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="mb-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
            : 'border-gray-300 hover:border-red-400 dark:border-gray-700 dark:hover:border-red-500'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="text-center">
            <svg className="animate-spin h-6 w-6 mx-auto mb-2 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload en cours...</p>
          </div>
        ) : isDragActive ? (
          <p className="text-red-500">Déposez le PDF ici...</p>
        ) : (
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Cliquez ou glissez-déposez un PDF
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PDF jusqu&apos;à 10MB
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}