import { Router } from 'express';
import userController from './admin/user';

const router = new Router()

router.use('/v1/admin', userController)

export default router;
