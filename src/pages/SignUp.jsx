import React, { useState } from 'react';
import LoadingSpinner from '../partials/components/LoadingSpinner';
import './../assets/css/signup.css';
import LogotypeLink from '../partials/components/LogotypeLink';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
  });
  
  const {SignUp} = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      SignUp(formData);
      console.log('Form submitted:', formData);
      setIsLoading(false);
    }, 1500);
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
            <h1>Create Account</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="signup-form-group">
              <label htmlFor="FirstName">First Name</label>
              <input 
                type="text" 
                id="FirstName"
                name="FirstName"
                placeholder="Enter your first name"
                value={formData.FirstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="signup-form-group">
              <label htmlFor="LastName">Last Name</label>
              <input 
                type="text" 
                id="LastName"
                name="LastName"
                placeholder="Enter your last name"
                value={formData.LastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="signup-form-group">
              <label htmlFor="Email">Email</label>
              <input 
                type="Email" 
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
                type="Password" 
                id="Password"
                name="Password"
                placeholder="Enter your password"
                value={formData.Password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="signup-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
              
              />
            </div>
            
            <div className="signup-checkbox-group">
              <input 
                type="checkbox" 
                id="acceptTerms"
                name="isAdmin"
                onChange={handleChange}
               
              />
              <label htmlFor="acceptTerms">
                I accept <a href="/terms">Terms and Conditions</a>
              </label>
            </div>
            
            <button type="submit" className="signup-button">
              Create Account
            </button>
          </form>
          
          <div className="signup-footer">
            <p>Already have an account? <a href="/login">Login</a></p>
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

export default SignUp;