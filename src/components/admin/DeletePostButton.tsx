'use client';

import { useState } from 'react';

interface DeletePostButtonProps {
  postId: string;
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      setLoading(true);
      
      try {
        // Utiliser l'API pour supprimer le post
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du post');
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
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
    >
      {loading ? 'Suppression...' : 'Supprimer'}
    </button>
  );
}
