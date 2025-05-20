import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sellersAPI } from '../api/sellers';
import { Seller, Flower } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStore, faStar, faPhone, faEnvelope, 
  faLocationDot, faCalendarAlt, faFlower, 
  faLeaf, faCircleInfo, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

const SellerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('ID продавца не указан');
        }
        
        const data = await sellersAPI.getById(parseInt(id));
        console.log('Данные продавца:', data);
        
        
        let sellerData: Seller | null = null;
        let flowersData: Flower[] = [];
        
        if (data.seller) {
          sellerData = data.seller;
        } else if (data && !data.message) {
          sellerData = data;
        }
        
        if (data.flowers) {
          flowersData = data.flowers;
        }
        
        setSeller(sellerData);
        setFlowers(flowersData);
        setError(null);
      } catch (err: any) {
        console.error('Ошибка при загрузке данных продавца:', err);
        setError(err.message || 'Не удалось загрузить данные продавца');
        setSeller(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, [id]);

  
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xl ${
            i < fullStars 
              ? 'text-yellow-400' 
              : i === fullStars && hasHalfStar 
                ? 'text-yellow-300' 
                : 'text-gray-300'
          }`}>
            ★
          </span>
        ))}
        <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Нет данных';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">Ошибка</h2>
          <p>{error}</p>
          <div className="mt-4">
            <Link to="/sellers" className="text-purple-600 hover:text-purple-800 font-medium">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Вернуться к списку продавцов
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">Продавец не найден</h2>
          <p>Запрашиваемый продавец не существует или был удален.</p>
          <div className="mt-4">
            <Link to="/sellers" className="text-purple-600 hover:text-purple-800 font-medium">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Вернуться к списку продавцов
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/sellers" className="text-purple-600 hover:text-purple-800 font-medium">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Вернуться к списку продавцов
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{seller.shopName}</h1>
              <p className="text-gray-600">{seller.fullName}</p>
            </div>
            <div className="mt-4 md:mt-0">
              {seller.rating && renderRating(seller.rating)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Контактная информация</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faLocationDot} className="text-purple-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Адрес</h3>
                    <p className="text-gray-700">{seller.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faPhone} className="text-purple-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Телефон</h3>
                    <p className="text-gray-700">{seller.phone}</p>
                  </div>
                </div>
                
                {seller.user?.email && (
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faEnvelope} className="text-purple-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-700">{seller.user.email}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Дата регистрации</h3>
                    <p className="text-gray-700">{formatDate(seller.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">О продавце</h2>
              {seller.description ? (
                <p className="text-gray-700">{seller.description}</p>
              ) : (
                <p className="text-gray-500 italic">Информация отсутствует</p>
              )}
              
              {seller.specialization && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Специализация</h3>
                  <div className="flex flex-wrap gap-2">
                    {seller.specialization.split(',').map((spec, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {flowers.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Цветы в продаже ({flowers.length})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flowers.map(flower => (
                <div key={flower.id} className="border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md">
                  <div className="mb-3">
                    {flower.imageUrl ? (
                      <img 
                        src={flower.imageUrl} 
                        alt={flower.name} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faLeaf} className="text-gray-400 text-4xl" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-1">{flower.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{flower.type}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-purple-600">{flower.price} ₽</span>
                    <Link 
                      to={`/flowers/${flower.id}`} 
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDetails; 