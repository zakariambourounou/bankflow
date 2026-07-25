import { z } from "zod";

// validation du mot de passe avec zod
const passwordSchema = z
  .string()
  .trim()
  .pipe(
    z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      })
      .max(128, {
        message: "Le mot de passe doit contenir au plus 128 caractères",
      })
      .regex(/[a-z]/, {
        message: "Le mot de passe doit contenir au moins une lettre minuscule",
      })
      .regex(/[A-Z]/, {
        message: "Le mot de passe doit contenir au moins une lettre majuscule",
      })
      .regex(/[0-9]/, {
        message: "Le mot de passe doit contenir au moins un chiffre",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Le mot de passe doit contenir au moins un caractère spécial",
      }),
  );

//
export const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .pipe(
      z
        .string()
        .min(2, {
          message: "Le prénom doit contenir au moins 2 caractères",
        })
        .max(50, {
          message: "Le prénom doit contenir au plus 50 caractères",
        })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, {
          message: "Le prénom contient des caractères non autorisés",
        }),
    ),

  lastName: z
    .string()
    .trim()
    .pipe(
      z
        .string()
        .min(2, {
          message: "Le nom doit contenir au moins 2 caractères",
        })
        .max(50, {
          message: "Le nom doit contenir au plus 50 caractères",
        })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, {
          message: "Le nom contient des caractères non autorisés",
        }),
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(
      z
        .email({ message: "Email invalide" })
        .min(5, { message: "L'email doit contenir au moins 5 caractères" })
        .max(255),
    ),
  password: passwordSchema,

 
});

//schema de validation pour la mise à jour d'un utilisateur

export const validateUserSchema = z.object({
  role: z.enum(["conseiller", "admin"]),
  agenceId: z.number().int().positive().nullable(),
});





export const passwordChangeSchema = z.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
});









// modifer le userSchema pour permettre la mise à jour partielle des champs
export const userInputSchema = userSchema.partial().omit({ password: true });
