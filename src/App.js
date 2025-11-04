import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Login from './Login';
import ProductsTable from './Tables/ProductsTable';
import CustomersTable from './Tables/CustomersTable';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  // ✅ Toggle sidebar visibility
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
      <div className="grid-container">
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

        {/* ✅ Define all routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ProductsTable" element={<ProductsTable />} />
          <Route path="/CustomersTable" element={<CustomersTable />} />
        </Routes>
      </div>
  );
}

export default App;
