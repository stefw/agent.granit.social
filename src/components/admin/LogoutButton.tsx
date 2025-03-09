'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      console.log('Tentative de déconnexion...');
      
      // Vérifier si Supabase est configuré
      if (!supabase) {
        throw new Error('Service d\'authentification temporairement indisponible. Veuillez réessayer plus tard.');
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      console.log('Déconnexion réussie, redirection vers la page de connexion');
      
      // Ajouter un délai avant la redirection
      setTimeout(() => {
        // Utiliser window.location.replace pour une redirection complète
        window.location.href = '/admin/login';
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50"
    >
      {loading ? 'Déconnexion...' : 'Déconnexion'}
    </button>
  );
}
