import { Router } from 'express';
import leadsControllers from '../../Controllers/leads/leadsControllers';
import adminLoginRequired from '../../middlewares/adminLoginRequired';

const router = Router();

router.get('/', adminLoginRequired, leadsControllers.index);
router.patch('/:id', adminLoginRequired, leadsControllers.update);

export default router;
