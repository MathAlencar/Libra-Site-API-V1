import { Router } from 'express';
import administradorControllers from '../../Controllers/admin/administradorControllers';
import adminLoginRequired from '../../middlewares/adminLoginRequired';

const router = Router();

router.get('/me', adminLoginRequired, administradorControllers.me);

export default router;
