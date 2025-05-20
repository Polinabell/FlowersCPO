import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCoins, faHandshake, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { flowersAPI, sellersAPI } from '../api/api';

const Analytics = () => {
  
  const [variety, setVariety] = useState('');
  const [varietyResults, setVarietyResults] = useState<any[]>([]);
  const [loadingVariety, setLoadingVariety] = useState(false);
  const [varietyError, setVarietyError] = useState<string | null>(null);
  
  
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [loadingTopSellers, setLoadingTopSellers] = useState(false);
  const [topSellersError, setTopSellersError] = useState<string | null>(null);
  
  
  const [matchingSuppliers, setMatchingSuppliers] = useState<any[]>([]);
  const [loadingMatching, setLoadingMatching] = useState(false);
  const [matchingError, setMatchingError] = useState<string | null>(null);
  
  
  useEffect(() => {
    fetchTopSellers();
    fetchMatchingSuppliers();
  }, []);
  

  const searchByVariety = async () => {
    if (!variety.trim()) {
      setVarietyError('Введите название сорта для поиска');
      return;
    }
    
    setLoadingVariety(true);
    setVarietyError(null);
    
    try {
      console.log('Выполняем поиск по сорту:', variety);
      const response = await flowersAPI.searchByVariety(variety);
      
      if (response && response.flowers) {
        setVarietyResults(response.flowers);
      } else {
        setVarietyResults([]);
      }
    } catch (error) {
      console.error('Ошибка при поиске цветов по сорту:', error);
      setVarietyError('Не удалось выполнить поиск. Пожалуйста, попробуйте позже.');
      setVarietyResults([]);
    } finally {
      setLoadingVariety(false);
    }
  };
  
  
  const fetchTopSellers = async () => {
    setLoadingTopSellers(true);
    setTopSellersError(null);
    
    try {
      console.log('Загрузка топа продавцов');
      const response = await sellersAPI.getTopExpensiveSellers();
      
      if (response && response.sellers) {
        setTopSellers(response.sellers);
      } else {
        setTopSellers([]);
      }
    } catch (error) {
      console.error('Ошибка при получении топа продавцов:', error);
      setTopSellersError('Не удалось загрузить данные о продавцах. Пожалуйста, попробуйте позже.');
      setTopSellers([]);
    } finally {
      setLoadingTopSellers(false);
    }
  };
  
  
  const fetchMatchingSuppliers = async () => {
    setLoadingMatching(true);
    setMatchingError(null);
    
    try {
      console.log('Загрузка совпадающих поставщиков');
      const response = await sellersAPI.getMatchingSuppliers();
      
      if (response && response.matchingData) {
        setMatchingSuppliers(response.matchingData);
      } else {
        setMatchingSuppliers([]);
      }
    } catch (error) {
      console.error('Ошибка при получении данных о совпадающих поставщиках:', error);
      setMatchingError('Не удалось загрузить данные о совпадающих поставщиках. Пожалуйста, попробуйте позже.');
      setMatchingSuppliers([]);
    } finally {
      setLoadingMatching(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary-600">Аналитика цветов</h1>
      
      {/* Поиск по сорту */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center text-primary-700">
          <FontAwesomeIcon icon={faSearch} className="mr-2" />
          У кого можно купить заданный сорт
        </h2>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            placeholder="Введите название сорта..."
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={searchByVariety}
            disabled={loadingVariety}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-r transition-colors"
          >
            {loadingVariety ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Найти'}
          </button>
        </div>
        
        {varietyError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            {varietyError}
          </div>
        )}
        
        {varietyResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Сорт</th>
                  <th className="py-2 px-4 text-left">Тип</th>
                  <th className="py-2 px-4 text-left">Цена</th>
                  <th className="py-2 px-4 text-left">Поставщик</th>
                  <th className="py-2 px-4 text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                {varietyResults.map((flower) => (
                  <tr key={flower.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{flower.variety}</td>
                    <td className="py-2 px-4">{flower.type}</td>
                    <td className="py-2 px-4">{flower.price} ₽</td>
                    <td className="py-2 px-4">
                      {flower.supplier ? flower.supplier.companyName : 'Не указано'}
                    </td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/flowers/${flower.id}`}
                        className="text-primary-500 hover:text-primary-700 underline"
                      >
                        Подробнее
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            {loadingVariety ? (
              <div className="flex justify-center items-center">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Загрузка...
              </div>
            ) : (
              <p>Результаты поиска будут отображены здесь</p>
            )}
          </div>
        )}
      </div>
      
      {/* Продавцы самых дорогих цветов */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center text-primary-700">
          <FontAwesomeIcon icon={faCoins} className="mr-2" />
          Продавцы самых дорогих цветов
        </h2>
        
        {topSellersError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            {topSellersError}
          </div>
        )}
        
        {loadingTopSellers ? (
          <div className="flex justify-center items-center py-8">
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Загрузка данных...
          </div>
        ) : topSellers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Продавец</th>
                  <th className="py-2 px-4 text-left">Адрес</th>
                  <th className="py-2 px-4 text-left">Макс. цена</th>
                  <th className="py-2 px-4 text-left">Кол-во цветов</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((seller, index) => (
                  <tr key={seller.id} className={`border-t hover:bg-gray-50 ${index === 0 ? 'bg-yellow-50' : ''}`}>
                    <td className="py-2 px-4">{seller.fullName}</td>
                    <td className="py-2 px-4">{seller.address}</td>
                    <td className="py-2 px-4 font-semibold">{seller.max_price} ₽</td>
                    <td className="py-2 px-4">{seller.flower_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            Нет данных о продавцах
          </div>
        )}
      </div>
      
      {/* Совпадающие поставщики у продавцов */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center text-primary-700">
          <FontAwesomeIcon icon={faHandshake} className="mr-2" />
          Совпадающие поставщики у продавцов
        </h2>
        
        {matchingError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            {matchingError}
          </div>
        )}
        
        {loadingMatching ? (
          <div className="flex justify-center items-center py-8">
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Загрузка данных...
          </div>
        ) : matchingSuppliers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Продавец</th>
                  <th className="py-2 px-4 text-left">Поставщик</th>
                  <th className="py-2 px-4 text-left">Количество цветов</th>
                </tr>
              </thead>
              <tbody>
                {matchingSuppliers.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{item.seller_name}</td>
                    <td className="py-2 px-4">{item.supplier_name}</td>
                    <td className="py-2 px-4">{item.flower_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            Нет данных о совпадающих поставщиках
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 