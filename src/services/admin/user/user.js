import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import { emailService } from '../..';
import { generateRandomNumber, diffInMinutes } from '../../../utils/helper';
import config from '../../../config';
import { sign, verify } from 'jsonwebtoken';

export const create = async(values) => {
    try {
        const user = new User(values);
        const emailExists = await User.findOne({ email: user.email});
        if(emailExists){
            return { status: 400 , msgText: 'Email already taken',success: false}
        }
        await user.save();
        emailService.sendWelcomeEmail(user.email, user.name, user.password);
        const token = await user.generateAuthToken();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, user, token }
    } catch (error) {
        throw error;
    }
};

export const login = async(values) => {
    try {
        const user = await User.findOne({email: values.email});
        if(!user) {
            return { status: 401 , msgText: "Wrong credentials, unable to login!" ,success: false }
        }
        const isMatch = await bcrypt.compare(values.password, user.password);
        if(!isMatch){
            return { status: 401 , msgText: "Wrong credentials, unable to login!" ,success: false }
        }
        const token = await user.generateAuthToken();  
        return { status: 200, msgText: 'Logged In Successfully! ',
        success: true, user, token}
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const user = await User.find(whereClause).sort({ _id: -1 });
        if(!user.length > 0) {
            return { status: 404 , msgText: "User does not exists!" ,success: false }
        }
        return { status: 200, success: true, user}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        if(values.password) {
            values.password = await bcrypt.hash(values.password, 8);
        }
        const user = await User.findByIdAndUpdate(id, values);
        if(!user) {
            return { status: 404 , msgText: "User does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const forgotPasswordRequest = async(email) => {
    try {
        const user = await User.findOne({email});
        if(!user) {
            return { status: 401 , msgText: "User mail not found!", success: false }
        }
        const resetToken = sign ({email: user.email}, config.JWT, { expiresIn: '5m'} );
        
        // const values = { otp: generateRandomNumber(), otp_timeout: new Date()}
        emailService.sendForgotPasswordEmail(email, resetToken);
        // await User.findByIdAndUpdate(user._id, values);
        // console.log("form service ", decoded);
        return { status: 200, msgText: 'OTP sent your mail!',success: true}
    } catch (error) {
        throw error;
    }
}

export const updateForgotPassword = async(values) => {
    try {
        const isValid = verify (values.resetToken, config.JWT);
        if(!isValid) {
            return { status: 401, msgText: 'Invalid Token', success: false }
        }
        await User.findByIdAndUpdate(isValid.email, values);
        return { status: 202, msgText: 'Password Updated successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

export const passwordVerify = (values) => {
    if(values.password !== values.confirmPassword) {
        return res.status(401).send({ msgText: "Password mismatch for new and confirm password!", success: false})
    }
}

export const remove = async(ids)=> {
    try {
        await User.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

