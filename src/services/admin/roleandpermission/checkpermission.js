import { Permission, PermRole } from "../../../models";

export const checkPermission = async(roleId, permName) => {
  try {
      const perm = await Permission.findOne({ perm_name: permName });
      if(!perm) {
        throw new Error();
        // return { status: 404 , msgText: 'Permission does not exists!',success: false }
      }
      const permRole =  await PermRole.findOne({role_id: roleId, permission_id: perm._id});
      if(!permRole) {
        throw new Error();
        // return { status: 403 , msgText: 'Access Forbidden',success: false }
      }
      return permRole;
  } catch (error) {
    throw { status: 403 , msgText: 'Access Forbidden', success: false };
  }
}

