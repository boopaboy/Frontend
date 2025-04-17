import React from 'react'
import logo from './../../assets/images/icon-logo.svg'
import {useState} from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const [isClicked, setIsClicked] = useState(false);
  const auth = useAuth();
  
  return (
    <header className="header">
        <div className="profile">
            <img src={logo} alt="Profile" onClick={() => setIsClicked(!isClicked)}/>
            {isClicked && (
            <div className="profile-dropdown">
                <ul>
                    <li><a href="#">Profile</a></li>
                    <li onClick={() => auth.signOut()}><a>
                      Log Out </a>
                   </li>
                </ul>
            </div>
            )}
        </div>
    </header>
  )
}

export default Header