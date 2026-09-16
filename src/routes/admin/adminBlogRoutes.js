import { Router } from 'express';
import blogControllers from '../../Controllers/blog/blogControllers';
import adminLoginRequired from '../../middlewares/adminLoginRequired';

const router = Router();

router.get('/', adminLoginRequired, blogControllers.adminIndex);
router.post('/', adminLoginRequired, blogControllers.store);
router.put('/:id', adminLoginRequired, blogControllers.update);
router.delete('/:id', adminLoginRequired, blogControllers.delete);

export default router;
