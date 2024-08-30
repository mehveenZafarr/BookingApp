import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const queryClient = useQueryClient();

    const { mutate: loginUser, isLoading, isError, error } = useMutation({
        mutationFn: async ({ email, password }) => {
            try {
                const res = await fetch('/api/auth/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong!");
                }
                console.log("User Login!");
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
        },
    });

    const login = (e) => {
        e.preventDefault();
        loginUser(formData);
    };
    return (
        <div className='mt-4 grow flex items-center justify-around'>
            <div className="mb-64">
                <h1 className='text-4xl text-center mb-4'>Login</h1>
                <form className='max-w-md mx-auto' onSubmit={login}>
                    <input type="email" placeholder='your@email.com' value={formData.email} name='email' onChange={handleInputChange} />
                    <input type="password" placeholder='password' value={formData.password} name='password' onChange={handleInputChange} />
                    <button className='primary'>{isLoading ? 'Loading...' : 'Login'}</button>
                    {isError && <p className='text-red-500'>{error.message}</p>}
                    <div className='text-center py-2 text-gray-500'>
                        Don't have an account yet? <Link className='underline text-black' to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage