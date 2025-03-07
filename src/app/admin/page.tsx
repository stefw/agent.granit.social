import { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/admin/LogoutButton';

export const metadata: Metadata = {
  title: 'Administration - Tableau de bord',
  description: 'Tableau de bord d\'administration',
};

export default async function AdminDashboard() {
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
  
  // Récupérer les statistiques
  const { count: postsCount } = await supabase
    .from('contents')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'post');
  
  const { count: pagesCount } = await supabase
    .from('contents')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'page');
  
  const { count: linksCount } = await supabase
    .from('contents')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'link');
  
  // Récupérer les derniers posts
  const { data: recentPosts } = await supabase
    .from('contents')
    .select('slug, title, date')
    .eq('type', 'post')
    .order('date', { ascending: false })
    .limit(5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex space-x-4">
          <Link 
            href="/admin/posts/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Nouveau post
          </Link>
          <Link 
            href="/admin/links/new" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Nouveau lien
          </Link>
          <LogoutButton />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Posts</h2>
          <p className="text-3xl font-bold">{postsCount || 0}</p>
          <Link href="/admin/posts" className="text-blue-600 hover:underline mt-2 inline-block">
            Voir tous les posts
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Pages</h2>
          <p className="text-3xl font-bold">{pagesCount || 0}</p>
          <Link href="/admin/pages" className="text-blue-600 hover:underline mt-2 inline-block">
            Voir toutes les pages
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Liens</h2>
          <p className="text-3xl font-bold">{linksCount || 0}</p>
          <Link href="/admin/links" className="text-blue-600 hover:underline mt-2 inline-block">
            Voir tous les liens
          </Link>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Posts récents</h2>
        {recentPosts && recentPosts.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentPosts.map((post) => (
              <li key={post.slug} className="py-4">
                <div className="flex justify-between">
                  <Link 
                    href={`/admin/posts/${post.slug}`}
                    className="text-lg font-medium hover:text-blue-600"
                  >
                    {post.title}
                  </Link>
                  <span className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucun post récent</p>
        )}
      </div>
    </div>
  );
}
