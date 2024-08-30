import React, { useContext, useState } from 'react'
import { UserContext } from '../components/UserContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Profile from './AccountPageSub/Profile';
import PlacesPage from './AccountPageSub/PlacesPage';
import AccountNav from '../components/AccountNav';
import PlacesFormPage from '../components/PlacesFormPage';
import BookingsPage from './Bookings/BookingsPage';

const AccountPage = () => {
    const { user, setUser } = useContext(UserContext);
    let { subpage, action, id } = useParams();
    console.log("id:AccountPage ", id);
    const navigate = useNavigate();

    if (subpage === undefined) {
        subpage = 'profile';
    }

    function linkClasses(type = null) {
        let classes = 'inline-flex gap-1 py-2 px-6 rounded-full ';
        if (type === subpage) {
            classes += 'bg-primary text-white';
        } else {
            classes += 'bg-gray-200'
        }
        return classes;
    }

    const queryClient = useQueryClient();

    const { mutate: logoutuser } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch('/api/auth/logout', {
                    method: "POST"
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Logout failed!");
                }
                // return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            navigate('/login');
            console.log('logout successfully!');
        },
    });

    const logout = (e) => {
        e.preventDefault();
        logoutuser();
    }

    return (
        // <div>
        //     <AccountNav linkClasses={linkClasses}/>
        //     {subpage === 'profile' && (<Profile logout={logout} user={user} />)}
        //     {subpage === 'places' && (<PlacesPage />)}
        //     {/* {id && (<PlacesPage/>)} */}
        // </div>
        <div>
            <AccountNav linkClasses={linkClasses} />
            {subpage === 'profile' && (<Profile logout={logout} user={user} />)}
            {subpage === 'places' && !action && !id && (<PlacesPage />)}
            {subpage === 'places' && action === 'new' && (<PlacesFormPage />)}
            {subpage === 'places' && id && (<PlacesFormPage placeId={id} />)} {/* Handle editing/viewing place */}
            {subpage === 'bookings' && !action && !id && (<BookingsPage />)}
            {/* {!subpage && id && (<PlacesFormPage placeId={id} />)} */}
        </div>
    )
}

export default AccountPage