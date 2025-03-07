import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PageForm from '@/components/admin/PageForm';
import LogoutButton from '@/components/admin/LogoutButton';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Administration - Nouvelle page',
  description: 'Créer une nouvelle page',
};

export default async function NewPagePage() {
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
    redirect('/admin/login');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Créer une nouvelle page</h1>
          <p className="text-gray-500 mt-2">
            Rédigez votre page en Markdown et ajoutez des médias (images, audio)
          </p>
        </div>
        <div className="flex space-x-4">
          <Link 
            href="/admin/pages" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Retour à la liste
          </Link>
          <LogoutButton />
        </div>
      </div>
      
      <PageForm />
    </div>
  );
}
