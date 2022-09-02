import { Schema, model } from 'mongoose';

const triviaSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlenght: 6,
        maxlength: 60
    },
    descp: {
        type: String,
        required: true,
        minlenght: 10
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