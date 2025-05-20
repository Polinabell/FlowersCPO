import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { suppliersAPI } from '../api/api';
import { Supplier, Flower } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTruck, faMapMarkerAlt, faEnvelope, faArrowLeft, 
  faLeaf, faFilter, faSortAmountDown, faSortAmountUp 
} from '@fortawesome/free-solid-svg-icons';
import FlowerCard from '../components/FlowerCard';

type SortField = 'name' | 'price' | 'type' | 'country';
type SortOrder = 'asc' | 'desc';

const SupplierDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const { supplier, flowers } = await suppliersAPI.getSupplierFlowers(Number(id));
        setSupplier(supplier);
        setFlowers(flowers);
      } catch (err: any) {
        console.error('Error fetching supplier details:', err);
        setError('Не удалось загрузить информацию о поставщике');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSupplierDetails();
    }
  }, [id]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedFlowers = flowers
    .filter(flower => 
      flower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flower.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flower.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flower.country.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'country':
          comparison = a.country.localeCompare(b.country);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p>{error || 'Поставщик не найден'}</p>
          <Link
            to="/suppliers"
            className="mt-4 inline-flex items-center text-red-700 font-medium hover:text-red-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Вернуться к списку поставщиков
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-6">
        <Link
          to="/suppliers"
          className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Вернуться к списку поставщиков
        </Link>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-md p-6 mb-10">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-6 md:mb-0">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto md:mx-0">
              <FontAwesomeIcon icon={faTruck} className="text-secondary-600 text-4xl" />
            </div>
          </div>
          <div className="md:w-3/4">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">{supplier.fullName}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supplier.farmType && (
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faTruck} className="text-secondary-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Тип фермы</p>
                    <p className="text-gray-800">{supplier.farmType}</p>
                  </div>
                </div>
              )}

              {supplier.address && (
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Адрес</p>
                    <p className="text-gray-800">{supplier.address}</p>
                  </div>
                </div>
              )}

              {supplier.user?.email && (
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="text-gray-800">{supplier.user.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <FontAwesomeIcon icon={faLeaf} className="text-green-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">Количество цветов</p>
                  <p className="text-gray-800">{flowers.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div>
        <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-6">
          Цветы поставщика
        </h2>

        {}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div className="flex items-center mb-4 md:mb-0">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-700">Фильтр и сортировка</h3>
            </div>

            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Поиск по названию, типу, стране..."
                className="input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleSort('name')}
              className={`flex items-center px-3 py-1 rounded-full text-sm border ${
                sortField === 'name' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              Название
              {sortField === 'name' && (
                <FontAwesomeIcon 
                  icon={sortOrder === 'asc' ? faSortAmountUp : faSortAmountDown} 
                  className="ml-1"
                />
              )}
            </button>

            <button
              onClick={() => toggleSort('price')}
              className={`flex items-center px-3 py-1 rounded-full text-sm border ${
                sortField === 'price' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              Цена
              {sortField === 'price' && (
                <FontAwesomeIcon 
                  icon={sortOrder === 'asc' ? faSortAmountUp : faSortAmountDown} 
                  className="ml-1"
                />
              )}
            </button>

            <button
              onClick={() => toggleSort('type')}
              className={`flex items-center px-3 py-1 rounded-full text-sm border ${
                sortField === 'type' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              Тип
              {sortField === 'type' && (
                <FontAwesomeIcon 
                  icon={sortOrder === 'asc' ? faSortAmountUp : faSortAmountDown} 
                  className="ml-1"
                />
              )}
            </button>

            <button
              onClick={() => toggleSort('country')}
              className={`flex items-center px-3 py-1 rounded-full text-sm border ${
                sortField === 'country' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              Страна
              {sortField === 'country' && (
                <FontAwesomeIcon 
                  icon={sortOrder === 'asc' ? faSortAmountUp : faSortAmountDown} 
                  className="ml-1"
                />
              )}
            </button>
          </div>
        </div>

        {}
        {filteredAndSortedFlowers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedFlowers.map((flower) => (
              <FlowerCard key={flower.id} flower={flower} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FontAwesomeIcon icon={faLeaf} className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Цветы не найдены</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Попробуйте изменить параметры поиска' 
                : 'У этого поставщика пока нет цветов'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDetails; 