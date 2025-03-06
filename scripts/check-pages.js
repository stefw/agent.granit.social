const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: '.env.local' });

// Vérifier que les variables d'environnement sont définies
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies');
  process.exit(1);
}

// Créer un client Supabase avec la clé de service
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPages() {
  // Récupérer toutes les pages
  const { data: pages, error } = await supabase
    .from('contents')
    .select('*')
    .eq('type', 'page');
  
  if (error) {
    console.error('Erreur lors de la récupération des pages:', error);
    return;
  }
  
  console.log('Pages trouvées:', pages.length);
  
  // Afficher les détails de chaque page
  pages.forEach(page => {
    console.log(`- Slug: ${page.slug}, Title: ${page.title}`);
  });
  
  // Vérifier spécifiquement la page "about"
  const { data: aboutPage, error: aboutError } = await supabase
    .from('contents')
    .select('*')
    .eq('type', 'page')
    .eq('slug', 'about')
    .single();
  
  if (aboutError) {
    console.error('Erreur lors de la récupération de la page about:', aboutError);
  } else {
    console.log('Page about trouvée:', aboutPage);
  }
}

checkPages();
