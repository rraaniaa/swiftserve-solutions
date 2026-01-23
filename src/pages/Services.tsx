import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  Smartphone, 
  Wrench, 
  Battery, 
  Monitor, 
  Wifi, 
  Camera,
  Mic,
  Volume2,
  Printer,
  FileText,
  CreditCard,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Monitor,
    title: "Réparation Écran",
    description: "Remplacement d'écran cassé ou fissuré pour tous modèles de smartphones et tablettes.",
    price: "À partir de 50 DT",
  },
  {
    icon: Battery,
    title: "Changement Batterie",
    description: "Batterie faible ou qui se décharge vite ? Nous remplaçons votre batterie par une neuve.",
    price: "À partir de 30 DT",
  },
  {
    icon: Wrench,
    title: "Réparation Connecteur",
    description: "Problème de charge ou de connexion ? Nous réparons tous types de connecteurs.",
    price: "À partir de 25 DT",
  },
  {
    icon: Camera,
    title: "Réparation Caméra",
    description: "Caméra avant ou arrière défectueuse ? Nous les remplaçons avec des pièces de qualité.",
    price: "À partir de 40 DT",
  },
  {
    icon: Mic,
    title: "Réparation Microphone",
    description: "Micro qui ne fonctionne plus ? Nous diagnostiquons et réparons le problème.",
    price: "À partir de 25 DT",
  },
  {
    icon: Volume2,
    title: "Réparation Haut-parleur",
    description: "Son faible ou absent ? Nous remplaçons vos haut-parleurs défectueux.",
    price: "À partir de 25 DT",
  },
  {
    icon: Wifi,
    title: "Problèmes Logiciels",
    description: "Déblocage, mise à jour, récupération de données et autres problèmes logiciels.",
    price: "À partir de 20 DT",
  },
  {
    icon: Smartphone,
    title: "Diagnostic Complet",
    description: "Diagnostic gratuit pour identifier tous les problèmes de votre appareil.",
    price: "Gratuit",
  },
];

const otherServices = [
  {
    icon: Printer,
    title: "Photocopies & Impressions",
    description: "Service de photocopie et impression couleur ou noir et blanc.",
  },
  {
    icon: FileText,
    title: "Saisie & Frappe",
    description: "Service de saisie de documents, CV, lettres administratives.",
  },
  {
    icon: CreditCard,
    title: "Recharge Téléphonique",
    description: "Recharge pour tous les opérateurs tunisiens.",
  },
  {
    icon: Shield,
    title: "Accessoires de Protection",
    description: "Vente de coques, films protecteurs et accessoires divers.",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Nos Services
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">
                Services de <span className="text-gradient-gold">Réparation</span> & Plus
              </h1>
              <p className="text-lg text-muted-foreground">
                Experts en réparation de smartphones avec plus de 10 ans d'expérience. 
                Nous offrons des services de qualité à des prix compétitifs.
              </p>
            </div>
          </div>
        </section>

        {/* Repair Services */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
              Services de Réparation
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-background border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <p className="text-primary font-semibold">{service.price}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="hero" size="lg">
                <Link to="/reparation">Demander une réparation</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Other Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
              Autres Services
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {otherServices.map((service) => (
                <div
                  key={service.title}
                  className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <service.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Besoin d'aide ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contactez-nous pour un diagnostic gratuit ou passez directement à notre boutique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/contact">Nous contacter</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:54080419">Appeler: 54 080 419</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
