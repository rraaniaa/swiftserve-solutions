import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Bell, Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le mot de passe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">
        Paramètres
      </h1>

      <div className="space-y-8">
        {/* Password Change */}
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            Changer le mot de passe
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Modifier le mot de passe
            </Button>
          </form>
        </div>

        <Separator />

        {/* Notifications */}
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </h2>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notifications par email</p>
                <p className="text-sm text-muted-foreground">
                  Recevoir des emails pour les mises à jour de commandes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Promotions</p>
                <p className="text-sm text-muted-foreground">
                  Recevoir les offres et promotions
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Réparations</p>
                <p className="text-sm text-muted-foreground">
                  Notifications sur l'état des réparations
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        {/* Security */}
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            Sécurité
          </h2>
          <div className="space-y-4 max-w-md">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-foreground mb-1">Email de connexion</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-foreground mb-1">Dernière connexion</p>
              <p className="text-sm text-muted-foreground">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString("fr-FR")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
