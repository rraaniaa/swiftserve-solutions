import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="font-display text-3xl font-bold mb-8">Mentions Légales</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Informations légales</h2>
              <p className="text-muted-foreground">
                <strong>Raison sociale :</strong> FGS Store (FourniGSM Store)<br />
                <strong>Adresse :</strong> Av de la République, ZAGHOUAN, Tunisie<br />
                <strong>Téléphone :</strong> 54 080 419<br />
                <strong>Activité :</strong> Vente d'accessoires GSM et réparation de smartphones
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Hébergement</h2>
              <p className="text-muted-foreground">
                Ce site est hébergé par Lovable (GPT Engineer Inc.).<br />
                Adresse : San Francisco, CA, USA
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Propriété intellectuelle</h2>
              <p className="text-muted-foreground">
                L'ensemble du contenu de ce site (textes, images, logos, graphismes) est protégé 
                par le droit d'auteur. Toute reproduction, même partielle, est interdite sans 
                autorisation préalable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Responsabilité</h2>
              <p className="text-muted-foreground">
                FGS Store s'efforce d'assurer l'exactitude des informations diffusées sur ce site. 
                Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité 
                des informations mises à disposition.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Données personnelles</h2>
              <p className="text-muted-foreground">
                Conformément à la loi tunisienne sur la protection des données personnelles, 
                vous disposez d'un droit d'accès, de rectification et de suppression de vos données. 
                Pour exercer ce droit, contactez-nous au 54 080 419.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Cookies</h2>
              <p className="text-muted-foreground">
                Ce site utilise des cookies pour améliorer votre expérience de navigation. 
                En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalNotice;
