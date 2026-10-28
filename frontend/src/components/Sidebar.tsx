import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Factory as FactoryIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@mui/icons-material';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/dashboard', 
      icon: <DashboardIcon />, 
      label: 'لوحة التحكم',
      enLabel: 'Dashboard'
    },
    { 
      path: '/companies', 
      icon: <BusinessIcon />, 
      label: 'الشركات',
      enLabel: 'Companies'
    },
    { 
      path: '/analytics', 
      icon: <AnalyticsIcon />, 
      label: 'التحليلات',
      enLabel: 'Analytics'
    },
    { 
      path: '/industry-analysis', 
      icon: <FactoryIcon />, 
      label: 'تحليل الصناعات',
      enLabel: 'Industry Analysis'
    },
    { 
      path: '/market-opportunities', 
      icon: <TrendingUpIcon />, 
      label: 'فرص السوق',
      enLabel: 'Market Opportunities'
    },
    { 
      path: '/competitive-analysis', 
      icon: <PeopleIcon />, 
      label: 'التحليل التنافسي',
      enLabel: 'Competitive Analysis'
    },
  ];

  const bottomItems = [
    { 
      path: '/settings', 
      icon: <SettingsIcon />, 
      label: 'الإعدادات',
      enLabel: 'Settings'
    },
    { 
      path: '/help', 
      icon: <HelpIcon />, 
      label: 'المساعدة',
      enLabel: 'Help'
    },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span style={{ color: '#1976d2' }}>Fikra</span>
            <span style={{ color: '#9c27b0' }}>Tech</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => window.innerWidth <= 1200 && toggleSidebar()}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span className="sidebar-nav-text">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="sidebar-nav-section" style={{ marginTop: '2rem' }}>
            {bottomItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="sidebar-nav-item"
                onClick={() => window.innerWidth <= 1200 && toggleSidebar()}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-text">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>
      
      {window.innerWidth <= 1200 && (
        <div 
          className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
