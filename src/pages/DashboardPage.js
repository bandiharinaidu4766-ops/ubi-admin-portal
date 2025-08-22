// src/pages/DashboardPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { customers } from '../data/mockData';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleCustomerClick = (customerId) => {
    navigate(`/customer/${customerId}`);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-info">
          <h1>Admin Dashboard</h1>
          <p>Name: <strong>Sanjay</strong></p>
          <p>Category: <strong>Admin</strong></p>
        </div>
        <div className="header-actions">
          <button className="services-button">Services Usage</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="card">
          <h2>Customer List</h2>
          <table>
            <thead>
              <tr>
                <th>SL. NO.</th>
                <th>NAME</th>
                <th>LAST USED DATE</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.id} onClick={() => handleCustomerClick(customer.id)} className="customer-row">
                  <td>{index + 1}</td>
                  <td>{customer.name}</td>
                  <td>{customer.lastUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;