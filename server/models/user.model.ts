import { pool } from '../src/db';

interface User {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'conseiller' | 'admin';
  agenceId: number | null;  // nullable, admins n'appartiennent pas forcément à une agence
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type PublicUser = Omit<User, 'passwordHash'>; 

interface Agence {
  id: number;
  nom: string;
  code: string;
  adresse: string | null;  // nullable car pas de "not null" dans le \d
  createdAt: Date;
}


// récupération d'un utilisateur par son id

async function getUserById(id:number) :Promise <PublicUser | null> {
const result = await pool.query(
    `SELECT id, email, first_name AS "firstName", last_name AS "lastName", 
     role, agence_id AS "agenceId", is_active AS "isActive", 
     created_at AS "createdAt", updated_at AS "updatedAt" 
     FROM users WHERE id = $1`,

    [id]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as PublicUser;
}

// login avec email et passwordHash

async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    `SELECT id, email, password_hash AS "passwordHash", first_name AS "firstName", last_name AS "lastName", 
     role, agence_id AS "agenceId", is_active AS "isActive", 
     created_at AS "createdAt", updated_at AS "updatedAt" 
     FROM users WHERE email = $1`,

    [email]
  );
  if (( result).rows.length === 0) {
    return null;
  }
  return ( result).rows[0] as User;
}

// création d'un utilisateur avec email, passwordHash, firstName, lastName, role et agenceId

async function createUser (userData:{  email: string; passwordHash: string; firstName: string; lastName: string; role: 'conseiller' | 'admin'; agenceId: number | null }) : Promise<PublicUser> {
  const { email, passwordHash, firstName, lastName, role, agenceId } = userData;
  const result = await pool.query(
    `INSERT INTO users ( email, password_hash, first_name, last_name, role, agence_id) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, email, first_name AS "firstName", last_name AS "lastName", 
               role, agence_id AS "agenceId", is_active AS "isActive", 
               created_at AS "createdAt", updated_at AS "updatedAt"`,
    [userData. email, passwordHash, firstName, lastName, role, agenceId]
  );
  return result.rows[0] as PublicUser;
}

// mise à jour d'un utilisateur avec possibilité de mettre à jour seulement certains champs

async function updateUser (userData:{ id: number; email?: string; passwordHash?: string; firstName?: string; lastName?: string; role?: 'conseiller' | 'admin'; agenceId?: number | null; isActive?: boolean }) : Promise<PublicUser | null> {
  const { id, email, passwordHash, firstName, lastName, role, agenceId, isActive } = userData
  const result = await pool.query(
    `UPDATE users 
     SET email = COALESCE($2, email),
         password_hash = COALESCE($3, password_hash),
         first_name = COALESCE($4, first_name),
         last_name = COALESCE($5, last_name),
         role = COALESCE($6, role),
         agence_id = COALESCE($7, agence_id),
         is_active = COALESCE($8, is_active)
     WHERE id = $1
     RETURNING id, email, first_name AS "firstName", last_name AS "lastName",
               role, agence_id AS "agenceId", is_active AS "isActive", 
               created_at AS "createdAt", updated_at AS "updatedAt"`,
    [id, email, passwordHash, firstName, lastName, role, agenceId, isActive]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as PublicUser;
}

// desactive un utilisateur (isActive = false)

async function desactivateUser(id: number): Promise<PublicUser | null> {
  const result = await pool.query(
    `UPDATE users 
     SET is_active = false
     WHERE id = $1
     RETURNING id, email, first_name AS "firstName", last_name AS "lastName",
               role, agence_id AS "agenceId", is_active AS "isActive",
               created_at AS "createdAt", updated_at AS "updatedAt"`,
    [id]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as PublicUser;
}

//reactivate un utilisateur (isActive = true)

async function reactivateUser(id: number): Promise<PublicUser | null> {
  const result = await pool.query(
    `UPDATE users 
     SET is_active = true
     WHERE id = $1
     RETURNING id, email, first_name AS "firstName", last_name AS "lastName",
               role, agence_id AS "agenceId", is_active AS "isActive",
               created_at AS "createdAt", updated_at AS "updatedAt"`,
    [id]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as PublicUser;
}

export { User, PublicUser, Agence, getUserById, findUserByEmail, createUser, updateUser, desactivateUser, reactivateUser };