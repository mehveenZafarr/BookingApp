import mongoose from "mongoose";

const BookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // user: {
    //     type: String,
    // },
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
}, {timestamps:true});

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;