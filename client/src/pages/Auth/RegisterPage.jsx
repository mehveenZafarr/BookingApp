import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const queryClient = useQueryClient();

    const InputField = (inputType, placeHolderName, inputValue, inputName) => {
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
        };
        return (
            <input
                type={inputType}
                placeholder={placeHolderName}
                value={inputValue}
                name={inputName}
                onChange={handleInputChange}
            />
        );
    };

    const { mutate: registerUser, isError, isLoading, error } = useMutation({
        mutationFn: async ({ name, email, password }) => {
            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Something went wrong!");
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const register = async (e) => {
        e.preventDefault();
        registerUser(formData);
    };
    return (
        <div className='mt-4 grow flex items-center justify-around'>
            <div className="mb-64">
                <h1 className='text-4xl text-center mb-4'>Register</h1>
                <form className='max-w-md mx-auto' onSubmit={register}>
                    {InputField('text', 'your name', formData.name, 'name')}
                    {InputField('email', 'your@email.com', formData.email, 'email')}
                    {InputField('password', 'password', formData.password, 'password')}
                    <button className='primary'>{isLoading ? 'Loading...' : 'Register'}</button>
                    {isError && <p className='text-red-500'>{error.message}</p>}
                    <div className='text-center py-2 text-gray-500'>
                        Already a member? <Link className='underline text-black' to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
