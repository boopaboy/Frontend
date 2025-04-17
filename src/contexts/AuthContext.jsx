import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const signUpEndpoint = "https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Users/signup"
  const signInEndpoint = "https://alpha123123-dmceh2cehfdagyac.swedencentral-01.azurewebsites.net/api/Users/signin"
  const defaultValues = { accessToken: null, role: "user", isAuthenticated: false, loading: true } 
  const [auth, setAuth] = useState(defaultValues)

  const SignUp = async (form) => {
    console.log(JSON.stringify(form), "form")
    const response = await fetch(signUpEndpoint, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'ZGRmMThkZmMtODg2Zi00NmM4LTljZDEtYzUyN2VjYTE1YWJi'
      },
      body: JSON.stringify(form)
    })
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        try {
          // Added try/catch for JWT decoding during signup
          const decoded = jwtDecode(data.token);
          sessionStorage.setItem("accessToken", data.token);
          setAuth({ 
            accessToken: data.token, 
            role: decoded.role || "user", // Use role from token or default to user
            isAuthenticated: true, 
            loading: false 
          });
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }

  const signIn = async (email, password) => {
    try { // Added try/catch
      const response = await fetch(signInEndpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'ZGRmMThkZmMtODg2Zi00NmM4LTljZDEtYzUyN2VjYTE1YWJi'
        },
        body: JSON.stringify({ email, password })
      })
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.succeeded === true && data.token) {
          try {
            const decoded = jwtDecode(data.token);
            const role = decoded.role || "user"; 
            
            sessionStorage.setItem("accessToken", data.token);
            setAuth({ 
              accessToken: data.token, 
              role: role, 
              isAuthenticated: true, 
              loading: false 
            });
            
            return true;
          } catch (error) {
            console.error("Error decoding token:", error);
            return false;
          }
        }
        return false;
      }
      return false;
    } catch (error) {
      console.error("Sign in failed:", error);
      return false;
    }
  }

  const signOut = () => {
    sessionStorage.removeItem("accessToken");
    setAuth({ 
      accessToken: null, 
      role: "user", 
      isAuthenticated: false, 
      loading: false 
    });
  }

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    
    if (!accessToken) {
      // Set loading to false if no token exists
      setAuth(prev => ({ ...prev, loading: false }));
      return;
    }
    
    try {
      const decodedToken = jwtDecode(accessToken);
      
      
      if (decodedToken.exp * 1000 < Date.now()) {
        sessionStorage.removeItem("accessToken");
        setAuth({ 
          accessToken: null, 
          role: "user", 
          isAuthenticated: false, 
          loading: false 
        });
        return;
      }
      
      setAuth({ 
        accessToken, 
        role: decodedToken.role || "user",
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      console.error("Error decoding token:", error);
      sessionStorage.removeItem("accessToken");
      setAuth({ 
        accessToken: null, 
        role: "user", 
        isAuthenticated: false, 
        loading: false 
      });
    }
  }, []);

  const hasRole = (roleToCheck) => {
    return auth.role === roleToCheck;
  };

  const getEmail = () => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.email;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      auth, 
      signIn, 
      SignUp, 
      signOut, 
      hasRole,
      getEmail  
    }}>
      {children}
    </AuthContext.Provider>
  );
};