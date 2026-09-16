import { Router } from 'express';
import uploadControllers from '../../Controllers/upload/uploadControllers';
import adminLoginRequired from '../../middlewares/adminLoginRequired';

const router = Router();

router.post('/imagem', adminLoginRequired, uploadControllers.storeImagem);
router.post('/video', adminLoginRequired, uploadControllers.storeVideo);

export default router;
