import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, Search as SearchIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'لوحة التحكم';
      case '/companies':
        return 'الشركات';
      case '/analytics':
        return 'التحليلات';
      case '/industry-analysis':
        return 'تحليل الصناعات';
      case '/market-opportunities':
        return 'فرص السوق';
      case '/competitive-analysis':
        return 'التحليل التنافسي';
      default:
        return 'Fikra Tech Dashboard';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <div className="header-title-container">
          <h1 className="header-title">{getPageTitle()}</h1>
          <p className="header-subtitle">Fikra Tech AI Assistant Dashboard</p>
        </div>
      </div>
      
      <div className="header-right">
        <form className="header-search" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input search-input"
            />
          </div>
        </form>
        
        <button className="header-icon-btn">
          <NotificationsIcon />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="header-user">
          <AccountCircleIcon className="user-avatar" />
          <span className="user-name">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
