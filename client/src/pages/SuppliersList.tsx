import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { suppliersAPI } from '../api/api';
import { Supplier } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faMapMarkerAlt, faEnvelope, faSearch } from '@fortawesome/free-solid-svg-icons';

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { suppliers } = await suppliersAPI.getAllSuppliers();
      setSuppliers(suppliers);
    } catch (err: any) {
      console.error('Error fetching suppliers:', err);
      setError('Не удалось загрузить данные о поставщиках');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.farmType && supplier.farmType.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.address && supplier.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.user?.email && supplier.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
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
            onClick={fetchSuppliers}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="section-title text-center mb-12">Поставщики цветов</h1>

      {}
      <div className="bg-white rounded-lg shadow-md p-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Поиск поставщиков</h2>

          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск по имени, ферме или адресу"
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-700">Найдено поставщиков: {filteredSuppliers.length}</h3>
        </div>

        {filteredSuppliers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Link 
                key={supplier.id} 
                to={`/suppliers/${supplier.id}`}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faTruck} className="text-secondary-600 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{supplier.fullName}</h3>
                  </div>

                  {supplier.farmType && (
                    <div className="flex items-start mb-2">
                      <FontAwesomeIcon icon={faTruck} className="text-secondary-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Тип фермы</p>
                        <p className="text-gray-800">{supplier.farmType}</p>
                      </div>
                    </div>
                  )}

                  {supplier.address && (
                    <div className="flex items-start mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Адрес</p>
                        <p className="text-gray-800">{supplier.address}</p>
                      </div>
                    </div>
                  )}

                  {supplier.user?.email && (
                    <div className="flex items-start mb-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-primary-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Email</p>
                        <p className="text-gray-800">{supplier.user.email}</p>
                      </div>
                    </div>
                  )}

                  <button className="w-full mt-4 text-center py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-md transition-colors duration-300">
                    Посмотреть цветы
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FontAwesomeIcon icon={faTruck} className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Поставщики не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuppliersList; 