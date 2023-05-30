import { PriortizationList } from '../../../models';
import mongoose from 'mongoose';

export const create = async(values) => {
    try {
        const priortizationlist = new PriortizationList(values);
        await priortizationlist.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, priortizationlist }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const priortizationlist = await PriortizationList.aggregate([
            {
                $match: whereClause
            },
            {
                $lookup: {
                    from: "events",
                    localField: "event_id",
                    foreignField: "_id",
                    as: "event"
                }
            }, { $unwind: "$event"} ,
            {
                $lookup: {
                    from: "users",
                    localField: "event.client_id",
                    foreignField: "_id",
                    as: "user"
                }
            } , { $unwind: "$user" }, 
            {
                $addFields: {
                    event_name: "$event.event_title",
                    client_name: "$user.name"
                }
            },
            {
                $project: {
                    event: 0,
                    user: 0
                }
            },
        ])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!priortizationlist.length > 0) {
            return { status: 404 , msgText: "PriortizationList does not exists!" ,success: false }
        }
        let count = await PriortizationList.find(whereClause).count();
        if(count === 1) {
            count = undefined;
        }
        return { status: 200, success: true, count, priortizationlist}
    } catch (error) {
        throw error;

    }
};

export const readForEvent = async({page, perPage, whereClause={}}) => {
    try {
        const priortizationlist = await PriortizationList.find(whereClause)
        .select(['-active','-createdAt','-updatedAt','-__v'])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!priortizationlist.length > 0) {
            return { status: 404 , msgText: "PriortizationList does not exists!" ,success: false }
        }
        return { status: 200, success: true, priortizationlist}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const priortizationlist = await PriortizationList.findByIdAndUpdate(id, values);
        if(!priortizationlist) {
            return { status: 404 , msgText: "PriortizationList does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await PriortizationList.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

export const removeMultiple = async(event_id)=> {
    try {
        await PriortizationList.deleteMany({event_id});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};