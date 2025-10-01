import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './UsageOverviewPage.css';

// Chart.js registration
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
        // ✅ 404 Fix: server.js లో ఫిక్స్ చేసిన 'aggregated-usage' రూట్‌ను వాడుతున్నాం.
        const response = await axios.get('http://localhost:5000/api/services/aggregated-usage'); 
        setUsageData(response.data);
      } catch (err) {
        // ఇక్కడ ఎర్రర్ వస్తే, సర్వర్ సరిగ్గా రన్ అవ్వలేదని లేదా అగ్రిగేషన్ ఫెయిల్ అయిందని అర్థం.
        setError("Usage overview data could not be loaded. Please check the backend server logs.");
        console.error("Error fetching usage overview:", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchAggregatedUsage();
  }, []);

  // సర్వర్ నుండి వస్తున్న ఫీల్డ్ names: 'serviceName' మరియు 'servicesUsedTimes' 
  const chartData = {
    labels: usageData.map(item => item.serviceName),
    datasets: [
      {
        data: usageData.map(item => item.servicesUsedTimes), 
        // పై చార్ట్ రంగుల రిపీటేషన్ సమస్యను నివారించడానికి మరిన్ని రంగులను జోడించవచ్చు
        backgroundColor: [
          '#4A90E2', '#50E3C2', '#F5A623', '#D0021B', 
          '#9013FE', '#417505', '#BD10E0', '#F8E71C',
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#6A0DAD', '#DAA520', '#C0C0C0', '#483D8B',
          '#3CB371', '#FFA07A', '#EE82EE', '#A0522D'
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
          {/* ✅ DOM Nesting Warning Fix: <table> structure is clean */}
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
                  <tr key={index}> 
                    <td>{index + 1}</td>
                    <td>{item.serviceName}</td>
                    {/* ✅ servicesUsedTimes - సర్వర్ అవుట్‌పుట్ ఫీల్డ్‌తో సరిపోలుతుంది */}
                    <td>{item.servicesUsedTimes}</td>
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