'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from './ImageUploader';
import AudioRecorder from './AudioRecorder';

// Import dynamique de l'éditeur Markdown pour éviter les erreurs SSR
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

// Import dynamique du prévisualiseur Markdown
const MDPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
);

interface MarkdownEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  topic?: string;
}

export default function MarkdownEditor({ initialValue, onChange, topic }: MarkdownEditorProps) {
  const [value, setValue] = useState(initialValue);
  
  // Fonction pour insérer du texte
  const insertText = useCallback((text: string) => {
    // Insérer simplement à la fin si nous n'avons pas accès au curseur
    const newValue = value + text;
    setValue(newValue);
    onChange(newValue);
  }, [value, onChange]);
  
  // Fonction appelée lorsqu'une image est uploadée
  const handleImageUploaded = useCallback((url: string, fileName: string) => {
    // Utiliser le nom du fichier comme texte alternatif pour l'image
    const altText = fileName.split('.')[0]; // Enlever l'extension
    const imageMarkdown = `![${altText}](${url})`;
    insertText(imageMarkdown);
  }, [insertText]);
  
  // Fonction appelée lorsqu'un audio est enregistré
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAudioRecorded = useCallback((url: string, fileName: string) => {
    const audioMarkdown = `<audio controls src="${url}"></audio>`;
    insertText(audioMarkdown);
  }, [insertText]);
  
  // Fonction pour insérer des éléments de formatage Markdown
  const insertFormatting = useCallback((type: string) => {
    let formattedText = '';
    
    switch (type) {
      case 'bold':
        formattedText = `**texte en gras**`;
        break;
      case 'italic':
        formattedText = `*texte en italique*`;
        break;
      case 'heading':
        formattedText = `\n## Titre\n`;
        break;
      case 'link':
        formattedText = `[lien](url)`;
        break;
      case 'list':
        formattedText = `\n- élément de liste\n- élément de liste\n- élément de liste\n`;
        break;
      case 'code':
        formattedText = `\n\`\`\`\ncode\n\`\`\`\n`;
        break;
      case 'table':
        formattedText = `\n| Colonne 1 | Colonne 2 | Colonne 3 |\n| --- | --- | --- |\n| Cellule | Cellule | Cellule |\n| Cellule | Cellule | Cellule |\n`;
        break;
      default:
        return;
    }
    
    // Insérer le texte formaté
    insertText(formattedText);
  }, [insertText]);
  
  return (
    <div className="space-y-4">
      {/* Barre d'outils de formatage */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onClick={() => insertFormatting('bold')}
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
          title="Gras"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('italic')}
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
          title="Italique"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('heading')}
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
          title="Titre"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('link')}
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
          title="Lien"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('list')}
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
          title="Liste"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('code')}
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
          title="Code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('table')}
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
          title="Tableau"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Éditer</TabsTrigger>
          <TabsTrigger value="preview">Prévisualiser</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-2">
          <div data-color-mode="light" className="w-full">
            <MDEditor
              value={value}
              onChange={(val) => {
                setValue(val || '');
                onChange(val || '');
              }}
              // Pas de ref pour le textarea
              height={500}
              preview="edit"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-2">
          <div data-color-mode="light" className="w-full border rounded-md p-4 min-h-[500px] bg-white dark:bg-gray-800">
            <MDPreview source={value} />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Ajouter une image</h3>
          <ImageUploader onImageUploaded={handleImageUploaded} topic={topic} />
        </div>
        
        <div>
          <AudioRecorder onAudioRecorded={handleAudioRecorded} topic={topic} />
        </div>
      </div>
    </div>
  );
}
