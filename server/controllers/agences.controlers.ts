
import {getAllAgences,getAgenceById,createAgence ,updateAgence} from '../models/agences.model';
import { Request, Response } from 'express';
import {agenceSchema} from '../validator/agences.validator';



// récupération de toutes les agences

export const listAgences = async (req:Request,res:Response)=>{
    try{
        const agences = await getAllAgences();
        res.status(200).json(agences);
    }
    catch(error){
        console.error('Erreur lors de la récupération des agences :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des agences' });
    }
 }
 // récupération d'une agence par son id

 export const getAgencyById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID d\'agence invalide' });
    }
    try{
        const agence = await getAgenceById(id);
        if (!agence) {
            return res.status(404).json({ message: 'Agence non trouvée' });
        }
        res.status(200).json(agence);

    }catch(error){
        console.error('Erreur lors de la récupération de l\'agence :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'agence' });
    }
 }

// creation de l'agence avec validation de données avec zod 

export const newAgences = async (req: Request, res: Response) => {
    const verifiedData = agenceSchema.safeParse(req.body);
    if(!verifiedData.success){
        return res.status(400).json({
      message: 'Données invalides',
      errors: verifiedData.error.issues,
    });
    }
    try {
        // verification de la base de donne afin de voir si le code de l'agence existe deja
       const createdNewAgence = await createAgence(verifiedData.data);
       res.status(201).json(createdNewAgence);

    } catch (error :any) {
        if (error.code === '23505') { // code d'erreur pour violation de contrainte unique
            return res.status(400).json({ message: 'Le code agence existe déjà' });
        }
        console.error('Erreur lors de la création de l\'agence :', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'agence' });
    }
}

// modifié une agence avec validation de données avec zod

export const modifyAgence = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Id invalide' });
  }

  const validation = agenceSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: 'Données invalides',
      errors: validation.error.issues,
    });
  }

  try {
    const agenceModifiee = await updateAgence(id, validation.data);

    if (!agenceModifiee) {
      return res.status(404).json({ message: 'Agence introuvable' });
    }

    res.status(200).json(agenceModifiee);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Ce code agence existe déjà' });
    }
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

