import { Button } from "@/components/ui/button";
import { Wrench, Clock, Shield, CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Réparation Express",
    description: "La plupart des réparations en moins de 24h",
  },
  {
    icon: Shield,
    title: "Garantie 6 Mois",
    description: "Toutes nos réparations sont garanties",
  },
  {
    icon: CheckCircle2,
    title: "Pièces Originales",
    description: "Nous utilisons des pièces de qualité OEM",
  },
];

const RepairCTASection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 circuit-pattern opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              Réparation GSM
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Votre téléphone est{" "}
              <span className="text-gradient-accent">cassé</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Ne vous inquiétez pas ! Nos experts sont là pour redonner vie à votre appareil. 
              Écran cassé, batterie faible, problème de charge... nous réparons tout !
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                <Wrench className="h-5 w-5" />
                Demander un devis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Suivre ma réparation
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            {/* Main card */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-2xl">
              <h3 className="font-display text-xl font-semibold mb-6 text-center">
                Formulaire de Réparation
              </h3>
              
              {/* Form Preview */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Nom
                  </label>
                  <div className="h-12 rounded-lg bg-muted border border-border" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Téléphone
                  </label>
                  <div className="h-12 rounded-lg bg-muted border border-border" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Type de panne
                  </label>
                  <div className="h-12 rounded-lg bg-muted border border-border" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Description
                  </label>
                  <div className="h-24 rounded-lg bg-muted border border-border" />
                </div>
                <Button variant="hero" className="w-full" size="lg">
                  Envoyer la demande
                </Button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 -top-8 -right-8 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-8 -left-8 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RepairCTASection;
