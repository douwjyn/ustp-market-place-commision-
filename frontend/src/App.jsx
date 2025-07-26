import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProvider from './context/UserProvider';
import AuthProvider from './context/AuthProvider';
import { CartProvider } from './context/CartContext';
import GuestLayout from './layouts/GuestLayout';
import DefaultLayout from './layouts/DefaultLayout';
import Login from './pages/login.jsx';
import Welcome from './pages/WelcomePage';
import CreateAccount from './pages/CreateAccount';
import ThankYouPage from './pages/ThankYouPage';
import Dashboard from './pages/Dashboard/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ProfilePage from './pages/ProfilePage';
import ProductInfoPage from './pages/ProductInfoPage';
import AddressPage from './pages/AddressPage';
import PurchaseHistory from './pages/PurchaseHistory';
import ShoppingCart from './pages/ShoppingCart';
import SellerRegistration from './pages/SellerRegistration';
import MyShopInfo from './pages/MyShopInfo';
import ProductDetails from './pages/ProductDetails';
import CheckoutPage from './pages/CheckoutPage';
import AdDashboard from './pages/AdDashboard';
import AddLogin from './pages/AddLogin';
import AdminAccountPage from './pages/AdminAccountPage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminShopViewPage from './pages/AdminShopViewPage';
import AllNotificationsPage from './pages/AllNotificationsPage';
import CreateAdminAccount from './pages/CreateAdminAccount';
import ShopInfoPage from './pages/ShopInfoPage';
import SellerReg from './pages/SellerReg';
import SellerAck from './pages/SellerAck';
import ShopInfo from './pages/ShopInfo.jsx';
import Navbar from './components/Navbar.jsx';
import './index.css';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProductEdit from './pages/ProductEdit.jsx';
import { Toaster } from 'react-hot-toast'
import VisitShop from './pages/VisitShop.jsx';
import Search from './pages/Search.jsx';
import { useEffect } from 'react';
import axios from 'axios'
import unloadHandler from './components/UnloadHandler.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
export default function App() {




  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <Toaster />
            <Routes>
              <Route path='/search' element={<Search />} />
              <Route path='/' index element={<Welcome />} />
              <Route path='/login' element={<Login />} />
              <Route path='/create-account' element={<CreateAccount />} />
              <Route path='/thank-you' element={<ThankYouPage />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password/:token' element={<ResetPassword />} />
              <Route path='/admin'>
                <Route path='login' element={<AddLogin />} />
                <Route
                  path='create-account'
                  element={<CreateAdminAccount />}
                />
              </Route>

              <Route path='/app' element={<DefaultLayout />}>
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='product/:id' element={<ProductDetails />} />
                <Route path='product-info/:id' element={<ProductEdit />} />
                <Route path='add-product' element={<ProductInfoPage />} />
                <Route path='checkout' element={<CheckoutPage />} />
                <Route path='cart' element={<ShoppingCart />} />
                <Route
                  path='notifications'
                  element={<AllNotificationsPage />}
                />

                <Route path='profile'>
                  <Route index element={<ProfilePage />} />
                  <Route path='address' element={<AddressPage />} />
                  <Route
                    path='purchase-history'
                    element={<PurchaseHistory />}
                  />
                </Route>

                <Route path='seller'>
                  <Route path='register' element={<SellerRegistration />} />
                  <Route path='registration' element={<SellerReg />} />
                  <Route path='acknowledgment' element={<SellerAck />} />
                </Route>

                <Route path='shop'>
                  <Route path='info' element={<ShopInfo />} />
                  <Route path='myshop' element={<MyShopInfo />} />
                  <Route path='info-page' element={<ShopInfoPage />} />
                  <Route path='visit/:id' element={<VisitShop />} />
                </Route>


              </Route>

              <Route path='admin' element={<AdminLayout />}>
                <Route path='dashboard' element={<AdDashboard />} />
                <Route path='account' element={<AdminAccountPage />} />
                <Route path='profile' element={<AdminProfilePage />} />
                <Route path='shop-view' element={<AdminShopViewPage />} />
                <Route path='all-notifications' element={<AllNotificationsPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
