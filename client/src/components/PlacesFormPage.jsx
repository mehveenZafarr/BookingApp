import React, { useEffect, useState } from 'react'
import PhotoUploader from './PhotoUploader.jsx'
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Perks from '../pages/AccountPageSub/Perks.jsx';

const PlacesFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    // console.log(id);
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        addedPhotos: [],
        photoLink: '',
        description: '',
        perks: [],
        extraInfo: '',
        checkIn: '',
        checkOut: '',
        maxGuests: 1,
        price: 100
    });

    const { mutate: putExistingData } = useMutation({
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
            console.log("Previous data: ", data.addedPhotos);
            setFormData({
                title: data.title,
                address: data.address,
                addedPhotos: data.photos,
                photoLink: '',
                description: data.description,
                perks: data.perks,
                extraInfo: data.extraInfo,
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                maxGuests: data.maxGuests,
                price: data.price
            });
        },
    });

    useEffect(() => {
        if (!id) {
            return;
        }
        putExistingData();
    }, [id]);

    function CheckFields({ headerTitle, placeHolderTitle, inputValue, flag = false, inputName }) {
        return (
            <div>
                <h3 className='mt-2 -mb-1'>{headerTitle}</h3>
                <input type={flag === true ? "number" : "text"} placeholder={placeHolderTitle} value={inputValue} onChange={handleInputChange} name={inputName} />
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            // [name]: value,
            [name]: value || "",
        });
    };

    const { mutate: addPlace, isError: isAddingPlaceError, error: addingPlaceError } = useMutation({
        mutationFn: async (formData) => {
            try {
                //adding place and updating
                const methd = id && id !== 'new' ? 'PUT' : 'POST';
                const url = id && id !== 'new' ? `/api/place/updatePlace/${id}` : '/api/place/addPlace';
                const jsonStringify = id ? { ...formData, _id: id } : { ...formData };
                const res = await fetch(url, {
                    method: methd,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonStringify)
                });
                console.log("add Place res: ", res);
                const data = await res.json();
                console.log("Add Place: ", data);
                if (!res.ok) {
                    throw new Error(data.error || 'Something went wrong!');
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: (data) => {
            console.log("here is newPlace: ", data);
            setFormData({
                title: '',
                address: '',
                addedPhotos: [],
                photoLink: '',
                description: '',
                perks: [],
                extraInfo: '',
                checkIn: '',
                checkOut: '',
                maxGuests: 1,
                price: 100
            });
            navigate('/account/places');
        },
    });

    const savePlace = (e) => {
        e.preventDefault();
        console.log('Submitting place form');
        addPlace(formData);
    }

    return (
        <div>
            <form onSubmit={savePlace}>
                <h2 className='text-2xl mt-4'>Title</h2>
                <p className='text-gray-500 text-sm'>Title should be short and catchy as in advertisement</p>
                <input type="text" placeholder='title, for example: My lovely apt' value={formData.title} name='title' onChange={handleInputChange} />
                <h2 className='text-2xl mt-4'>Address</h2>
                <p className='text-gray-500 text-sm'>Address to this place</p>
                <input type="text" placeholder='address' value={formData.address} name='address' onChange={handleInputChange} />
                <h2 className='text-2xl mt-4'>Photos</h2>
                <p className='text-gray-500 text-sm'>more = better</p>
                {/* ================Photo Uploader================= */}
                <PhotoUploader formData={formData} setFormData={setFormData} handleInputChange={handleInputChange} />
                <h2 className='text-2xl mt-4'>Description</h2>
                <p className='text-gray-500 text-sm'>description of the place</p>
                <textarea value={formData.description} name='description' onChange={handleInputChange} />
                <h2 className='text-2xl mt-4'>Perks</h2>
                <p className='text-gray-500 text-sm'>select all the perks of your place</p>
                {/* ====================CheckBoxes=================== */}
                <Perks formData={formData} setFormData={setFormData} />
                <h2 className='text-2xl mt-4'>Extra Info</h2>
                <p className='text-gray-500 text-sm'>house rules, etc</p>
                <textarea value={formData.extraInfo} name='extraInfo' onChange={handleInputChange} />
                <h2 className='text-2xl mt-4'>Check in&out times</h2>
                <p className='text-gray-500 text-sm'>add check in and out times, remember to have some time window for cleaning the room between guests</p>
                <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-4'>
                    {CheckFields({ headerTitle: 'Check in time', placeHolderTitle: '14', inputValue: formData.checkIn, inputName: 'checkIn' })}
                    {CheckFields({ headerTitle: 'Check out time', placeHolderTitle: '11', inputValue: formData.checkOut, inputName: 'checkOut' })}
                    {CheckFields({ headerTitle: 'Max number of guests', placeHolderTitle: '1', inputValue: formData.maxGuests, flag: true, inputName: 'maxGuests' })}
                    {CheckFields({ headerTitle: 'Price per night', placeHolderTitle: '100', inputValue: formData.price, flag: true, inputName: 'price' })}
                </div>
                <button className='primary my-4'>Save</button>
            </form>
        </div>
    )
}

export default PlacesFormPage