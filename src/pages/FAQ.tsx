import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";

const faqs = [
  {
    category: "Réparations",
    questions: [
      {
        q: "Combien de temps dure une réparation ?",
        a: "La plupart des réparations sont effectuées en moins de 24 heures. Pour les cas plus complexes ou nécessitant des pièces spéciales, le délai peut aller jusqu'à 3-5 jours.",
      },
      {
        q: "Quelle est la garantie sur les réparations ?",
        a: "Toutes nos réparations sont garanties 6 mois. Cette garantie couvre les pièces remplacées et la main d'œuvre.",
      },
      {
        q: "Utilisez-vous des pièces originales ?",
        a: "Nous utilisons des pièces de qualité OEM (Original Equipment Manufacturer) qui offrent les mêmes performances que les pièces d'origine.",
      },
      {
        q: "Le diagnostic est-il gratuit ?",
        a: "Oui, le diagnostic est entièrement gratuit et sans engagement. Nous vous informerons du problème et du coût de réparation avant toute intervention.",
      },
      {
        q: "Puis-je suivre l'état de ma réparation ?",
        a: "Oui, vous pouvez suivre l'état de votre réparation en ligne avec votre numéro de suivi. Vous recevrez également des notifications par SMS.",
      },
    ],
  },
  {
    category: "Commandes & Livraison",
    questions: [
      {
        q: "Quels sont les délais de livraison ?",
        a: "Pour Zaghouan et environs, la livraison est effectuée en 24-48h. Pour le reste de la Tunisie, comptez 2-5 jours ouvrables.",
      },
      {
        q: "La livraison est-elle gratuite ?",
        a: "La livraison est gratuite pour toute commande supérieure à 200 DT. En dessous, les frais de livraison sont de 7 DT.",
      },
      {
        q: "Puis-je payer à la livraison ?",
        a: "Oui, nous proposons le paiement à la livraison (COD) pour toutes les commandes en Tunisie.",
      },
      {
        q: "Comment annuler ma commande ?",
        a: "Vous pouvez annuler votre commande tant qu'elle n'a pas été expédiée. Contactez-nous par téléphone ou via votre espace client.",
      },
    ],
  },
  {
    category: "Compte & Paiement",
    questions: [
      {
        q: "Comment créer un compte ?",
        a: "Cliquez sur 'Connexion' puis 'Créer un compte'. Remplissez le formulaire avec vos informations et validez votre email.",
      },
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons le paiement à la livraison (COD) et les cartes bancaires via une plateforme sécurisée.",
      },
      {
        q: "Mes données sont-elles sécurisées ?",
        a: "Oui, nous utilisons des protocoles de sécurité avancés pour protéger vos données personnelles et bancaires.",
      },
    ],
  },
  {
    category: "Retours & Remboursements",
    questions: [
      {
        q: "Quelle est la politique de retour ?",
        a: "Vous disposez de 7 jours après réception pour retourner un produit non utilisé dans son emballage d'origine.",
      },
      {
        q: "Comment effectuer un retour ?",
        a: "Contactez notre service client pour obtenir un numéro de retour, puis renvoyez le produit à notre adresse.",
      },
      {
        q: "Quand serai-je remboursé ?",
        a: "Le remboursement est effectué sous 5-7 jours ouvrables après réception et vérification du produit retourné.",
      },
    ],
  },
];

const FAQ = () => {
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
                FAQ
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">
                Questions <span className="text-gradient-gold">Fréquentes</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Trouvez les réponses à vos questions les plus courantes.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {faqs.map((section) => (
              <div key={section.category} className="mb-12">
                <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {section.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${section.category}-${index}`}
                      className="bg-card border border-border rounded-xl px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-2xl font-bold mb-4">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Notre équipe est là pour vous aider.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/contact">
                  <MessageCircle className="h-5 w-5" />
                  Nous contacter
                </Link>
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

export default FAQ;
