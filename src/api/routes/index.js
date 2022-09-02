import { Router } from 'express';
import userController from './admin/user';
import triviaController from './admin/trivia';

const router = new Router()

router.use('/v1/admin', userController);
router.use('/v1/admin/trivia', triviaController);

export default router;
