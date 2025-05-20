import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLeaf, faUser, faSignOutAlt, faSignInAlt, 
  faSeedling, faStore, faTruck, faChartLine, faListAlt 
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getProfileLink = () => {
    if (!user) return '/profile';
    
    switch (user.role) {
      case 'supplier':
        return '/supplier/manage';
      case 'seller':
        return '/seller/manage';
      case 'admin':
        return '/admin/requests';
      default:
        return '/profile';
    }
  };

  const getProfileText = () => {
    if (!user) return 'Профиль';
    
    switch (user.role) {
      case 'supplier':
        return 'Мои цветы';
      case 'seller':
        return 'Мои продажи';
      case 'admin':
        return 'Запросы';
      default:
        return 'Профиль';
    }
  };

  const getProfileIcon = () => {
    if (!user) return faUser;
    
    switch (user.role) {
      case 'admin':
        return faListAlt;
      default:
        return faUser;
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary-600 text-xl font-serif font-bold">
          <FontAwesomeIcon icon={faLeaf} className="text-secondary-500" />
          <span>Цветы</span>
        </Link>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/flowers" className="text-gray-700 hover:text-primary-500 flex items-center gap-1">
            <FontAwesomeIcon icon={faSeedling} /> Цветы
          </Link>
          <Link to="/suppliers" className="text-gray-700 hover:text-primary-500 flex items-center gap-1">
            <FontAwesomeIcon icon={faTruck} /> Поставщики
          </Link>
          <Link to="/sellers" className="text-gray-700 hover:text-primary-500 flex items-center gap-1">
            <FontAwesomeIcon icon={faStore} /> Продавцы
          </Link>
          <Link to="/analytics" className="text-gray-700 hover:text-primary-500 flex items-center gap-1">
            <FontAwesomeIcon icon={faChartLine} /> Аналитика
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link 
                to={getProfileLink()} 
                className="text-gray-700 hover:text-primary-500 flex items-center gap-1"
              >
                <FontAwesomeIcon icon={getProfileIcon()} /> 
                {getProfileText()}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-primary-500 flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Выйти
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-full flex items-center gap-1 transition duration-300"
            >
              <FontAwesomeIcon icon={faSignInAlt} /> Войти
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 px-6 py-3 bg-white border-t">
          <div className="flex flex-col space-y-4">
            <Link to="/flowers" className="text-gray-700 hover:text-primary-500 flex items-center gap-1">
              <FontAwesomeIcon icon={faSeedling} /> Цветы
            </Link>
            <Link to="/suppliers" className="text-gray-700 hover:text-primary-500 flex items-center gap-1">
              <FontAwesomeIcon icon={faTruck} /> Поставщики
            </Link>
            <Link to="/sellers" className="text-gray-700 hover:text-primary-500 flex items-center gap-1">
              <FontAwesomeIcon icon={faStore} /> Продавцы
            </Link>
            <Link to="/analytics" className="text-gray-700 hover:text-primary-500 flex items-center gap-1">
              <FontAwesomeIcon icon={faChartLine} /> Аналитика
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={getProfileLink()} 
                  className="text-gray-700 hover:text-primary-500 flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={getProfileIcon()} /> 
                  {getProfileText()}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-500 flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Выйти
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-primary-500 flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faSignInAlt} /> Войти
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 