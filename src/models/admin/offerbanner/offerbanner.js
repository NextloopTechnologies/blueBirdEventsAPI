import { model, Schema } from "mongoose";

const offerBannerSchema = new Schema({
    event_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    }, 
    banner_title: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    banner_descp: {
        type: String,
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



