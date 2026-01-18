import { ShoppingCart, Heart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type StockStatus = "available" | "low" | "empty" | "coming";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: StockStatus;
  badge?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Câble USB-C Premium",
    category: "Câbles",
    price: 15,
    originalPrice: 25,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 124,
    stock: "available",
    badge: "Promo",
  },
  {
    id: 2,
    name: "Coque iPhone 15 Pro",
    category: "Cache-téléphone",
    price: 25,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 89,
    stock: "available",
  },
  {
    id: 3,
    name: "Écouteurs Bluetooth Pro",
    category: "Écouteurs",
    price: 45,
    originalPrice: 60,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 256,
    stock: "low",
    badge: "-25%",
  },
  {
    id: 4,
    name: "Chargeur Rapide 65W",
    category: "Chargeurs",
    price: 35,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 178,
    stock: "available",
  },
  {
    id: 5,
    name: "Smartwatch Sport",
    category: "Smartwatch",
    price: 89,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 92,
    stock: "coming",
    badge: "Bientôt",
  },
  {
    id: 6,
    name: "Enceinte Bluetooth",
    category: "Baffle",
    price: 55,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 145,
    stock: "available",
  },
];

const stockLabels: Record<StockStatus, { label: string; class: string }> = {
  available: { label: "En stock", class: "stock-available" },
  low: { label: "Stock faible", class: "stock-low" },
  empty: { label: "Rupture", class: "stock-empty" },
  coming: { label: "Bientôt", class: "stock-coming" },
};

const ProductsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-card/50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Boutique
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
              Produits <span className="text-gradient-accent">vedettes</span>
            </h2>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl border border-border overflow-hidden card-hover"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-accent text-accent-foreground font-bold">
                      {product.badge}
                    </Badge>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>

                {/* Stock Status */}
                <div className="absolute bottom-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${stockLabels[product.stock].class}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {stockLabels[product.stock].label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category */}
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {product.category}
                </span>

                {/* Name */}
                <h3 className="font-semibold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews} avis)
                  </span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">
                      {product.price} DT
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice} DT
                      </span>
                    )}
                  </div>
                  <Button size="sm" variant="default" disabled={product.stock === "empty" || product.stock === "coming"}>
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
