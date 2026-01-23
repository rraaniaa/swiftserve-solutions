import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="font-display text-3xl font-bold mb-8">Politique de Confidentialité</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Collecte des données</h2>
              <p className="text-muted-foreground">
                FGS Store collecte les données personnelles suivantes lors de votre utilisation 
                du site :<br /><br />
                - Nom et prénom<br />
                - Adresse email<br />
                - Numéro de téléphone<br />
                - Adresse de livraison<br />
                - Historique des commandes et réparations
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Utilisation des données</h2>
              <p className="text-muted-foreground">
                Vos données sont utilisées pour :<br /><br />
                - Traiter vos commandes et demandes de réparation<br />
                - Vous contacter concernant vos commandes<br />
                - Améliorer nos services<br />
                - Vous envoyer des informations promotionnelles (avec votre consentement)
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Protection des données</h2>
              <p className="text-muted-foreground">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos 
                données personnelles contre tout accès non autorisé, modification, divulgation 
                ou destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Partage des données</h2>
              <p className="text-muted-foreground">
                Nous ne vendons, n'échangeons ni ne transférons vos données personnelles à des 
                tiers, sauf pour assurer le service de livraison de vos commandes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Vos droits</h2>
              <p className="text-muted-foreground">
                Vous avez le droit de :<br /><br />
                - Accéder à vos données personnelles<br />
                - Demander la rectification de vos données<br />
                - Demander la suppression de vos données<br />
                - Vous opposer au traitement de vos données<br /><br />
                Pour exercer ces droits, contactez-nous au 54 080 419.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Conservation des données</h2>
              <p className="text-muted-foreground">
                Nous conservons vos données personnelles pendant la durée nécessaire aux finalités 
                pour lesquelles elles ont été collectées, conformément à la législation en vigueur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Modifications</h2>
              <p className="text-muted-foreground">
                Nous nous réservons le droit de modifier cette politique de confidentialité à 
                tout moment. Les modifications seront publiées sur cette page.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
