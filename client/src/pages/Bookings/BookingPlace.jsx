import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import PhotosGallery from '../../components/PhotosGallery';
import AddressTag from '../../components/AddressTag';
import BookingDates from '../../components/BookingDates';

const BookingPlace = () => {
  const [bookingData, setBookingData] = useState([]);
  const { id } = useParams();
  const { mutate: getBooking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/bookings/getSelectedBooking/${id}`, {
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
      console.log("Selected Booking: ", data);
      setBookingData(data);
    },
    onError: (error) => {
      console.log("Error in getting selected Booking: ", error);
    },
  });
  useEffect(() => {
    getBooking();
  }, []);
  if (!bookingData) {
    return '';
  }
  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{bookingData.placeId?.title}</h1>
      <AddressTag place={bookingData.placeId} />
      <div className="flex items-center justify-between bg-gray-200 p-6 my-4 rounded-2xl">
        <div>
          <h2 className="text-2xl mb-4">Your booking information</h2>
          {<BookingDates booking={bookingData} />}
        </div>
        <div className='bg-primary text-white rounded-2xl p-6'>
          <div>Total price</div>
          <div className='text-3xl'>${bookingData.price}</div>
        </div>
      </div>
      <PhotosGallery place={bookingData.placeId} />
    </div>
  )
}

export default BookingPlace