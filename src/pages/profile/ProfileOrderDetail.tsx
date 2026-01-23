import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, MapPin, Phone, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente", variant: "secondary" },
  confirmed: { label: "Confirmée", variant: "default" },
  processing: { label: "En préparation", variant: "default" },
  shipped: { label: "Expédiée", variant: "default" },
  delivered: { label: "Livrée", variant: "outline" },
  cancelled: { label: "Annulée", variant: "destructive" },
};

const ProfileOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: order, isLoading } = useQuery({
    queryKey: ["user-order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id!)
        .eq("user_id", user!.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Commande non trouvée</p>
        <Button asChild className="mt-4">
          <Link to="/profil/commandes">Retour aux commandes</Link>
        </Button>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/profil/commandes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-foreground">
              {order.order_number}
            </h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Passée le {format(new Date(order.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Items */}
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Articles commandés
          </h2>
          <div className="space-y-3">
            {order.order_items?.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{item.product_name}</p>
                  {item.variant_name && (
                    <p className="text-sm text-muted-foreground">{item.variant_name}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Quantité: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-foreground">
                  {item.total_price.toFixed(2)} DT
                </p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{order.subtotal.toFixed(2)} DT</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span>{order.shipping_cost.toFixed(2)} DT</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Réduction</span>
                <span>-{order.discount.toFixed(2)} DT</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{order.total.toFixed(2)} DT</span>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Adresse de livraison
            </h2>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.shipping_address}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact
            </h2>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{order.customer_phone}</p>
              {order.customer_email && (
                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Paiement
            </h2>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                {order.payment_method === "cod" ? "Paiement à la livraison" : "Carte bancaire"}
              </p>
              <Badge variant={order.payment_status === "paid" ? "default" : "secondary"} className="mt-2">
                {order.payment_status === "paid" ? "Payé" : "En attente"}
              </Badge>
            </div>
          </div>

          {order.notes && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Notes</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileOrderDetail;
