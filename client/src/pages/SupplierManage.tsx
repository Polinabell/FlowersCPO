import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faStar, faSeedling,
  faCalendarAlt, faTag, faBoxOpen, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { flowersAPI } from '../api/flowers';
import { Flower as FlowerType } from '../types';
import { API_PATHS } from '../config';


interface LocalFlower extends FlowerType {
  image: string;
  rating: number;
  createdAt?: string;
}


interface ModalProps {
  formData: {
    name: string;
    price: number;
    inStock: number;
    type: string;
    image: string;
    rating: number;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const SupplierManage = () => {
  const { user } = useAuth();
  const [flowers, setFlowers] = useState<LocalFlower[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentFlower, setCurrentFlower] = useState<LocalFlower | null>(null);
  
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    inStock: 0,
    type: '',
    image: '',
    rating: 0
  });
  

  useEffect(() => {
    
    const fetchFlowers = async () => {
      setLoading(true);
      try {
        if (!user || !user.id) {
          console.error('Пользователь не авторизован');
          setLoading(false);
          return;
        }
        
        console.log('Данные пользователя:', user);
        
        
        if (!user.supplier || !user.supplier.id) {
          console.error('Пользователь не является поставщиком или нет данных поставщика');
          console.error('User role:', user.role);
          console.error('User data:', JSON.stringify(user));
          setLoading(false);
          return;
        }
        
        
        const supplierId = user.supplier.id;
        console.log(`Загрузка цветов для поставщика с ID: ${supplierId}`);
        console.log(`URL запроса: ${API_PATHS.FLOWERS.BY_SUPPLIER(supplierId)}`);
        
        const flowersData = await flowersAPI.getBySupplier(supplierId);
        console.log('Полученные данные о цветах:', flowersData);
        
        
        const formattedFlowers = flowersData.map(flower => ({
          ...flower,
          image: flower.imageUrl || '',
          rating: 4.0, 
          inStock: flower.inStock || 0
        }));
        
        setFlowers(formattedFlowers);
      } catch (error) {
        console.error('Ошибка при загрузке цветов:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlowers();
  }, [user]);
  
  const filteredFlowers = flowers.filter(flower => 
    flower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flower.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
   
    const activeElement = e.target as HTMLInputElement;
    const selectionStart = activeElement.selectionStart;
    const selectionEnd = activeElement.selectionEnd;
    const activeElementId = activeElement.id;
    
   
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'inStock' || name === 'rating' ? parseFloat(value) : value
    }));
    
   
    requestAnimationFrame(() => {
      const elementToFocus = document.getElementById(activeElementId);
      if (elementToFocus) {
        (elementToFocus as HTMLInputElement).focus();
        
   
        if (selectionStart !== null && selectionEnd !== null) {
          try {
            (elementToFocus as HTMLInputElement).setSelectionRange(selectionStart, selectionEnd);
          } catch (error) {
         
          }
        }
      }
    });
  }, []);
  
  
  const openAddModal = useCallback(() => {
    setFormData({
      name: '',
      price: 0,
      inStock: 0,
      type: '',
      image: '',
      rating: 0
    });
    
    
    setShowAddModal(true);
  }, []);
  
  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
  }, []);
  
  const openEditModal = useCallback((flower: LocalFlower) => {
    
    setCurrentFlower(flower);
    setFormData({
      name: flower.name,
      price: flower.price,
      inStock: flower.inStock,
      type: flower.type,
      image: flower.image,
      rating: flower.rating
    });
    
    setShowEditModal(true);
  }, []);
  
  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);
  
  const handleAddSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Необходимо авторизоваться');
        return;
      }
      
      
      const flowerData = {
        name: formData.name,
        price: formData.price,
        type: formData.type,
        season: 'Круглый год',
        country: 'Россия',
        variety: formData.type,
        imageUrl: formData.image,
        description: `Свежие ${formData.name.toLowerCase()} высокого качества`,
        inStock: formData.inStock
      };
      
      
      const newFlower = await flowersAPI.create(flowerData, token);
      
      
      const formattedFlower: LocalFlower = {
        ...newFlower,
        image: newFlower.imageUrl || '',
        rating: 4.0, 
        inStock: newFlower.inStock || 0
      };
      
      
      setFlowers(prev => [...prev, formattedFlower]);
      setShowAddModal(false);
      
    } catch (error) {
      console.error('Ошибка при создании цветка:', error);
      alert('Не удалось создать цветок. Пожалуйста, попробуйте снова.');
    }
  }, [formData]);
  
  const handleEditSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentFlower) return;
    
    try {
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Необходимо авторизоваться');
        return;
      }
      
      
      const flowerData = {
        name: formData.name,
        price: formData.price,
        type: formData.type,
        imageUrl: formData.image,
        inStock: formData.inStock
      };
      
      
      await flowersAPI.update(currentFlower.id, flowerData, token);
      
      
      setFlowers(prev => 
        prev.map(flower => 
          flower.id === currentFlower.id ? { 
            ...flower, 
            ...formData, 
            image: formData.image,
            imageUrl: formData.image 
          } : flower
        )
      );
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Ошибка при обновлении цветка:', error);
      alert('Не удалось обновить цветок. Пожалуйста, попробуйте снова.');
    }
  }, [currentFlower, formData]);
  
  const handleDelete = useCallback(async (id: number) => {
    
    if (window.confirm('Вы уверены, что хотите удалить этот цветок?')) {
      try {
        
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Необходимо авторизоваться');
          return;
        }
        
        
        await flowersAPI.delete(id, token);
        
        
        setFlowers(prev => prev.filter(flower => flower.id !== id));
      } catch (error) {
        console.error('Ошибка при удалении цветка:', error);
        alert('Не удалось удалить цветок. Пожалуйста, попробуйте снова.');
      }
    }
  }, []);
  
  
  const AddModalComponent = memo(({ formData, onInputChange, onSubmit, onCancel }: ModalProps) => {
  
    const formRef = useRef<HTMLFormElement>(null);
    const inputRefs = {
      name: useRef<HTMLInputElement>(null),
      type: useRef<HTMLInputElement>(null),
      price: useRef<HTMLInputElement>(null),
      inStock: useRef<HTMLInputElement>(null),
      rating: useRef<HTMLInputElement>(null),
      image: useRef<HTMLInputElement>(null)
    };

    
    useEffect(() => {
      if (inputRefs.name.current) {
        inputRefs.name.current.focus();
      } 
    }, []);
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Добавить новый цветок</h2>
          
          <form ref={formRef} onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Название</label>
                <input
                  ref={inputRefs.name}
                  type="text"
                  name="name"
                  id="add-name-input"
                  value={formData.name}
                  onChange={onInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Тип</label>
                <input
                  ref={inputRefs.type}
                  type="text"
                  name="type"
                  id="add-type-input"
                  value={formData.type}
                  onChange={onInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Цена (₽)</label>
                <input
                  ref={inputRefs.price}
                  type="number"
                  name="price"
                  id="add-price-input"
                  value={formData.price}
                  onChange={onInputChange}
                  min="0"
                  step="0.01"
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">В наличии</label>
                <input
                  ref={inputRefs.inStock}
                  type="number"
                  name="inStock"
                  id="add-inStock-input"
                  value={formData.inStock}
                  onChange={onInputChange}
                  min="0"
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Рейтинг</label>
                <input
                  ref={inputRefs.rating}
                  type="number"
                  name="rating"
                  id="add-rating-input"
                  value={formData.rating}
                  onChange={onInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">URL изображения</label>
                <input
                  ref={inputRefs.image}
                  type="url"
                  name="image"
                  id="add-image-input"
                  value={formData.image}
                  onChange={onInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-8 gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Добавить
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  });
  
  // Модальное окно редактирования - используем мемоизацию
  const EditModalComponent = memo(({ formData, onInputChange, onSubmit, onCancel }: ModalProps) => {
    // Используем useRef для сохранения фокуса
    const formRef = useRef<HTMLFormElement>(null);
    const inputRefs = {
      name: useRef<HTMLInputElement>(null),
      type: useRef<HTMLInputElement>(null),
      price: useRef<HTMLInputElement>(null),
      inStock: useRef<HTMLInputElement>(null),
      rating: useRef<HTMLInputElement>(null),
      image: useRef<HTMLInputElement>(null)
    };

    // Эффект, который выполняется только при первом рендере модального окна
    useEffect(() => {
      // Фокусируемся на первом поле при открытии
      if (inputRefs.name.current) {
        inputRefs.name.current.focus();
      }
    }, []);
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Редактировать цветок</h2>
          
          <form ref={formRef} onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Название</label>
                <input
                  ref={inputRefs.name}
                  type="text"
                  name="name"
                  id="edit-name-input"
                  value={formData.name}
                  onChange={onInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Тип</label>
                <input
                  ref={inputRefs.type}
                  type="text"
                  name="type"
                  id="edit-type-input"
                  value={formData.type}
                  onChange={onInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Цена (₽)</label>
                <input
                  ref={inputRefs.price}
                  type="number"
                  name="price"
                  id="edit-price-input"
                  value={formData.price}
                  onChange={onInputChange}
                  min="0"
                  step="0.01"
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">В наличии</label>
                <input
                  ref={inputRefs.inStock}
                  type="number"
                  name="inStock"
                  id="edit-inStock-input"
                  value={formData.inStock}
                  onChange={onInputChange}
                  min="0"
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Рейтинг</label>
                <input
                  ref={inputRefs.rating}
                  type="number"
                  name="rating"
                  id="edit-rating-input"
                  value={formData.rating}
                  onChange={onInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">URL изображения</label>
                <input
                  ref={inputRefs.image}
                  type="url"
                  name="image"
                  id="edit-image-input"
                  value={formData.image}
                  onChange={onInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-8 gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  });
  
  // Отображение загрузки
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="section-title text-center mb-12">Управление товарами</h1>
      
      {/* Шапка с поиском и кнопкой добавления */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск по названию или типу..."
                className="input-field pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <button
            onClick={openAddModal}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Добавить цветок</span>
          </button>
        </div>
      </div>
      
      {/* Список цветов */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Изображение</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Название</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Тип</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Цена</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">В наличии</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Рейтинг</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Дата</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFlowers.length > 0 ? (
                filteredFlowers.map((flower) => (
                  <tr key={flower.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="w-16 h-16 rounded-md overflow-hidden">
                        <img 
                          src={flower.image || flower.imageUrl} 
                          alt={flower.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">
                      <Link to={`/flowers/${flower.id}`} className="text-primary-600 hover:text-primary-700">
                        {flower.name}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1">
                        <FontAwesomeIcon icon={faSeedling} className="text-green-500" />
                        {flower.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1">
                        <FontAwesomeIcon icon={faTag} className="text-blue-500" />
                        {flower.price} ₽
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1">
                        <FontAwesomeIcon icon={faBoxOpen} className="text-orange-500" />
                        {flower.inStock}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                        {flower.rating}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
                        {flower.createdAt}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(flower)}
                          className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDelete(flower.id)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 px-6 text-center text-gray-500">
                    Цветы не найдены. Попробуйте изменить параметры поиска или добавьте новый цветок.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Модальные окна */}
      {showAddModal && (
        <AddModalComponent 
          formData={formData} 
          onInputChange={handleInputChange}
          onSubmit={handleAddSubmit}
          onCancel={closeAddModal}
        />
      )}
      
      {showEditModal && (
        <EditModalComponent 
          formData={formData} 
          onInputChange={handleInputChange}
          onSubmit={handleEditSubmit}
          onCancel={closeEditModal}
        />
      )}
    </div>
  );
};

export default SupplierManage; 