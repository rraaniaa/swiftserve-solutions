import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useCategories, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Package, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id && id !== 'nouveau';

  const { data: existingProduct, isLoading: productLoading } = useProduct(
    isEditing ? '' : ''
  );
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    brand: '',
    image_url: '',
    stock_quantity: '0',
    stock_threshold: '5',
    is_featured: false,
    is_new: false,
    is_active: true,
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !formData.price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      category_id: formData.category_id || null,
      brand: formData.brand || null,
      image_url: formData.image_url || null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      stock_threshold: parseInt(formData.stock_threshold) || 5,
      is_featured: formData.is_featured,
      is_new: formData.is_new,
      is_active: formData.is_active,
    };

    try {
      if (isEditing) {
        await updateProduct.mutateAsync({ id: id!, ...productData });
        toast.success('Produit mis à jour');
      } else {
        await createProduct.mutateAsync(productData);
        toast.success('Produit créé');
      }
      navigate('/admin/produits');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/produits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold">
            {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit au catalogue'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="glass lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    placeholder="iPhone 15 Pro Max"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug URL *</Label>
                  <Input
                    id="slug"
                    placeholder="iphone-15-pro-max"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description détaillée du produit..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(v) => handleChange('category_id', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marque</Label>
                  <Input
                    id="brand"
                    placeholder="Apple, Samsung..."
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL de l'image</Label>
                  <Input
                    id="image_url"
                    placeholder="https://..."
                    value={formData.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-display">Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Actif</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(v) => handleChange('is_active', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured">Produit vedette</Label>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(v) => handleChange('is_featured', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_new">Nouveau produit</Label>
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(v) => handleChange('is_new', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing & Stock */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-display">Prix & Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (TND) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Prix barré (TND)</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={formData.original_price}
                  onChange={(e) => handleChange('original_price', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Quantité en stock</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleChange('stock_quantity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_threshold">Seuil d'alerte</Label>
                <Input
                  id="stock_threshold"
                  type="number"
                  value={formData.stock_threshold}
                  onChange={(e) => handleChange('stock_threshold', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link to="/admin/produits">
            <Button variant="outline">Annuler</Button>
          </Link>
          <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {createProduct.isPending || updateProduct.isPending
              ? 'Sauvegarde...'
              : isEditing
              ? 'Mettre à jour'
              : 'Créer le produit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
