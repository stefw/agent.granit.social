const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createClient } = require('@supabase/supabase-js');

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

const postsDirectory = path.join(process.cwd(), 'content/posts');
const pagesDirectory = path.join(process.cwd(), 'content/pages');

// Fonction pour uploader un fichier média vers Supabase Storage
async function uploadMedia(filePath: string, topic: string | null) {
  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath);
  
  // Construire le chemin dans le bucket (conserver la structure des dossiers)
  const storagePath = topic 
    ? `${topic}/medias/${fileName}` 
    : `medias/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('media')
    .upload(storagePath, fileContent, {
      contentType: getContentType(fileName),
      upsert: true
    });
  
  if (error) {
    console.error(`Erreur lors de l'upload de ${fileName}:`, error);
    throw error;
  }
  
  // Retourner l'URL publique du fichier
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(storagePath);
  
  return publicUrl;
}

// Fonction pour déterminer le type MIME
function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.m4a': 'audio/mp4',
    // Ajouter d'autres types selon vos besoins
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}

// Fonction pour traiter le contenu markdown et remplacer les chemins des médias
async function processContent(content: string, topic: string | null) {
  let processedContent = content;
  
  // Remplacer les liens Obsidian vers les images
  const imageRegex = /!\[\[(.*?(?:\.(?:jpg|jpeg|png|gif|webp|svg)))\]\]/g;
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const fileName = match[1];
    const filePath = topic 
      ? path.join(postsDirectory, topic, 'medias', fileName)
      : path.join(postsDirectory, 'medias', fileName);
    
    if (fs.existsSync(filePath)) {
      const publicUrl = await uploadMedia(filePath, topic);
      processedContent = processedContent.replace(
        match[0],
        `![${fileName}](${publicUrl})`
      );
    }
  }
  
  // Remplacer les liens Obsidian vers les fichiers audio
  const audioRegex = /!\[\[(.*?\.m4a)\]\]/g;
  
  while ((match = audioRegex.exec(content)) !== null) {
    const fileName = match[1];
    const filePath = topic 
      ? path.join(postsDirectory, topic, 'medias', fileName)
      : path.join(postsDirectory, 'medias', fileName);
    
    if (fs.existsSync(filePath)) {
      const publicUrl = await uploadMedia(filePath, topic);
      processedContent = processedContent.replace(
        match[0],
        `<audio controls src="${publicUrl}"></audio>`
      );
    }
  }
  
  return processedContent;
}

interface FileInfo {
  path: string;
  topic: string | null;
}

// Fonction pour migrer les posts
async function migratePosts() {
  // Fonction récursive pour lire les fichiers dans les sous-dossiers
  function getFilesRecursively(dir: string): FileInfo[] {
    const files: FileInfo[] = [];
    
    if (!fs.existsSync(dir)) {
      console.warn(`Le répertoire ${dir} n'existe pas`);
      return files;
    }
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    entries.forEach((entry: any) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'medias') { // Ignorer les dossiers medias
          const topic = entry.name;
          const subFiles = getFilesRecursively(fullPath);
          subFiles.forEach(file => {
            if (!file.topic) file.topic = topic;
          });
          files.push(...subFiles);
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Déterminer le topic en fonction du chemin relatif
        const relativePath = path.relative(postsDirectory, dir);
        const topic = relativePath !== '' ? relativePath : null;
        files.push({ path: fullPath, topic });
      }
    });
    
    return files;
  }
  
  const files = getFilesRecursively(postsDirectory);
  
  for (const file of files) {
    const fileContents = fs.readFileSync(file.path, 'utf8');
    const { data, content } = matter(fileContents);
    const slug = path.basename(file.path, '.md');
    
    // Traiter le contenu pour remplacer les chemins des médias
    const processedContent = await processContent(content, file.topic);
    
    // Insérer dans Supabase
    const { error } = await supabase
      .from('contents')
      .insert({
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt || null,
        content: processedContent,
        topic: file.topic,
        cover: data.cover || null,
        type: 'post'
      });
    
    if (error) {
      console.error(`Erreur lors de l'insertion du post ${slug}:`, error);
    } else {
      console.log(`Post ${slug} migré avec succès`);
    }
  }
}

// Fonction pour migrer les pages
async function migratePages() {
  if (!fs.existsSync(pagesDirectory)) {
    console.warn('Le répertoire des pages n\'existe pas');
    return;
  }
  
  const fileNames = fs.readdirSync(pagesDirectory);
  
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;
    
    const fullPath = path.join(pagesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const slug = fileName.replace(/\.md$/, '');
    
    // Traiter le contenu pour remplacer les chemins des médias
    const processedContent = await processContent(content, null);
    
    // Insérer dans Supabase
    const { error } = await supabase
      .from('contents')
      .insert({
        slug,
        title: data.title,
        content: processedContent,
        type: 'page',
        date: new Date()
      });
    
    if (error) {
      console.error(`Erreur lors de l'insertion de la page ${slug}:`, error);
    } else {
      console.log(`Page ${slug} migrée avec succès`);
    }
  }
}

// Fonction pour créer le bucket de stockage s'il n'existe pas
async function createStorageBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Erreur lors de la récupération des buckets:', listError);
    return;
  }
  
  const mediaBucketExists = buckets.some((bucket: any) => bucket.name === 'media');
  
  if (!mediaBucketExists) {
    const { data, error } = await supabase.storage.createBucket('media', {
      public: true
    });
    
    if (error) {
      console.error('Erreur lors de la création du bucket media:', error);
    } else {
      console.log('Bucket media créé avec succès');
    }
  } else {
    console.log('Le bucket media existe déjà');
  }
}

// Fonction pour créer la table contents si elle n'existe pas
async function createContentsTable() {
  // Vérifier si la table existe déjà
  const { error: queryError } = await supabase
    .from('contents')
    .select('id')
    .limit(1);
  
  // Si la table n'existe pas, la créer
  if (queryError && queryError.code === '42P01') { // relation "contents" does not exist
    const { error } = await supabase.rpc('create_contents_table');
    
    if (error) {
      console.error('Erreur lors de la création de la table contents:', error);
    } else {
      console.log('Table contents créée avec succès');
    }
  } else {
    console.log('La table contents existe déjà');
  }
}

// Exécuter la migration
async function runMigration() {
  try {
    console.log('Vérification/création du bucket de stockage...');
    await createStorageBucket();
    
    console.log('Vérification/création de la table contents...');
    await createContentsTable();
    
    console.log('Début de la migration des posts...');
    await migratePosts();
    
    console.log('Début de la migration des pages...');
    await migratePages();
    
    console.log('Migration terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
  }
}

runMigration();
