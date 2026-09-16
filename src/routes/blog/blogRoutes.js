import { Router } from 'express';
import blogControllers from '../../Controllers/blog/blogControllers';

const router = Router();

router.get('/', blogControllers.index);
router.get('/:slug', blogControllers.show);

export default router;
