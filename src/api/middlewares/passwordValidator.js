import bcrypt from "bcryptjs";

export default async(req, res, next) => {
    const isMatch  = await bcrypt.compare(req.values.oldPassword, req.user.password);
    if(! isMatch) {
      return res.status(401).send({msgText: "Incorrect old password!", success: false});
    }
    next();
};