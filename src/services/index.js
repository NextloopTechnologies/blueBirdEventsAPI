import * as userService from './admin/user';
import * as roleService from './admin/role';
import * as permissionService from './admin/permission';
import * as permissionRoleService from './admin/permission_role';
import * as assignedPermissionService from './admin/checkpermission';
import * as triviaService from './admin/trivia';
import * as eventService from './admin/event';
import * as eventPhotoService from './admin/eventphoto';
import * as enquiryService from './admin/enquiry';
import * as offerBannerService from './admin/offerbanner'
import * as fileService from './admin/fileuploads';
import * as freelancerService from './admin/freelancer';
import * as subEventService from './admin/subevent';
import * as hotelService from './admin/hotel';
import * as hotelRoomService from './admin/hotel_room';
import * as hotelRoomTypeService from './admin/hotel_room_type';
import * as hotelRoomChecklistService from './admin/hotel_room_checklist';
import * as ghmsGuestlistService from './admin/ghms_guestlist';
import * as roomAllotmentService from './admin/room_allotment';

export {
    userService,
    roleService,
    permissionService,
    permissionRoleService,
    assignedPermissionService,
    fileService,
    triviaService,
    eventService,
    subEventService,
    eventPhotoService,
    enquiryService,
    offerBannerService,
    freelancerService,
    hotelService,
    hotelRoomService,
    hotelRoomTypeService,
    hotelRoomChecklistService,
    ghmsGuestlistService,
    roomAllotmentService
}