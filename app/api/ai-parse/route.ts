import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { brand, model, rawText } = await req.json();

  if (!brand || !model || !rawText) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY non configurée" }, { status: 500 });
  }

  const prompt = `Tu es un expert automobile spécialisé dans les véhicules chinois vendus en Afrique francophone.

Voici la fiche technique brute d'une voiture :
Marque : ${brand}
Modèle : ${model}

FICHE TECHNIQUE BRUTE :
${rawText}

Génère un JSON structuré avec exactement ces champs :
{
  "specs": [{ "key": "...", "value": "..." }],
  "mini": [
    { "v": "...", "k": "..." },
    { "v": "...", "k": "..." },
    { "v": "...", "k": "..." }
  ],
  "desc": "...",
  "reasons": [
    { "title": "...", "body": "..." },
    { "title": "...", "body": "..." },
    { "title": "...", "body": "..." },
    { "title": "...", "body": "..." },
    { "title": "...", "body": "..." }
  ],
  "price": "...",
  "cat": "...",
  "colors": ["..."]
}

Instructions :
- "specs" : 8 à 15 caractéristiques techniques extraites de la fiche (Moteur, Puissance, Couple, Transmission, Consommation, Dimensions, Poids, Coffre, etc.)
- "mini" : les 3 specs les plus importantes à afficher sur la carte (ex: v="2.0T", k="Moteur" / v="5", k="Places" / v="0", k="Kilomètre")
- "desc" : une phrase d'accroche courte qui commence par "Découvrez la ${brand} ${model}..."
- "reasons" : exactement 5 objets {title, body}. Chaque raison = une vraie raison d'acheter cette voiture. title = titre court (3-5 mots), body = 1-2 phrases percutantes. Parle au client africain : rapport qualité-prix, fiabilité, confort, autonomie, livraison CIF.
- "price" : prix en FCFA avec espaces si mentionné dans le texte (ex: "13 935 000"), sinon ""
- "cat" : exactement une de ces valeurs : suv, hybride, 5places, 7places
- "colors" : liste des couleurs disponibles si mentionnées, sinon []

Réponds UNIQUEMENT avec le JSON valide, sans texte avant ou après, sans markdown.`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";

  // Strip markdown code fences if present
  const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  try {
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch {
    // Try extracting JSON from within the text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return NextResponse.json(JSON.parse(match[0]));
      } catch {}
    }
    return NextResponse.json({ error: "Réponse IA invalide", raw: text }, { status: 500 });
  }
}
