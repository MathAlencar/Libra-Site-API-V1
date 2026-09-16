import { Router } from 'express';
import leadsControllers from '../../Controllers/leads/leadsControllers';

const router = Router();

router.post('/', leadsControllers.store);

export default router;
