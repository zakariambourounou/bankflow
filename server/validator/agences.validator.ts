import { z } from "zod";

export const agenceSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(150),
  code: z
    .string()
    .regex(/^\d{3}$/, "Le code agence doit contenir exactement 3 chiffres"),
  adresse: z.string().max(255).optional(),
  is_active: z.boolean().optional(),
});

export type AgenceInput = z.infer<typeof agenceSchema>;
export type AgenceUpdateInput = Partial<AgenceInput>;