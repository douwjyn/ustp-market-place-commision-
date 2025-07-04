import { createContext, useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const navigate = useNavigate();


  async function authenticated() {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      setUserToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/app/dashboard');
    } else {
      navigate('/login');
    }
  }

  useEffect(() => {
    authenticated();
  }, []);
  return (
    <>
      <AuthContext.Provider value={{ userToken }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
