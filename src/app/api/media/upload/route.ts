import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // Note: Dans Next.js 15, on ne peut pas modifier les cookies dans un composant serveur
            // Cette fonction ne sera pas utilisée ici, mais est nécessaire pour l'interface
          },
          remove(name: string, options: any) {
            // Note: Dans Next.js 15, on ne peut pas modifier les cookies dans un composant serveur
            // Cette fonction ne sera pas utilisée ici, mais est nécessaire pour l'interface
          },
        },
      }
    );
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    // Récupérer le formulaire avec le fichier
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const topic = formData.get('topic') as string | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }
    
    // Vérifier le type de fichier
    const fileType = file.type;
    const isImage = fileType.startsWith('image/');
    const isAudio = fileType.startsWith('audio/');
    
    if (!isImage && !isAudio) {
      return NextResponse.json(
        { error: 'Type de fichier non pris en charge. Seuls les images et les fichiers audio sont acceptés.' },
        { status: 400 }
      );
    }
    
    // Créer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
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
    
    // Normaliser le topic si présent
    const normalizedTopic = topic ? normalizeString(topic) : null;
    
    // Construire le chemin dans le bucket
    const storagePath = normalizedTopic 
      ? `${normalizedTopic}/medias/${fileName}`
      : `medias/${fileName}`;
    
    // Convertir le fichier en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Uploader le fichier
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, buffer, {
        contentType: fileType,
        cacheControl: '3600',
        upsert: false,
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(storagePath);
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      path: storagePath,
      type: isImage ? 'image' : 'audio',
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// Configurer la taille maximale des requêtes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
