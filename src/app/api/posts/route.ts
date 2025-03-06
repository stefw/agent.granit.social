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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          set(name: string, value: string, options: Record<string, unknown>) {
            // Note: Dans Next.js 15, on ne peut pas modifier les cookies dans un composant serveur
            // Cette fonction ne sera pas utilisée ici, mais est nécessaire pour l'interface
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          remove(name: string, options: Record<string, unknown>) {
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
    
    // Vérifier que le slug est unique
    const { data: existingPost } = await supabase
      .from('contents')
      .select('id')
      .eq('slug', postData.slug)
      .eq('type', 'post')
      .maybeSingle();
    
    if (existingPost) {
      return NextResponse.json(
        { error: 'Un post avec ce slug existe déjà' },
        { status: 400 }
      );
    }
    
    // Créer le post
    const { data, error } = await supabase
      .from('contents')
      .insert([
        {
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt || null,
          content: postData.content,
          topic: postData.topic || null,
          cover: postData.cover || null,
          type: 'post',
          date: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true, post: data });
  } catch (error: any) {
    console.error('Erreur lors de la création du post:', error);
    
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          set(name: string, value: string, options: Record<string, unknown>) {
            // Note: Dans Next.js 15, on ne peut pas modifier les cookies dans un composant serveur
            // Cette fonction ne sera pas utilisée ici, mais est nécessaire pour l'interface
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          remove(name: string, options: Record<string, unknown>) {
            // Note: Dans Next.js 15, on ne peut pas modifier les cookies dans un composant serveur
            // Cette fonction ne sera pas utilisée ici, mais est nécessaire pour l'interface
          },
        },
      }
    );
    
    // Récupérer les paramètres de requête
    const searchParams = request.nextUrl.searchParams;
    const topic = searchParams.get('topic');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const offset = (page - 1) * limit;
    
    // Construire la requête
    let query = supabase
      .from('contents')
      .select('id, slug, title, excerpt, date, topic, cover', { count: 'exact' })
      .eq('type', 'post')
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Filtrer par topic si spécifié
    if (topic) {
      query = query.eq('topic', topic);
    }
    
    // Exécuter la requête
    const { data, count, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      posts: data,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des posts:', error);
    
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
