import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Wrench, Smartphone, Calendar, FileText, CreditCard } from "lucide-react";
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

const ProfileRepairDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: repair, isLoading } = useQuery({
    queryKey: ["user-repair", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repairs")
        .select("*")
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

  if (!repair) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Réparation non trouvée</p>
        <Button asChild className="mt-4">
          <Link to="/profil/reparations">Retour aux réparations</Link>
        </Button>
      </div>
    );
  }

  const status = statusConfig[repair.status] || statusConfig.received;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/profil/reparations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-foreground">
              {repair.repair_number}
            </h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Créé le {format(new Date(repair.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Device Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Appareil
            </h2>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{repair.device_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Marque</span>
                <span className="font-medium">{repair.device_brand || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modèle</span>
                <span className="font-medium">{repair.device_model || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Description du problème
            </h2>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{repair.problem_description}</p>
            </div>
          </div>

          {repair.technician_notes && (
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Notes du technicien
              </h2>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">{repair.technician_notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status & Cost */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Dates
            </h2>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Réception</span>
                <span className="font-medium">
                  {format(new Date(repair.created_at), "d MMM yyyy", { locale: fr })}
                </span>
              </div>
              {repair.estimated_completion && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimation</span>
                  <span className="font-medium">
                    {format(new Date(repair.estimated_completion), "d MMM yyyy", { locale: fr })}
                  </span>
                </div>
              )}
              {repair.completed_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Terminé le</span>
                  <span className="font-medium">
                    {format(new Date(repair.completed_at), "d MMM yyyy", { locale: fr })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Coût
            </h2>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              {repair.estimated_cost && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimation</span>
                  <span className="font-medium">{repair.estimated_cost.toFixed(2)} DT</span>
                </div>
              )}
              {repair.final_cost && (
                <>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Coût final</span>
                    <span className="text-primary">{repair.final_cost.toFixed(2)} DT</span>
                  </div>
                </>
              )}
              {!repair.estimated_cost && !repair.final_cost && (
                <p className="text-sm text-muted-foreground">
                  Le coût sera déterminé après diagnostic
                </p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-semibold text-foreground mb-3">État de la réparation</h3>
            <div className="space-y-3">
              {["received", "diagnosing", "repairing", "completed", "delivered"].map((step, index) => {
                const stepStatus = statusConfig[step];
                const currentIndex = ["received", "diagnosing", "waiting_parts", "repairing", "completed", "delivered"].indexOf(repair.status);
                const stepIndex = ["received", "diagnosing", "repairing", "completed", "delivered"].indexOf(step);
                const isCompleted = currentIndex >= stepIndex + (repair.status === "waiting_parts" ? 1 : 0);
                const isCurrent = repair.status === step || (repair.status === "waiting_parts" && step === "diagnosing");

                return (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isCompleted ? "bg-primary" : isCurrent ? "bg-accent" : "bg-muted-foreground/30"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isCompleted || isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {stepStatus.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRepairDetail;
