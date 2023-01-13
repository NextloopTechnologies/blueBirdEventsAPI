import { Schema, model } from 'mongoose';

const triviaSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlenght: 3
    },
    descp: {
        type: String,
        required: true,
        minlenght: 3
    },
    active : {
        type: Boolean,
        default : true
    }
},{ 
    timestamps: true
});

const Trivia = model('Trivia', triviaSchema);

export default Trivia;