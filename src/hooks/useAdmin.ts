import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  subtotal: number;
  shipping_cost: number | null;
  discount: number | null;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  notes: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  variant_id: string | null;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Repair {
  id: string;
  repair_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  device_type: string;
  device_brand: string | null;
  device_model: string | null;
  problem_description: string;
  status: string;
  technician_notes: string | null;
  estimated_cost: number | null;
  final_cost: number | null;
  estimated_completion: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useAdminOrders = (status?: string) => {
  return useQuery({
    queryKey: ['admin-orders', status],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) throw orderError;

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      return { ...order, items } as Order;
    },
    enabled: !!id,
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Order> & { id: string }) => {
      const { error } = await supabase
        .from('orders')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
    },
  });
};

export const useAdminRepairs = (status?: string) => {
  return useQuery({
    queryKey: ['admin-repairs', status],
    queryFn: async () => {
      let query = supabase
        .from('repairs')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Repair[];
    },
  });
};

export const useAdminRepair = (id: string) => {
  return useQuery({
    queryKey: ['admin-repair', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repairs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Repair;
    },
    enabled: !!id,
  });
};

export const useUpdateRepair = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Repair> & { id: string }) => {
      const updateData: any = { ...data };
      
      // Set completed_at when status changes to delivered
      if (data.status === 'delivered' && !data.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('repairs')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-repairs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-repair'] });
    },
  });
};

export const useCreateRepair = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repair: Partial<Repair>) => {
      const { data, error } = await supabase
        .from('repairs')
        .insert(repair as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-repairs'] });
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [ordersResult, repairsResult, productsResult] = await Promise.all([
        supabase.from('orders').select('id, total, status, created_at'),
        supabase.from('repairs').select('id, status, created_at'),
        supabase.from('products').select('id, stock_quantity, stock_threshold'),
      ]);

      if (ordersResult.error) throw ordersResult.error;
      if (repairsResult.error) throw repairsResult.error;
      if (productsResult.error) throw productsResult.error;

      const orders = ordersResult.data || [];
      const repairs = repairsResult.data || [];
      const products = productsResult.data || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const todayOrders = orders.filter(o => new Date(o.created_at) >= today);
      const monthOrders = orders.filter(o => new Date(o.created_at) >= thisMonth);
      const pendingOrders = orders.filter(o => o.status === 'pending');
      
      const activeRepairs = repairs.filter(r => !['delivered', 'cancelled'].includes(r.status));
      const lowStockProducts = products.filter(p => p.stock_quantity <= (p.stock_threshold || 5));

      const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      return {
        todayOrdersCount: todayOrders.length,
        monthOrdersCount: monthOrders.length,
        pendingOrdersCount: pendingOrders.length,
        activeRepairsCount: activeRepairs.length,
        lowStockCount: lowStockProducts.length,
        monthRevenue,
        totalProducts: products.length,
        totalOrders: orders.length,
      };
    },
  });
};
