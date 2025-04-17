import React from "react";
import { useState, useEffect } from "react";
import ModalButton from "../partials/components/ModalButton";
import ProjectModal from "../partials/components/ProjectModal";
import "./../assets/css/style.css";
import { ProjectCard } from "../partials/components/cards/ProjectCard";
import { useAuth } from "../contexts/AuthContext";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const auth = useAuth();
 
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Projects",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProjectModal = () => {
    setSelectedProject(null);
    setAddProjectModal(!addProjectModal);
  };

  const openEditModal = async (projectId) => {
    try {
      const response = await fetch(`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Projects/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY,
        },
      });
      if (response.ok) {
        const projectData = await response.json();
        setSelectedProject(projectData);
        setAddProjectModal(true);
      } else {
        console.error("Failed to fetch project details");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const fetchProjectsWithSort = async (e) => {
    setSortOrder(e.target.value);
    try {
      setLoading(true);
      const response = await fetch(`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Projects/GetAllWithExpressions?sortOrder=${sortOrder}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        console.log(data);
      } else {
        console.error("Failed to fetch projects with sort order");
      }
    } catch (error) {
      console.error("Error fetching projects with sort order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ProjectModal
        isOpen={addProjectModal}
        onClose={() => {
          setAddProjectModal(false);
          setSelectedProject(null);
        }}
        onSubmit={fetchProjects}
        initialData={selectedProject || {}}
      />

      <div id="projects">
        <div className="page-header">
          <h1 className="h2">Projects</h1>
          <ModalButton
            type="add"
            text="Add Project"
            onClick={toggleProjectModal}
          />
        </div>
        
        <div className="projects-filter-bar">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              ALL ({projects.length})
            </button>
            <button 
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              COMPLETED (0)
            </button>
          </div>
          
          <div className="sort-order">
            <select 
              value={sortOrder}
              onChange={(e) => fetchProjectsWithSort(e)}
              className="sort-select"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        
        <div className="projectCard-wrapper">
          {loading ? (
            <p>Loading projects...</p>
          ) : (
            projects.map((project, index) => (
              <ProjectCard 
                project={project} 
                key={index} 
                refresh={fetchProjects} 
                handleEdit={() => openEditModal(project.id)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Projects;