'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface LinkFormProps {
  initialData?: {
    id?: string;
    title?: string;
    content?: string;
    excerpt?: string;
    url?: string;
    slug?: string;
  };
  isEditing?: boolean;
}

export default function LinkForm({ initialData = {}, isEditing = false }: LinkFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Récupérer les paramètres d'URL (pour la bookmarklet)
  const urlParam = searchParams.get('url');
  const titleParam = searchParams.get('title');
  const excerptParam = searchParams.get('excerpt');
  
  const [title, setTitle] = useState(initialData.title || titleParam || '');
  const [content, setContent] = useState(initialData.content || '');
  const [excerpt, setExcerpt] = useState(initialData.excerpt || excerptParam || '');
  const [url, setUrl] = useState(initialData.url || urlParam || '');
  const [slug, setSlug] = useState(initialData.slug || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Générer un slug à partir du titre
  useEffect(() => {
    if (!isEditing && title && !slug) {
      // Ajouter un timestamp pour garantir l'unicité
      const timestamp = new Date().getTime().toString().slice(-6);
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
        .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
        .replace(/--+/g, '-') // Remplacer les tirets multiples par un seul
        .trim();
      
      // Ajouter le timestamp pour garantir l'unicité
      setSlug(`${generatedSlug}-${timestamp}`);
    }
  }, [title, isEditing, slug]);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Vérifier que les champs obligatoires sont remplis
      if (!title || !url || !content) {
        throw new Error('Le titre, l\'URL et la description sont obligatoires');
      }
      
      // Vérifier que l'URL est valide
      try {
        new URL(url);
      } catch (e) {
        throw new Error('L\'URL n\'est pas valide');
      }
      
      // Vérifier que le slug est rempli
      if (!slug) {
        throw new Error('Le slug est obligatoire');
      }
      
      // Préparer les données du lien
      const linkData = {
        title,
        content,
        excerpt,
        url,
        slug,
        type: 'link',
        date: new Date().toISOString(),
      };
      
      if (isEditing && initialData.id) {
        // Mettre à jour un lien existant
        const { error } = await supabase
          .from('contents')
          .update(linkData)
          .eq('id', initialData.id);
        
        if (error) throw error;
      } else {
        // Créer un nouveau lien
        const { error } = await supabase
          .from('contents')
          .insert([linkData]);
        
        if (error) throw error;
      }
      
      // Rediriger vers la liste des liens
      router.push('/admin/links');
      router.refresh();
    } catch (error: unknown) {
      // Afficher plus de détails sur l'erreur
      console.error('Erreur détaillée:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Une erreur est survenue';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Essayer d'extraire plus d'informations de l'objet d'erreur
        const errorObj = error as Record<string, unknown>;
        if (typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        } else if (errorObj.error) {
          errorMessage = typeof errorObj.error === 'string' ? errorObj.error : JSON.stringify(errorObj.error);
        } else if (errorObj.details) {
          errorMessage = typeof errorObj.details === 'string' ? errorObj.details : JSON.stringify(errorObj.details);
        } else {
          errorMessage = JSON.stringify(error);
        }
      }
      
      setError(errorMessage);
      console.error('Erreur lors de la sauvegarde du lien:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Identifiant unique pour l&apos;URL (ex: mon-lien)
          </p>
        </div>
        
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
            Extrait
          </label>
          <input
            id="excerpt"
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Court extrait (optionnel)"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description du lien"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/admin/links')}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}
