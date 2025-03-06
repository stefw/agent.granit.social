import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Créer une réponse qui sera modifiée et renvoyée
  const res = NextResponse.next();
  
  try {
    // Créer un client Supabase avec les cookies de la requête
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => req.cookies.get(name)?.value,
          set: (name, value, options) => {
            res.cookies.set({ name, value, ...options });
          },
          remove: (name, options) => {
            res.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    // Vérifier si l'utilisateur est authentifié
    const { data: { session } } = await supabase.auth.getSession();
  
    console.log('Middleware exécuté pour:', req.nextUrl.pathname);
    console.log('Session existe:', !!session);
    
    // Si l'utilisateur accède à une route admin et n'est pas authentifié, rediriger vers la page de connexion
    if (req.nextUrl.pathname.startsWith('/admin') && !session) {
      // Exclure la page de connexion pour éviter une redirection en boucle
      if (req.nextUrl.pathname !== '/admin/login') {
        console.log('Redirection vers la page de connexion depuis', req.nextUrl.pathname);
        const redirectUrl = new URL('/admin/login', req.url);
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
    } else if (req.nextUrl.pathname === '/admin/login' && session) {
      // Si l'utilisateur est déjà connecté et essaie d'accéder à la page de connexion,
      // le rediriger vers le tableau de bord
      console.log('Utilisateur déjà connecté, redirection vers le tableau de bord');
      return NextResponse.redirect(new URL('/admin', req.url));
    } else if (req.nextUrl.pathname.startsWith('/admin') && session) {
      // L'utilisateur est authentifié et accède à une route admin
      console.log('Utilisateur authentifié accédant à', req.nextUrl.pathname);
    }
    
    // Retourner la réponse modifiée
    return res;
  } catch (error) {
    console.error('Erreur dans le middleware:', error);
    return res;
  }
}

// Spécifier les routes sur lesquelles le middleware doit s'exécuter
export const config = {
  matcher: ['/admin/:path*'],
};
