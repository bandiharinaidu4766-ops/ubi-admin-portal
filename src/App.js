import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
// ఈ లైన్ తప్పనిసరిగా ఉండాలి
import UsageOverviewPage from './pages/UsageOverviewPage'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customer/:customerId" element={<CustomerDetailPage />} />
          {/* ఈ రూట్ మిస్ అవ్వడం వల్లే మీకు ఎర్రర్ వస్తోంది */}
          <Route path="/usage-overview" element={<UsageOverviewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;