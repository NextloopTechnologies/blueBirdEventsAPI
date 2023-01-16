import { model, Schema } from "mongoose";

const offerBannerSchema = new Schema({
    event_type: {
        type: String,
        required: true
    }, 
    banner_title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    banner_descp: {
        type: String,
        minlength: 3,
        required: true
    },
    offer_starts: {
        type: Date,
        required: true,
    },
    offer_ends: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    banner_img : {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const OfferBanner = model('OfferBanner', offerBannerSchema);

export default OfferBanner;



