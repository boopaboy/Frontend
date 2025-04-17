import React from 'react'
import { useState, useEffect } from 'react'
import './../../../assets/css/memberCard.css'
import img from './../../../assets/images/alpha-logotype.svg'
import { useAuth } from '../../../contexts/AuthContext'

export const MemberCard = ({ member, refresh, handleEdit }) => {
    const [isHovered, setIsHovered] = useState(false);

    const auth = useAuth();

    const handleDelete = async () => {
        console.log(member.id);
        try {
            await fetch(`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Members/${member.id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY
                },
            });
            console.log('Member deleted successfully');
        } catch (error) {
            console.error('Error deleting member:', error);
        } finally {
            refresh();
        }
    };

    const randomIcon = () => {
        const icons = [
            "https://alphaappweb.blob.core.windows.net/stockicons/Member icon 1.svg",
            "https://alphaappweb.blob.core.windows.net/stockicons/Member icon 2.svg",
            "https://alphaappweb.blob.core.windows.net/stockicons/Member icon 3.svg",
            "https://alphaappweb.blob.core.windows.net/stockicons/Member icon 4.svg",
            "https://alphaappweb.blob.core.windows.net/stockicons/Member icon 5.svg"
        ];
        const randomIndex = Math.floor(Math.random() * icons.length);
        return icons[randomIndex];
    };

    return (
        <div className='member-card'>
            <div className='member-options'>
                <span onMouseOver={() => setIsHovered(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                    </svg>
                </span>

                {isHovered && (
                    <div className='member-options-container' onMouseLeave={() => setIsHovered(false)}>
                        <span className='member-options-item' onClick={() => handleEdit(member.id)}>Edit</span>
                        <span className='member-options-item' onClick={handleDelete}>Delete</span>
                    </div>
                )}
            </div>
            
            <img src={member.imageUrl ?? randomIcon()} alt={member.firstName} className='member-icon' />
            
            <div className='member-name'>{member.firstName + " " + member.lastName} <br />
            </div>
            <div className='member-title'>{member.jobTitle}</div>

            <div className='member-email'>{member.email}</div>
            <div className='member-phone'>{member.phoneNumber}</div>
            <div className='member-role'>{member.isAdmin ? 'Admin' : 'Member'}</div>
        </div>
    )
}