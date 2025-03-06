-- Création de la table contents
CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE,
  excerpt TEXT,
  content TEXT NOT NULL,
  topic TEXT,
  cover TEXT,
  type TEXT NOT NULL CHECK (type IN ('post', 'page')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX contents_type_idx ON contents(type);
CREATE INDEX contents_topic_idx ON contents(topic);
CREATE INDEX contents_slug_type_idx ON contents(slug, type);

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le timestamp updated_at
CREATE TRIGGER update_contents_updated_at
BEFORE UPDATE ON contents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Fonction RPC pour créer la table contents (utilisée par le script de migration)
CREATE OR REPLACE FUNCTION create_contents_table()
RETURNS void AS $$
BEGIN
  -- Vérifier si la table existe déjà
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'contents'
  ) THEN
    -- Créer la table
    CREATE TABLE contents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      date TIMESTAMP WITH TIME ZONE,
      excerpt TEXT,
      content TEXT NOT NULL,
      topic TEXT,
      cover TEXT,
      type TEXT NOT NULL CHECK (type IN ('post', 'page')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Créer les index
    CREATE INDEX contents_type_idx ON contents(type);
    CREATE INDEX contents_topic_idx ON contents(topic);
    CREATE INDEX contents_slug_type_idx ON contents(slug, type);
    
    -- Créer le trigger pour updated_at
    CREATE TRIGGER update_contents_updated_at
    BEFORE UPDATE ON contents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Politiques de sécurité Row Level Security (RLS)
-- Activer RLS sur la table contents
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read access" ON contents
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion/mise à jour/suppression uniquement aux utilisateurs authentifiés
-- Note: Ajustez cette politique selon vos besoins de sécurité
CREATE POLICY "Allow authenticated insert" ON contents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON contents
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON contents
  FOR DELETE USING (auth.role() = 'authenticated');
