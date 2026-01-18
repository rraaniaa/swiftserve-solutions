import { 
  Smartphone, 
  Monitor, 
  Cable, 
  Printer, 
  Car, 
  GraduationCap,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Smartphone,
    title: "Réparation Smartphones",
    description: "Diagnostic et réparation de tous types de smartphones. Écrans, batteries, connecteurs...",
    color: "primary",
  },
  {
    icon: Monitor,
    title: "Changement Écran",
    description: "Remplacement d'écrans cassés ou défectueux avec des pièces de qualité garantie.",
    color: "secondary",
  },
  {
    icon: Cable,
    title: "Diagnostic GSM",
    description: "Analyse complète de votre appareil pour identifier les problèmes techniques.",
    color: "accent",
  },
  {
    icon: Printer,
    title: "Photocopies & Impressions",
    description: "Services d'impression et de photocopies pour vos documents professionnels.",
    color: "primary",
  },
  {
    icon: Car,
    title: "Visite Technique",
    description: "Accompagnement pour vos démarches de visite technique automobile.",
    color: "secondary",
  },
  {
    icon: GraduationCap,
    title: "Inscription Étudiant",
    description: "Assistance pour les inscriptions universitaires et démarches étudiantes.",
    color: "accent",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 circuit-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nos Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Des solutions pour{" "}
            <span className="text-gradient-gold">tous vos besoins</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            FGS Store vous accompagne dans la réparation, la vente et bien plus encore.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                service.color === "primary" ? "bg-primary/10 text-primary" :
                service.color === "secondary" ? "bg-secondary/20 text-secondary" :
                "bg-accent/10 text-accent"
              }`}>
                <service.icon className="h-7 w-7" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Link */}
              <button className="inline-flex items-center gap-2 text-primary text-sm font-medium group/link">
                En savoir plus
                <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            Tous nos services
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
