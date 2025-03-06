import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
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
    
    // Récupérer le post pour obtenir les informations sur les médias associés
    const { data: post } = await supabase
      .from('contents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer le post
    const { error } = await supabase
      .from('contents')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    // Note: Nous pourrions également supprimer les médias associés au post,
    // mais nous les conservons pour l'instant car ils pourraient être utilisés ailleurs
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de la suppression du post:', error);
    
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
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
    
    // Récupérer les données du post depuis la requête
    const postData = await request.json();
    
    // Vérifier que les champs obligatoires sont présents
    if (!postData.title || !postData.slug || !postData.content) {
      return NextResponse.json(
        { error: 'Le titre, le slug et le contenu sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Mettre à jour le post
    const { error } = await supabase
      .from('contents')
      .update({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        topic: postData.topic || null,
        cover: postData.cover || null,
        // Ne pas mettre à jour la date pour conserver la date de création originale
      })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du post:', error);
    
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
