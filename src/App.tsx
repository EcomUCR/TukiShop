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
import SearchPage from "./modules/search/ui/SearchPage";
import StoresListPage from "./modules/search/ui/StoresListPage";

//home
import HomePage from "./modules/home/ui/HomePage";

//seller
import BeSellerPage from "./modules/home/ui/BeSellerPage";
import StoreProductCRUDPage from "./modules/store/ui/StoreProductCRUDPage";
import ProductPage from "./modules/store/ui/ProductPage";
import RegisterSellerPage from "./modules/store/ui/RegisterSellerPage";
import StorePage from "./modules/store/ui/StorePage";

//users
import ProfilePage from "./modules/users/ui/ProfilePage";
import ShoppingCartPage from "./modules/users/ui/ShoppingCartPage";
import { AlertProvider } from "./hooks/context/AlertContext";
import AboutUsPage from "./modules/home/ui/AboutUsPage";
import HelpPage from "./modules/home/ui/HelpPage";
import WishListPage from "./modules/users/ui/WishListPage";
import NotFoundPage from "./components/navigation/NotFoundPage";
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
                <Route path="/store/:id" element={<StorePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/shoppingCart" element={<ShoppingCartPage />} />
                <Route path="/wishlist" element={<WishListPage />} />
                <Route
                  path="/wishlist/public/:slug"
                  element={<WishListPage />}
                />
                <Route path="/p/:id" element={<ProductPage />} />
                <Route path="/resetPassword" element={<ResetPasswordPage />} />
                <Route
                  path="/forgotPassword"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/crudProduct" element={<StoreProductCRUDPage />} />
                <Route
                  path="/s/:categoryId"
                  element={<SearchPage />}
                />
                <Route path="/s" element={<SearchPage />} />
                <Route path="/s/st" element={<StoresListPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/editProduct/:id" element={<StoreProductCRUDPage />} />
                <Route path="/store/:id/search" element={<StorePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </NotificationProvider>
          </CartProvider>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
