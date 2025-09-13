import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { 
  FiHome, 
  FiUser, 
  FiLogOut, 
  FiLogIn, 
  FiUserPlus, 
  
  FiInfo,
  FiFileText,
  FiFile,
  FiDownload,
  FiMenu,
  FiX
} from 'react-icons/fi';
import '../css/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [converterOpen, setConverterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Toggle dropdown on click
  const toggleDropdown = () => {
    setConverterOpen(!converterOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setConverterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setConverterOpen(false);
  };

  return (
    <nav className="nav">
       {/* Logo/Brand */}
        <Link to="/" className="brand" onClick={closeMobileMenu}>
          <div className="logo-icon">⏰</div>
          <p>Daily Tools</p>
        </Link>
      <div className="nav-inner">
       

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation Menu */}
        <div className={`nav-menu ${mobileMenuOpen ? 'nav-menu-open' : ''}`}>
          <NavLink 
            to="/" 
            className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            <FiHome className="nav-icon" />
            <span>Home</span>
          </NavLink>
          
          <NavLink 
            to="/about" 
            className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            <FiInfo className="nav-icon" />
            <span>About</span>
          </NavLink>

          

          {/* Converter Dropdown */}
          {/* <div className="dropdown-container" ref={dropdownRef}>
            <button 
              className="nav-link dropdown-toggle"
              onClick={toggleDropdown}
            >
              <FiFileText className="nav-icon" />
              <span>Converter</span>
              <span className="dropdown-arrow">{converterOpen ? '▴' : '▾'}</span>
            </button>
            {converterOpen && (
              <div className="dropdown-menu">
                <NavLink 
                  to="/text-to-pdf" 
                  className={({isActive}) => isActive ? 'dropdown-item active' : 'dropdown-item'} 
                  onClick={closeMobileMenu}
                >
                  <FiFile className="dropdown-icon" />
                  <span>Text to PDF</span>
                </NavLink>
                <NavLink 
                  to="/word-to-pdf" 
                  className={({isActive}) => isActive ? 'dropdown-item active' : 'dropdown-item'} 
                  onClick={closeMobileMenu}
                >
                  <FiDownload className="dropdown-icon" />
                  <span>Word to PDF</span>
                </NavLink>
                <NavLink 
                  to="/imageconverter" 
                  className={({isActive}) => isActive ? 'dropdown-item active' : 'dropdown-item'} 
                  onClick={closeMobileMenu}
                >
                  <FiDownload className="dropdown-icon" />
                  <span>Image Converter</span>
                </NavLink>
                <NavLink 
                  to="/text-to-word" 
                  className={({isActive}) => isActive ? 'dropdown-item active' : 'dropdown-item'} 
                  onClick={closeMobileMenu}
                >
                  <FiFileText className="dropdown-icon" />
                  <span>Text to Word</span>
                </NavLink>
                <NavLink 
                  to="/word-to-pdf" 
                  className={({isActive}) => isActive ? 'dropdown-item active' : 'dropdown-item'} 
                  onClick={closeMobileMenu}
                >
                  <FiDownload className="dropdown-icon" />
                  <span>Word to PDF</span>
                </NavLink>
              </div>
            )}
          </div> */}

          {/* User Section - Right aligned */}
          <div className="nav-user-section">
            {user ? (
              <>
                <NavLink 
                  to="/profile" 
                  className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={closeMobileMenu}
                >
                  <FiUser className="nav-icon" />
                  <span>Profile</span>
                </NavLink>
                <div className="user-info">
                  <span className="user-greeting">👋 Hi, {user.name}</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    <FiLogOut className="logout-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="nav-auth">
                <NavLink 
                  to="/login" 
                  className={({isActive}) => isActive ? 'auth-btn login-btn active' : 'auth-btn login-btn'}
                  onClick={closeMobileMenu}
                >
                  <FiLogIn className="auth-icon" />
                  <span>Login</span>
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className={({isActive}) => isActive ? 'auth-btn signup-btn active' : 'auth-btn signup-btn'}
                  onClick={closeMobileMenu}
                >
                  <FiUserPlus className="auth-icon" />
                  <span>Sign Up</span>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}