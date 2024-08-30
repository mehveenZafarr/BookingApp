import mongoose from "mongoose";

// const PhotoSchema = new mongoose.Schema({
//     filename: { type: String, required: true },
//     filepath: { type: String, required: true },
//     mimetype: { type: String, required: true },
//     size: { type: Number, required: true },
//   });

const placeSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
    },
    address: {
        type: String,
    },
    photos: {
        type: [String],
    },
    description: {
        type: String,
    },
    perks: {
        type: [String],
    },
    extraInfo: {
        type: String,
    },
    checkIn: {
        type: Number,
    },
    checkOut: {
        type: Number,
    },
    maxGuests: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    }
}, {timestamps: true});

const Place = mongoose.model('Place', placeSchema);

export default Place;