import React, { useState, useEffect, useRef } from 'react';
import './../../assets/css/style.css'
import './../../assets/css/form.css'
import ModalButton from './ModalButton';
import { useAuth } from '../../contexts/AuthContext';

const MemberModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const auth = useAuth()

  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.id) {
        setIsEditMode(true);
        setMemberId(initialData.id);
        setFirstName(initialData.firstName || '');
        setLastName(initialData.lastName || '');
        setEmail(initialData.email || '');
        setPhoneNumber(initialData.phoneNumber || '');
        setJobTitle(initialData.jobTitle || '');
        setAddress(initialData.adress || ''); 
        setPostalCode(initialData.postalCode || '');
        setCity(initialData.city || '');
        
        if (initialData.imageFileName) {
          setCurrentImage(initialData.imageFileName);
        } else {
          setCurrentImage('');
        }
      } else {
        // Create mode
        resetForm();
        setIsEditMode(false);
        setMemberId(null);
      }
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setJobTitle('');
    setAddress('');
    setPostalCode('');
    setCity('');
    setImageFile(null);
    setCurrentImage('');
    setErrors({});
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Valid email is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!city.trim()) newErrors.city = "City is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData = new FormData();
    
    if (isEditMode) {
      formData.append('Id', memberId);
    }
    
    if (imageFile) {
      formData.append('ImageFile', imageFile);
    }
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Email', email);
    formData.append('PhoneNumber', phoneNumber || '');
    formData.append('JobTitle', jobTitle || '');
    formData.append('Adress', address); 
    formData.append('PostalCode', postalCode);
    formData.append('City', city);
    
    let url = "https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Members";
    let method;
    
    if (isEditMode) {
      method = "PUT";
      formData.append('id', memberId); 
    } else {
      method = "POST";
    }
    
    try {
      console.log(formData);
      console.log(`Making ${method} request to ${url}`);
      const response = await fetch(url, {
        method: method,
        headers: {
          "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY,
        },
        body: formData,
      });
      
      if (response.ok) {
        console.log(isEditMode ? "Member updated successfully" : "Member added successfully");
        onClose();
        if (onSubmit) onSubmit(); 
      } else {
        console.error(isEditMode ? "Error updating member:" : "Error adding member:", response);
      }
    } catch (error) {
      console.error(isEditMode ? "Error updating member:" : "Error adding member:", error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Member' : 'Add Member'}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="image-upload" onClick={handleImageClick}>
            <div className="image-placeholder">
              
                <span className="camera-icon">📷</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={errors.firstName ? "error" : ""}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            
            <div className="form-group half">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={errors.lastName ? "error" : ""}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              placeholder="Enter Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address*</label>
            <input
              type="text"
              id="address"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={errors.address ? "error" : ""}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="postalCode">Postal Code*</label>
              <input
                type="text"
                id="postalCode"
                placeholder="Enter Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={errors.postalCode ? "error" : ""}
              />
              {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
            </div>
            
            <div className="form-group half">
              <label htmlFor="city">City*</label>
              <input
                type="text"
                id="city"
                placeholder="Enter City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={errors.city ? "error" : ""}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
          </div>
          
          <ModalButton 
            type="submit" 
            text={isEditMode ? "Update" : "Create"}
            onClick={handleSubmit} 
          />
        </form>
      </div>
    </div>
  );
};

export default MemberModal;