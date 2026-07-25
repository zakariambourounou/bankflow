import {Router} from 'express';
import { listAgences, getAgencyById, newAgences, modifyAgence } from '../controllers/agences.controlers';

const router = Router();

router.get('/', listAgences);
router.get('/:id', getAgencyById);
router.post('/', newAgences);
router.patch('/:id', modifyAgence);

export default router;