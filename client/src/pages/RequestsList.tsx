import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestsAPI } from '../api/requests';
import { Request } from '../types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function RequestsList() {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'processing' | 'completed' | 'cancelled'>('all');
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const fetchRequests = useCallback(async () => {
    if (!token) {
      setDebugInfo('Нет токена авторизации');
      setError('Требуется авторизация');
      setLoading(false);
      setHasAttemptedFetch(true);
      return;
    }

    try {
      setLoading(true);
      setDebugInfo('Начало запроса данных...');
      
      const data = await requestsAPI.getAll(token);
      setDebugInfo(prev => `${prev}\nДанные получены: ${JSON.stringify(data).substring(0, 100)}...`);
      console.log('Полученные данные запросов:', data);

      // Обработка различных форматов ответа
      let requestsArray: Request[] = [];
      
      if (Array.isArray(data)) {
        requestsArray = data;
        setDebugInfo(prev => `${prev}\nДанные в формате массива`);
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.requests)) {
          requestsArray = data.requests;
          setDebugInfo(prev => `${prev}\nДанные в формате {requests: []}`);
        } else if (Array.isArray(data.data)) {
          requestsArray = data.data;
          setDebugInfo(prev => `${prev}\nДанные в формате {data: []}`);
        } else if (data.success === false) {
          throw new Error(data.message || 'Ошибка при получении данных');
        }
      }

      setDebugInfo(prev => `${prev}\nОбработано ${requestsArray.length} запросов`);
      console.log('Обработанный массив запросов:', requestsArray);
      
      setRequests(requestsArray);
      setHasAttemptedFetch(true);
      setError(null);
    } catch (error: any) {
      console.error('Failed to fetch requests:', error);
      const errorMessage = error.message || 'Не удалось загрузить запросы. Пожалуйста, попробуйте позже.';
      setDebugInfo(prev => `${prev}\nОшибка: ${errorMessage}`);
      setError(errorMessage);
      setRequests([]);
      setHasAttemptedFetch(true);
      toast.error('Не удалось загрузить запросы');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (id: number) => {
    try {
      await requestsAPI.approve(id, token || '');
      toast.success('Запрос принят в обработку');
      fetchRequests();
    } catch (error) {
      console.error('Failed to approve request:', error);
      toast.error('Не удалось принять запрос');
    }
  };

  const handleReject = async (id: number) => {
    try {
      const reason = prompt('Укажите причину отклонения запроса:');
      if (reason) {
        await requestsAPI.reject(id, reason, token || '');
        toast.success('Запрос отклонен');
        fetchRequests();
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast.error('Не удалось отклонить запрос');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот запрос?')) {
      try {
        await requestsAPI.delete(id, token || '');
        toast.success('Запрос удален');
        setRequests(requests.filter(request => request.id !== id));
      } catch (error) {
        console.error('Failed to delete request:', error);
        toast.error('Не удалось удалить запрос');
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NEW':
        return 'Новый';
      case 'PROCESSING':
        return 'В обработке';
      case 'COMPLETED':
        return 'Выполнен';
      case 'CANCELLED':
        return 'Отменен';
      default:
        return status;
    }
  };


  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(request => request.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Запросы</h1>
        {user?.role?.toLowerCase() === 'user' && (
          <Link
            to="/new-request"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Создать запрос
          </Link>
        )}
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'all' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Новые
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'processing' ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            В обработке
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Выполненные
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded transition-colors ${
              filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Отмененные
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <FontAwesomeIcon icon={faSpinner} className="text-primary-500 text-3xl animate-spin" />
          <span className="ml-3 text-gray-600">Загрузка запросов...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-3 mt-0.5" />
          <div>
            <p className="font-medium">{error}</p>
            <button
              onClick={fetchRequests}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
            >
              Попробовать снова
            </button>
            {debugInfo && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer">Отладочная информация</summary>
                <pre className="mt-1 p-2 bg-gray-100 rounded whitespace-pre-wrap">{debugInfo}</pre>
              </details>
            )}
          </div>
        </div>
      )}

      {!loading && !error && filteredRequests.length === 0 && hasAttemptedFetch && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Запросы не найдены</p>
          {filter !== 'all' && (
            <p className="text-gray-400 mt-2">
              Попробуйте изменить параметры фильтра или
              <button 
                onClick={() => setFilter('all')}
                className="text-blue-500 hover:text-blue-700 ml-1"
              >
                посмотреть все запросы
              </button>
            </p>
          )}
          {debugInfo && (
            <details className="mt-4 text-left p-2 border border-gray-200 rounded mx-auto max-w-lg">
              <summary className="cursor-pointer text-gray-500">Отладочная информация</summary>
              <pre className="mt-1 p-2 bg-gray-100 rounded whitespace-pre-wrap text-xs">{debugInfo}</pre>
            </details>
          )}
        </div>
      )}

      {!loading && filteredRequests.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white shadow-md rounded-lg p-6 transition-transform hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{request.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
              </div>

              <p className="text-gray-700 mb-4 whitespace-pre-line">{request.description}</p>

              {(request.flowerType || request.quantity) && (
                <div className="mb-4">
                  <h3 className="font-medium mb-1">Детали заказа:</h3>
                  {request.flowerType && (
                    <p className="text-gray-700">
                      <span className="font-medium">Тип цветов:</span> {request.flowerType}
                    </p>
                  )}
                  {request.quantity && (
                    <p className="text-gray-700">
                      <span className="font-medium">Количество:</span> {request.quantity}
                    </p>
                  )}
                  {request.deadline && (
                    <p className="text-gray-700">
                      <span className="font-medium">Срок:</span>{' '}
                      {new Date(request.deadline).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              )}

              {request.contactPhone || request.contactEmail ? (
                <div className="mb-4">
                  <h3 className="font-medium mb-1">Контактная информация:</h3>
                  {request.contactPhone && (
                    <p className="text-gray-700">
                      <span className="font-medium">Телефон:</span> {request.contactPhone}
                    </p>
                  )}
                  {request.contactEmail && (
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {request.contactEmail}
                    </p>
                  )}
                </div>
              ) : null}

              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                {user?.role?.toLowerCase() === 'supplier' && request.status.toUpperCase() === 'NEW' && (
                  <>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Принять
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Отклонить
                    </button>
                  </>
                )}
                
                {user?.role?.toLowerCase() === 'supplier' && request.status.toUpperCase() === 'PROCESSING' && (
                  <button
                    onClick={() => {
                      try {
                        requestsAPI.complete(request.id, token || '');
                        toast.success('Запрос помечен как выполненный');
                        fetchRequests();
                      } catch (error) {
                        toast.error('Ошибка при изменении статуса запроса');
                      }
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Завершить
                  </button>
                )}
                
                {(user?.role?.toLowerCase() === 'admin' || 
                  (user?.role?.toLowerCase() === 'user' && request.userId === user?.id)) && (
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 