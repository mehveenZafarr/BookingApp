import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import IndexPage from './pages/IndexPage/IndexPage.jsx'
import LoginPage from './pages/Auth/LoginPage.jsx';
import Layout from './pages/Layout';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { useContext } from 'react';
import { UserContext } from './components/UserContext.jsx';
import AccountPage from './pages/AccountPage.jsx';
import PlacesFormPage from './components/PlacesFormPage.jsx';
import IndexPlacePage from './pages/IndexPage/IndexPlacePage.jsx';
import BookingPlace from './pages/Bookings/BookingPlace.jsx';

// axios.defaults.baseURL = 'http://localhost:4000/api'

function App() {

  const { setUser } = useContext(UserContext);
  const { data: authUser, isLoading, error, isError } = useQuery({
    //we use queryKey to give a unique name to our query and refer to it later
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data);
        console.log("here i am setting: ", data);
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error);
        }
        console.log("Auth User is here ", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    ); // Or a spinner component
  }

  if (isError) {
    return <div className='text-red-500'>Error: {error.message}</div>; // Handle error state
  }

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Default route: Shows IndexPage if user is not logged in */}
        <Route index element={<IndexPage />} />

        {/* Login and Register Routes */}
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/register' element={!authUser ? <RegisterPage /> : <Navigate to='/' />} />

        {/* Profile route: Shows AccountPage if user is logged in */}
        <Route path='/account/:subpage?' element={authUser ? <AccountPage /> : <Navigate to='/login' />} />
        <Route path='/account/:subpage/:action' element={<AccountPage />} />
        <Route path='/account/places/:id' element={<PlacesFormPage />} />
        <Route path='/account/bookings/:id' element={<BookingPlace />} />
        <Route path='/place/:id' element={<IndexPlacePage/>}/>
      </Route>
    </Routes>
  )
}

export default App