import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faShoppingCart, faCalendarAlt, 
  faMoneyBillWave, faSearch, faFilter, faTag, faUser
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

interface Sale {
  id: number;
  date: string;
  customerName: string;
  flowerName: string;
  quantity: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'online';
  status: 'completed' | 'cancelled' | 'processing';
}

interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  populatFlower: string;
}

const salesAPI = {
  getSalesSummary: async (): Promise<SalesSummary> => {
    return {
      totalSales: 158,
      totalRevenue: 82500,
      averageOrderValue: 522,
      populatFlower: 'Красные розы'
    };
  },
  
  getSalesHistory: async (): Promise<Sale[]> => {
    return [
      {
        id: 1,
        date: '2023-06-10T15:30:00',
        customerName: 'Иванов Иван',
        flowerName: 'Красные розы',
        quantity: 5,
        total: 1250,
        paymentMethod: 'card',
        status: 'completed'
      },
      {
        id: 2,
        date: '2023-06-09T11:20:00',
        customerName: 'Петрова Анна',
        flowerName: 'Белые лилии',
        quantity: 3,
        total: 1050,
        paymentMethod: 'cash',
        status: 'completed'
      },
      {
        id: 3,
        date: '2023-06-08T14:45:00',
        customerName: 'Сидоров Петр',
        flowerName: 'Желтые тюльпаны',
        quantity: 10,
        total: 1800,
        paymentMethod: 'online',
        status: 'completed'
      },
      {
        id: 4,
        date: '2023-06-08T09:15:00',
        customerName: 'Козлова Мария',
        flowerName: 'Орхидеи',
        quantity: 2,
        total: 900,
        paymentMethod: 'card',
        status: 'completed'
      },
      {
        id: 5,
        date: '2023-06-07T16:30:00',
        customerName: 'Смирнов Алексей',
        flowerName: 'Ромашки',
        quantity: 15,
        total: 750,
        paymentMethod: 'cash',
        status: 'completed'
      },
      {
        id: 6,
        date: '2023-06-07T10:00:00',
        customerName: 'ООО "Праздник"',
        flowerName: 'Розовые розы',
        quantity: 50,
        total: 12500,
        paymentMethod: 'online',
        status: 'completed'
      },
      {
        id: 7,
        date: '2023-06-06T13:40:00',
        customerName: 'Рестора "Лето"',
        flowerName: 'Красные розы',
        quantity: 20,
        total: 5000,
        paymentMethod: 'card',
        status: 'completed'
      }
    ];
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }) + ' • ' + date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Выполнен';
    case 'processing':
      return 'В обработке';
    case 'cancelled':
      return 'Отменен';
    default:
      return status;
  }
};

const getPaymentMethodText = (method: string) => {
  switch (method) {
    case 'cash':
      return 'Наличные';
    case 'card':
      return 'Карта';
    case 'online':
      return 'Онлайн';
    default:
      return method;
  }
};

const SellerManage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [summaryData, salesData] = await Promise.all([
          salesAPI.getSalesSummary(),
          salesAPI.getSalesHistory()
        ]);
        
        setSummary(summaryData);
        setSales(salesData);
        setFilteredSales(salesData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    let result = sales;
    
    if (statusFilter !== 'all') {
      result = result.filter(sale => sale.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(sale => 
        sale.customerName.toLowerCase().includes(term) ||
        sale.flowerName.toLowerCase().includes(term)
      );
    }
    
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      result = result.filter(sale => new Date(sale.date) >= startDate);
    }
    
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59);
      result = result.filter(sale => new Date(sale.date) <= endDate);
    }
    
    setFilteredSales(result);
  }, [sales, searchTerm, statusFilter, dateRange]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="section-title text-center mb-12">Управление продажами</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Всего продаж</h3>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faShoppingCart} className="text-primary-500 text-xl" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{summary?.totalSales}</p>
          <p className="text-sm text-gray-500 mt-2">За все время</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Общая выручка</h3>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 text-xl" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{summary?.totalRevenue.toLocaleString()} ₽</p>
          <p className="text-sm text-gray-500 mt-2">За все время</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Средний чек</h3>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faTag} className="text-blue-500 text-xl" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{summary?.averageOrderValue.toLocaleString()} ₽</p>
          <p className="text-sm text-gray-500 mt-2">За все время</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Популярный товар</h3>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="text-yellow-500 text-xl" />
            </div>
          </div>
          <p className="text-xl font-bold text-gray-800">{summary?.populatFlower}</p>
          <p className="text-sm text-gray-500 mt-2">По количеству продаж</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Фильтры продаж</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск по клиенту или товару"
              className="input-field pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div>
            <select
              className="input-field bg-white"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="all">Все статусы</option>
              <option value="completed">Выполненные</option>
              <option value="processing">В обработке</option>
              <option value="cancelled">Отмененные</option>
            </select>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="start"
                  placeholder="С"
                  className="input-field pl-10"
                  value={dateRange.start}
                  onChange={handleDateChange}
                />
              </div>
              <span className="text-gray-500">—</span>
              <input
                type="date"
                name="end"
                placeholder="По"
                className="input-field flex-1"
                value={dateRange.end}
                onChange={handleDateChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="btn-secondary flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFilter} />
              <span>Сбросить фильтры</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Дата</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Клиент</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Товар</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Кол-во</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Сумма</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Оплата</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">#{sale.id}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                        {formatDate(sale.date)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        {sale.customerName}
                      </span>
                    </td>
                    <td className="py-4 px-6">{sale.flowerName}</td>
                    <td className="py-4 px-6">{sale.quantity} шт.</td>
                    <td className="py-4 px-6 font-medium">{sale.total.toLocaleString()} ₽</td>
                    <td className="py-4 px-6">{getPaymentMethodText(sale.paymentMethod)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(sale.status)}`}>
                        {getStatusText(sale.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 px-6 text-center text-gray-500">
                    Продажи не найдены. Попробуйте изменить параметры фильтрации.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerManage; 