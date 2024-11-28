import * as userService from './admin/user/user';
import * as roleService from './admin/roleandpermission/role';
import * as permissionService from './admin/roleandpermission/permission';
import * as permissionRoleService from './admin/roleandpermission/permission_role';
import * as assignedPermissionService from './admin/roleandpermission/checkpermission';
import * as triviaService from './admin/trivia/trivia';
import * as eventService from './admin/event/event';
import * as eventPhotoService from './admin/event/eventphoto';
import * as subEventService from './admin/event/subevent';
import * as enquiryService from './admin/enquiry/enquiry';
import * as offerBannerService from './admin/offerbanner/offerbanner'
import * as fileService from './admin/generalservice/fileuploads';
import * as filterService from './admin/generalservice/filter';
import * as emailService from './admin/generalservice/email';
import * as freelancerService from './admin/freelancer/freelancer';
import * as freelancerAssignedEventService from './admin/freelancer/freelancer_assigned_event';
import * as hotelService from './admin/hotel/hotel';
import * as hotelRoomService from './admin/hotel/hotel_room';
import * as hotelRoomTypeService from './admin/hotel/hotel_room_type';
import * as hotelRoomChecklistService from './admin/hotel/hotel_room_checklist';
import * as roomAllotmentService from './admin/hotel/room_allotment';
import * as hospitalityChecklistService from './admin/hospitalitychecklist/hospitality_checklist';
import * as ghmsGuestlistService from './admin/ghms/ghms_guestlist';
import * as ghmsArrivalMgmtService from './admin/ghms/ghms_arrival_mgmt';
import * as ghmsDepartureMgmtService from './admin/ghms/ghms_departure_mgmt';
import * as ghmsLostFoundService from './admin/ghms/ghms_lost_found';
import * as ghmsOutstationService from './admin/ghms/ghms_outstation';
import * as vendorService from './admin/vendor/vendor';
import * as vendorCarService from './admin/vendor/vendor_car';
import * as vendorDriverService from './admin/vendor/vendor_driver';
import * as vendorProdDecorService from './admin/vendor/vendor_prod_decor';
import * as vendorProdDecorChecklistService from './admin/vendor/vendor_proddecor_checklist';
import * as vendorFoodBevService from './admin/vendor/vendor_food_bev';
import * as generalChecklistService from './admin/general_checklist/general_checklist';
import * as priortizationListService from './admin/priortizationlist/priortizationlist';
import * as whatsappService from './admin/whatsapp/whatsapp';

export {
    userService,
    roleService,
    permissionService,
    permissionRoleService,
    assignedPermissionService,
    fileService,
    filterService,
    emailService,
    triviaService,
    eventService,
    subEventService,
    eventPhotoService,
    enquiryService,
    offerBannerService,
    freelancerService,
    freelancerAssignedEventService,
    hotelService,
    hotelRoomService,
    hotelRoomTypeService,
    hotelRoomChecklistService,
    roomAllotmentService,
    hospitalityChecklistService,
    ghmsGuestlistService,
    ghmsArrivalMgmtService,
    ghmsDepartureMgmtService,
    ghmsLostFoundService,
    ghmsOutstationService,
    vendorService,
    vendorCarService,
    vendorDriverService,
    vendorProdDecorService,
    vendorProdDecorChecklistService,
    vendorFoodBevService,
    generalChecklistService,
    priortizationListService,
    whatsappService
}