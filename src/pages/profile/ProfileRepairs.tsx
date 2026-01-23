import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wrench, Eye, Plus, Smartphone } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  received: { label: "Reçu", variant: "secondary" },
  diagnosing: { label: "Diagnostic", variant: "default" },
  waiting_parts: { label: "Pièces en attente", variant: "outline" },
  repairing: { label: "En réparation", variant: "default" },
  completed: { label: "Terminé", variant: "default" },
  delivered: { label: "Livré", variant: "outline" },
  cancelled: { label: "Annulé", variant: "destructive" },
};

const ProfileRepairs = () => {
  const { user } = useAuth();

  const { data: repairs, isLoading } = useQuery({
    queryKey: ["user-repairs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repairs")
        .select("*")
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Mes Réparations
        </h1>
        <Button asChild>
          <Link to="/reparation">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Link>
        </Button>
      </div>

      {repairs && repairs.length > 0 ? (
        <div className="space-y-4">
          {repairs.map((repair) => {
            const status = statusConfig[repair.status] || statusConfig.received;
            return (
              <div
                key={repair.id}
                className="border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Wrench className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {repair.repair_number}
                        </h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {repair.device_brand} {repair.device_model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(repair.created_at), "d MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {repair.final_cost && (
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {repair.final_cost.toFixed(2)} DT
                        </p>
                      </div>
                    )}
                    <Link to={`/profil/reparations/${repair.id}`}>
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
            <Smartphone className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Aucune réparation
          </h3>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas encore de demande de réparation.
          </p>
          <Button asChild>
            <Link to="/reparation">
              <Wrench className="h-4 w-4 mr-2" />
              Demander une réparation
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileRepairs;
