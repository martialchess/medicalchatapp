import { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import signinImage from '@/assets/signup.jpg';

const cookies = new Cookies();

const initialState = {
  fullName: '',
  username: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  avatarURL: '',
};

const Auth = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, phoneNumber, avatarURL } = form;

    const endpoint = isSignup ? 'signup' : 'login';
    const URL = `http://localhost:5000/auth/${endpoint}`;

    try {
      const { data } = await axios.post(URL, {
        username,
        password,
        fullName: form.fullName,
        phoneNumber,
        avatarURL,
      });

      cookies.set('token', data.token);
      cookies.set('username', data.username);
      cookies.set('fullName', data.fullName);
      cookies.set('userId', data.userId);

      if (isSignup) {
        cookies.set('avatarURL', avatarURL);
        cookies.set('phoneNumber', phoneNumber);
        cookies.set('hashedPassword', data.hashedPassword);
      }

      window.location.reload();
    } catch (err) {
      alert('Authentication failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="fullName">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="auth__form-container_fields-content_input">
              <label htmlFor="username">Username</label>
              <input
                name="username"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                required
              />
            </div>

            {isSignup && (
              <>
                <div className="auth__form-container_fields-content_input">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    name="phoneNumber"
                    type="text"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="auth__form-container_fields-content_input">
                  <label htmlFor="avatarURL">Avatar URL</label>
                  <input
                    name="avatarURL"
                    type="text"
                    placeholder="Avatar URL"
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="auth__form-container_fields-content_input">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>

            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="auth__form-container_fields-content_button">
              <button type="submit">{isSignup ? 'Sign Up' : 'Sign In'}</button>
            </div>
          </form>

          <div className="auth__form-container_fields-account">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <span onClick={switchMode}>
                {isSignup ? ' Sign In' : ' Sign Up'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="auth__form-container_image">
        <img src={signinImage} alt="sign in" />
      </div>
    </div>
  );
};

export default Auth;
