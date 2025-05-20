import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { flowersAPI } from '../api/api';
import { Flower } from '../types';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLeaf, faMapMarkerAlt, faTag, faSun, faRubleSign, 
  faArrowLeft, faTrash, faPlus, faTimes, faTruck, faStore
} from '@fortawesome/free-solid-svg-icons';

const defaultImage = 'https://images.pexels.com/photos/1179074/pexels-photo-1179074.jpeg';

const FlowerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [flower, setFlower] = useState<Flower | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isAddedToSeller, setIsAddedToSeller] = useState(false);
  const [addingToSeller, setAddingToSeller] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFlowerDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { flower } = await flowersAPI.getFlowerById(Number(id));
        setFlower(flower);
        
        
        if (user?.role === 'seller' && user.seller && flower.sellers) {
          const isAdded = flower.sellers.some(seller => seller.id === user.seller?.id);
          setIsAddedToSeller(isAdded);
        }
      } catch (err: any) {
        console.error('Error fetching flower details:', err);
        setError('Не удалось загрузить информацию о цветке');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchFlowerDetails();
    }
  }, [id, user]);
  
  const handleAddToSeller = async () => {
    if (!user || user.role !== 'seller') return;
    
    setAddingToSeller(true);
    setAddError(null);
    
    try {
      await flowersAPI.addFlowerToSeller(Number(id));
      setIsAddedToSeller(true);
    } catch (err: any) {
      console.error('Error adding flower to seller:', err);
      setAddError(err.response?.data?.message || 'Ошибка при добавлении цветка в продажу');
    } finally {
      setAddingToSeller(false);
    }
  };
  
  const handleRemoveFromSeller = async () => {
    if (!user || user.role !== 'seller') return;
    
    setAddingToSeller(true);
    setAddError(null);
    
    try {
      await flowersAPI.removeFlowerFromSeller(Number(id));
      setIsAddedToSeller(false);
    } catch (err: any) {
      console.error('Error removing flower from seller:', err);
      setAddError(err.response?.data?.message || 'Ошибка при удалении цветка из продажи');
    } finally {
      setAddingToSeller(false);
    }
  };
  
  const handleDeleteFlower = async () => {
    if (!user || user.role !== 'supplier' || !flower) return;
    
    const confirmed = window.confirm('Вы уверены, что хотите удалить этот цветок?');
    if (!confirmed) return;
    
    setLoading(true);
    
    try {
      await flowersAPI.deleteFlower(Number(id));
      navigate('/flowers');
    } catch (err: any) {
      console.error('Error deleting flower:', err);
      setError(err.response?.data?.message || 'Ошибка при удалении цветка');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error || !flower) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p>{error || 'Цветок не найден'}</p>
          <Link
            to="/flowers"
            className="mt-4 inline-flex items-center text-red-700 font-medium hover:text-red-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Вернуться к списку цветов
          </Link>
        </div>
      </div>
    );
  }
  
  const { name, type, season, country, variety, price, imageUrl, description, supplier } = flower;
  const isSupplierOwner = user?.role === 'supplier' && user?.supplier?.id === supplier?.id;
  
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-6">
        <Link
          to="/flowers"
          className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Вернуться к списку цветов
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 h-64 md:h-auto">
            <img
              src={imageUrl || defaultImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">{name}</h1>
              <div className="text-xl font-bold text-primary-600 flex items-center">
                <FontAwesomeIcon icon={faRubleSign} className="mr-1" />
                {price}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faLeaf} className="mr-2 text-secondary-500" />
                <span className="font-medium">Тип:</span>
                <span className="ml-2">{type}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faSun} className="mr-2 text-yellow-500" />
                <span className="font-medium">Сезон:</span>
                <span className="ml-2">{season}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
                <span className="font-medium">Страна:</span>
                <span className="ml-2">{country}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-500" />
                <span className="font-medium">Сорт:</span>
                <span className="ml-2">{variety}</span>
              </div>
            </div>
            
            {description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Описание</h2>
                <p className="text-gray-600">{description}</p>
              </div>
            )}
            
            {supplier && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <FontAwesomeIcon icon={faTruck} className="mr-2 text-secondary-600" />
                  Поставщик
                </h2>
                <p className="text-gray-600">
                  <span className="font-medium">{supplier.fullName || 'Информация отсутствует'}</span>
                </p>
                {supplier.farmType && (
                  <p className="text-gray-600 text-sm">
                    Тип фермы: {supplier.farmType}
                  </p>
                )}
                <Link 
                  to={`/suppliers/${supplier.id}`} 
                  className="mt-2 inline-block text-primary-600 text-sm hover:underline"
                >
                  Посмотреть все цветы поставщика
                </Link>
              </div>
            )}
            
            {flower.sellers && flower.sellers.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <FontAwesomeIcon icon={faStore} className="mr-2 text-primary-600" />
                  Продавцы ({flower.sellers.length})
                </h2>
                <div className="space-y-2">
                  {flower.sellers.slice(0, 3).map(seller => (
                    <div key={seller.id} className="text-sm">
                      <Link 
                        to={`/sellers/${seller.id}`} 
                        className="text-primary-600 hover:underline"
                      >
                        {seller.fullName}
                      </Link>
                    </div>
                  ))}
                  {flower.sellers.length > 3 && (
                    <p className="text-sm text-gray-500">
                      И еще {flower.sellers.length - 3} продавцов...
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Действия для продавца */}
            {user?.role === 'seller' && (
              <div className="mt-6">
                {addError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
                    {addError}
                  </div>
                )}
                
                {isAddedToSeller ? (
                  <button
                    onClick={handleRemoveFromSeller}
                    disabled={addingToSeller}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                  >
                    {addingToSeller ? (
                      <span>Обработка...</span>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Убрать из продажи
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleAddToSeller}
                    disabled={addingToSeller}
                    className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                  >
                    {addingToSeller ? (
                      <span>Обработка...</span>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Добавить в продажу
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
            
            {/* Действия для поставщика */}
            {isSupplierOwner && (
              <div className="mt-6">
                <button
                  onClick={handleDeleteFlower}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Удалить цветок
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowerDetails; 