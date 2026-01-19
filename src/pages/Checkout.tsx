import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, Truck, Wallet, MapPin, User, Phone, Mail,
  CheckCircle, ArrowLeft, Loader2
} from 'lucide-react';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: profile?.full_name || '',
    customerPhone: profile?.phone || '',
    customerEmail: user?.email || '',
    shippingAddress: profile?.address || '',
    notes: '',
    paymentMethod: 'cod' as 'cod' | 'card',
  });
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const shippingCost = totalPrice >= 200 ? 0 : 7;
  const finalTotal = totalPrice + shippingCost;

  if (!user) {
    navigate('/connexion');
    return null;
  }

  if (items.length === 0 && !orderComplete) {
    navigate('/panier');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_email: formData.customerEmail,
          shipping_address: formData.shippingAddress,
          payment_method: formData.paymentMethod,
          subtotal: totalPrice,
          shipping_cost: shippingCost,
          total: finalTotal,
          notes: formData.notes,
        } as any)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product.name,
        variant_name: item.variant?.name || null,
        quantity: item.quantity,
        unit_price: item.variant?.price ?? item.product.price,
        total_price: (item.variant?.price ?? item.product.price) * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update stock quantities
      for (const item of items) {
        if (item.variant_id) {
          await supabase
            .from('product_variants')
            .update({ stock_quantity: (item.variant?.stock_quantity || 0) - item.quantity })
            .eq('id', item.variant_id);
        } else {
          await supabase
            .from('products')
            .update({ stock_quantity: item.product.stock_quantity - item.quantity })
            .eq('id', item.product_id);
        }
      }

      // Clear cart
      await clearCart();

      setOrderNumber(order.order_number);
      setOrderComplete(true);

      toast({
        title: "Commande confirmée !",
        description: `Votre commande ${order.order_number} a été passée avec succès`,
      });

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de passer la commande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center py-16">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">
                Commande confirmée !
              </h1>
              <p className="text-muted-foreground mb-2">
                Merci pour votre commande
              </p>
              <p className="text-lg font-semibold text-primary mb-8">
                N° {orderNumber}
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Vous recevrez un SMS/email de confirmation avec les détails de votre commande.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/profil/commandes">Voir mes commandes</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/boutique">Continuer mes achats</Link>
                </Button>
              </div>
            </div>
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
          <Button variant="ghost" className="mb-4" asChild>
            <Link to="/panier">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au panier
            </Link>
          </Button>

          <h1 className="text-3xl font-display font-bold mb-8">
            <span className="text-gradient-gold">Finaliser</span> la commande
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Informations de contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse complète *</Label>
                      <Textarea
                        id="address"
                        placeholder="Rue, ville, code postal..."
                        value={formData.shippingAddress}
                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                        required
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-primary" />
                      Mode de paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as 'cod' | 'card' })}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Paiement à la livraison</p>
                              <p className="text-sm text-muted-foreground">Payez en espèces à la réception</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Carte bancaire</p>
                              <p className="text-sm text-muted-foreground">Paiement sécurisé en ligne</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Notes (optionnel)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Instructions spéciales pour la livraison..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="glass sticky top-24">
                  <CardHeader>
                    <CardTitle>Votre commande</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => {
                      const price = item.variant?.price ?? item.product.price;
                      return (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-16 h-16 rounded bg-muted overflow-hidden shrink-0">
                            <img
                              src={item.product.image_url || '/placeholder.svg'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                            {item.variant && (
                              <p className="text-xs text-muted-foreground">{item.variant.name}</p>
                            )}
                            <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">
                            {(price * item.quantity).toFixed(3)} TND
                          </p>
                        </div>
                      );
                    })}

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span>{totalPrice.toFixed(3)} TND</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Livraison</span>
                        <span>{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(3)} TND`}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{finalTotal.toFixed(3)} TND</span>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        'Confirmer la commande'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
