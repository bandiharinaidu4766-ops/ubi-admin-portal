import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './CustomerDetail.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerDetailPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  
  const [customerProfile, setCustomerProfile] = useState(null);
  const [serviceUsageData, setServiceUsageData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const [profileResponse, usageResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/user/profile/${customerId}`),
          axios.get(`http://localhost:5000/api/customers/${customerId}/service-usage`)
        ]);
        
        setCustomerProfile(profileResponse.data);
        setServiceUsageData(usageResponse.data);
      } catch (err) {
        setError("కస్టమర్ వివరాలు లోడ్ చేయడంలో లోపం.");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const chartData = {
    labels: serviceUsageData.map(item => item.serviceName),
    datasets: [
      {
        data: serviceUsageData.map(item => item.timesUsed),
        backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#9013FE', '#417505'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = { responsive: true, plugins: { legend: { position: 'top' } } };

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (error) return <div className="detail-error">Error: {error}</div>;
  if (!customerProfile) return <div className="detail-message">Customer not found.</div>;

  return (
    <div className="detail-container">
      <header className="detail-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          &larr; Back to Dashboard
        </button>
        <div className="detail-info">
          <h2>Admin Panel</h2>
          <p>Customer Name: <strong>{customerProfile.name}</strong></p>
          <p>Customer ID: <strong>{customerProfile._id}</strong></p>
          <p>Email: <strong>{customerProfile.email || 'N/A'}</strong></p>
          <p>Phone: <strong>{customerProfile.phone || 'N/A'}</strong></p>
        </div>
      </header>
      <main className="detail-content">
        <div className="card">
          <h3>Services Usage Overview</h3>
          <table>
            <thead>
              <tr>
                <th>SL. NO.</th>
                <th>SERVICE NAME</th>
                <th>TIMES USED</th>
              </tr>
            </thead>
            <tbody>
              {serviceUsageData.length > 0 ? (
                serviceUsageData.map((item, index) => (
                  // ఈ <tr> మరియు <td> మధ్య ఎటువంటి ఖాళీ లేకుండా చూసుకోండి
                  <tr key={item.serviceName}>
                    <td>{index + 1}</td>
                    <td>{item.serviceName}</td>
                    <td>{item.timesUsed}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No service usage data available for this customer.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Services Usage Distribution</h3>
          {serviceUsageData.length > 0 ? (
            <div className="chart-container">
              <Pie data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p>No chart data available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDetailPage;