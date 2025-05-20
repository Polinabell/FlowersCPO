import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faTruck, faStore, faSearch } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-100 to-secondary-100 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#C879C9" d="M47.5,-57.2C60.9,-46.8,70.2,-31.5,74.3,-14.3C78.4,2.8,77.3,21.8,68.4,36.2C59.5,50.6,42.9,60.4,25.5,65.9C8.2,71.4,-9.9,72.6,-25.3,66.8C-40.8,61.1,-53.6,48.4,-61.5,33.3C-69.5,18.2,-72.5,0.7,-68.3,-14.2C-64.1,-29,-52.7,-41.2,-39.8,-51.3C-26.9,-61.4,-13.5,-69.3,1.6,-71.3C16.7,-73.2,33.1,-68.7,47.5,-57.2Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="absolute left-0 bottom-0 w-1/2 h-full opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#84CD96" d="M42.8,-57.2C55.9,-51.3,67.2,-39.8,71,-26.2C74.8,-12.6,71.1,3.1,65.4,17C59.7,31,52,43.2,41,50.4C30,57.7,15,60,0.4,59.5C-14.3,59,-28.5,55.7,-40.8,48.2C-53.1,40.7,-63.5,28.9,-68.3,14.6C-73.1,0.3,-72.4,-16.6,-65.2,-29.6C-58,-42.5,-44.3,-51.7,-30.6,-57.3C-16.9,-62.9,-3.2,-65,10.4,-63.8C24,-62.6,47.9,-58.2,42.8,-57.2Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-6">
                Платформа <span className="text-primary-600">«Цветы»</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Соединяем поставщиков, продавцов и любителей цветов в одной системе. Управляйте информацией о цветах, поставщиках и продавцах с удобством.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/flowers" className="btn-primary">
                  Исследовать цветы
                </Link>
                <Link to="/register" className="bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                  Регистрация
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg" 
                alt="Цветы" 
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-center">Возможности платформы</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            <div className="card text-center border border-gray-200 hover:border-primary-400 transform hover:-translate-y-2 transition-all duration-300">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faSeedling} className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Каталог цветов</h3>
              <p className="text-gray-600">
                Полная информация о различных видах цветов, их сезонах, странах происхождения и сортах.
              </p>
            </div>
            
            <div className="card text-center border border-gray-200 hover:border-primary-400 transform hover:-translate-y-2 transition-all duration-300">
              <div className="mx-auto w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faTruck} className="text-secondary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Поставщики</h3>
              <p className="text-gray-600">
                Информация о поставщиках цветов, управление ассортиментом и отслеживание продаж.
              </p>
            </div>
            
            <div className="card text-center border border-gray-200 hover:border-primary-400 transform hover:-translate-y-2 transition-all duration-300">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faStore} className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Продавцы</h3>
              <p className="text-gray-600">
                Управление продажами, связь с поставщиками и формирование ассортимента.
              </p>
            </div>
            
            <div className="card text-center border border-gray-200 hover:border-primary-400 transform hover:-translate-y-2 transition-all duration-300">
              <div className="mx-auto w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faSearch} className="text-secondary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Поиск и фильтрация</h3>
              <p className="text-gray-600">
                Удобные инструменты поиска по различным параметрам: сезон, страна, сорт и многое другое.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Присоединяйтесь к нашей цветочной платформе</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Станьте частью растущего сообщества поставщиков и продавцов цветов или просто исследуйте прекрасный мир цветов
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-full transition-colors duration-300">
              Зарегистрироваться
            </Link>
            <Link to="/flowers" className="bg-transparent hover:bg-white/10 border border-white text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300">
              Смотреть каталог
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 