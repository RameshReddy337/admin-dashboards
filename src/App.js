import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import ProductsTable from './Tables/ProductsTable';
import CustomersTable from './Tables/CustomersTable';
import CategoriesTable from './Tables/CategoriesTable';
import ReportsTable from './Tables/ReportsTable';
import Settings from './Tables/Setting';

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
          <Route path="/ProductsTable" element={<ProductsTable />} />
          <Route path="/CustomersTable" element={<CustomersTable />} />
          <Route path="/CategoriesTable" element={<CategoriesTable />} />
          <Route path= "/ReportsTable" element= {<ReportsTable />} />
          <Route path="/Settings" element={<Settings />} />
        </Routes>
      </div>
  );
}

export default App;
