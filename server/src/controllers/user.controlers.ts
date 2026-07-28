import { Request, Response } from 'express';
import { userSchema } from '../validator/users.validator';
import { createUser } from '../models/user.model';





// hashage password
const bcrypt = require('bcrypt');
const saltRounds = 10;

//fonction itulitaire de comparaison du schem et de la data envoye

const validateData = <T>(schema : userSchema<T>, data):T =>{
    const result = schema.safeParse(data)
    if (!result){
        throw new Error('Données invalides');
    }

    return result.data
}



//creation d'un utilisateur avec validation de données avec zod
export const  createUserController = async (req: Request, res: Response) => {
    const verifiedData = validateData(userSchema , req.body);
    if(!verifiedData.success){
        return res.status(400).json({
      message: 'Données invalides',
      errors: verifiedData.error.issues, 
    });
    }

    // encrypter le mot de passe avant de le stocker dans la base de données
    const passwordHash = await bcrypt.hash(verifiedData.data.password, saltRounds);
    const {password, ...rest} =verifiedData.data;
    try{
        // creation de l'utilisateur avec le mot de passe hashé dans la base de données
        const createdNewUser = await createUser({...rest, passwordHash});
        res.status(201).json(createdNewUser);

    }
catch(error){
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
}

// modification d'un utilisateur avec validation de données avec zod
export const updateUserController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    const verificati
