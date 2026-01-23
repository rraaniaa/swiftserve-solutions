import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Wrench, 
  Clock, 
  Shield, 
  CheckCircle2, 
  Search,
  Loader2,
  ArrowRight
} from "lucide-react";

const deviceTypes = [
  "Smartphone",
  "Tablette",
  "Montre connectée",
  "Autre",
];

const brands = [
  "Apple",
  "Samsung",
  "Huawei",
  "Xiaomi",
  "Oppo",
  "Realme",
  "OnePlus",
  "Google",
  "Nokia",
  "Autre",
];

const Repair = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [formData, setFormData] = useState({
    customer_name: profile?.full_name || "",
    customer_phone: profile?.phone || "",
    customer_email: user?.email || "",
    device_type: "",
    device_brand: "",
    device_model: "",
    problem_description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.customer_phone || !formData.device_type || !formData.problem_description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const insertData: any = { ...formData };
      if (user?.id) {
        insertData.user_id = user.id;
      }
      
      const { data, error } = await supabase
        .from("repairs")
        .insert(insertData)
        .select("repair_number")
        .single();

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: `Votre numéro de suivi : ${data.repair_number}`,
      });

      // Redirect to profile repairs if logged in, otherwise show success
      if (user) {
        navigate("/profil/reparations");
      } else {
        setFormData({
          customer_name: "",
          customer_phone: "",
          customer_email: "",
          device_type: "",
          device_brand: "",
          device_model: "",
          problem_description: "",
        });
      }
    } catch (error) {
      console.error("Error submitting repair:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTrackRepair = () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un numéro de réparation.",
        variant: "destructive",
      });
      return;
    }
    // For now, redirect to login if not authenticated
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour suivre vos réparations.",
      });
      navigate("/connexion");
    } else {
      navigate("/profil/reparations");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                Réparation Express
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">
                Réparez votre <span className="text-gradient-accent">appareil</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Demandez un devis gratuit ou suivez l'état de votre réparation en cours.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-8 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 justify-center">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Réparation Express</p>
                  <p className="text-sm text-muted-foreground">En moins de 24h</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Garantie 6 Mois</p>
                  <p className="text-sm text-muted-foreground">Sur toutes les réparations</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Diagnostic Gratuit</p>
                  <p className="text-sm text-muted-foreground">Sans engagement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Repair Form */}
              <div>
                <h2 className="font-display text-2xl font-bold mb-6">
                  Demander une réparation
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name">Nom complet *</Label>
                      <Input
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_phone">Téléphone *</Label>
                      <Input
                        id="customer_phone"
                        name="customer_phone"
                        value={formData.customer_phone}
                        onChange={handleChange}
                        placeholder="Ex: 54 080 419"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_email">Email (optionnel)</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Type d'appareil *</Label>
                      <Select
                        value={formData.device_type}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, device_type: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {deviceTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Marque</Label>
                      <Select
                        value={formData.device_brand}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, device_brand: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="device_model">Modèle</Label>
                      <Input
                        id="device_model"
                        name="device_model"
                        value={formData.device_model}
                        onChange={handleChange}
                        placeholder="Ex: iPhone 13"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="problem_description">Description du problème *</Label>
                    <Textarea
                      id="problem_description"
                      name="problem_description"
                      value={formData.problem_description}
                      onChange={handleChange}
                      placeholder="Décrivez le problème de votre appareil..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Wrench className="h-5 w-5" />
                        Envoyer la demande
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Track Repair */}
              <div>
                <h2 className="font-display text-2xl font-bold mb-6">
                  Suivre ma réparation
                </h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">
                    Entrez votre numéro de réparation pour suivre l'état de votre appareil.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tracking">Numéro de réparation</Label>
                      <Input
                        id="tracking"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Ex: REP-20250123-1234"
                      />
                    </div>
                    <Button onClick={handleTrackRepair} className="w-full">
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>

                  {user && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-3">
                        Vous êtes connecté. Accédez directement à vos réparations :
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <a href="/profil/reparations">Voir mes réparations</a>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-3">Comment ça marche ?</h3>
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        1
                      </span>
                      <span className="text-muted-foreground">
                        Remplissez le formulaire avec les détails de votre appareil
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        2
                      </span>
                      <span className="text-muted-foreground">
                        Nous vous contactons pour un diagnostic gratuit
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        3
                      </span>
                      <span className="text-muted-foreground">
                        Déposez votre appareil et suivez la réparation en ligne
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        4
                      </span>
                      <span className="text-muted-foreground">
                        Récupérez votre appareil réparé et garanti 6 mois
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Repair;
