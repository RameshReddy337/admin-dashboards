import React, { useState } from 'react';
import './CustomersTable.css';
import { BsFilter, BsSortAlphaDown, BsSortAlphaUp, BsSortNumericDownAlt, BsSortNumericUpAlt } from 'react-icons/bs';
// import CustomerData from './Data/CustomerData.js'; // Assume this is an array of customer objects
import {CustomerData} from './CustomerData'; // Assume this is an array of customer objects

function CustomersTable() {
  const [customers, setCustomers] = useState(Array.isArray(CustomerData) ? CustomerData : []);

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchText, setSearchText] = useState('');

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredCustomers = customers
    .filter((customer) => customer.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      if (!sortBy) return 0;
      let A = a[sortBy];
      let B = b[sortBy];
      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();
      if (A < B) return sortOrder === 'asc' ? -1 : 1;
      if (A > B) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="customer-table-container">
      <h2 className="table-title">Customer List</h2>

      <div className="controls">
        <div className="filter-box">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <BsFilter className="filter-icon" />
        </div>
      </div>

      <table className="customer-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>
              Name
              <button className="sort-btn" onClick={() => handleSort('name')}>
                {sortBy === 'name' ? (sortOrder === 'asc' ? <BsSortAlphaDown /> : <BsSortAlphaUp />) : <BsSortAlphaDown className="muted" />}
              </button>
            </th>
            <th>Email</th>
            <th>Phone</th>
            <th>
              Location
              <button className="sort-btn" onClick={() => handleSort('location')}>
                {sortBy === 'location' ? (sortOrder === 'asc' ? <BsSortAlphaDown /> : <BsSortAlphaUp />) : <BsSortAlphaDown className="muted" />}
              </button>
            </th>
            <th>
              Orders
              <button className="sort-btn" onClick={() => handleSort('orders')}>
                {sortBy === 'orders' ? (sortOrder === 'asc' ? <BsSortNumericDownAlt /> : <BsSortNumericUpAlt />) : <BsSortNumericDownAlt className="muted" />}
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <tr key={CustomerData.id}>
                <td>{index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.location}</td>
                <td>{customer.orders}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomersTable;

