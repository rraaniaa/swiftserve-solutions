import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShoppingBag, 
  Truck, Shield, CreditCard 
} from 'lucide-react';

const Cart = () => {
  const { items, loading, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingCost = totalPrice >= 200 ? 0 : 7;
  const finalTotal = totalPrice + shippingCost;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Connectez-vous</h1>
            <p className="text-muted-foreground mb-6">
              Veuillez vous connecter pour accéder à votre panier
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/connexion">Se connecter</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/inscription">Créer un compte</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-6">
              Découvrez nos produits et commencez vos achats
            </p>
            <Button asChild variant="hero">
              <Link to="/boutique">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Voir la boutique
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-display font-bold mb-8">
            Mon <span className="text-gradient-gold">Panier</span>
            <span className="text-lg font-normal text-muted-foreground ml-2">
              ({totalItems} article{totalItems > 1 ? 's' : ''})
            </span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const price = item.variant?.price ?? item.product.price;
                const stock = item.variant?.stock_quantity ?? item.product.stock_quantity;
                
                return (
                  <Card key={item.id} className="glass">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Link to={`/produit/${item.product_id}`} className="shrink-0">
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-muted overflow-hidden">
                            <img
                              src={item.product.image_url || '/placeholder.svg'}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link to={`/produit/${item.product_id}`}>
                            <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          
                          {item.variant && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.variant.name}
                            </p>
                          )}

                          <p className="text-primary font-bold mt-2">
                            {price.toFixed(3)} TND
                          </p>

                          {stock <= 5 && stock > 0 && (
                            <p className="text-xs text-yellow-500 mt-1">
                              Plus que {stock} en stock
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, Math.min(stock, item.quantity + 1))}
                                disabled={item.quantity >= stock}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="font-bold">
                                {(price * item.quantity).toFixed(3)} TND
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="glass sticky top-24">
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{totalPrice.toFixed(3)} TND</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-500">Gratuite</span>
                      ) : (
                        `${shippingCost.toFixed(3)} TND`
                      )}
                    </span>
                  </div>

                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Livraison gratuite à partir de 200 TND
                    </p>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{finalTotal.toFixed(3)} TND</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate('/checkout')}
                  >
                    Passer la commande
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/boutique">Continuer mes achats</Link>
                  </Button>

                  {/* Trust badges */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t w-full">
                    <div className="text-center">
                      <Truck className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-[10px] text-muted-foreground">Livraison rapide</p>
                    </div>
                    <div className="text-center">
                      <Shield className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-[10px] text-muted-foreground">Paiement sécurisé</p>
                    </div>
                    <div className="text-center">
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-[10px] text-muted-foreground">À la livraison</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
