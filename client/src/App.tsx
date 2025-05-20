import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FlowersList from './pages/FlowersList';
import FlowerDetails from './pages/FlowerDetails';
import SuppliersList from './pages/SuppliersList';
import SupplierDetails from './pages/SupplierDetails';
import SellersList from './pages/SellersList';
import SellerDetails from './pages/SellerDetails';
import NewRequest from './pages/NewRequest';
import Profile from './pages/Profile';
import SupplierManage from './pages/SupplierManage';
import SellerManage from './pages/SellerManage';
import Analytics from './pages/Analytics';
import RequestsList from './pages/RequestsList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/flowers" element={<FlowersList />} />
              <Route path="/flowers/:id" element={<FlowerDetails />} />
              <Route path="/suppliers" element={<SuppliersList />} />
              <Route path="/suppliers/:id" element={<SupplierDetails />} />
              <Route path="/sellers" element={<SellersList />} />
              <Route path="/sellers/:id" element={<SellerDetails />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/new-request" element={<NewRequest />} />
              
              {/* Защищенные маршруты */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              <Route element={<ProtectedRoute requiredRoles={['supplier']} />}>
                <Route path="/supplier/manage" element={<SupplierManage />} />
              </Route>
              
              <Route element={<ProtectedRoute requiredRoles={['seller']} />}>
                <Route path="/seller/manage" element={<SellerManage />} />
              </Route>
              
              <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
                <Route path="/admin/requests" element={<RequestsList />} />
              </Route>
              
              {/* Маршрут для неизвестных путей */}
              <Route path="*" element={
                <div className="container mx-auto px-6 py-12 text-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - Страница не найдена</h1>
                  <p className="text-lg text-gray-600 mb-8">Запрашиваемая страница не существует.</p>
                </div>
              } />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-serif font-bold mb-2">Цветы</h3>
                  <p className="text-gray-400">Платформа для работы с цветами, поставщиками и продавцами</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-gray-400">&copy; {new Date().getFullYear()} Все права защищены</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
