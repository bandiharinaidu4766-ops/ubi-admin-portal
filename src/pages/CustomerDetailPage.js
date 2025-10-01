import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './CustomerDetail.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerDetailPage = () => {
    // ✅ Fix: App.js లో రూట్ "/user/profile/:id" కాబట్టి, ఇక్కడ 'id' ని ఉపయోగించాలి.
    const { id } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation();
    
    const [customerProfile, setCustomerProfile] = useState(null);
    const [serviceUsageData, setServiceUsageData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const customerName = location.state?.customerName || 'Customer';

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            // App.js రూట్ నుండి తీసుకున్న ID ని ఉపయోగించండి
            const customerId = id; 
            
            try {
                setLoading(true);
                setError(null);

                // API కాల్స్‌లో ID ని ఉపయోగించండి
                const profileResponse = await axios.get(`http://localhost:5000/api/user/profile/${customerId}`);
                setCustomerProfile(profileResponse.data);

                const usageResponse = await axios.get(`http://localhost:5000/api/customers/${customerId}/service-usage`);
                
                if (typeof usageResponse.data === 'object' && usageResponse.data !== null) {
                    setServiceUsageData(usageResponse.data);
                } else {
                    setServiceUsageData({}); 
                    console.warn("Service usage data was not an object:", usageResponse.data);
                }

            } catch (err) {
                console.error("Failed to fetch data for customer:", err);
                // ఇక్కడ API కాలింగ్ ఎర్రర్ వస్తే, దాన్ని యూజర్‌కు చూపించండి
                setError("కస్టమర్ వివరాలు మరియు సర్వీస్ యూసేజ్ లోడ్ చేయడంలో లోపం. సర్వర్ రూట్‌లను తనిఖీ చేయండి.");
            } finally {
                setLoading(false);
            }
        };

        if (id) { // customerId కి బదులు id ఉపయోగించండి
            fetchCustomerDetails();
        }
    }, [id]); // customerId కి బదులు id ఉపయోగించండి

    if (loading) return <div className="detail-loading">Loading customer details...</div>;
    if (error) return <div className="detail-error">Error: {error}</div>;
    if (!customerProfile) return <div className="detail-message">Customer not found or profile data incomplete.</div>;

    // serviceUsageData ఒక ఆబ్జెక్ట్ అని మరియు null కాదని నిర్ధారించుకోండి
    const servicesWithCount = (typeof serviceUsageData === 'object' && serviceUsageData !== null)
        ? Object.entries(serviceUsageData).filter(([service, count]) => count > 0)
        : [];

    const chartData = {
        labels: servicesWithCount.map(([service, count]) => service),
        datasets: [
            {
                data: servicesWithCount.map(([service, count]) => count),
                backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#9013FE', '#417505', '#BD10E0', '#F8E71C'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = { };

    return (
        <div className="detail-container">
            <header className="detail-header">
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    &larr; Back to Dashboard
                </button>
                <div className="detail-info">
                    <h2>Admin Panel</h2>
                    <p>Customer Name: <strong>{customerProfile.name || customerName}</strong></p>
                    <p>Customer ID: <strong>{customerProfile._id || id}</strong></p> {/* ఇక్కడ id ఉపయోగించండి */}
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
                            {servicesWithCount.length > 0 ? (
                                servicesWithCount.map(([service, count], index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{service}</td>
                                        <td>{count}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">ఈ కస్టమర్ కోసం సర్వీస్ యూసేజ్ డేటా లేదు.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h3>Services Usage Distribution</h3>
                    {servicesWithCount.length > 0 ? (
                        <div className="chart-container">
                            <Pie data={chartData} options={chartOptions} />
                        </div>
                    ) : (
                        <p>ఈ కస్టమర్ కోసం చార్ట్ డేటా అందుబాటులో లేదు.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CustomerDetailPage;