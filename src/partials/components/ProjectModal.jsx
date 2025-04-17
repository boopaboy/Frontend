import React, { useState, useEffect, useRef } from 'react';
import './../../assets/css/style.css';
import './../../assets/css/form.css';
import ModalButton from './ModalButton';
import { useAuth } from '../../contexts/AuthContext';

const ProjectModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [projectName, setProjectName] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusId, setStatusId] = useState('');
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState('04f47f11-a2ea-445c-afb8-291b5204d8e3');
  const [imageFile, setImageFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const fileInputRef = useRef(null);

  const [clients, setClients] = useState([]);
  const auth = useAuth();
  useEffect(() => {
    if (isOpen) {
      fetchClients();
      
      if (initialData && initialData.id) {
        setIsEditMode(true);
        setProjectId(initialData.id);
        setProjectName(initialData.projectName || '');
        setClientId(initialData.clientId || (initialData.client ? initialData.client.id : ''));
        setDescription(initialData.description || '');
        
        if (initialData.startDate) {
          const startDateObj = new Date(initialData.startDate);
          setStartDate(startDateObj.toISOString().split('T')[0]);
        } else {
          setStartDate('');
        }
        
        if (initialData.endDate) {
          const endDateObj = new Date(initialData.endDate);
          setEndDate(endDateObj.toISOString().split('T')[0]);
        } else {
          setEndDate('');
        }
        
        setStatusId(initialData.statusId || '');
        setBudget(initialData.budget || '');
        
        if (initialData.imageFileName) {
          setCurrentImage(initialData.imageFileName);
        } else {
          setCurrentImage(null);
        }
      } else {
        resetForm();
        setIsEditMode(false);
        setProjectId(null);
      }
    }
  }, [isOpen, initialData]);

  const saveProject = async () => {
    try {
      const formData = new FormData();
      
      formData.append('projectName', projectName);
      formData.append('clientId', clientId);
      formData.append('description', description || '');
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('userId', userId);
      formData.append('statusId', statusId);
      formData.append('budget', Number(budget) || 0);
      
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }
      
      let url = "https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Projects";
      let method;
      
      if (isEditMode) {
        method = "PUT";
        
        formData.append('id', projectId);
      } else {
        method = "POST";
        
        formData.append('userEmail', auth.getEmail());
      }
      
      console.log(`Making ${method} request to ${url}`);
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY,

        },
        body: formData,
      });
      
      if (response.ok) {
        console.log(isEditMode ? "Project updated successfully" : "Project added successfully");
        onClose();
        if (onSubmit) onSubmit(); 
      } else {
        console.error(isEditMode ? "Failed to update project" : "Failed to add project");
        console.error("Status:", response.status);
        const errorText = await response.text();
        console.error("Error details:", errorText);
      }
    } catch (error) {
      console.error(isEditMode ? "Error updating project:" : "Error adding project:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Clients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY,
        },

      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else {
        console.error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!projectName.trim()) newErrors.projectName = "Project name is required";
    if (!clientId) newErrors.clientId = "Client is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    saveProject();
  };

  const resetForm = () => {
    setProjectName('');
    setClientId('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setStatusId('');
    setBudget('');
    setImageFile(null);
    setCurrentImage('');
    setErrors({});
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
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
          <h2>{isEditMode ? 'Edit Project' : 'Add Project'}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="image-upload" onClick={handleImageClick}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div className="image-placeholder">
              {imageFile ? (
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Project" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : currentImage ? (
                <img 
                  src={`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Projects/image/${currentImage}`} 
                  alt="Project" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'default-image-path.jpg'; 
                  }}
                />
              ) : (
                <span className="camera-icon">📷</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="projectName">Project Name</label>
            <input
              type="text"
              id="projectName"
              placeholder="Enter Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={errors.projectName ? "error" : ""}
            />
            {errors.projectName && <span className="error-message">{errors.projectName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="clientId">Client Name</label>
            <div className="select-wrapper">
              <select
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className={errors.clientId ? "error" : ""}
              >
                <option value="" disabled>Select Client Name</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
              <span className="select-icon">•••</span>
            </div>
            {errors.clientId && <span className="error-message">{errors.clientId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="clientId">Status</label>
            <div className="select-wrapper">
              <select
                id="statusId"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                className={errors.clientId ? "error" : ""}
              >
                <option value="" disabled>Select status </option>
                <option value="1">Not started</option>
                <option value="3">Completed</option>
                <option value="4">Started</option>

              </select>
              <span className="select-icon">•••</span>
            </div>
            {errors.clientId && <span className="error-message">{errors.clientId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Type something"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="startDate">Start Date</label>
              <div className="date-input">
                <input
                  type="date"
                  id="startDate"
                  placeholder="Select Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={errors.startDate ? "error" : ""}
                />
                {errors.startDate && <span className="error-message">{errors.startDate}</span>}
              </div>
            </div>

            <div className="form-group half">
              <label htmlFor="endDate">End Date</label>
              <div className="date-input">
                <input
                  type="date"
                  id="endDate"
                  placeholder="Select End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={errors.endDate ? "error" : ""}
                />
                {errors.endDate && <span className="error-message">{errors.endDate}</span>}
              </div>
            </div>
          </div>

         

          <div className="form-group">
            <label htmlFor="budget">Budget</label>
            <div className="budget-input">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="budget"
                placeholder="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
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

export default ProjectModal;