import { useMutation } from '@tanstack/react-query';
import React from 'react'

const PhotoUploader = ({ formData, setFormData, handleInputChange }) => {
    const { mutate: uploadLink, isError: isByLinkError, error: byLinkError } = useMutation({
        mutationFn: async ({ photoLink }) => {
            try {
                console.log("Here is the photo link: " + photoLink);
                const res = await fetch('/api/upload/upload-by-link', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ photoLink })
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
            console.log('Photo uploaded successfully:', data);
            console.log("photolink: " + data);
            setFormData(prevFormData => ({
                ...prevFormData,
                addedPhotos: [
                    ...(prevFormData.addedPhotos || []), // Maintain existing photos
                    data // Add the new photo link
                ]
            }));
            console.log("Added photos: ", formData.addedPhotos);
        },
        onError: (error) => {
            alert(error.message);
            console.error('Upload failed:', error.message);
        },
    });

    const addPhotoByLink = (e) => {
        e.preventDefault();
        uploadLink({ photoLink: formData.photoLink });
        setFormData({ ...formData, photoLink: '' });
    }

    const { mutate: uploadFromDevice, isError: isByDeviceError, error: byDeviceError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const res = await fetch('/api/upload/uploadFromDevice', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                console.log("upload from device: ",
                    data.uploadedFiles.map((file) => file.filename),
                    // data.uploadedFiles[0].filename
                );
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong!");
                }
                return data;
            } catch (error) {
                alert(error.message);
                throw new Error(error.message);
            }
        },
        onSuccess: (data) => {
            console.log("Photo from device uploaded successfully!");
            setFormData(prevFormData => ({
                ...prevFormData,
                addedPhotos: [
                    ...(prevFormData.addedPhotos || []),
                    ...(data.uploadedFiles.map((file) => file.filename)),
                ],
            }));
            console.log("Added photos: ", formData.addedPhotos);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const uploadPhotofromDevice = (e) => {
        const files = e.target.files;
        const formData = new FormData();
        // formData.append('photos', files);
        Array.from(files).forEach((file) => formData.append('photos', file));
        console.log("Append data: ", formData);
        uploadFromDevice(formData);
        console.log('Files from formData', { files });
    }
    const handleEmptyClick = (e) => {
        e.preventDefault();
    }
    const removePhoto = (filename, e) => {
        e.preventDefault();
        setFormData({ ...formData, addedPhotos: [...formData.addedPhotos.filter((photo) => photo !== filename)] });
    }
    const selectAsMainPhoto = (filename, e) => {
        e.preventDefault();
        const addedPhotosWithOutSelected = formData.addedPhotos.filter((photo) => photo !== filename);
        const newAddedPhotos = [filename, ...addedPhotosWithOutSelected];
        setFormData({ ...formData, addedPhotos: newAddedPhotos });
    }
    return (
        <>
            <div className='flex gap-2'>
                <input type="text" placeholder='Add using a link ...jpg' value={formData.photoLink} name='photoLink' onChange={handleInputChange} />
                <button onClick={formData.photoLink ? addPhotoByLink : handleEmptyClick} className='bg-gray-200 grow px-4 rounded-2xl'>Add&nbsp;photo</button>
            </div>
            {/* ==================Photo Uploading by link and from device=================== */}
            <div
                className="mt-2 items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-1/2 h-1/2"
            >
                {formData.addedPhotos && formData.addedPhotos.length > 0 && formData.addedPhotos.map((link, index) => (
                    <div key={index}>
                        {!isByDeviceError || !isByLinkError ?
                            <div className='h-32 flex relative' key={index}>
                                <img key={index} src={"http://localhost:4000/uploads/" + link} alt=""
                                    className='rounded-2xl w-full object-cover' />
                                <button onClick={(e) => removePhoto(link, e)} className="absolute bottom-1 right-2 text-white bg-black bg-opacity-50 p-1 rounded-xl py-2 px-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                                <button onClick={(e) => selectAsMainPhoto(link, e)} className="absolute bottom-1 left-2 text-white bg-black bg-opacity-50 p-1 rounded-xl py-2 px-3">
                                    {link === formData.addedPhotos[0] &&
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    {link !== formData.addedPhotos[0] &&
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                        </svg>
                                    }
                                </button>
                            </div>
                            : <label className='text-primary'>{byLinkError || byDeviceError}</label>}

                    </div>
                ))}
                <label className='h-32 cursor-pointer flex gap-1 items-center border bg-transparent rounded-2xl p-4 text-2xl text-gray-600'>
                    <input type="file" multiple className='hidden' onChange={uploadPhotofromDevice} name='photoUpload' />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    Upload
                </label>
            </div>
        </>
    )
}

export default PhotoUploader