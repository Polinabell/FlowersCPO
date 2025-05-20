import React, { useEffect, useState } from 'react';
import { flowersAPI } from '../api';
import { Flower } from '../types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSpinner, faGlobe, faSeedling } from '@fortawesome/free-solid-svg-icons';

const FlowersList = () => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flowerTypes, setFlowerTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [varieties, setVarieties] = useState<string[]>([]);
  const [selectedVariety, setSelectedVariety] = useState('all');
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('all');

  useEffect(() => {
    fetchFlowers();
  }, []);

  const fetchFlowers = async () => {
    try {
      setLoading(true);
      const flowersArray = await flowersAPI.getAll();
      setFlowers(flowersArray);

      if (flowersArray.length > 0) {
        // Получаем уникальные типы цветов
        const types = Array.from(new Set(flowersArray.map(flower => flower.type)));
        setFlowerTypes(types);
        
        // Получаем уникальные сорта цветов
        const varietyList = Array.from(new Set(flowersArray.map(flower => flower.variety))).filter(Boolean);
        setVarieties(varietyList);
        
        // Получаем уникальные страны происхождения
        const countryList = Array.from(new Set(flowersArray.map(flower => flower.country))).filter(Boolean);
        setCountries(countryList);
      }
    } catch (error) {
      console.error('Error fetching flowers:', error);
      setError('Не удалось загрузить данные о цветах');
    } finally {
      setLoading(false);
    }
  };

  const filteredFlowers = flowers.filter(flower => {
    const matchesSearch = flower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flower.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || flower.type === selectedType;
    const matchesVariety = selectedVariety === 'all' || flower.variety === selectedVariety;
    const matchesCountry = selectedCountry === 'all' || flower.country === selectedCountry;

    return matchesSearch && matchesType && matchesVariety && matchesCountry;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedVariety('all');
    setSelectedCountry('all');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchFlowers}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Каталог цветов</h1>

      {}
      <div className="mb-8 bg-white shadow rounded-lg p-6">
        <div className="flex flex-col space-y-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск цветов по названию, сорту и стране..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Фильтр по типу */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">Все типы</option>
                {flowerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Фильтр по сорту */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSeedling} className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedVariety}
                onChange={(e) => setSelectedVariety(e.target.value)}
              >
                <option value="all">Все сорта</option>
                {varieties.map(variety => (
                  <option key={variety} value={variety}>{variety}</option>
                ))}
              </select>
            </div>
            
            {/* Фильтр по стране */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faGlobe} className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="all">Все страны</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            {/* Кнопка сброса */}
            <div className="relative">
              <button
                onClick={resetFilters}
                className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        </div>
      </div>

      {}
      {filteredFlowers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Цветы не найдены. Попробуйте изменить параметры поиска.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFlowers.map(flower => (
            <Link 
              to={`/flowers/${flower.id}`} 
              key={flower.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={flower.imageUrl || '/images/flower-default.jpg'} 
                  alt={flower.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{flower.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{flower.type}</p>
                  </div>
                  <div className="text-green-600 font-bold">
                    {flower.price} ₽
                  </div>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-2">{flower.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    В наличии: {flower.inStock}
                  </span>
                  <span className="text-sm text-gray-500">
                    Поставщик: {flower.supplierName}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlowersList; 