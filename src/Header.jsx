import React from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function Header({ OpenSidebar }) {
  const navigate = useNavigate();

  // ✅ Handle click on Profile icon
  const handleProfileClick = () => {
    navigate('/login'); // Redirects to login page
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>

      <div className="header-left">
        <BsSearch className="icon" />
      </div>

      <div className="header-right">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />
        <BsPersonCircle className="icon" onClick={handleProfileClick} />
      </div>
    </header>
  );
}

export default Header;
