import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faMapMarkerAlt, 
  faPencilAlt, faCheck, faTimes, faKey
} from '@fortawesome/free-solid-svg-icons';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [editableProfile, setEditableProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    
    setInitialLoading(true);
    setTimeout(() => {
      const profileData = {
        name: user?.name || 'Имя пользователя',
        email: user?.email || 'email@example.com',
        phone: '+7 (999) 123-45-67',
        address: ''
      };
      
      setProfile(profileData);
      setEditableProfile(profileData);
      setInitialLoading(false);
    }, 500);
  }, [isAuthenticated, navigate, user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  
  const handleEditClick = () => {
  
    setEditableProfile({...profile});
    setEditMode(true);
  };
  
  
  const handleCancelClick = () => {
    setEditMode(false);
  
  };
  
  
  const handleSaveClick = () => {
    setLoading(true);
    
  
    setTimeout(() => {
  
      setProfile({...editableProfile});
      setLoading(false);
      setEditMode(false);
      setSuccessMessage('Профиль успешно обновлен');
      
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };
  
  const handlePasswordChange = () => {
    alert('Функция смены пароля будет реализована позже');
  };
  
  if (initialLoading) {
    return (
      <div className="container mx-auto px-6 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="section-title text-center mb-12">Личный кабинет</h1>
      
      {/* Информация о профиле */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-primary-500 text-4xl" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-primary-100">{user?.role === 'supplier' ? 'Поставщик' : user?.role === 'seller' ? 'Продавец' : 'Пользователь'}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {successMessage && (
              <div className="mb-6 bg-green-100 text-green-700 p-4 rounded-md">
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-md">
                {errorMessage}
              </div>
            )}
            
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Имя
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                      value={editableProfile.name}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    ) : (
                      <p className="text-gray-800 p-2 bg-gray-50 rounded-md">{profile.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                      Email
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                      value={editableProfile.email}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    ) : (
                      <p className="text-gray-800 p-2 bg-gray-50 rounded-md">{profile.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <FontAwesomeIcon icon={faPhone} className="mr-2" />
                      Телефон
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                      value={editableProfile.phone}
                        onChange={handleChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-800 p-2 bg-gray-50 rounded-md">{profile.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      Адрес
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="address"
                      value={editableProfile.address}
                        onChange={handleChange}
                        className="input-field"
                      placeholder="Введите ваш адрес"
                      />
                    ) : (
                    <p className="text-gray-800 p-2 bg-gray-50 rounded-md">
                      {profile.address || "Адрес не указан"}
                    </p>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  {editMode ? (
                    <div className="flex flex-wrap justify-end gap-4">
                      <button
                        type="button"
                      onClick={handleCancelClick}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        <span>Отмена</span>
                      </button>
                      
                      <button
                      type="button"
                      onClick={handleSaveClick}
                        className="btn-primary flex items-center gap-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
                        ) : (
                          <FontAwesomeIcon icon={faCheck} />
                        )}
                        <span>Сохранить</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-between gap-4">
                      <button
                        type="button"
                        onClick={handlePasswordChange}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faKey} />
                        <span>Изменить пароль</span>
                      </button>
                      
                      <button
                        type="button"
                      onClick={handleEditClick}
                        className="btn-primary flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                        <span>Редактировать профиль</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 