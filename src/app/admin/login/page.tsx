import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion - Administration',
  description: 'Connexion à l\'interface d\'administration',
};

export default async function LoginPage() {
  // Vérifier si l'utilisateur est déjà connecté
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
  
  // Si l'utilisateur est déjà connecté, le rediriger vers le tableau de bord
  if (session) {
    redirect('/admin');
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <LoginForm />
      </div>
    </div>
  );
}
