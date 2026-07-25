import { z } from "zod";

export const userSchema = z.object({
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
    password: z
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
          message:
            "Le mot de passe doit contenir au moins un caractère spécial",
        })
    ),
});

// modifer le userSchema pour permettre la mise à jour partielle des champs
export const userInputSchema = userSchema.partial();
