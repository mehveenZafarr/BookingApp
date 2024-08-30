import Booking from "../models/Booking.js";

export const makeBooking = async (req, res) => {
    try {
        const userId = req.user._id;
        // console.log(`${user} is making booking==============================`);
        const {placeId, checkIn, checkOut, name, mobile, numberOfGuests, price} = req.body;
        const newBooking = new Booking({
            userId, placeId, checkIn, checkOut, name, mobile, numberOfGuests, price
        });
        if(newBooking) {
            await newBooking.save();
            res.status(200).json(newBooking);
        }
        // res.json({message: "Make booking endpoint!"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getAllBookings = async (req, res) => {
    try {
        const user = req.user;
        const userId = user._id;
        // console.log(`${user} is making booking==============================`);
        const response = await Booking.find({userId})
        .populate({
            path: 'userId',
            select: '-password'
        })
        .populate({
            path: 'placeId',
        });
        if(!response) {
            return res.status(400).json({message: "You havn't make any booking!" });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getSelectedBooking = async (req, res) => {
    try {
        const {id} = req.params;
        const selectedBooking = await Booking.findById({_id: id}).populate('placeId');
        if(selectedBooking === null) {
            res.status(404).json({message: "No Booking!"});
        }
        res.status(200).json(selectedBooking);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}