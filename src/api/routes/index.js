import { Router } from 'express';
import userController from './admin/user';
import triviaController from './admin/trivia';
import eventController from './admin/event';
import eventPhotoController from './admin/eventphoto';
import enquiryController from './admin/enquiry';
import offerBannerController from './admin/offerbanner';

const router = new Router()

router.use('/v1/admin/user', userController);
router.use('/v1/admin/trivia', triviaController);
router.use('/v1/admin/event', eventController);
router.use('/v1/admin/eventPhoto', eventPhotoController);
router.use('/v1/admin/enquiry', enquiryController);
router.use('/v1/admin/offerBanner', offerBannerController);

export default router;
