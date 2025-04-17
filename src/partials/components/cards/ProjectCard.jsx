import React from 'react'
import { useState, useEffect } from 'react'
import './../../../assets/css/projectCard.css'
import img from './../../../assets/images/alpha-logotype.svg'

export const ProjectCard = ({ project, refresh, handleEdit }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDelete = async () => {
        try {
          await fetch(`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Projects/${project.id}`, {
            method: 'DELETE',
          });
          console.log('Project deleted successfully');
        } catch (error) {
          console.error('Error deleting project:', error);
        } finally {
            refresh();
        }
    };

    const randomIcon = () => {
        const icons = [
           "https://alphaappweb.blob.core.windows.net/stockicons/Project icon 1.svg",
           "https://alphaappweb.blob.core.windows.net/stockicons/Project icon 2.svg",
           "https://alphaappweb.blob.core.windows.net/stockicons/Project icon 3.svg",
           "https://alphaappweb.blob.core.windows.net/stockicons/Project icon 4.svg",
           "https://alphaappweb.blob.core.windows.net/stockicons/Project icon 5.svg"
           
        ];
        const randomIndex = Math.floor(Math.random() * icons.length);
        return icons[randomIndex];
    };

    return (
        <div className='project-card'>
            <img src={project.imageFileName ?? randomIcon() } alt={project.projectName} className='project-icon' />
            <div className='project-title'>{project.projectName} <br />
                <span className='project-client'>{project.client.clientName}</span>
            </div>
            <div className='project-description'>{project.description}</div>
            <div className='project-options'>
                <span onMouseOver={() => setIsHovered(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                    </svg>
                </span>

                {isHovered && (
                    <div className='project-options-container' onMouseLeave={() => setIsHovered(false)}>
                        <span className='project-options-item' onClick={() => handleEdit(project.id)}>Edit</span>
                        <span className='project-options-item' onClick={handleDelete}>Delete</span>
                    </div>
                )}
            </div>
        </div>
    )
}