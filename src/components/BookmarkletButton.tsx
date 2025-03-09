'use client';

import React, { useState } from 'react';

interface BookmarkletButtonProps {
  bookmarkletCode: string;
  siteName: string;
}

export default function BookmarkletButton({ bookmarkletCode, siteName }: BookmarkletButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
        alert('Impossible de copier le code. Veuillez le sélectionner manuellement et utiliser Ctrl+C / Cmd+C.');
      });
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
        <code className="text-sm text-blue-600 dark:text-blue-400 whitespace-pre-wrap break-all">
          {bookmarkletCode}
        </code>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleCopy}
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        >
          {copied ? 'Copié !' : 'Copier le code'}
        </button>
        
        <a 
          className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md text-center"
          href="https://support.google.com/chrome/answer/188842?hl=fr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Comment créer un favori
        </a>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>
          <strong>Instructions :</strong>
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Cliquez sur "Copier le code" ci-dessus</li>
          <li>Créez un nouveau favori dans Chrome (clic droit sur la barre de favoris → Ajouter une page...)</li>
          <li>Donnez-lui un nom comme "Ajouter à {siteName}"</li>
          <li>Collez le code copié dans le champ URL</li>
          <li>Cliquez sur Enregistrer</li>
        </ol>
      </div>
    </div>
  );
}
