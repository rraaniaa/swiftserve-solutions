import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="font-display text-3xl font-bold mb-8">Conditions Générales de Vente</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Objet</h2>
              <p className="text-muted-foreground">
                Les présentes conditions générales de vente régissent les relations contractuelles 
                entre FGS Store et ses clients dans le cadre de la vente de produits et services 
                de réparation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Prix</h2>
              <p className="text-muted-foreground">
                Les prix sont indiqués en Dinars Tunisiens (DT) TTC. FGS Store se réserve le droit 
                de modifier ses prix à tout moment, étant entendu que le prix figurant au catalogue 
                le jour de la commande sera le seul applicable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Commandes</h2>
              <p className="text-muted-foreground">
                Toute commande implique l'acceptation des présentes conditions générales de vente. 
                La validation de la commande vaut engagement ferme de la part du client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Paiement</h2>
              <p className="text-muted-foreground">
                Le paiement peut être effectué :<br /><br />
                - À la livraison (paiement contre remboursement)<br />
                - Par carte bancaire (via plateforme sécurisée)<br /><br />
                Le paiement est exigible à la commande ou à la livraison selon le mode choisi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Livraison</h2>
              <p className="text-muted-foreground">
                Les délais de livraison sont donnés à titre indicatif :<br /><br />
                - Zaghouan et environs : 24-48h<br />
                - Reste de la Tunisie : 2-5 jours ouvrables<br /><br />
                Frais de livraison : Gratuit à partir de 200 DT, sinon 7 DT.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Retours et remboursements</h2>
              <p className="text-muted-foreground">
                Le client dispose d'un délai de 7 jours à compter de la réception pour retourner 
                un produit non conforme ou défectueux. Le produit doit être retourné dans son 
                emballage d'origine, non utilisé et accompagné de la facture.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Garantie réparations</h2>
              <p className="text-muted-foreground">
                Toutes les réparations effectuées par FGS Store sont garanties 6 mois. Cette 
                garantie couvre les pièces remplacées et la main d'œuvre. Elle ne couvre pas 
                les dommages causés par une mauvaise utilisation ou un choc.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Responsabilité</h2>
              <p className="text-muted-foreground">
                FGS Store ne saurait être tenu responsable des dommages indirects résultant de 
                l'utilisation des produits vendus ou des services de réparation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Litiges</h2>
              <p className="text-muted-foreground">
                En cas de litige, une solution amiable sera recherchée avant toute action 
                judiciaire. À défaut, les tribunaux tunisiens seront seuls compétents.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
