import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiChevronUp, FiFilter, FiMapPin, FiStar, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { sellersAPI } from '../api/sellers';
import { Link } from 'react-router-dom';
import { Seller } from '../types';

const SellersList: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Seller | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [specializationFilter, setSpecializationFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setIsLoading(true);
        const data = await sellersAPI.getAll();
        console.log('Полученные данные продавцов:', data);
        
        
        let sellersArray: Seller[] = [];
        if (Array.isArray(data)) {
          sellersArray = data;
        } else if (data && typeof data === 'object') {
          sellersArray = Array.isArray(data.sellers) ? data.sellers : [];
        }
        
        console.log('Обработанный массив продавцов:', sellersArray);
        setSellers(sellersArray);
        setFilteredSellers(sellersArray);
        setIsLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные о продавцах. Попробуйте позже.');
        setIsLoading(false);
      }
    };

    fetchSellers();
  }, []);

  
  const specializations = React.useMemo(() => {
    if (!Array.isArray(sellers) || sellers.length === 0) return [];
    
    return [...new Set(sellers
      .filter(seller => seller && seller.specialization)
      .flatMap(seller => 
        (seller.specialization || '').split(',').map(s => s.trim())
      ))].sort();
  }, [sellers]);

  
  const cities = React.useMemo(() => {
    if (!Array.isArray(sellers) || sellers.length === 0) return [];
    
    return [...new Set(sellers
      .filter(seller => seller && seller.address)
      .map(seller => {
        const addressParts = seller.address.split(',');
        if (addressParts.length > 0) {
          return addressParts[0].trim();
        }
        return '';
      })
      .filter(city => city !== '')
    )].sort();
  }, [sellers]);

  
  useEffect(() => {
    if (!Array.isArray(sellers)) {
      console.error('sellers is not an array:', sellers);
      setFilteredSellers([]);
      return;
    }

    let result = [...sellers];

    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        seller =>
          (seller.shopName && seller.shopName.toLowerCase().includes(searchLower)) ||
          (seller.user?.email && seller.user.email.toLowerCase().includes(searchLower)) ||
          (seller.fullName && seller.fullName.toLowerCase().includes(searchLower)) ||
          (seller.address && seller.address.toLowerCase().includes(searchLower)) ||
          (seller.specialization && seller.specialization.toLowerCase().includes(searchLower))
      );
    }

    
    if (specializationFilter) {
      result = result.filter(seller => 
        seller.specialization && seller.specialization.toLowerCase().includes(specializationFilter.toLowerCase())
      );
    }
    
    
    if (cityFilter) {
      result = result.filter(seller => 
        seller.address && seller.address.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }
    
    
    if (ratingFilter !== null) {
      result = result.filter(seller => 
        seller.rating && seller.rating >= ratingFilter
      );
    }

    
    if (sortField) {
      result.sort((a, b) => {
        
        const aValue = a[sortField] as string | number || '';
        const bValue = b[sortField] as string | number || '';
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        } else {
          return sortDirection === 'asc' 
            ? (aValue as number) - (bValue as number) 
            : (bValue as number) - (aValue as number);
        }
      });
    }

    setFilteredSellers(result);
  }, [sellers, searchTerm, sortField, sortDirection, specializationFilter, cityFilter, ratingFilter]);

  
  const resetFilters = () => {
    setSearchTerm('');
    setSpecializationFilter('');
    setCityFilter('');
    setRatingFilter(null);
    setSortField(null);
    setSortDirection('asc');
  };

  
  const handleSort = (field: keyof Seller) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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

  
  const renderRatingStars = (rating: number) => {
    if (!rating) return 'Нет оценок';
    
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

  
  const hasActiveFilters = specializationFilter || cityFilter || ratingFilter !== null || searchTerm;

  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Продавцы цветов</h1>
      
      {/* Search bar */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out sm:text-sm"
              placeholder="Поиск по названию, имени, адресу или специализации..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <FiFilter className="mr-2" />
            <span>Фильтры</span>
            {hasActiveFilters && <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full"></span>}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
        
        {/* Advanced filters */}
        {isFiltersOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiTag className="mr-1" />
                Специализация
              </label>
            <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
            >
              <option value="">Все специализации</option>
                {specializations.map((specialization) => (
                  <option key={specialization} value={specialization}>{specialization}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiMapPin className="mr-1" />
                Город
              </label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="">Все города</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiStar className="mr-1" />
                Рейтинг от
              </label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={ratingFilter === null ? '' : ratingFilter.toString()}
                onChange={(e) => setRatingFilter(e.target.value ? parseFloat(e.target.value) : null)}
              >
                <option value="">Любой рейтинг</option>
                <option value="3">От 3 и выше</option>
                <option value="3.5">От 3.5 и выше</option>
                <option value="4">От 4 и выше</option>
                <option value="4.5">От 4.5 и выше</option>
              </select>
            </div>
        </div>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {searchTerm && (
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span>Поиск: {searchTerm}</span>
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
              >
                &times;
              </button>
            </div>
          )}
          
          {specializationFilter && (
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span>Специализация: {specializationFilter}</span>
              <button 
                onClick={() => setSpecializationFilter('')}
                className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
              >
                &times;
              </button>
            </div>
          )}
          
          {cityFilter && (
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span>Город: {cityFilter}</span>
              <button 
                onClick={() => setCityFilter('')}
                className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
              >
                &times;
              </button>
            </div>
          )}
          
          {ratingFilter !== null && (
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span>Рейтинг от: {ratingFilter}</span>
              <button 
                onClick={() => setRatingFilter(null)}
                className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Sellers table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('shopName')}
                >
                  <div className="flex items-center">
                    Название
                    {sortField === 'shopName' && (
                      sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('address')}
            >
                  <div className="flex items-center">
                    Контакты
                    {sortField === 'address' && (
                sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
              )}
            </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('specialization')}
            >
                  <div className="flex items-center">
              Специализация
              {sortField === 'specialization' && (
                sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
              )}
            </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('rating')}
            >
                  <div className="flex items-center">
              Рейтинг
              {sortField === 'rating' && (
                sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
              )}
            </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                  onClick={() => handleSort('createdAt')}
            >
                  <div className="flex items-center">
                    Дата регистрации
                    {sortField === 'createdAt' && (
                sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
              )}
            </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <motion.tr 
                key={seller.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{seller.shopName}</div>
                          <div className="text-sm text-gray-500">{seller.fullName}</div>
                    </div>
                  </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{seller.address}</div>
                      <div className="text-sm text-gray-500">{seller.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {seller.specialization ? 
                          seller.specialization.split(',').map((spec, index) => (
                            <span key={index} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              {spec.trim()}
                            </span>
                          )) : 
                          <span className="text-gray-500">Не указана</span>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderRatingStars(seller.rating || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {formatDate(seller.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/sellers/${seller.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Детали
                      </Link>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <p>Продавцы не найдены.</p>
                    {hasActiveFilters && (
                      <button 
                        onClick={resetFilters}
                        className="mt-2 text-purple-600 hover:text-purple-800"
                      >
                        Сбросить все фильтры
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
                  </div>
                </div>

      {/* Total count */}
      <div className="mt-4 text-sm text-gray-500">
        Всего найдено: {filteredSellers.length} {filteredSellers.length === 1 ? 'продавец' : 
          filteredSellers.length > 1 && filteredSellers.length < 5 ? 'продавца' : 'продавцов'}
        </div>
    </div>
  );
};

export default SellersList; 