import { Router } from 'express';
import userController from './admin/user';
import roleController from './admin/role';
import permissionController from './admin/permission';
import permissionRoleController from './admin/permission_role';
import triviaController from './admin/trivia';
import eventController from './admin/event';
import subEventController from './admin/subevent';
import eventPhotoController from './admin/eventphoto';
import enquiryController from './admin/enquiry';
import offerBannerController from './admin/offerbanner';
import freelancerController from './admin/freelancer';
import hotelController from './admin/hotel';
import hotelRoomController from './admin/hotel_room';
import hotelRoomTypeController from './admin/hotel_room_type';

const router = new Router()

router.use('/v1/admin/user', userController);
router.use('/v1/admin/role', roleController);
router.use('/v1/admin/permission', permissionController);
router.use('/v1/admin/permissionrole', permissionRoleController);
router.use('/v1/admin/trivia', triviaController);
router.use('/v1/admin/event', eventController);
router.use('/v1/admin/subEvent', subEventController);
router.use('/v1/admin/eventPhoto', eventPhotoController);
router.use('/v1/admin/enquiry', enquiryController);
router.use('/v1/admin/offerBanner', offerBannerController);
router.use('/v1/admin/freelancer', freelancerController);
router.use('/v1/admin/hotel', hotelController);
router.use('/v1/admin/hotelroom', hotelRoomController);
router.use('/v1/admin/hotelroomtype', hotelRoomTypeController);

export default router;
