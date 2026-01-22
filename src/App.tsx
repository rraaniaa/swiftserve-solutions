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
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
