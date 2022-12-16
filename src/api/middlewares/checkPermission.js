import { Permission, PermRole } from "../../models";

export default (permName) => {
  return async(req, res, next) => {
    try {
      // const perm = await Permission.findOne({ perm_name: permName });
      console.log("perm value", permName, " perm db ", perm);
      // if(!perm) {
      //   return res.status(404).send({msgText:"Permission does not exists!", success: false});
      // }
      // const permRole = await PermRole.findOne({role_id: req.user.role_id, permission_id: perm._id});
      // if(!permRole) {
      //   throw new Error();
      // }
      next()
    } catch (error) {
      console.log("Catch Response");
      // res.status(403).send({msgText:"Access Forbidden", success: false});
    }
  }
}


