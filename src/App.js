import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import UsageOverviewPage from './pages/UsageOverviewPage'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* ✅ Customer Profile Route: "View" బటన్ నుండి వచ్చే "/user/profile/10001" లింక్‌కు సరిపోతుంది. */}
          <Route path="/user/profile/:id" element={<CustomerDetailPage />} /> 

          {/* ✅ Services Usage Route: "Services Usage" బటన్‌కు అనుగుణంగా మార్చబడింది. */}
          <Route path="/services-overview" element={<UsageOverviewPage />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
