import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, Heart, Star, Minus, Plus, Check, Truck, Shield, 
  RotateCcw, ChevronLeft, Share2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const { data: relatedProducts } = useProducts({ featured: true });
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-square bg-muted rounded-lg" />
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-12 bg-muted rounded w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
            <Button asChild>
              <Link to="/boutique">Retour à la boutique</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = [product.image_url, ...(product.images || [])].filter(Boolean);
  const currentVariant = product.variants?.find(v => v.id === selectedVariant);
  const currentPrice = currentVariant?.price ?? product.price;
  const currentStock = currentVariant?.stock_quantity ?? product.stock_quantity;
  
  const getStockStatus = () => {
    if (currentStock === 0) return { label: 'Rupture de stock', class: 'stock-empty' };
    if (currentStock <= (product.stock_threshold || 5)) return { label: 'Stock faible', class: 'stock-low' };
    return { label: 'En stock', class: 'stock-available' };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    if (product.has_variants && !selectedVariant) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner une variante",
        variant: "destructive",
      });
      return;
    }
    addToCart(product.id, selectedVariant, quantity);
  };

  // Group variants by attribute
  const colors = [...new Set(product.variants?.map(v => v.color).filter(Boolean))];
  const capacities = [...new Set(product.variants?.map(v => v.capacity).filter(Boolean))];
  const sizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">Accueil</Link>
            <span>/</span>
            <Link to="/boutique" className="hover:text-foreground">Boutique</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link to={`/boutique?category=${product.category.slug}`} className="hover:text-foreground">
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={images[selectedImage] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {product.is_new && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    Nouveau
                  </Badge>
                )}
                {product.original_price && (
                  <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                    -{Math.round((1 - product.price / product.original_price) * 100)}%
                  </Badge>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 ${
                        selectedImage === idx ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img || ''} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.brand} • {product.category?.name}
                </p>
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.review_count} avis)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-primary">{currentPrice.toFixed(3)} TND</span>
                  {product.original_price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {product.original_price.toFixed(3)} TND
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className={`inline-flex px-3 py-1 rounded-full text-sm border ${stockStatus.class}`}>
                  {stockStatus.label} {currentStock > 0 && `(${currentStock})`}
                </div>
              </div>

              {/* Variants */}
              {product.has_variants && (
                <div className="space-y-4">
                  {colors.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Couleur</label>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => {
                          const variant = product.variants?.find(v => v.color === color);
                          const isSelected = currentVariant?.color === color;
                          return (
                            <button
                              key={color}
                              onClick={() => variant && setSelectedVariant(variant.id)}
                              className={`px-4 py-2 rounded-lg border transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {capacities.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Capacité</label>
                      <div className="flex flex-wrap gap-2">
                        {capacities.map((capacity) => {
                          const variant = product.variants?.find(
                            v => v.capacity === capacity && (!currentVariant || v.color === currentVariant.color)
                          );
                          const isSelected = currentVariant?.capacity === capacity;
                          return (
                            <button
                              key={capacity}
                              onClick={() => variant && setSelectedVariant(variant.id)}
                              className={`px-4 py-2 rounded-lg border transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              {capacity}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={currentStock === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </Button>

                <Button variant="outline" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>

                <Button variant="outline" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs">Livraison rapide</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs">Garantie</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs">Retour facile</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mt-12">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Caractéristiques</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({product.review_count})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || "Aucune description disponible."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {Object.keys(product.specifications || {}).length > 0 ? (
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b pb-2">
                          <dt className="text-muted-foreground">{key}</dt>
                          <dd className="font-medium">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-muted-foreground">Aucune caractéristique disponible.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Les avis seront bientôt disponibles.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-display font-bold mb-6">Produits similaires</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).filter(p => p.id !== product.id).map((p) => (
                  <Card key={p.id} className="group card-hover">
                    <Link to={`/produit/${p.slug}`}>
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img
                          src={p.image_url || '/placeholder.svg'}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium line-clamp-1">{p.name}</h3>
                        <p className="text-primary font-bold">{p.price.toFixed(3)} TND</p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
