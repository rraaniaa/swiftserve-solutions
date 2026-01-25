import { supabase } from '@/lib/supabase';

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data;
};

export const createCategory = async (payload: any) => {
  const { error } = await supabase
    .from('categories')
    .insert(payload);
  if (error) throw error;
};

export const updateCategory = async (id: string, payload: any) => {
  const { error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', id);
  if (error) throw error;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
