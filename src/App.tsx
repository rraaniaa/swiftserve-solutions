import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Services from "./pages/Services";
import Repair from "./pages/Repair";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import LegalNotice from "./pages/legal/LegalNotice";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import ChatAssistant from "./components/chat/ChatAssistant";

// Profile
import ProfileLayout from "./pages/profile/ProfileLayout";
import Profile from "./pages/profile/Profile";
import ProfileOrders from "./pages/profile/ProfileOrders";
import ProfileOrderDetail from "./pages/profile/ProfileOrderDetail";
import ProfileFavorites from "./pages/profile/ProfileFavorites";
import ProfileRepairs from "./pages/profile/ProfileRepairs";
import ProfileRepairDetail from "./pages/profile/ProfileRepairDetail";
import ProfileSettings from "./pages/profile/ProfileSettings";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductsList from "./pages/admin/ProductsList";
import ProductForm from "./pages/admin/ProductForm";
import CategoriesList from "./pages/admin/CategoriesList";
import CategoryForm from "./pages/admin/CategoryForm";
import OrdersList from "./pages/admin/OrdersList";
import OrderDetail from "./pages/admin/OrderDetail";
import RepairsList from "./pages/admin/RepairsList";
import RepairDetail from "./pages/admin/RepairDetail";
import NewRepair from "./pages/admin/NewRepair";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/connexion" element={<Login />} />
              <Route path="/inscription" element={<Signup />} />
              <Route path="/boutique" element={<Shop />} />
              <Route path="/produit/:slug" element={<ProductDetail />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/services" element={<Services />} />
              <Route path="/reparation" element={<Repair />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/mentions-legales" element={<LegalNotice />} />
              <Route path="/confidentialite" element={<Privacy />} />
              <Route path="/cgv" element={<Terms />} />
              
              {/* Profile Routes */}
              <Route path="/profil" element={<ProfileLayout />}>
                <Route index element={<Profile />} />
                <Route path="commandes" element={<ProfileOrders />} />
                <Route path="commandes/:id" element={<ProfileOrderDetail />} />
                <Route path="favoris" element={<ProfileFavorites />} />
                <Route path="reparations" element={<ProfileRepairs />} />
                <Route path="reparations/:id" element={<ProfileRepairDetail />} />
                <Route path="parametres" element={<ProfileSettings />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="produits" element={<ProductsList />} />
                <Route path="produits/nouveau" element={<ProductForm />} />
                <Route path="produits/:id" element={<ProductForm />} />
                <Route path="categories" element={<CategoriesList />} />
                <Route path="categories/nouveau" element={<CategoryForm />} />
                <Route path="categories/:id" element={<CategoryForm />} />
                <Route path="commandes" element={<OrdersList />} />
                <Route path="commandes/:id" element={<OrderDetail />} />
                <Route path="reparations" element={<RepairsList />} />
                <Route path="reparations/nouvelle" element={<NewRepair />} />
                <Route path="reparations/:id" element={<RepairDetail />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatAssistant />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
