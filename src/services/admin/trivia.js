import { Trivia } from '../../models';

export const create = async(values) => {
    try {
        const trivia = new Trivia(values);
        await trivia.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, trivia }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const trivia = await Trivia.find(whereClause).sort({ _id: -1 });
        if(!trivia.length > 0) {
            return { status: 404 , msgText: "Trivia does not exists!" ,success: false }
        }
        return { status: 200, success: true, trivia}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const trivia = await Trivia.findByIdAndUpdate(id, values);
        if(!trivia) {
            return { status: 404 , msgText: "Trivia does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const trivia = await Trivia.findByIdAndDelete(id);  
        if(!trivia) {
            return { status: 404, msgText: "Trivia does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
