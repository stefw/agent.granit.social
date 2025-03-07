-- Modifier la contrainte CHECK sur le champ type pour inclure 'link'
ALTER TABLE contents DROP CONSTRAINT IF EXISTS contents_type_check;
ALTER TABLE contents ADD CONSTRAINT contents_type_check CHECK (type IN ('post', 'page', 'link'));

-- Fonction RPC pour modifier la contrainte CHECK (utilisée par le script de migration)
CREATE OR REPLACE FUNCTION add_link_type()
RETURNS void AS $$
BEGIN
  -- Modifier la contrainte CHECK sur le champ type
  -- D'abord, récupérer le nom de la contrainte
  DECLARE
    constraint_name TEXT;
  BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'contents'::regclass
    AND conname LIKE '%type%check%';
    
    IF FOUND THEN
      -- Supprimer l'ancienne contrainte
      EXECUTE 'ALTER TABLE contents DROP CONSTRAINT ' || constraint_name;
    END IF;
  END;
  
  -- Ajouter la nouvelle contrainte
  ALTER TABLE contents ADD CONSTRAINT contents_type_check CHECK (type IN ('post', 'page', 'link'));
END;
$$ LANGUAGE plpgsql;
