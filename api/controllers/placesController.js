import Place from "../models/Place.js";

export const addPlace = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
        const newPlace = new Place({
            owner: userId,
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price
        });
        if (newPlace) {
            await newPlace.save();
            res.status(201).json(newPlace);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server error! ' + error.message });
    }
}
export const updatePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
        const newPlace = await Place.findByIdAndUpdate(
            id,
            {
                owner: userId,
                title,
                address,
                photos: addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price
            },
            { new: true, runValidators: true }
        );
        if (newPlace) {
            await newPlace.save();
            res.status(201).json({
                address: newPlace.address,
                owner: newPlace.owner
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server error! ' + error.message });
    }
}

export const getAllPlaces = async (req, res) => {
    try {
        const userId = req.user._id;
        const response = await Place.find({ owner: userId });
        if (response.length === 0) {
            return res.status(400).json({ message: "You havn't added any place yet!" });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getPlace = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Place.findById({ _id: id });
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getPlaces = async (req, res) => {
    try {
        const response = await Place.find();
        if (response.length < 0) {
            return res.status(404).json({ message: "There is nothing to display!" });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}