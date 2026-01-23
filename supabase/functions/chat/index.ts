import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Tu es l'assistant virtuel de FGS Store (FourniGSM Store), une boutique spécialisée dans la réparation de smartphones et la vente d'accessoires GSM à Zaghouan, Tunisie.

Informations sur FGS Store:
- Adresse: Av de la République, ZAGHOUAN
- Téléphone: 54 080 419
- Horaires: Lundi - Samedi, 9h - 19h

Services proposés:
- Réparation de smartphones (écrans cassés, batteries, problèmes de charge, etc.)
- Vente d'accessoires (coques, chargeurs, écouteurs, etc.)
- Photocopies et services administratifs
- Visite technique

Points forts:
- Réparation express en moins de 24h pour la plupart des pannes
- Garantie 6 mois sur toutes les réparations
- Pièces de qualité OEM
- Prix compétitifs

Tu dois être:
- Poli et professionnel
- Utile et informatif
- Répondre en français par défaut, mais tu peux aussi répondre en arabe tunisien si le client le souhaite
- Guider les clients vers les bonnes pages (boutique, réparation, contact)
- Aider avec les questions sur les produits, les réparations et les commandes`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporairement indisponible." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur du service AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
