import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // మీ CSS ఫైల్

const DashboardPage = () => {
    // 1. పేజినేషన్ మరియు డేటా కోసం స్టేట్స్
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const limit = 5; // ప్రతి పేజీకి 5 కస్టమర్‌లు
    const navigate = useNavigate();
    
    // 2. API నుండి డేటాను fetch చేసే ఫంక్షన్
    const fetchCustomers = async (page) => {
        setLoading(true);
        setError(null);
        try {
            // పేజ్ మరియు లిమిట్ ను query parameters గా పంపడం
            const response = await axios.get(`http://localhost:5000/api/customers?page=${page}&limit=${limit}`);
            
            // customers.slice error Fix: response.data లోని customers ఎర్రేను మాత్రమే తీసుకోండి
            setCustomers(response.data.customers); 
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);

        } catch (err) {
            console.error("Error fetching customers:", err);
            setError("కస్టమర్ డేటా లోడ్ చేయడంలో లోపం. సర్వర్ రన్ అవుతోందో లేదో తనిఖీ చేయండి.");
        } finally {
            setLoading(false);
        }
    };

    // 3. currentPage మారిన ప్రతిసారీ డేటాను fetch చేయడం
    useEffect(() => {
        fetchCustomers(currentPage);
    }, [currentPage]); 

    // 4. పేజీ మార్చే ఫంక్షన్
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    // ✅ 5. Logout ఫంక్షన్: Login Page కి నావిగేట్ చేస్తుంది
    const handleLogout = () => {
        // ఇక్కడ మీరు ఏదైనా ఆథెంటికేషన్ టోకెన్‌ను తొలగించవచ్చు
        navigate('/'); // Login Page కు నావిగేట్ చేయండి
    };

    // 6. తేదీ ఫార్మాటింగ్
    const formatLastUsedDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            timeZoneName: 'short',
            hour12: false 
        }).replace(',', ' '); 
    };


    if (loading) return <div className="loading-message">Loading customer details...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    // 7. UI రెండరింగ్
    return (
        <div className="dashboard-container">
            <header>
                <div className="admin-info">
                    <h1>Admin Dashboard</h1>
                    <p>Name: <strong>Sanjeev</strong></p> 
                    <p>Category: <strong>Admin</strong></p> 
                </div>
                <div className="header-actions">
                    <button 
                        onClick={() => navigate('/services-overview')} 
                        className="services-usage-button"
                    >
                        Services Usage
                    </button>
                    {/* ✅ Logout బటన్ onClick తో జోడించబడింది */}
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </header>

            <div className="customers-list-card">
                <h2>Customer List</h2>
                
                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>SL. NO.</th>
                            <th>NAME</th>
                            <th>LAST USED DATE</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer, index) => (
                            <tr key={customer._id}>
                                <td>{(currentPage - 1) * limit + index + 1}</td> 
                                <td>{customer.name}</td>
                                <td>{formatLastUsedDate(customer.lastUsedAt)}</td>
                                <td>
                                    <button 
                                        onClick={() => navigate(`/user/profile/${customer._id}`)} 
                                        className="view-profile-button"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 8. Pagination Controls */}
            <div className="pagination-controls">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span style={{ margin: '0 10px' }}>
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;