import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import BookmarkletButton from '@/components/BookmarkletButton';

export const metadata: Metadata = {
  title: 'Bookmarklet - Ajouter un lien',
  description: 'Bookmarklet pour ajouter facilement un lien à votre site',
};

export default function BookmarkletPage() {
  // Code JavaScript de la bookmarklet
  const bookmarkletCode = `javascript:(function(){
    var title = document.title;
    var url = window.location.href;
    var excerpt = '';
    
    // Récupérer le texte sélectionné s'il y en a
    if (window.getSelection) {
      excerpt = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== 'Control') {
      excerpt = document.selection.createRange().text;
    }
    
    // Ouvrir une nouvelle fenêtre avec le formulaire pré-rempli
    window.open('${siteConfig.url}/api/bookmarklet?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&excerpt=' + encodeURIComponent(excerpt), '_blank');
  })();`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-4">Bookmarklet - Ajouter un lien</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Utilisez cette bookmarklet pour ajouter facilement un lien à votre site depuis n&apos;importe quelle page web.
        </p>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Comment créer la bookmarklet</h2>
        
        <div className="my-4">
          <BookmarkletButton 
            bookmarkletCode={bookmarkletCode} 
            siteName={siteConfig.name} 
          />
        </div>
        
        <h3 className="text-lg font-medium mt-8 mb-4">Comment l&apos;utiliser</h3>
        
        <ol className="list-decimal pl-6 space-y-4 mb-6">
          <li>
            <strong>Naviguez</strong> sur n&apos;importe quelle page web que vous souhaitez ajouter à votre site.
          </li>
          <li>
            <strong>Sélectionnez</strong> du texte sur la page (optionnel) pour l&apos;utiliser comme extrait.
          </li>
          <li>
            <strong>Cliquez</strong> sur le favori &quot;Ajouter à {siteConfig.name}&quot; dans votre barre de favoris.
          </li>
          <li>
            Une nouvelle fenêtre s&apos;ouvrira avec le formulaire d&apos;ajout de lien pré-rempli.
          </li>
          <li>
            <strong>Complétez</strong> les informations si nécessaire et cliquez sur &quot;Ajouter&quot;.
          </li>
        </ol>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 text-sm">
          <p className="font-medium text-yellow-800 dark:text-yellow-200">Note</p>
          <p className="text-yellow-700 dark:text-yellow-300">
            Vous devez être connecté à votre compte administrateur pour que la bookmarklet fonctionne correctement.
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Fonctionnalités</h2>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>Capture automatiquement l&apos;URL de la page</li>
          <li>Capture automatiquement le titre de la page</li>
          <li>Capture le texte sélectionné comme extrait (si disponible)</li>
          <li>Pré-remplit le formulaire d&apos;ajout de lien</li>
          <li>Génère automatiquement un slug unique</li>
        </ul>
      </div>
      
      <footer className="mt-12 text-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          Retour à l&apos;accueil
        </Link>
      </footer>
    </div>
  );
}
