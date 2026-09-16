import { Router } from 'express';
import conteudoControllers from '../../Controllers/conteudo/conteudoControllers';
import adminLoginRequired from '../../middlewares/adminLoginRequired';

const router = Router();

router.get('/', conteudoControllers.index);
router.put('/', adminLoginRequired, conteudoControllers.update);

export default router;
