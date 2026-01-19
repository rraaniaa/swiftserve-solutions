import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    stock_quantity: number;
  };
  variant?: {
    id: string;
    name: string;
    price: number | null;
    color: string | null;
    capacity: string | null;
    size: string | null;
    stock_quantity: number;
  } | null;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, variantId?: string | null, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          variant_id,
          quantity,
          product:products(id, name, price, image_url, stock_quantity),
          variant:product_variants(id, name, price, color, capacity, size, stock_quantity)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const cartItems = (data || []).map((item: any) => ({
        ...item,
        product: item.product,
        variant: item.variant,
      }));
      
      setItems(cartItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, variantId?: string | null, quantity: number = 1) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter au panier",
        variant: "destructive",
      });
      return;
    }

    try {
      const existingItem = items.find(
        item => item.product_id === productId && item.variant_id === (variantId || null)
      );

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        const { error } = await supabase.from('cart_items').insert({
          user_id: user.id,
          product_id: productId,
          variant_id: variantId || null,
          quantity,
        });

        if (error) throw error;
        await fetchCart();
      }

      toast({
        title: "Ajouté au panier",
        description: "Produit ajouté avec succès",
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter au panier",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
