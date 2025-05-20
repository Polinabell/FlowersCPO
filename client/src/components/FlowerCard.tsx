import { Link } from 'react-router-dom';
import { Flower } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faMapMarkerAlt, faTag, faSun, faRubleSign } from '@fortawesome/free-solid-svg-icons';

interface FlowerCardProps {
  flower: Flower;
  onDelete?: (id: number) => void;
  onAddToSeller?: (id: number) => void;
  onRemoveFromSeller?: (id: number) => void;
  showActions?: boolean;
  isSeller?: boolean;
  isSupplier?: boolean;
}

const defaultImage = 'https://images.pexels.com/photos/1179074/pexels-photo-1179074.jpeg';

const FlowerCard = ({
  flower,
  onDelete,
  onAddToSeller,
  onRemoveFromSeller,
  showActions = false,
  isSeller = false,
  isSupplier = false,
}: FlowerCardProps) => {
  const {
    id,
    name,
    type,
    season,
    country,
    variety,
    price,
    imageUrl,
    supplier,
  } = flower;

  return (
    <div className="card group hover:scale-[1.02] transition-all duration-300">
      <div className="relative overflow-hidden rounded-lg mb-4 h-48">
        <img
          src={imageUrl || defaultImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 text-sm font-bold rounded-bl-lg">
          <span className="flex items-center">
            <FontAwesomeIcon icon={faRubleSign} className="mr-1" /> {price}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">{name}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <FontAwesomeIcon icon={faLeaf} className="mr-2 text-secondary-500" />
          <span>{type}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FontAwesomeIcon icon={faSun} className="mr-2 text-yellow-500" />
          <span>{season}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
          <span>{country}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-500" />
          <span>{variety}</span>
        </div>
      </div>

      {supplier && (
        <p className="text-sm text-gray-500 mb-4">
          Поставщик: <Link to={`/suppliers/${supplier.id}`} className="text-primary-600 hover:underline">{supplier.fullName || 'Информация отсутствует'}</Link>
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={`/flowers/${id}`}
          className="btn-primary flex-1"
        >
          Подробнее
        </Link>
        
        {showActions && (
          <>
            {isSupplier && onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
              >
                Удалить
              </button>
            )}
            
            {isSeller && (
              <>
                {onAddToSeller && (
                  <button
                    onClick={() => onAddToSeller(id)}
                    className="btn-secondary flex-1"
                  >
                    Добавить в продажу
                  </button>
                )}
                
                {onRemoveFromSeller && (
                  <button
                    onClick={() => onRemoveFromSeller(id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Убрать из продажи
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FlowerCard; 