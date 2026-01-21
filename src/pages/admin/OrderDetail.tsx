import { useParams, Link } from 'react-router-dom';
import { useAdminOrder, useUpdateOrder } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, User, Phone, Mail, MapPin, Package, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useAdminOrder(id!);
  const updateOrder = useUpdateOrder();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateOrder.mutateAsync({ id: id!, status: newStatus });
      toast.success('Statut mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Commande non trouvée</p>
        <Link to="/admin/commandes">
          <Button variant="outline" className="mt-4">
            Retour aux commandes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/commandes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold">{order.order_number}</h1>
              <Badge className={statusColors[order.status]}>
                {statusLabels[order.status] || order.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {format(new Date(order.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Select value={order.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="processing">En préparation</SelectItem>
              <SelectItem value="shipped">Expédiée</SelectItem>
              <SelectItem value="delivered">Livrée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informations client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{order.customer_phone}</span>
            </div>
            {order.customer_email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer_email}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <span className="text-sm">{order.shipping_address}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Articles commandés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    {item.variant_name && (
                      <p className="text-sm text-muted-foreground">{item.variant_name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {item.unit_price.toFixed(3)} TND
                    </p>
                    <p className="font-medium">{item.total_price.toFixed(3)} TND</p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{order.subtotal.toFixed(3)} TND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{(order.shipping_cost || 0).toFixed(3)} TND</span>
                </div>
                {order.discount && order.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Réduction</span>
                    <span>-{order.discount.toFixed(3)} TND</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{order.total.toFixed(3)} TND</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Badge variant="outline">
                  {order.payment_method === 'cod' ? 'Paiement à la livraison' : 'Carte bancaire'}
                </Badge>
                <Badge
                  className={
                    order.payment_status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }
                >
                  {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                </Badge>
              </div>

              {order.notes && (
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Notes:</p>
                  <p className="text-sm mt-1">{order.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;
