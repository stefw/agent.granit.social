const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
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

const pagesDirectory = path.join(process.cwd(), 'content/pages');

async function insertAboutPage() {
  const aboutPath = path.join(pagesDirectory, 'about.md');
  
  if (!fs.existsSync(aboutPath)) {
    console.error(`Le fichier ${aboutPath} n'existe pas`);
    return;
  }
  
  const fileContents = fs.readFileSync(aboutPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  console.log('Données extraites du fichier about.md:');
  console.log('- Title:', data.title);
  console.log('- Date:', data.date);
  console.log('- Excerpt:', data.excerpt);
  
  // Insérer la page about dans Supabase
  const { data: insertedData, error } = await supabase
    .from('contents')
    .insert({
      slug: 'about',
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || null,
      content: content,
      type: 'page'
    })
    .select();
  
  if (error) {
    console.error('Erreur lors de l\'insertion de la page about:', error);
  } else {
    console.log('Page about insérée avec succès:', insertedData);
  }
}

insertAboutPage();
