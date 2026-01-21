import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts, useCategories, useBrands } from '@/hooks/useProducts';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useCart } from '@/contexts/CartContext';
import { 
  Search, ShoppingCart, Heart, Star, Filter, X, 
  Smartphone, Shield, Cable, Watch, Speaker, Headphones, Package, Grid, List
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Smartphone, Shield, Cable, Watch, Speaker, Headphones, Package
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating'>('newest');
  const [inStock, setInStock] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: products, isLoading } = useProducts({
    categorySlug: selectedCategory || undefined,
    search: search || undefined,
    brand: selectedBrand || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    inStock,
    sortBy,
  });

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { addToCart } = useCart();

  const getStockStatus = (quantity: number, threshold: number = 5) => {
    if (quantity === 0) return { label: 'Rupture', class: 'stock-empty' };
    if (quantity <= threshold) return { label: 'Stock faible', class: 'stock-low' };
    return { label: 'En stock', class: 'stock-available' };
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? '' : slug);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange([0, 10000]);
    setInStock(false);
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Notre <span className="text-gradient-gold">Boutique</span>
            </h1>
            <p className="text-muted-foreground">
              Découvrez notre sélection de produits de qualité
            </p>
          </div>

          {/* Categories Bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <Button
              variant={selectedCategory === '' ? 'hero' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
              className="shrink-0"
            >
              Tous
            </Button>
            {categories?.map((category) => {
              const Icon = iconMap[category.icon || ''] || Package;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'hero' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryClick(category.slug)}
                  className="shrink-0"
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="glass sticky top-24">
                <CardContent className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filtres</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" /> Réinitialiser
                    </Button>
                  </div>

                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recherche</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Marque</label>
                    <Select value={selectedBrand || "all"} onValueChange={(v) => setSelectedBrand(v === "all" ? "" : v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les marques" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les marques</SelectItem>
                        {brands?.map((brand) => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Prix: {priceRange[0]} - {priceRange[1]} TND
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={10000}
                      step={50}
                      className="mt-2"
                    />
                  </div>

                  {/* In Stock */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="inStock"
                      checked={inStock}
                      onCheckedChange={(checked) => setInStock(checked as boolean)}
                    />
                    <label htmlFor="inStock" className="text-sm">En stock uniquement</label>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4 gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>

                <p className="text-sm text-muted-foreground">
                  {products?.length || 0} produits
                </p>

                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Plus récents</SelectItem>
                      <SelectItem value="price_asc">Prix croissant</SelectItem>
                      <SelectItem value="price_desc">Prix décroissant</SelectItem>
                      <SelectItem value="rating">Mieux notés</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="hidden md:flex border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-square bg-muted" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded mb-2" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products?.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground mb-4">
                    Essayez de modifier vos filtres
                  </p>
                  <Button onClick={clearFilters}>Réinitialiser les filtres</Button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                  : 'space-y-4'
                }>
                  {products?.map((product) => {
                    const stockStatus = getStockStatus(product.stock_quantity, product.stock_threshold);
                    
                    return (
                      <Card key={product.id} className="group card-hover overflow-hidden">
                        <Link to={`/produit/${product.slug}`}>
                          <div className="relative aspect-square bg-muted overflow-hidden">
                            <img
                              src={product.image_url || '/placeholder.svg'}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {product.is_new && (
                                <Badge className="bg-accent text-accent-foreground text-xs">Nouveau</Badge>
                              )}
                              {product.original_price && (
                                <Badge className="bg-destructive text-destructive-foreground text-xs">
                                  -{Math.round((1 - product.price / product.original_price) * 100)}%
                                </Badge>
                              )}
                            </div>

                            {/* Stock Status */}
                            <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs border ${stockStatus.class}`}>
                              {stockStatus.label}
                            </div>

                            {/* Wishlist */}
                            <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Heart className="w-4 h-4" />
                            </button>
                          </div>
                        </Link>

                        <CardContent className="p-4">
                          <Link to={`/produit/${product.slug}`}>
                            <p className="text-xs text-muted-foreground mb-1">
                              {product.category?.name || 'Non classé'}
                            </p>
                            <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <span className="text-xs">{product.rating}</span>
                            <span className="text-xs text-muted-foreground">({product.review_count})</span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-bold text-primary">{product.price.toFixed(3)} TND</span>
                            {product.original_price && (
                              <span className="text-sm text-muted-foreground line-through">
                                {product.original_price.toFixed(3)} TND
                              </span>
                            )}
                          </div>

                          <Button
                            size="sm"
                            className="w-full"
                            disabled={product.stock_quantity === 0}
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product.id);
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.stock_quantity === 0 ? 'Indisponible' : 'Ajouter'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
