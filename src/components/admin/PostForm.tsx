'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MarkdownEditor from './MarkdownEditor';

interface PostFormProps {
  initialData?: {
    id?: string;
    slug?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    topic?: string;
    cover?: string;
  };
  isEditing?: boolean;
}

export default function PostForm({ initialData = {}, isEditing = false }: PostFormProps) {
  const router = useRouter();
  
  const [title, setTitle] = useState(initialData.title || '');
  const [slug, setSlug] = useState(initialData.slug || '');
  const [excerpt, setExcerpt] = useState(initialData.excerpt || '');
  const [content, setContent] = useState(initialData.content || '');
  const [topic, setTopic] = useState(initialData.topic || '');
  const [cover, setCover] = useState(initialData.cover || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  
  // Générer un slug à partir du titre
  useEffect(() => {
    if (!isEditing && title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  }, [title, isEditing, slug]);
  
  // Récupérer les topics disponibles
  useEffect(() => {
    const fetchTopics = async () => {
      // Vérifier si Supabase est configuré
      if (!supabase) {
        console.warn('Supabase n\'est pas configuré. Impossible de récupérer les topics.');
        return;
      }

      const { data, error } = await supabase
        .from('contents')
        .select('topic')
        .eq('type', 'post')
        .not('topic', 'is', null);
      
      if (error) {
        console.error('Erreur lors de la récupération des topics:', error);
        return;
      }
      
      // Extraire les topics uniques
      const topics = [...new Set(data.map(item => item.topic).filter(Boolean))];
      setAvailableTopics(topics);
    };
    
    fetchTopics();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Vérifier que les champs obligatoires sont remplis
      if (!title || !slug || !content) {
        throw new Error('Le titre, le slug et le contenu sont obligatoires');
      }
      
      // Préparer les données du post
      const postData = {
        title,
        slug,
        excerpt,
        content,
        topic: topic || null,
        cover: cover || null,
        type: 'post',
        date: new Date().toISOString(),
      };
      
      // Vérifier si Supabase est configuré
      if (!supabase) {
        throw new Error('Service de base de données temporairement indisponible. Veuillez réessayer plus tard.');
      }
      
      if (isEditing && initialData.id) {
        // Mettre à jour un post existant
        const { error } = await supabase
          .from('contents')
          .update(postData)
          .eq('id', initialData.id);
        
        if (error) throw error;
      } else {
        // Créer un nouveau post
        const { error } = await supabase
          .from('contents')
          .insert([postData]);
        
        if (error) throw error;
      }
      
      // Rediriger vers la liste des posts
      router.push('/admin/posts');
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setError(errorMessage);
      console.error('Erreur lors de la sauvegarde du post:', error);
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Identifiant unique pour l&apos;URL (ex: mon-article)
            </p>
          </div>
          
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
              Extrait
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Court résumé du post (affiché dans les listes)
            </p>
          </div>
          
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-1">
              Topic
            </label>
            <div className="flex">
              <select
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Sélectionner un topic --</option>
                {availableTopics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ou saisir un nouveau topic"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="cover" className="block text-sm font-medium mb-1">
              Image de couverture
            </label>
            <input
              id="cover"
              type="text"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="URL de l'image de couverture"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Contenu <span className="text-red-500">*</span>
          </label>
          <MarkdownEditor
            initialValue={content}
            onChange={setContent}
            topic={topic}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/admin/posts')}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Publier'}
        </button>
      </div>
    </form>
  );
}
