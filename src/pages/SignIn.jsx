import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../partials/components/LoadingSpinner';
import './../assets/css/signup.css';
import LogotypeLink from '../partials/components/LogotypeLink';
import { useAuth } from '../contexts/AuthContext';

const SignIn = () => {
  const navigate = useNavigate(); // Use useNavigate hook instead
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });
  
  const { signIn } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const succeeded = await signIn(formData.Email, formData.Password);
    
    if (succeeded) {
      console.log('inloggning lyckades');
      navigate('/admin/projects'); // Use navigate function directly
    } else {
      console.log('inloggning misslyckades');
    }
    
    setIsLoading(false);
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <>
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-content">
            <div className="signup-header">
              <h1>Login</h1>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="signup-form-group">
                <label htmlFor="Email">Email</label>
                <input 
                  type="email" 
                  id="Email"
                  name="Email"
                  placeholder="Enter your email address"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="signup-form-group">
                <label htmlFor="Password">Password</label>
                <input 
                  type="password" 
                  id="Password"
                  name="Password"
                  placeholder="Enter your password"
                  value={formData.Password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="signup-checkbox-group">
                <input 
                  type="checkbox" 
                  id="rememberMe"
                  name="rememberMe"
                />
                <label htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              
              <button type="submit" className="signup-button">
                Login
              </button>
            </form>
            
            <div className="signup-footer">
              <p>Don't have an account? <a href="/auth/signup">Sign Up</a></p>
            </div>
          </div>
        </div>
      </div>
      <div className="logo-container">
        <LogotypeLink />
      </div>
    </>
  );
};

export default SignIn;