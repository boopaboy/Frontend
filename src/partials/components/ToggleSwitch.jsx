//Helt ai genererad

import { useState } from 'react';
import './../../assets/css/style.css'; 
import { useTheme } from '../../contexts/ThemeContext';
export default function ToggleSwitch() {
    const theme = useTheme();
    const [isToggled, setIsToggled] = useState(localStorage.getItem('theme') === 'dark' ? true : false);
  const handleToggle = () => {
    theme.toggleTheme();
    console.log(theme);
    setIsToggled(!isToggled);
  };

  return (
    <div className="toggle-container">
      <label className="toggle-switch">
        <input 
          type="checkbox" 
          checked={isToggled}
          onChange={handleToggle}
        />
        <span className="slider round"></span>
      </label>
      <p>Status: {isToggled ? 'Dark Mode' : 'Light Mode'}</p>
    </div>
  );
}