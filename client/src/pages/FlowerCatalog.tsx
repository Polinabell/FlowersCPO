import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faLeaf, faRubleSign, faSpinner, faShoppingCart, faGlobe, faSeedling, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { flowersAPI } from '../api';
import { Flower } from '../types';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const FlowerCatalog = () => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedVariety, setSelectedVariety] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | null>(null);
  const [flowerTypes, setFlowerTypes] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [varieties, setVarieties] = useState<string[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState<boolean>(false);
  const [showVarietyDropdown, setShowVarietyDropdown] = useState<boolean>(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const { addToCart } = useCart();

  
  useEffect(() => {
    const fetchFlowers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await flowersAPI.getAllFlowers();
        setFlowers(response.flowers);
        
        
        const uniqueTypes = Array.from(
          new Set(response.flowers.map(flower => flower.type))
        );
        setFlowerTypes(uniqueTypes);
        
        
        const uniqueSeasons = Array.from(
          new Set(response.flowers.map(flower => flower.season))
        );
        setSeasons(uniqueSeasons);
        
        
        const uniqueCountries = Array.from(
          new Set(response.flowers.map(flower => flower.country))
        );
        setCountries(uniqueCountries);
        
        
        const uniqueVarieties = Array.from(
          new Set(response.flowers.map(flower => flower.variety))
        );
        setVarieties(uniqueVarieties);
      } catch (err: any) {
        console.error('Error fetching flowers:', err);
        setError('Не удалось загрузить данные о цветах');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlowers();
  }, []);
  
  
  const filteredFlowers = flowers.filter(flower => {
  
    if (selectedType !== 'all' && flower.type !== selectedType) {
      return false;
    }
    
  
    if (selectedSeason !== 'all' && flower.season !== selectedSeason) {
      return false;
    }
    
  
    if (selectedCountry !== 'all' && flower.country !== selectedCountry) {
      return false;
    }
    
  
    if (selectedVariety !== 'all' && flower.variety !== selectedVariety) {
      return false;
    }
    
  
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = flower.name.toLowerCase().includes(searchTermLower);
      const varietyMatch = flower.variety.toLowerCase().includes(searchTermLower);
      const countryMatch = flower.country.toLowerCase().includes(searchTermLower);
      
      if (!nameMatch && !varietyMatch && !countryMatch) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
  
    if (priceSort === 'asc') {
      return a.price - b.price;
    } else if (priceSort === 'desc') {
      return b.price - a.price;
    }
    
  
    return a.id - b.id;
  });

  
  if (loading && flowers.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  
  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedSeason('all');
    setSelectedCountry('all');
    setSelectedVariety('all');
    setPriceSort(null);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="section-title text-center mb-12">Каталог цветов</h1>
      
      {/* Очень простая панель поиска и фильтров */}
      <div className="mb-8">
        {/* Строка поиска */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Поиск цветов..."
            className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
        </div>
        
        {/* Кнопки фильтрации под полем поиска */}
        <div className="flex justify-between gap-2 mb-2">
          <button
            className="flex-1 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors focus:outline-none"
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowVarietyDropdown(false);
              setShowCountryDropdown(false);
            }}
          >
            Типы
          </button>
          <button
            className="flex-1 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors focus:outline-none"
            onClick={() => {
              setShowVarietyDropdown(!showVarietyDropdown);
              setShowTypeDropdown(false);
              setShowCountryDropdown(false);
            }}
          >
            Сорта
          </button>
          <button
            className="flex-1 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors focus:outline-none"
            onClick={() => {
              setShowCountryDropdown(!showCountryDropdown);
              setShowTypeDropdown(false);
              setShowVarietyDropdown(false);
            }}
          >
            Страны
          </button>
          <button
            className="flex-1 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors focus:outline-none"
            onClick={resetFilters}
          >
            Очистить
          </button>
        </div>
        
        {/* Выпадающие списки */}
        {showTypeDropdown && (
          <div className="mt-1 p-4 bg-gray-800 text-white border border-gray-600 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Выберите тип цветов</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <div 
                className={`px-3 py-2 cursor-pointer rounded-md border ${selectedType === 'all' ? 'bg-primary-500 text-white border-primary-600' : 'bg-gray-700 hover:bg-gray-600 border-gray-600'}`}
                onClick={() => {
                  setSelectedType('all');
                  setShowTypeDropdown(false);
                }}
              >
                Все типы
              </div>
              {flowerTypes.map(type => (
                <div 
                  key={type}
                  className={`px-3 py-2 cursor-pointer rounded-md border ${selectedType === type ? 'bg-primary-500 text-white border-primary-600' : 'bg-gray-700 hover:bg-gray-600 border-gray-600'}`}
                  onClick={() => {
                    setSelectedType(type);
                    setShowTypeDropdown(false);
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showVarietyDropdown && (
          <div className="mt-1 p-4 bg-gray-800 text-white border border-gray-600 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Выберите сорт цветов</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <div 
                className={`px-3 py-2 cursor-pointer rounded-md border ${selectedVariety === 'all' ? 'bg-primary-500 text-white border-primary-600' : 'bg-gray-700 hover:bg-gray-600 border-gray-600'}`}
                onClick={() => {
                  setSelectedVariety('all');
                  setShowVarietyDropdown(false);
                }}
              >
                Все сорта
              </div>
              {varieties.map(variety => (
                <div 
                  key={variety}
                  className={`px-3 py-2 cursor-pointer rounded-md border ${selectedVariety === variety ? 'bg-primary-500 text-white border-primary-600' : 'bg-gray-700 hover:bg-gray-600 border-gray-600'}`}
                  onClick={() => {
                    setSelectedVariety(variety);
                    setShowVarietyDropdown(false);
                  }}
                >
                  {variety}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showCountryDropdown && (
          <div className="mt-1 p-4 bg-gray-800 text-white border border-gray-600 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Выберите страну происхождения</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <div 
                className={`px-3 py-2 cursor-pointer rounded-md border ${selectedCountry === 'all' ? 'bg-primary-500 text-white border-primary-600' : 'bg-gray-700 hover:bg-gray-600 border-gray-600'}`}
                onClick={() => {
                  setSelectedCountry('all');
                  setShowCountryDropdown(false);
                }}
              >
                Все страны
              </div>
              {countries.map(country => (
                <div 
                  key={country}
                  className={`px-3 py-2 cursor-pointer rounded-md border ${selectedCountry === country ? 'bg-primary-500 text-white border-primary-600' : 'bg-gray-700 hover:bg-gray-600 border-gray-600'}`}
                  onClick={() => {
                    setSelectedCountry(country);
                    setShowCountryDropdown(false);
                  }}
                >
                  {country}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Результаты */}
      {loading && (
        <div className="mb-4 flex justify-center">
          <FontAwesomeIcon icon={faSpinner} className="text-primary-500 text-2xl animate-spin" />
        </div>
      )}
      
      {/* Показ количества найденных цветов */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Каталог цветов</h2>
        <div className="flex items-center">
          <span className="text-gray-600">
            Найдено: {filteredFlowers.length}
          </span>
        </div>
      </div>
      
      {filteredFlowers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFlowers.map((flower) => (
            <div key={flower.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
              <Link to={`/flowers/${flower.id}`}>
                <img 
                  src={flower.imageUrl || '/assets/flower-placeholder.jpg'} 
                  alt={flower.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <div className="mb-2 flex flex-wrap gap-1">
                  <span className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 rounded">{flower.type}</span>
                  <span className="text-xs font-medium px-2 py-1 bg-secondary-100 text-secondary-700 rounded">{flower.season}</span>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">{flower.country}</span>
                </div>
                
                <Link to={`/flowers/${flower.id}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-500 transition-colors">
                    {flower.name}
                  </h3>
                </Link>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-primary-500 font-semibold text-lg">
                    {flower.price.toLocaleString()} ₽
                    {flower.oldPrice && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        {flower.oldPrice.toLocaleString()} ₽
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(flower);
                    }}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-gray-500">Цветы не найдены. Попробуйте изменить параметры поиска.</p>
        </div>
      )}
    </div>
  );
};

export default FlowerCatalog; 