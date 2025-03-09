import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Vérifier si les variables d'environnement nécessaires sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérifier si les variables d'environnement sont définies
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Client pour le frontend (accès public)
export const supabase = isSupabaseConfigured 
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null;

// Client admin pour les opérations privilégiées (à utiliser uniquement côté serveur)
export const createAdminClient = () => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase n\'est pas configuré. Impossible de créer un client admin.');
    return null;
  }
  
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY n\'est pas défini. Impossible de créer un client admin.');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};
