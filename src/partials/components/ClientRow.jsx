import React, { useState } from 'react';
import './../../assets/css/clientsRow.css';

const ClientRow = ({ client, isSelected, onSelect, handleEdit, handleDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className='clientRow'>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="select-all"
      />

      <div className='clientRow-name'>
        <div className="client-info">
          {client.imageFileName ? (
            <img
              src={`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/images/clients/${client.imageFileName}`}
              alt=""
              className="client-avatar"
            />
          ) : (
            <div className="client-avatar-placeholder">
              <img
                src={`https://alphaappweb.blob.core.windows.net/stockicons/Project icon 1.svg`}
                alt=""
                className="client-avatar"
              />
            </div>
          )}
          <div className="client-details">
            <div className="client-fullname">{client.clientName}</div>
            <div className="client-email">{client.email}</div>
          </div>
        </div>
      </div>

      <div className='clientRow-location'>{client.city || 'N/A'}</div>
      <div className='clientRow-phone'>{client.phone || 'N/A'}</div>
      <div className='clientRow-date'>{client.adress}</div>

      <div className='clientRow-status'>
        <span className={`status-badge`}>
          Active
        </span>
      </div>

      <div className='clientRow-actions'>
        <span onMouseOver={() => setIsHovered(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
          </svg>
        </span>

        {isHovered && (
          <div className='project-options' onMouseLeave={() => setIsHovered(false)}>
            <span className='project-options-item' onClick={() => handleEdit(client.id)}>Edit</span>
            <span className='project-options-item' onClick={() => handleDelete(client.id)}>Delete</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRow;