import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Analytics from './pages/Analytics';
import IndustryAnalysis from './pages/IndustryAnalysis';
import MarketOpportunities from './pages/MarketOpportunities';
import CompetitiveAnalysis from './pages/CompetitiveAnalysis';
import NotFound from './pages/NotFound';
import './App.css';

// Set base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check API health on mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await axios.get('/health');
        if (response.data.status === 'healthy') {
          setIsLoading(false);
        }
      } catch (err) {
        setError('Unable to connect to the API server');
        setIsLoading(false);
      }
    };

    checkApiHealth();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Fikra Tech Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="alert alert-error">
          <span>{error}</span>
          <p>Please make sure the backend server is running.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/industry-analysis" element={<IndustryAnalysis />} />
            <Route path="/market-opportunities" element={<MarketOpportunities />} />
            <Route path="/competitive-analysis" element={<CompetitiveAnalysis />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
