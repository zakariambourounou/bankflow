import {
  userInputSchema,
  validateUserInput,
  UserUpdateInput,
  UserInput,
} from "../validator/users.validator";

import { pool } from "../db";

interface User {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: "conseiller" | "admin";
  agenceId: number | null; // nullable, admins n'appartiennent pas forcément à une agence
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type PublicUser = Omit<User, "passwordHash">;

interface Agence {
  id: number;
  nom: string;
  code: string;
  adresse: string | null; // nullable car pas de "not null" dans le \d
  createdAt: Date;
}

// récupération d'un utilisateur par son id

async function getUserById(id: number): Promise<PublicUser | null> {
  const result = await pool.query(
    `SELECT id, email, first_name AS "firstName", last_name AS "lastName", 
     role, agence_id AS "agenceId", is_active AS "isActive", 
     created_at AS "createdAt", updated_at AS "updatedAt" 
     FROM users WHERE id = $1`,

    [id],
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

    [email],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as User;
}

// création d'un utilisateur avec email, passwordHash, firstName, lastName, role et agenceId

async function createUser(
  userData: Omit<UserInput, "password"> & { passwordHash: string },
): Promise<PublicUser> {
  const { email, passwordHash, firstName, lastName,} = userData;
  const result = await pool.query(
    `INSERT INTO users ( email, password_hash, first_name, last_name, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, email, first_name AS "firstName", last_name AS "lastName",               
     role, agence_id AS "agenceId", is_active AS "isActive", 
     created_at AS "createdAt", updated_at AS "updatedAt"`,
    [email, passwordHash, firstName, lastName, "conseiller"],
  );
  return result.rows[0] as PublicUser;
}

// mise à jour d'un utilisateur avec possibilité de mettre à jour seulement certains champs

async function updateUser(
  id: number,
  userData: Omit<UserUpdateInput, "password"> & { passwordHash?: string },
): Promise<PublicUser | null> {
  const { email, firstName, lastName, passwordHash } = userData;
  const result = await pool.query(
    `UPDATE users 
     SET email = COALESCE($2, email),
         password_hash = COALESCE($3, password_hash),
         first_name = COALESCE($4, first_name),
         last_name = COALESCE($5, last_name)
     WHERE id = $1
     RETURNING id, email, first_name AS "firstName", last_name AS "lastName",
               role, agence_id AS "agenceId", is_active AS "isActive", 
               created_at AS "createdAt", updated_at AS "updatedAt"`,
    [id, email, passwordHash, firstName, lastName],
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
    [id],
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
    [id],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as PublicUser;
}

//validation du role de l'utilisateur ainsi que l'agence a laquel il est affilié
async function validateUserAccount(
  id: number,
  data: validateUserInput,
): Promise<PublicUser | null> {
  const { role, agenceId } = data;
  const result = await pool.query(
    `UPDATE users
     SET role = $2, agence_id = $3
     WHERE id = $1
     RETURNING id, email, first_name AS "firstName", last_name AS "lastName",
               role, agence_id AS "agenceId", is_active AS "isActive",
               created_at AS "createdAt", updated_at AS "updatedAt"`,
    [id, role, agenceId],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as PublicUser;
}


// fonction pour recupere le passwordHash d'un utilisateur par son id (utile pour le changement de mot de passe)

async function getPasswordHashById(id: number): Promise<string | null> {
  const result = await pool.query(
    `SELECT password_hash AS "passwordHash" FROM users WHERE id = $1`,
    [id],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0].passwordHash as string;
}

export {
  User,
  PublicUser,
  Agence,
  getUserById,
  findUserByEmail,
  createUser,
  updateUser,
  desactivateUser,
  reactivateUser,
  validateUserAccount,
  getPasswordHashById
};
