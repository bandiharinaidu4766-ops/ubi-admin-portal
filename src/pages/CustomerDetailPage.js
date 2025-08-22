// src/pages/CustomerDetailPage.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customers, servicesData } from '../data/mockData';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './CustomerDetailPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerDetailPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const customer = customers.find(c => c.id.toString() === customerId);
  const customerServices = servicesData[customerId]?.services || [];

  if (!customer) {
    return <div>Customer not found.</div>;
  }
  
  const chartData = {
    labels: customerServices.filter(s => s.count > 0).map(s => s.name),
    datasets: [
      {
        data: customerServices.filter(s => s.count > 0).map(s => s.count),
        backgroundColor: [
          '#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#9013FE', '#417505', '#BD10E0', '#F8E71C'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false // The legend is custom-built above the chart
      }
    }
  };

  return (
    <div className="detail-container">
      <header className="detail-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          &larr; Back to Dashboard
        </button>
        <div className="detail-info">
          <h2>Admin Panel</h2>
          <p>Username: <strong>{customer.name}</strong></p>
          <p>Customer ID: <strong>{customer.id}</strong></p>
        </div>
      </header>

      <main className="detail-content">
        <div className="card">
          <h3>Services Usage Overview</h3>
          <table>
            <thead>
              <tr>
                <th>SL. NO.</th>
                <th>SERVICES</th>
                <th>SERVICES USED TIMES</th>
              </tr>
            </thead>
            <tbody>
              {customerServices.map((service, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{service.name}</td>
                  <td>{service.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Services Usage Distribution</h3>
          <div className="legend-container">
            {chartData.labels.map((label, index) => (
              <div key={index} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}></span>
                {label}: {chartData.datasets[0].data[index]}
              </div>
            ))}
          </div>
          <div className="chart-container">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDetailPage;