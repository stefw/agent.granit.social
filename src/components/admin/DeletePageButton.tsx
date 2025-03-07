'use client';

import { useState } from 'react';

interface DeletePageButtonProps {
  pageId: string;
}

export default function DeletePageButton({ pageId }: DeletePageButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      setLoading(true);
      
      try {
        // Utiliser l'API pour supprimer la page (même API que pour les posts)
        const response = await fetch(`/api/posts/${pageId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de la page');
        }
        
        // Recharger la page pour afficher les changements
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setLoading(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
    >
      {loading ? 'Suppression...' : 'Supprimer'}
    </button>
  );
}
