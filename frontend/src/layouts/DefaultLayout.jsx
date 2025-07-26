
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserProvider'
import Navbar from '../components/Navbar';
import { useEffect } from 'react'
import axios from 'axios'
import { api } from '../lib/axios';

function DefaultLayout() {
  const { user, setUserToken } = useUser();
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    const handleVisibilityChange = () => {
      const token = sessionStorage.getItem("access_token");

      // Debug the token
      console.log('Token from sessionStorage:', token);
      console.log('Token type:', typeof token);
      console.log('Token length:', token?.length);

      if (document.visibilityState === 'hidden' && token) {
        console.log('page is hidden');

        fetch('http://localhost:8000/api/v1/user/status', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'offline'
          }),
          keepalive: true
        })
          .then(response => {
            console.log('Response status:', response.status);
            return response.text();
          })
          .then(data => {
            console.log('Response data:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });

      } else if (document.visibilityState === 'visible') {
        console.log('Page is visible again');
        fetch('http://localhost:8000/api/v1/user/status', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'online'
          }),
          keepalive: true
        })
          .then(response => {
            console.log('Response status:', response.status);
            return response.text();
          })
          .then(data => {
            console.log('Response data:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, []);

  async function authenticated() {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      setUserToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/app/dashboard');
    } else {
      navigate('/');
    }
  }

  useEffect(() => {
    authenticated();
  }, []);

  if (!sessionStorage.getItem('access_token')) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!user) {
    // Not logged in yet, or user info not loaded
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" state={{ from: location }} replace />;
  }

  return (<>
    <Navbar />
    <div className="min-h-screen bg-gray-90 p">
      <Outlet />
    </div>
  </>
  );
}

export default DefaultLayout;
