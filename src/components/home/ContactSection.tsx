import { MapPin, Phone, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Contact
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Visitez-nous à{" "}
              <span className="text-gradient-gold">Zaghouan</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Notre équipe est disponible pour répondre à toutes vos questions. 
              Passez nous voir en boutique ou contactez-nous !
            </p>

            {/* Contact Cards */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Adresse</h4>
                  <p className="text-sm text-muted-foreground">
                    Av de la République, ZAGHOUAN
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Téléphone</h4>
                  <a href="tel:54080419" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    54 080 419
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Horaires</h4>
                  <p className="text-sm text-muted-foreground">
                    Lun - Sam: 9h00 - 19h00
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <Button variant="accent" size="lg" className="w-full sm:w-auto">
              <MessageCircle className="h-5 w-5" />
              Nous contacter sur WhatsApp
            </Button>
          </div>

          {/* Map Placeholder */}
          <div className="relative">
            <div className="aspect-square lg:aspect-auto lg:h-full min-h-[400px] rounded-2xl bg-muted border border-border overflow-hidden">
              {/* Map iframe placeholder */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25832.97726752568!2d10.1331!3d36.4028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd5e4e79c3d1e7%3A0x86c21b16d57d29f5!2sZaghouan!5e0!3m2!1sfr!2stn!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FGS Store Location"
              />
            </div>

            {/* Floating Card */}
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 p-4 rounded-xl bg-card/95 backdrop-blur-lg border border-border shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
                  <span className="font-display font-bold text-primary-foreground">F</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">FGS Store</div>
                  <div className="text-xs text-muted-foreground">Ouvert maintenant</div>
                </div>
              </div>
              <Button size="sm" className="w-full">
                <Send className="h-4 w-4" />
                Itinéraire
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
