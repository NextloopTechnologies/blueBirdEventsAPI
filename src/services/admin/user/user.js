import { User } from '../../../models';
import bcrypt from 'bcryptjs';

export const create = async(values) => {
    try {
        const user = new User(values);
        const emailExists = await User.findOne({ email: user.email});
        if(emailExists){
            return { status: 400 , msgText: 'Email already taken',success: false}
        }
        await user.save();
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
        console.log("fro service ",user)
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
        const user = await User.findByIdAndUpdate(id, values);
        if(!user) {
            return { status: 404 , msgText: "User does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const user = await User.findByIdAndDelete(id);  
        if(!user) {
            return { status: 404, msgText: "User does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

