import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
const Providers = ({children}) => {
  return (
    <>
    <AuthProvider>
        <ThemeProvider>
        {children}
        </ThemeProvider>
    </AuthProvider>
    </>
  )
}

export default Providers