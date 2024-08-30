import React from 'react'

const Profile = ({ user, logout }) => {
    return (
        <div className='text-center max-w-lg mx-auto'>
            Logged in as {user.name} ({user.email}) <br />
            <button onClick={(e) => logout(e)} className='primary max-w-sm mt-2'>Logout</button>
        </div>
    )
}

export default Profile