import React, { useState, useEffect, useRef } from 'react';
import './../../assets/css/style.css';
import './../../assets/css/form.css';
import ModalButton from './ModalButton';
import { useAuth } from '../../contexts/AuthContext';

const ClientModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [statusId, setStatusId] = useState(1); // Default to Active (assuming 1 is Active)
  const [imageFile, setImageFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [errors, setErrors] = useState({});
  const [statuses, setStatuses] = useState([]);
  const fileInputRef = useRef(null);
  const auth = useAuth();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch("https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Statuses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStatuses(data);
        } else {
          console.log("status error");
      
        }
      } catch (error) {
        console.log("status:", error);

      }
    };

    fetchStatuses();
  }, [auth]);

  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.id) {
        setIsEditMode(true);
        setClientId(initialData.id);
        setClientName(initialData.clientName || '');
        setEmail(initialData.email || '');
        setPhone(initialData.phone || '');
        setCity(initialData.city || '');
        setAddress(initialData.adress || '');
        setStatusId(initialData.statusId || 1);
        
        if (initialData.imageFileName) {
          setCurrentImage(initialData.imageFileName);
        } else {
          setCurrentImage('');
        }
      } else {
        resetForm();
        setIsEditMode(false);
        setClientId(null);
      }
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setClientName('');
    setEmail('');
    setPhone('');
    setCity('');
    setAddress('');
    setStatusId(1); // Default to Active
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
    
    if (!clientName.trim()) newErrors.clientName = "Client name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Valid email is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData = new FormData();
    
    if (isEditMode && clientId) {
      formData.append('Id', clientId);
    }
    
    if (imageFile) {
      formData.append('ImageFile', imageFile);
    }
    
    formData.append('ClientName', clientName);
    formData.append('Email', email);
    formData.append('Phone', phone || '');
    formData.append('City', city || '');
    formData.append('Adress', address || '');
    formData.append('StatusId', statusId);
    
    let url = "https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Clients";
    let method = isEditMode ? "PUT" : "POST";
    
    try {
      console.log(`Sending ${method} request to ${url}`);
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY,
        },
        body: formData,
      });
      
      if (response.ok) {
        console.log(isEditMode ? "Client updated successfully" : "Client added successfully");
        onClose();
        if (typeof onSubmit === 'function') onSubmit();
      } else {
        const errorText = await response.text();
        console.error(isEditMode ? "Error updating client:" : "Error adding client:", response.status, errorText);
      }
    } catch (error) {
      console.error(isEditMode ? "Error updating client:" : "Error adding client:", error);
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
          <h2>{isEditMode ? 'Edit Client' : 'Add Client'}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="image-upload" onClick={handleImageClick}>
            {currentImage ? (
              <img 
                src={`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/images/clients/${currentImage}`} 
                alt="Client avatar" 
                className="profile-preview" 
              />
            ) : (
              <div className="image-placeholder">
                <span className="camera-icon">📷</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="clientName">Client Name*</label>
            <input
              type="text"
              id="clientName"
              placeholder="Enter Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={errors.clientName ? "error" : ""}
            />
            {errors.clientName && <span className="error-message">{errors.clientName}</span>}
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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              placeholder="Enter City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="statusId">Status</label>
            <select
              id="statusId"
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
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

export default ClientModal;