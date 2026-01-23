import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, ShoppingBag, ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBanner} 
          alt="FGS Store - Réparation GSM et Accessoires"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 circuit-pattern z-10 opacity-30" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Service Rapide à Zaghouan</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Réparation</span>{" "}
            <span className="text-gradient-gold">GSM</span>
            <br />
            <span className="text-foreground">&</span>{" "}
            <span className="text-gradient-accent">Accessoires</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl animate-fade-in">
            Expert en réparation de smartphones et vente d'accessoires de qualité. 
            Service rapide, prix compétitifs et garantie sur toutes nos interventions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/reparation">
              <Button variant="hero" size="xl" className="group">
                <Wrench className="h-5 w-5" />
                Réparer mon téléphone
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/boutique">
              <Button variant="glass" size="xl" className="group">
                <ShoppingBag className="h-5 w-5" />
                Voir la boutique
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 md:gap-12">
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="font-display text-3xl md:text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Réparations/an</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="font-display text-3xl md:text-4xl font-bold text-secondary">1000+</div>
              <div className="text-sm text-muted-foreground">Clients satisfaits</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="font-display text-3xl md:text-4xl font-bold text-accent">24h</div>
              <div className="text-sm text-muted-foreground">Délai moyen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decoration */}
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float hidden lg:block" />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float hidden lg:block" style={{ animationDelay: "-2s" }} />
    </section>
  );
};

export default HeroSection;
