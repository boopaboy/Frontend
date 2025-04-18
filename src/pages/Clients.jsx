import React from 'react'
import ModalButton from '../partials/components/ModalButton'
import ClientModal from '../partials/components/ClientModal'
import './../assets/css/clients.css'
import { useState, useEffect } from 'react'
import ClientRow from '../partials/components/ClientRow'
import { useAuth } from '../contexts/AuthContext'

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addClientModal, setAddClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedClients, setSelectedClients] = useState({});
  const auth = useAuth();
  
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    const newSelectedClients = {};
    clients.forEach((client, index) => {
      newSelectedClients[index] = newSelectAll;
    });
    setSelectedClients(newSelectedClients);
  };
  
  const handleSelectClient = (index) => {
    const newSelectedClients = {
      ...selectedClients,
      [index]: !selectedClients[index]
    };
    setSelectedClients(newSelectedClients);
    
    const allSelected = clients.every((_, idx) => newSelectedClients[idx]);
    setSelectAll(allSelected);
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Clients",
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
        setClients(data);
      } else {
        console.log(response);
      }
    } catch (error) {
    } finally {
      setLoading(false);      
    }
  };

  const fetchClientById = async (id) => {
    try {
      const response = await fetch(`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Clients/${id}`,
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
        console.log(response);
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const deleteClient = async (id) => {
    
      try {
        const response = await fetch(`https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Clients/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY": auth.hasRole("admin") ? import.meta.env.VITE_ADMIN_API_KEY : import.meta.env.VITE_USER_API_KEY,
            },
          }
        );
        
        if (response.ok) {
          fetchClients(); 
        } 
  
      } catch (error) {
        console.log(error);
      }
    };

  const openEditModal = async (clientId) => {
    try {
      const clientData = await fetchClientById(clientId);
      if (clientData) {
        setSelectedClient(clientData);
        setAddClientModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const toggleClientModal = () => {
    setSelectedClient(null); 
    setAddClientModal(!addClientModal);
  };

  const closeModal = () => {
    fetchClients();
    setAddClientModal(false);
    setSelectedClient(null);
  };

  return (
    <>    
      <ClientModal 
        isOpen={addClientModal} 
        onClose={closeModal} 
        onSubmit={fetchClients} 
        initialData={selectedClient || {}} 
      />

      <div id="clients">
        <div className="page-header">
          <h1 className="h2">Clients</h1>
          <div className="button-group">
            <ModalButton 
              type="add" 
              text="Add Client" 
              onClick={toggleClientModal} 
            />
          </div>
        </div>
        <div className='clients-container'>
          <div className='clients-header'>
            <input 
              type="checkbox" 
              checked={selectAll}
              onChange={handleSelectAll}
              className="select-all" 
            />
            <div className='client-name'>Client Name</div>
            <div className='client-location'>City</div>
            <div className='client-phone'>Phone</div>
            <div className='client-date'>Address</div>
            <div className='client-status'>Status</div>
            <div className='client-actions'>Actions</div>
          </div>
          <div className='clients-body'>
            {loading ? (
              <div className="loading-message">Loading clients...</div>
            ) : clients.length === 0 ? (
              <div className="no-data-message">No clients found</div>
            ) : (
              clients.map((client, index) => (
                <ClientRow 
                  key={index}
                  client={client} 
                  index={index}
                  isSelected={selectedClients[index] || false}
                  onSelect={() => handleSelectClient(index)}
                  handleEdit={() => openEditModal(client.id)}
                  handleDelete={() => deleteClient(client.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Clients;