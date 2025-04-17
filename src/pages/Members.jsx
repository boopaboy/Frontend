import React from 'react'
import { useState, useEffect } from 'react'
import ModalButton from '../partials/components/ModalButton'
import MemberModal from '../partials/components/MemberModal'
import './../assets/css/style.css'
import { MemberCard } from './../partials/components/cards/MemberCard'
import { useAuth } from '../contexts/AuthContext'

const Members = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [addMemberModal, setAddMemberModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const auth = useAuth()

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Members",
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
        setMembers(data);
      } else {
        console.log("failed");
        console.error("Failed to fetch members");
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);      
    }
  }

  const fetchMemberById = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Members/${id}`,
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
        return data;
      } else {
        console.log("failed");
        console.error("Failed to fetch member");
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching member:", error);
    } finally {
      setLoading(false);  
    }
  }

  const deleteMember = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        const response = await fetch(`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Members/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY,
            },
          }
        );
        if (response.ok) {
          fetchMembers(); 
        } else {
          console.error("Failed to delete member");
        }
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  }

  const openEditModal = async (memberId) => {
    try {
      const memberData = await fetchMemberById(memberId);
      if (memberData) {
        setSelectedMember(memberData);
        setAddMemberModal(true);
      }
    } catch (error) {
      console.error("Error preparing member for edit:", error);
    }
  }

  const toggleMemberModal = () => {
    setSelectedMember(null);
    setAddMemberModal(!addMemberModal);
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  const closeModal = () => {
    fetchMembers();
    setAddMemberModal(false);
    setSelectedMember(null);
  }

  return (
    <>
      <MemberModal 
        isOpen={addMemberModal} 
        onClose={closeModal} 
        onSubmit={fetchMembers} 
        initialData={selectedMember || {}} 
      />

      <div id="Members">
        <div className="page-header">
          <h1 className="h2">Members</h1>
          <ModalButton 
            type="add" 
            text="Add Member" 
            onClick={toggleMemberModal} 
          />
        </div>
        <div className='projectCard-wrapper'>
          {loading ? (
            <p>Loading members...</p>
          ) : (
            members.map((member, index) => (
              <MemberCard 
                member={member} 
                key={index} 
                refresh={fetchMembers} 
                handleEdit={() => openEditModal(member.id)}
                handleDelete={() => deleteMember(member.id)}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default Members