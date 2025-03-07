import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url') || '';
  const title = request.nextUrl.searchParams.get('title') || '';
  const excerpt = request.nextUrl.searchParams.get('excerpt') || '';
  
  // Rediriger vers le formulaire d'ajout de lien avec les paramètres
  return NextResponse.redirect(new URL(`/admin/links/new?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&excerpt=${encodeURIComponent(excerpt)}`, request.url));
}

export async function POST(request: NextRequest) {
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
  
  // Vérifier si l'utilisateur est authentifié
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Générer un slug à partir du titre
    const slug = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/--+/g, '-') // Remplacer les tirets multiples par un seul
      .trim();
    
    // Ajouter un timestamp pour garantir l'unicité
    const timestamp = new Date().getTime().toString().slice(-6);
    const uniqueSlug = `${slug}-${timestamp}`;
    
    // Préparer les données du lien
    const linkData = {
      title: data.title,
      content: data.content || data.excerpt || '',
      excerpt: data.excerpt || '',
      url: data.url,
      slug: uniqueSlug,
      type: 'link',
      date: new Date().toISOString(),
    };
    
    // Insérer le lien dans la base de données
    const { error } = await supabase
      .from('contents')
      .insert([linkData]);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
