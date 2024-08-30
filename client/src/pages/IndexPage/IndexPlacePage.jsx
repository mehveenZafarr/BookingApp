import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BookingWidget from '../IndexPageWidgets/BookingWidget';
import PhotosGallery from '../../components/PhotosGallery';
import AddressTag from '../../components/AddressTag';

const IndexPlacePage = () => {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        numberOfGuests: 1,
        name: '',
        mobile: '',
        price: 1,
    });

    const { mutate: getPlace } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/place/getPlace/${id}`, {
                    method: "GET"
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong!");
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: (data) => {
            console.log("Index Place Page: ", data);
            setPlace(data);
        },
    });

    useEffect(() => {
        getPlace();
    }, [id]);

    if (!place) {
        return '';
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            // [name]: value,
            [name]: value || "",
        });
    };
    return (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
            <h1 className="text-3xl">{place.title}</h1>
            <AddressTag place={place} />
            <PhotosGallery place={place} />
            <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className='my-4'>
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {place.description}
                    </div>
                    Check-in: {place.checkIn} <br />
                    Check-out: {place.checkOut} <br />
                    Max number of guests: {place.maxGuests}
                </div>
                <div>
                    <BookingWidget place={place} formData={formData} setFormData={setFormData} handleInputChange={handleInputChange} />
                </div>
            </div>
            <div className="bg-white -mx-8 px-8 py-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Extra Info</h2>
                </div>
                <div className='mb-4 mt-1 text-sm text-gray-700 leading-5'>{place.extraInfo}</div>
            </div>
        </div>
    )
}

export default IndexPlacePage