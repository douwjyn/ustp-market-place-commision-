import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../lib/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { me } from '../service/User';
export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  async function getUser() {
    try {
      const response = await me();
      console.log(response)
      setUser(response.user)
      if (response.user && response.user.role == 'admin') {
        navigate('/admin/dashboard')
      } else if (response.user) {
        navigate('/app/dashboard')
      }
    } catch (err) {
      if (err.response.data.message = 'Token has expired') {
        sessionStorage.removeItem('access_token')
        // navigate('/')
      }
    }
  }

  const notProtectedRoutes = [
    '/',
    '/login',
    '/create-account',
    '/forgot-password',
    '/thank-you',
    '/create-admin-account',
    '/admin/login',
  ];

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      getUser()
    }

    // const token = sessionStorage.getItem('access_token');
    // console.log(token);
    // if (token) {
    // setUserToken(token);
    // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // getUser();
    // } else {
    // if (!notProtectedRoutes.includes(location.pathname)) {
    // navigate(notProtectedRoutes[0]);
    // }
    // }
  }, []);

  return (
    <>
      <UserContext.Provider value={{ userToken, setUserToken, user, setUser }}>
        {children}
      </UserContext.Provider>
    </>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
