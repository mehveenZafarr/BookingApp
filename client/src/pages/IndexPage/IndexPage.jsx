import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

const IndexPage = () => {
    const [places, setPlaces] = useState([]);

    const { mutate: getPlaces } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch('/api/place/getPlaces', {
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
        onError: (error) => {
            console.log("Error in getting places at Index Page: ", error);
        },
    });

    useEffect(() => {
        getPlaces();
    }, []);
    return (
        <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {places.length > 0 && places.map((place, index) => (
                <Link to={'/place/' + place._id} key={index}>
                    <div key={index} className="bg-gray-500 mb-2 rounded-2xl">
                        {place.photos?.[0] && (
                            <div className="overflow-hidden">
                                <img className="rounded-2xl object-cover aspect-square w-full h-auto" src={`http://localhost:4000/uploads/${[place.photos?.[0]]}`} alt="" />
                            </div>
                        )}
                    </div>
                    <h2 className="font-bold leading-4">{place.address}</h2>
                    <h3 className="text-sm leading-4 text-gray-500">{place.title}</h3>
                    <div className="mt-1">
                        <span className="font-bold">${place.price}</span> per night
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default IndexPage