import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import LinkForm from '@/components/admin/LinkForm';
import LogoutButton from '@/components/admin/LogoutButton';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Administration - Éditer un lien',
  description: 'Modifier un lien existant',
};

interface EditLinkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditLinkPage({ params }: EditLinkPageProps) {
  const { id } = await params;
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
  
  // Récupérer le lien à éditer
  const { data: link, error } = await supabase
    .from('contents')
    .select('*')
    .eq('type', 'link')
    .eq('id', id)
    .single();
  
  if (error || !link) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Éditer le lien</h1>
          <p className="text-gray-500 mt-2">
            Modifiez les informations du lien
          </p>
        </div>
        <div className="flex space-x-4">
          <Link 
            href="/admin/links" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Retour à la liste
          </Link>
          <LogoutButton />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <LinkForm initialData={link} isEditing={true} />
      </div>
    </div>
  );
}
