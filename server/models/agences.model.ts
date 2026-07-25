import { pool } from '../src/db';
import { AgenceInput, AgenceUpdateInput } from '../validator/agences.validator';

interface Agence {
  id: number;
  nom: string;
  code: string;
  isActive: boolean;
  adresse: string | null;  // nullable car pas de "not null" dans le \d
  createdAt: Date;
}

// recupération d'une agence par son id

async function getAgenceById(id: number): Promise<Agence | null> {
  const result = await pool.query(
    `SELECT id, nom, code, adresse, is_active AS "isActive", created_at AS "createdAt"
     FROM agences WHERE id = $1`,
    [id]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as Agence;
}





// creation d'une agence
async function createAgence(agenceData: AgenceInput): Promise<Agence> {

  const { nom, code, adresse , is_active = true } = agenceData;
  const result = await pool.query (
    `INSERT INTO agences (nom, code, adresse, is_active) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, nom, code, adresse, is_active AS "isActive", created_at AS "createdAt"`,
    [nom, code, adresse, is_active]  // si is_active n'est pas fourni, on le met à true par défaut
  );

  return result.rows[0] as Agence;
} 



// récupération de toutes les agences
async function getAllAgences(): Promise<Agence[]> {
  const result = await pool.query(
    `SELECT id, nom, code, adresse, is_active AS "isActive", created_at AS "createdAt"
     FROM agences`
  );

  return result.rows as Agence[];
} 


// desactivtaation d'une agence (isActive = false)
async function deactivateAgence(id: number): Promise<Agence | null> {

  const result = await pool.query(
    `UPDATE agences 
     SET is_active = false
     WHERE id = $1
     RETURNING id, nom, code, adresse,is_active AS "isActive", created_at AS "createdAt" `,
    [id]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as Agence;
}



// modification d'une agence (nom, code, adresse)

async function updateAgence(id: number, agenceData: AgenceUpdateInput): Promise<Agence | null> {
  const { nom, code, adresse, is_active   } = agenceData;
  const result = await pool.query(
    `UPDATE agences
     SET nom = COALESCE($1, nom),
         code = COALESCE($2, code),
         adresse = COALESCE($3, adresse),
         is_active = COALESCE($4, is_active)
     WHERE id = $5
     RETURNING id, nom, code, adresse, is_active AS "isActive", created_at AS "createdAt"`,
    [nom, code, adresse, is_active, id]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as Agence;
}


export { Agence, getAgenceById, createAgence, getAllAgences, deactivateAgence, updateAgence };
