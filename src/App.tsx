import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./hooks/context/AuthContext";
import { CartProvider } from "./hooks/context/CartContext";

//admin
//import AdminPage from "./modules/admin/ui/AdminPage";

//auth
import ForgotPasswordPage from "./modules/auth/ui/ForgotPasswordPage";
import LoginRegisterPage from "./modules/auth/ui/LoginRegisterPage";
import ResetPasswordPage from "./modules/auth/ui/ResetPasswordPage";

//Search product
import SearchedProductPage from "./modules/search/ui/SearchedProductPage";
import SearchedStores from "./modules/search/ui/SearchedStores";

//home
import HomePage from "./modules/home/ui/HomePage";

//seller
import BeSellerPage from "./modules/seller/ui/BeSellerPage";
import CrudProductPage from "./modules/seller/ui/CrudProductPage";
import ProductPage from "./modules/seller/ui/ProductPage";
import RegisterSellerPage from "./modules/seller/ui/RegisterSellerPage";
import SellerPage from "./modules/seller/ui/SellerPage";

//users
import ProfilePage from "./modules/users/ui/ProfilePage";
import ShoppingCartPage from "./modules/users/ui/ShoppingCartPage";
import { AlertProvider } from "./hooks/context/AlertContext";
import AboutUsPage from "./modules/home/ui/AboutUsPage";
import HelpPage from "./modules/home/ui/HelpPage";
import WishListPage from "./modules/users/ui/WishListPage";
import NotFound from "./components/navigation/NotFound";
import { NotificationProvider } from "./hooks/context/NotificationContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <CartProvider>
            <NotificationProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/loginRegister" element={<LoginRegisterPage />} />
                <Route
                  path="/registerSeller"
                  element={<RegisterSellerPage />}
                />
                <Route path="/beSellerPage" element={<BeSellerPage />} />
                <Route path="/store/:id" element={<SellerPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/shoppingCart" element={<ShoppingCartPage />} />
                <Route path="/wishlist" element={<WishListPage />} />
                <Route
                  path="/wishlist/public/:slug"
                  element={<WishListPage />}
                />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/resetPassword" element={<ResetPasswordPage />} />
                <Route
                  path="/forgotPassword"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/crudProduct" element={<CrudProductPage />} />
                <Route
                  path="/search/:categoryId"
                  element={<SearchedProductPage />}
                />
                <Route path="/search" element={<SearchedProductPage />} />
                <Route path="/search/stores" element={<SearchedStores />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/editProduct/:id" element={<CrudProductPage />} />
                <Route path="/store/:id/search" element={<SellerPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </CartProvider>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
