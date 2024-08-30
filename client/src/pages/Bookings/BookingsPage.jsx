import { useMutation } from "@tanstack/react-query"
import { differenceInCalendarDays, format } from "date-fns";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import BookingDates from "../../components/BookingDates";

const BookingsPage = () => {
  const [allBookings, setAllBookings] = useState([]);
  const { mutate: getBookings } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch('/api/bookings/getAllBookings', {
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
      console.log("All Booking are: ", data);
      setAllBookings(data);
      console.log("allBookings: ", allBookings);
    },
    onError: (error) => {
      console.log("Error in getting all bookings is: ", error);
    },
  });

  useEffect(() => {
    getBookings();
  }, []);
  return (
    <div>
      {allBookings?.length > 0 && allBookings.map((booking, index) => (
        <Link to={`/account/bookings/${booking._id}`} className='flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mb-4' key={index}>
          <div className="w-48 md:w-48 lg:w-48">
            <img
              className="w-full h-full overflow-hidden rounded-2xl object-cover"
              src={`http://localhost:4000/uploads/${booking.placeId.photos?.[0]}`}
              alt=""
            />
          </div>
          <div className="py-3 pr-3 grow">
            <h2 className="text-xl">{booking.placeId.title}</h2>
            {/* <div className="flex gap-2 items-center border-t border-gray-300 mt-2 py-2"></div> */}
            <div className="text-xl">
              <BookingDates booking={booking} className={"mb-2 mt-4 text-gray-500"} />
              <div className="flex gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
                <span className="text-2xl">Total price: ${booking.price}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
      {/* Bookings */}
    </div>
  )
}

export default BookingsPage