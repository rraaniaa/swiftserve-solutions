import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail,
  Send,
  Loader2,
  Facebook,
  Instagram,
  MessageCircle
} from "lucide-react";

const Contact = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: profile?.full_name || "",
    customer_email: user?.email || "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("feedback").insert({
        user_id: user?.id || null,
        customer_name: formData.customer_name || null,
        customer_email: formData.customer_email || null,
        subject: formData.subject,
        message: formData.message,
      });

      if (error) throw error;

      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Contact
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">
                <span className="text-gradient-gold">Contactez</span>-nous
              </h1>
              <p className="text-lg text-muted-foreground">
                Une question ? Un besoin ? N'hésitez pas à nous contacter. 
                Notre équipe est à votre disposition.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="font-display text-2xl font-bold mb-6">
                  Envoyez-nous un message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name">Nom</Label>
                      <Input
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_email">Email</Label>
                      <Input
                        id="customer_email"
                        name="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="L'objet de votre message"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Votre message..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="font-display text-2xl font-bold mb-6">
                  Informations de contact
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
                        <p className="text-muted-foreground">
                          Av de la République, ZAGHOUAN
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          (En face de la mosquée)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                        <a 
                          href="tel:54080419" 
                          className="text-primary hover:underline font-medium"
                        >
                          54 080 419
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          WhatsApp disponible
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Horaires</h3>
                        <p className="text-muted-foreground">Lundi - Samedi</p>
                        <p className="font-medium">9h00 - 19h00</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Fermé le dimanche
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Suivez-nous</h3>
                    <div className="flex gap-3">
                      <a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-card border border-border hover:border-primary/50 flex items-center justify-center transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-card border border-border hover:border-primary/50 flex items-center justify-center transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a 
                        href="https://wa.me/21654080419" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-card border border-border hover:border-accent/50 flex items-center justify-center transition-colors"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map placeholder */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="bg-muted rounded-xl h-64 flex items-center justify-center border border-border">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Av de la République, ZAGHOUAN
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
