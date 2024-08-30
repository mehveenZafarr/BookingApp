import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import PlacesFormPage from '../../components/PlacesFormPage.jsx';

const PlacesPage = () => {
    const { action } = useParams();
    const [places, setPlaces] = useState([]);

    const { mutate: getPlaces, error: placingError, isError: isPlacingError } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch('/api/place/getAllPlaces', {
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
            setPlaces(data);
        },
    });

    const getAllPlaces = () => {
        getPlaces();
    }

    useEffect(() => {
        getAllPlaces();
    }, []);

    const placeWidget = places.map((place, index) => {
        return (
            <Link to={`/account/places/${place._id}`}
                key={index}
                className='flex cursor-pointer flex-col md:flex-row lg:flex-row xl:flex-row gap-4 bg-gray-100 p-4 rounded-2xl mt-4'>
                <div key={index} className='flex gap-4 bg-gray-100 p-4 rounded-2xl flex-col md:flex-row lg:flex-row xl:flex-row'>
                    <div className='w-full md:w-32 lg:w-32 xl:w-32 aspect-square bg-gray-300 rounded-2xl flex overflow-hidden grow shrink-0'>
                        {place.photos.length > 0 && (
                            <img key={index} src={`http://localhost:4000/uploads/${place.photos[0]}`} alt=""
                                className='object-cover rounded-2xl' style={{ aspectRatio: '1/1' }} />
                        )}
                    </div>
                    {/* <div className='flex flex-col justify-center w-full'> */}
                    <div className='shrink grow-0'>
                        <h2 className='text-xl'>{place.title}</h2>
                        <p className='text-sm mt-2'>{place.description}</p>
                    </div>
                </div>
            </Link>
            // </div>
        );
    });

    return (
        <div>
            {action !== 'new' && (
                <>
                    <div className='text-center'>
                        <Link className='inline-flex bg-primary gap-1 text-white py-2 px-6 rounded-full' to={'/account/places/new'}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                            Add new place
                        </Link>
                    </div>
                    {places.length > 0 &&
                        <div className='mt-4'>
                            {/* Places here */}
                            {placeWidget}
                        </div>
                    }
                </>
            )}
            {action === 'new' && (
                isPlacingError ? <PlacesFormPage /> :
                    !placingError ? <p>You havn't added any place yet</p> :
                        <p className='text-primary'>{placingError}</p>
            )}
        </div>
    )
}

export default PlacesPage