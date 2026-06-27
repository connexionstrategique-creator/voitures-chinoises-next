/**
 * seo-cars.mjs
 * Optimise les métadonnées SEO des fiches voitures dans Sanity via Claude API.
 * Améliore seoTitle, seoDescription et desc pour chaque voiture.
 */
import { createClient } from '@sanity/client'

const SANITY_TOKEN      = process.env.SANITY_TOKEN
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK

if (!SANITY_TOKEN)      throw new Error('SANITY_TOKEN manquant')
if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY manquant')

const sanity = createClient({
  projectId: 't3ow1rmc',
  dataset: 'production',
  token: SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function optimizeCarSEO(car) {
  const prompt = `Tu es un expert SEO pour le marché automobile africain francophone.
Génère des métadonnées SEO optimales pour cette fiche voiture.

VOITURE : ${car.brand} ${car.model}
PRIX : ${car.price || 'Non renseigné'} FCFA
CATÉGORIE : ${car.cat || 'SUV'}
ANNÉE : ${car.year || '2025'}
SPECS : ${JSON.stringify(car.specs || {})}
DESCRIPTION ACTUELLE : ${car.desc || 'Aucune'}

CONTEXTE : Voitures chinoises neuves 0 km, livraison CIF (Coût + Assurance + Fret inclus) vers Cotonou, Lomé, Abidjan, Dakar. Paiement 70%+30%.

Génère UNIQUEMENT ce JSON valide (sans texte avant/après) :
{
  "seoTitle": "Titre SEO 55-62 caractères avec marque + modèle + FCFA ou Afrique",
  "seoDescription": "Description 148-158 caractères : features clés + CIF + livraison + appel à l'action",
  "desc": "Description longue 180-220 mots : présentation du véhicule, atouts pour le marché africain, motorisation, habitacle, mentions des villes (Cotonou, Lomé, Abidjan, Dakar), avantage prix CIF"
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) throw new Error(`API ${response.status}`)
  const data = await response.json()
  let raw = data.content[0].text.trim()
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (m) raw = m[1]
  return JSON.parse(raw)
}

export async function runCarsOptimization() {
  console.log('\n🚗 TÂCHE : Optimisation SEO des fiches voitures')
  console.log(`   ${new Date().toISOString()}`)

  // Récupérer les voitures via Sanity (peut être bloqué par proxy)
  let cars = []
  try {
    cars = await sanity.fetch(`
      *[_type == "car"] | order(_createdAt asc) {
        _id, brand, model, price, cat, year, desc, specs,
        seoTitle, seoDescription
      }
    `)
    console.log(`   Total voitures : ${cars.length}`)
  } catch (e) {
    console.warn(`   ⚠️ Lecture Sanity échouée (proxy) : ${e.message}`)
    console.log(`\n[SANITY_MCP_REQUIRED]`)
    console.log(`ACTION: Utilise le connecteur MCP Sanity (outil "Get document" ou "List datasets") pour lire les fiches voitures (_type=="car"), puis génère les seoTitle/seoDescription optimisés via Claude API, et utilise "Patch document(s)" pour les mettre à jour. Max 5 voitures avec seoTitle < 30 chars ou seoDescription < 80 chars.`)
    console.log(`[/SANITY_MCP_REQUIRED]`)
    return 0
  }

  // Prioriser celles sans SEO ou avec SEO trop court
  const toOptimize = cars.filter(c =>
    !c.seoTitle ||
    c.seoTitle.length < 30 ||
    !c.seoDescription ||
    c.seoDescription.length < 80 ||
    !c.desc ||
    c.desc.length < 100
  ).slice(0, 5)

  if (toOptimize.length === 0) {
    console.log('   ✅ Toutes les voitures ont déjà des métadonnées SEO complètes')
    return 0
  }

  console.log(`   Voitures à optimiser : ${toOptimize.length}`)
  const results = []
  let updated = 0

  for (const car of toOptimize) {
    try {
      console.log(`\n   Optimisation : ${car.brand} ${car.model}`)
      const seo = await optimizeCarSEO(car)

      console.log(`     seoTitle (${seo.seoTitle?.length}c) : ${seo.seoTitle}`)
      console.log(`     seoDesc (${seo.seoDescription?.length}c) : ${seo.seoDescription?.substring(0, 60)}...`)

      results.push({ _id: car._id, brand: car.brand, model: car.model, seo })

      try {
        await sanity.patch(car._id).set({
          seoTitle: seo.seoTitle,
          seoDescription: seo.seoDescription,
          ...(seo.desc && { desc: seo.desc }),
        }).commit()
        console.log(`     ✅ Mis à jour dans Sanity`)
        updated++
      } catch (patchErr) {
        console.warn(`     ⚠️ Patch Sanity échoué (proxy) : ${patchErr.message}`)
      }

      await new Promise(r => setTimeout(r, 800))
    } catch (e) {
      console.error(`     ✗ Erreur ${car.brand} ${car.model} : ${e.message}`)
    }
  }

  // Sauvegarder les SEO générés
  if (results.length > 0) {
    const fs = await import('fs')
    const date = new Date().toISOString().slice(0, 10)
    const path = `seo-logs/cars-seo-${date}.json`
    fs.default.mkdirSync('seo-logs', { recursive: true })
    fs.default.writeFileSync(path, JSON.stringify(results, null, 2))
    console.log(`\n   JSON sauvegardé : ${path}`)

    if (updated < results.length) {
      const notPatched = results.filter((_, i) => i >= updated)
      console.log(`\n[SANITY_MCP_REQUIRED]`)
      console.log(`ACTION: Utilise le connecteur MCP Sanity (outil "Patch document(s)") pour mettre à jour ${notPatched.length} voitures non patchées.`)
      console.log(`FILE: ${path}`)
      console.log(`[/SANITY_MCP_REQUIRED]`)
    }
  }

  if (updated > 0 && VERCEL_DEPLOY_HOOK) {
    await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' })
    console.log('\n   🚀 Vercel redéploiement déclenché')
  }

  console.log(`\n   Résultat : ${updated}/${toOptimize.length} voitures optimisées`)
  return updated
}
