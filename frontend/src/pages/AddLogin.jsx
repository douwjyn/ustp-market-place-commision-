import React, { useState, } from 'react';
import styles from './AddLogin.module.css';
import pancakes from '../assets/logo.png';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios'
import { UserContext} from '../context/UserProvider'; // Import UserContext if needed
const AdLogin = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { setUser, user} = React.useContext(UserContext); // Access userToken and user from UserContext
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (ev) => {
    ev.preventDefault(); // Prevent default form submission

    setError(''); // Clear previous error

    try {
      const response = await axios.post('http://localhost:8000/api/v1/admin/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      // if (!response.status !== 200) {
      //   if (data && data.message) {
      //     setError(data.message);
      //   } else {
      //     setError('An unexpected error occurred. Please try again.');
      //   }
      //   return;
      // }

      

      // Assuming successful login, you might want to store a token or user info
      // and then redirect to the admin dashboard.
      // console.log('Login successful:', data);
      // setUserToken(data.access_token); // Store token in context or state
      // setUser(data.user)
      // console.log(user)
      sessionStorage.setItem('access_token', data.access_token); // Store token in session storage
      navigate('/admin/dashboard'); // Redirect to admin dashboard
    } catch (err) {
      console.log(err)
      setError(
        err.response.data.message ||
        'A network error occurred. Please check your connection and try again.'
      );
    }
  };

  return (
    <div className={styles.container}>
      <img src={pancakes} alt='USTP Logo' className={styles.logo} />
      <h1 className={styles.title}>USTP MARKET PLACE FOR STUDENTS</h1>
      <h2 className={styles.adminLabel}>Administrator</h2>

      <div className={styles.form}>
        <input
          type='text'
          placeholder='Email'
          className={styles.input}
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />

        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            className={styles.input}
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <span onClick={togglePassword} className={styles.eyeIcon}>
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.links}>
          <Link to='/admin/create-account' className={styles.link}>
            Create account
          </Link>
          <a href='#' className={styles.link}>
            Forgot Password?
          </a>
        </div>

        <button className={styles.loginButton} onClick={handleLogin}>
          Login
        </button>
      </div>

      <footer className={styles.footer}>© 2025 All Rights Reserved.</footer>
    </div>
  );
};

export default AdLogin;
