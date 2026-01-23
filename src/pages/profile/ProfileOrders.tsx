import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Eye, ShoppingBag } from "lucide-react";
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

const ProfileOrders = () => {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">
        Mes Commandes
      </h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            return (
              <div
                key={order.id}
                className="border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {order.order_number}
                        </h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.created_at), "d MMMM yyyy 'à' HH:mm", {
                          locale: fr,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.order_items?.length || 0} article(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {order.total.toFixed(2)} DT
                      </p>
                    </div>
                    <Link to={`/profil/commandes/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Aucune commande
          </h3>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas encore passé de commande.
          </p>
          <Button asChild>
            <Link to="/boutique">Découvrir la boutique</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileOrders;
