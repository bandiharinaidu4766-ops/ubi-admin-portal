import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './UsageOverviewPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const UsageOverviewPage = () => {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAggregatedUsage = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/services/aggregated-usage');
        setUsageData(response.data);
      } catch (err) {
        setError("Usage overview data could not be loaded.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAggregatedUsage();
  }, []);

  const chartData = {
    labels: usageData.map(item => item.serviceName),
    datasets: [
      {
        data: usageData.map(item => item.totalTimesUsed),
        backgroundColor: [
          '#4A90E2', '#50E3C2', '#F5A623', '#D0021B', 
          '#9013FE', '#417505', '#BD10E0', '#F8E71C'
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div className="overview-message">Loading...</div>;
  if (error) return <div className="overview-message error">{error}</div>;

  return (
    <div className="overview-container">
      <header className="overview-header">
        <h1>Aggregated Services Usage</h1>
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          &larr; Back to Dashboard
        </button>
      </header>
      <main className="overview-content">
        <div className="overview-card">
          <h3>Services Summary</h3>
          <table>
            <thead>
              <tr>
                <th>SL. NO.</th>
                <th>SERVICE NAME</th>
                <th>TOTAL TIMES USED</th>
              </tr>
            </thead>
            <tbody>
              {usageData.length > 0 ? (
                usageData.map((item, index) => (
                  <tr key={item.serviceName}>
                    <td>{index + 1}</td>
                    <td>{item.serviceName}</td>
                    <td>{item.totalTimesUsed}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No usage data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="overview-card">
          <h3>Services Distribution</h3>
          {usageData.length > 0 ? (
            <div className="chart-container">
               <Pie data={chartData} />
            </div>
           ) : (
            <p>No data available for chart.</p>
           )}
        </div>
      </main>
    </div>
  );
};

export default UsageOverviewPage;