import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardPage.css';

const DashboardPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // పేజినేషన్ కోసం స్టేట్
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/customers');
        setCustomers(response.data);
      } catch (err) {
        setError("డేటాను లోడ్ చేయడంలో లోపం సంభవించింది.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    const options = {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZone: 'Asia/Kolkata'
    };
    const formattedDate = date.toLocaleString('en-IN', options).replace(',', '');
    return `${formattedDate.replace(/\//g, '-')} hrs IST`;
  };
  
  const handleCustomerClick = (customerId) => {
    navigate(`/customer/${customerId}`);
  };

  const handleLogout = () => {
    navigate('/');
  };

  // పేజినేషన్ లాజిక్
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      {/* పూర్తి హెడర్ ఇక్కడ తిరిగి జోడించబడింది */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <div className="admin-info">
            <p>Name: <strong>Sanjay</strong></p>
            <p>Category: <strong>Admin</strong></p>
          </div>
        </div>
        <div className="header-right">
          <button className="usage-button" onClick={() => navigate('/usage-overview')}>
            Services Usage
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="customer-list-card">
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
              {currentCustomers.map((customer, index) => (
                <tr key={customer._id} className="customer-row" onClick={() => handleCustomerClick(customer._id)}>
                  <td>{indexOfFirstCustomer + index + 1}</td>
                  <td>{customer.name}</td>
                  <td>{formatDate(customer.lastUsedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;