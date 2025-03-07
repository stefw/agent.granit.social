import { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/admin/LogoutButton';
import DeletePageButton from '@/components/admin/DeletePageButton';

export const metadata: Metadata = {
  title: 'Administration - Liste des pages',
  description: 'Gestion des pages',
};

export default async function PagesListPage() {
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
  
  // Récupérer toutes les pages
  const { data: pages, error } = await supabase
    .from('contents')
    .select('id, slug, title, date')
    .eq('type', 'page')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Erreur lors de la récupération des pages:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des pages</h1>
        <div className="flex space-x-4">
          <Link 
            href="/admin" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Tableau de bord
          </Link>
          <Link 
            href="/admin/pages/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Nouvelle page
          </Link>
          <LogoutButton />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Titre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pages && pages.length > 0 ? (
                pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{page.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{page.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(page.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/${page.slug}`} 
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Voir
                        </Link>
                        <Link 
                          href={`/admin/pages/${page.slug}`} 
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Éditer
                        </Link>
                        <DeletePageButton pageId={page.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Aucune page trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
