import React, { useState } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import LoginModal from './LoginModal'; // make sure this path is correct

function Header({ OpenSidebar }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileClick = () => {
    // open modal instead of navigate
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <header className="header">
        <div className="menu-icon">
          <BsJustify className="icon" onClick={OpenSidebar} />
        </div>

        <div className="header-left">
          <BsSearch className="icon" />
        </div>

        <div className="header-right">
          <BsFillBellFill className="icon" />
          <Link to="/EMail" className="home-link">
            <BsFillEnvelopeFill className="icon" />
          </Link>
          <BsPersonCircle className="icon" onClick={handleProfileClick} />
        </div>
      </header>

      {isModalOpen && <LoginModal onClose={closeModal} />}
    </>
  );
}

export default Header;
