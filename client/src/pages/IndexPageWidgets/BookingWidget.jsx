import { useMutation } from '@tanstack/react-query';
import { differenceInCalendarDays } from 'date-fns';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingWidget = ({ place, formData, setFormData, handleInputChange }) => {
    const id = place._id;
    let numberOfNights = 0;
    const navigate = useNavigate();

    if (formData.checkIn && formData.checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(formData.checkOut), new Date(formData.checkIn));
    }
    const {mutate: makeBooking} = useMutation({
        mutationFn: async ({checkIn, checkOut, name, mobile, numberOfGuests, price}) => {
            try {
                const dt = {
                    placeId: id, 
                    checkIn: checkIn,
                    checkOut: checkOut,
                    name: name,
                    mobile: mobile,
                    numberOfGuests: numberOfGuests,
                    price: price
                };
                const res = await fetch('/api/bookings/makeBooking', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dt)
                });
                const data = await res.json();
                if(!res.ok) {
                    throw new Error(data.error || "Something went wrong!");
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
                // alert(error.message);
            }
        },
        onSuccess: (data) => {
            navigate(`/account/bookings/${data._id}`);
            console.log("Booking data: ", data);
        },
        onError: (error) => {
            console.log("Booking error: ", error);
        }
    });

    useEffect(() => {
        setFormData({...formData, price: numberOfNights * place.price})
    }, [numberOfNights]);

    const bookPlace = (e) => {
        e.preventDefault();
        makeBooking(formData);
    }
    return (
        <div className="bg-white p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className='py-3 px-4'>
                        <label >Check in: </label>
                        <input type="date" value={formData.checkIn} onChange={(e) => handleInputChange(e)} name='checkIn' />
                    </div>
                    <div className='py-3 px-4 border-l'>
                        <label >Check out: </label>
                        <input type="date" value={formData.checkOut} onChange={(e) => handleInputChange(e)} name='checkOut' />
                    </div>
                </div>
                <div className='py-3 px-4 border-t'>
                    <label >Number of Guests: </label>
                    <input type="number" value={formData.numberOfGuests} onChange={(e) => handleInputChange(e)} name='numberOfGuests' />
                </div>
                {numberOfNights > 0 && (
                    <div className='py-3 px-4 border-t'>
                        <label >Your full name: </label>
                        <input type="text" value={formData.name} onChange={(e) => handleInputChange(e)} name='name' />
                        <label >Phone number: </label>
                        <input type="tel" value={formData.mobile} onChange={(e) => handleInputChange(e)} name='mobile' />
                    </div>
                )}
            </div>
            <button onClick={(e) => bookPlace(e)} className="primary mt-4">
                Book this place
                {numberOfNights > 0 && (
                    <span> ${numberOfNights * place.price}</span>
                )}
            </button>
        </div>
    )
}

export default BookingWidget