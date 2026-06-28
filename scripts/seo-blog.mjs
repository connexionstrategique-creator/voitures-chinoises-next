/**
 * seo-blog.mjs
 * Génère 1 article de blog SEO optimisé via Claude API et le publie dans Sanity.
 * Cible spécifiquement le marché des voitures chinoises en Afrique de l'Ouest.
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

// ─── Portable Text helpers ────────────────────────────────────────────────────
let _k = 0
const key = () => `k${++_k}`
const ptBlock = (text, style = 'normal') => ({
  _type: 'block', _key: key(), style, markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})
const ptListItem = (text, listItem = 'bullet') => ({
  _type: 'block', _key: key(), style: 'normal', listItem, level: 1,
  markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }],
})
const ptImage = (assetId, alt = '') => ({
  _type: 'image', _key: key(), alt,
  asset: { _type: 'reference', _ref: assetId },
})

function sectionsToPortableText(sections) {
  const blocks = []
  for (const s of sections) {
    if (!s) continue
    switch (s.type) {
      case 'paragraph':  blocks.push(ptBlock(s.text)); break
      case 'h2':         blocks.push(ptBlock(s.text, 'h2')); break
      case 'h3':         blocks.push(ptBlock(s.text, 'h3')); break
      case 'blockquote': blocks.push(ptBlock(s.text, 'blockquote')); break
      case 'bullet':     s.items.forEach(t => blocks.push(ptListItem(t, 'bullet'))); break
      case 'numbered':   s.items.forEach(t => blocks.push(ptListItem(t, 'number'))); break
      case 'image': {
        // s._ref est une photo de voiture chinoise du catalogue (assignée en amont)
        if (s._ref) blocks.push(ptImage(s._ref, s.alt || ''))
        break
      }
    }
  }
  return blocks
}

// ─── Images : UNIQUEMENT des photos de voitures chinoises du catalogue ───────
// RÈGLE ABSOLUE : on n'utilise JAMAIS de banque d'images générique (Pexels, etc.).
// Toutes les images des articles proviennent des photos réelles du catalogue
// Sanity (voitures chinoises : BYD, Changan, Jetour, GAC, Haval, Geely…).
async function getCatalogImages() {
  const cars = await sanity.fetch(
    `*[_type=="car" && count(photos) > 0]{ brand, "refs": photos[].asset._ref }`
  )
  const byBrand = {}
  const all = []
  for (const c of cars) {
    const brand = (c.brand || '').toLowerCase().trim()
    const refs = (c.refs || []).filter(Boolean)
    if (!brand || !refs.length) continue
    byBrand[brand] = (byBrand[brand] || []).concat(refs)
    all.push(...refs)
  }
  return { byBrand, all }
}

// Sélecteur : renvoie une photo de voiture chinoise correspondant à la marque
// indiquée (sinon une voiture chinoise au hasard). Évite les doublons par article.
function makeImagePicker(catalog) {
  const used = new Set()
  return function pick(brandHint = '') {
    const hint = String(brandHint).toLowerCase()
    let pool = []
    if (hint) {
      for (const [brand, refs] of Object.entries(catalog.byBrand)) {
        if (hint.includes(brand) || brand.includes(hint)) pool.push(...refs)
      }
    }
    if (!pool.length) pool = catalog.all
    if (!pool.length) return null
    const fresh = pool.filter(r => !used.has(r))
    const from = fresh.length ? fresh : pool
    const choice = from[Math.floor(Math.random() * from.length)]
    if (choice) used.add(choice)
    return choice || null
  }
}

// ─── Récupérer articles déjà publiés ─────────────────────────────────────────
async function getPublished() {
  const posts = await sanity.fetch(`*[_type=="post"] | order(publishedAt desc) { title, slug }`)
  return {
    slugs: posts.map(p => p.slug?.current).filter(Boolean),
    titles: posts.map(p => p.title).filter(Boolean),
  }
}

// ─── Générer 1 article via Claude API ────────────────────────────────────────
async function generateArticle(publishedTitles) {
  console.log('Appel API Claude pour générer un article SEO...')

  const systemPrompt = `Tu es le meilleur rédacteur SEO automobile francophone spécialisé sur le marché africain.
Tu travailles pour voitureschinoises.com, le référence de l'importation directe de voitures chinoises neuves en Afrique de l'Ouest.
Ton objectif absolu : chaque article que tu rédiges doit occuper la position #1 sur Google pour son mot-clé cible.

TON STYLE ET TON NIVEAU D'EXIGENCE :
- Tu rédiges avec la précision d'un journaliste automobile et l'autorité d'un expert du marché africain
- Tes articles contiennent des données chiffrées réelles et précises (prix en FCFA, délais, consommations, puissances)
- Tu intègres des exemples concrets ancrés dans la réalité locale (routes de Cotonou, chaleur d'Abidjan, marchés de Dakar)
- Tu anticipes TOUTES les questions que l'acheteur se pose — et tu y réponds DANS l'article
- Tu ne rédiges PAS du contenu générique : chaque paragraphe apporte une information utile et unique
- Tu utilises les mots-clés sémantiques naturellement (LSI) pour couvrir tout le champ lexical du sujet
- Tes articles respectent les critères E-E-A-T de Google : Experience, Expertise, Authoritativeness, Trustworthiness
- Le français est impeccable, le ton est professionnel mais accessible, sans jargon inutile`

  const userPrompt = `Génère UN article de blog complet de 2 000 à 2 500 mots, le meilleur de sa catégorie sur Google.

═══════════════════════════════════════
CONTEXTE voitureschinoises.com
═══════════════════════════════════════
- Import direct voitures chinoises NEUVES 0 km depuis l'usine
- Marques disponibles : BYD, Changan, Jetour, Geely, GAC, Haval, Chery, MG, GWM, Omoda, BAIC, Dongfeng
- Marchés servis : Bénin (Cotonou), Togo (Lomé), Côte d'Ivoire (Abidjan), Sénégal (Dakar), Mali (Bamako), Burkina Faso (Ouagadougou)
- Prix CIF tout inclus (Coût + Assurance + Fret jusqu'au port) : 8 à 45 millions FCFA
- Paiement : 70% à la commande + 30% avant expédition
- Délai de livraison : 45 à 90 jours selon le modèle et le port
- Contact WhatsApp : +229 41 76 53 41 — réponse sous 24h

DONNÉES TECHNIQUES À INTÉGRER NATURELLEMENT :
- Berlines/citadines : Changan Alsvin (8-10M FCFA), Chery Tiggo 4 Pro (10-12M), MG 5 (11-13M)
- SUV compacts : Changan CS35 Plus (10-13M), Omoda 5 (13-16M), Jetour Dashing (14-17M)
- SUV familiaux 5-7 places : Jetour X70 (14-18M), Changan CS75 Plus (16-20M), Haval H6 (17-21M), GAC GS8 (22-28M)
- Pickup : GWM Poer (18-24M FCFA) — robustesse professionnelle
- Électriques : BYD Atto 3 (22-28M), BYD Seal (28-35M), BYD Dolphin (18-22M)
- Hybrides : BYD Song Plus DM-i (24-30M), Changan Uni-K iDD (26-32M)
- Délais douane Bénin : 15-21 jours ouvrables + droits ~30% valeur CIF
- Délais douane Côte d'Ivoire : 10-15 jours ouvrables + droits ~25% valeur CIF

ARTICLES DÉJÀ PUBLIÉS (NE PAS RÉPÉTER ces sujets) :
${publishedTitles.slice(0, 30).map(t => `- ${t}`).join('\n') || 'Aucun pour l\'instant — tous les sujets sont disponibles'}

═══════════════════════════════════════
SUJETS PRIORITAIRES — choisis le plus pertinent NON encore couvert
═══════════════════════════════════════
MODÈLES PHARES :
1. "BYD Atto 3 au Bénin : prix FCFA, autonomie et avis 2026" [MOT-CLÉ : BYD Atto 3 Bénin prix]
2. "Changan CS75 Plus : le SUV chinois qui bat Toyota RAV4 en Afrique" [MOT-CLÉ : Changan CS75 Plus Afrique]
3. "Haval H6 2026 : fiche technique, prix FCFA et comparatif" [MOT-CLÉ : Haval H6 prix Afrique]
4. "Jetour X70 7 places : le SUV familial idéal pour l'Afrique de l'Ouest" [MOT-CLÉ : Jetour X70 7 places]
5. "Omoda 5 en Côte d'Ivoire : tout ce qu'il faut savoir en 2026" [MOT-CLÉ : Omoda 5 Côte d'Ivoire]
6. "GWM Poer : le pick-up chinois pour les professionnels africains" [MOT-CLÉ : GWM Poer Afrique prix]
7. "BYD Dolphin : voiture électrique pas chère en Afrique de l'Ouest" [MOT-CLÉ : BYD Dolphin Afrique]
8. "Changan Alsvin : la berline chinoise à 10 millions FCFA vaut-elle le coup ?" [MOT-CLÉ : Changan Alsvin prix FCFA]
9. "GAC GS8 : le SUV luxe chinois 7 places pour l'Afrique" [MOT-CLÉ : GAC GS8 Afrique]
10. "MG ZS 2026 : SUV compact chinois prix et fiche technique" [MOT-CLÉ : MG ZS prix Afrique]

GUIDES ET COMPARATIFS :
11. "Voiture neuve vs occasion importée en Afrique : le vrai comparatif 2026" [MOT-CLÉ : voiture neuve occasion afrique]
12. "Top 5 voitures chinoises les plus fiables pour le taxi en Afrique" [MOT-CLÉ : voiture chinoise taxi afrique]
13. "SUV 7 places moins de 20 millions FCFA : notre sélection 2026" [MOT-CLÉ : SUV 7 places moins 20 millions FCFA]
14. "Voiture électrique en Afrique de l'Ouest : mythe ou réalité en 2026 ?" [MOT-CLÉ : voiture électrique afrique ouest]
15. "Changan vs BYD vs Jetour : quel constructeur choisir pour l'Afrique ?" [MOT-CLÉ : meilleure marque chinoise afrique]
16. "Comment financer l'achat d'une voiture chinoise neuve au Bénin" [MOT-CLÉ : financement voiture neuve bénin]
17. "Voiture chinoise hybride en Afrique : avantages réels sur route africaine" [MOT-CLÉ : voiture hybride afrique]
18. "Top 10 voitures chinoises moins de 15 millions FCFA en 2026" [MOT-CLÉ : voiture chinoise moins 15 millions FCFA]

PAR VILLE / MARCHÉ :
19. "Acheter une voiture neuve à Cotonou : guide pratique 2026" [MOT-CLÉ : achat voiture neuve Cotonou]
20. "Importation voiture Lomé : procédures, taxes et délais en 2026" [MOT-CLÉ : importation voiture Lomé]
21. "Voiture neuve à Abidjan : pourquoi le CIF change tout" [MOT-CLÉ : voiture neuve Abidjan prix]
22. "Meilleure voiture pour rouler à Dakar : notre sélection 2026" [MOT-CLÉ : voiture Dakar meilleure]
23. "Importer une voiture au Mali depuis la Chine : guide complet 2026" [MOT-CLÉ : importation voiture Mali]

PRATIQUE ET ENTRETIEN :
24. "Entretien voiture chinoise en Afrique : ce qu'il faut vraiment savoir" [MOT-CLÉ : entretien voiture chinoise afrique]
25. "Pièces détachées voitures chinoises à Cotonou, Lomé et Abidjan en 2026" [MOT-CLÉ : pièces détachées voiture chinoise]
26. "Dédouanement voiture importée au Bénin : procédure et coûts réels 2026" [MOT-CLÉ : dédouanement voiture bénin]
27. "Assurance voiture neuve importée en Afrique de l'Ouest : guide 2026" [MOT-CLÉ : assurance voiture importée afrique]
28. "Garantie constructeur voiture chinoise : ce qui est couvert en Afrique" [MOT-CLÉ : garantie voiture chinoise afrique]

═══════════════════════════════════════
EXIGENCES QUALITÉ — TOUTES OBLIGATOIRES
═══════════════════════════════════════
STRUCTURE SEO :
1. seoTitle : exactement 55-62 caractères, mot-clé principal en début
2. seoDescription : exactement 148-158 caractères, bénéfice concret + appel à l'action
3. Introduction : 150-200 mots — pose le problème réel de l'acheteur africain, promet une réponse concrète
4. H2s : 5 à 7 sections, chaque titre contient un mot-clé secondaire différent
5. Minimum 1 tableau comparatif (prix/modèles, ou avantages/inconvénients)
6. FAQ finale : 4 questions que les internautes tapent vraiment sur Google, réponses 60-80 mots (format featured snippet)
7. CTA final : invitation à consulter le catalogue voitureschinoises.com OU WhatsApp +229 41 76 53 41

QUALITÉ RÉDACTIONNELLE :
- Données chiffrées obligatoires : cite au moins 6 prix précis en FCFA, 2 délais, 1 consommation, 1 puissance
- Contexte local : mentionne les réalités africaines (chaleur, routes, douanes, FCFA, WhatsApp)
- Pas de formules creuses ("il est important de noter", "en conclusion", "en résumé") — va droit au fait
- Chaque paragraphe doit apporter une information NOUVELLE et UTILE
- Utilise des mots-clés sémantiques naturellement : import direct, voiture neuve 0 km, prix CIF, livraison port, garantie constructeur
- Minimum 4 mentions de villes africaines (Cotonou, Lomé, Abidjan, Dakar — répartis dans le texte)
- Pas de superlatifs vides — si tu dis "le meilleur", explique POURQUOI avec des chiffres

IMAGES — VOITURES CHINOISES UNIQUEMENT :
8. Les images sont sélectionnées AUTOMATIQUEMENT parmi les vraies photos du catalogue (voitures chinoises). Tu ne fournis JAMAIS d'URL ni d'identifiant d'image. Tu indiques seulement la marque :
   - "coverBrand" : la marque chinoise la plus pertinente pour la couverture
   - 2 sections {"type":"image","brand":"<marque chinoise>","alt":"texte alternatif avec mot-clé"} dans le corps
   - Place la 1ère image après la 2e section H2, la 2e image après la 4e section H2
   - INTERDIT : banques d'images génériques (Pexels, Unsplash…). Seules les voitures chinoises du catalogue sont autorisées.

MARQUES CHINOISES VALIDES (pour coverBrand et brand) :
BYD, Changan, Jetour, GAC, Geely, Haval, Chery, MG, GWM, Omoda, Livan, EXEED, Bestune, Roewe — choisis celle qui correspond le mieux au sujet de l'article.

═══════════════════════════════════════
FORMAT DE RÉPONSE — JSON STRICT
═══════════════════════════════════════
RÉPONDS UNIQUEMENT avec un objet JSON valide, sans texte avant ni après :
{
  "title": "Titre H1 complet et accrocheur",
  "slug": "slug-kebab-case-sans-accents-ni-majuscules-ni-apostrophes",
  "seoTitle": "Titre SEO exactement 55-62 caractères",
  "seoDescription": "Description meta exactement 148-158 caractères avec bénéfice et appel à l'action clair.",
  "excerpt": "Accroche courte 120-140 caractères pour les aperçus et réseaux sociaux.",
  "category": "guides",
  "tags": ["voiture chinoise", "afrique", "tag-specifique-1", "tag-specifique-2", "marque-ou-modele"],
  "coverBrand": "BYD",
  "sections": [
    { "type": "paragraph", "text": "Introduction 150-200 mots : situation réelle de l'acheteur africain, données contextuelles, promesse de l'article..." },
    { "type": "h2", "text": "Titre H2 avec mot-clé secondaire" },
    { "type": "paragraph", "text": "Contenu 200-280 mots avec données chiffrées, exemples concrets, contexte africain..." },
    { "type": "bullet", "items": ["Point précis avec chiffre ou exemple", "Point précis avec chiffre ou exemple", "Point précis avec chiffre ou exemple", "Point précis avec chiffre ou exemple"] },
    { "type": "h2", "text": "Deuxième H2 avec mot-clé différent" },
    { "type": "paragraph", "text": "Contenu 200-280 mots..." },
    { "type": "image", "brand": "Changan", "alt": "Description alt avec mot-clé principal et contexte africain" },
    { "type": "h2", "text": "Tableau comparatif ou analyse comparative" },
    { "type": "paragraph", "text": "Intro du comparatif..." },
    { "type": "bullet", "items": ["Modèle A (XX millions FCFA) : avantage + inconvénient", "Modèle B (XX millions FCFA) : avantage + inconvénient", "Modèle C (XX millions FCFA) : avantage + inconvénient"] },
    { "type": "h2", "text": "Quatrième H2 — approfondissement" },
    { "type": "paragraph", "text": "Contenu 200-280 mots..." },
    { "type": "blockquote", "text": "Fait clé ou conseil expert ancré dans la réalité du marché africain." },
    { "type": "image", "brand": "BYD", "alt": "Description alt avec contexte africain et mot-clé" },
    { "type": "h2", "text": "Cinquième H2 — aspect pratique" },
    { "type": "paragraph", "text": "Contenu 150-220 mots..." },
    { "type": "h2", "text": "Questions fréquentes sur [sujet]" },
    { "type": "h3", "text": "Question 1 réelle que les gens tapent sur Google ?" },
    { "type": "paragraph", "text": "Réponse directe et complète de 60-80 mots, chiffrée, sans introduction." },
    { "type": "h3", "text": "Question 2 ?" },
    { "type": "paragraph", "text": "Réponse 60-80 mots..." },
    { "type": "h3", "text": "Question 3 ?" },
    { "type": "paragraph", "text": "Réponse 60-80 mots..." },
    { "type": "h3", "text": "Question 4 ?" },
    { "type": "paragraph", "text": "Réponse 60-80 mots..." },
    { "type": "h2", "text": "Conclusion" },
    { "type": "paragraph", "text": "Conclusion 100-140 mots : synthèse des points clés, invitation concrète à agir (catalogue voitureschinoises.com ou WhatsApp +229 41 76 53 41 pour un devis CIF personnalisé sous 24h)." }
  ]
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic API ${response.status}: ${err}`)
  }

  const data = await response.json()
  let raw = data.content[0].text.trim()
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (m) raw = m[1]
  return JSON.parse(raw)
}

// ─── Publier l'article dans Sanity ───────────────────────────────────────────
async function publishArticle(article) {
  const existing = await sanity.fetch(
    `*[_type=="post" && slug.current==$s][0]._id`,
    { s: article.slug }
  )
  if (existing) {
    console.log(`  Slug déjà publié : ${article.slug} — ignoré`)
    return null
  }

  const body = sectionsToPortableText(article.sections)
  const mainRef = article._coverRef || null

  const doc = {
    _type: 'post',
    title: article.title,
    slug: { _type: 'slug', current: article.slug },
    publishedAt: new Date().toISOString(),
    category: article.category || 'guides',
    tags: article.tags || [],
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    excerpt: article.excerpt || '',
    body,
    ...(mainRef && {
      mainImage: { _type: 'image', asset: { _type: 'reference', _ref: mainRef } },
    }),
  }

  const created = await sanity.create(doc)
  console.log(`  ✅ Publié : "${article.title}"`)
  console.log(`     URL : https://www.voitureschinoises.com/blog/${article.slug}`)
  return created
}

// ─── Sauvegarder JSON localement ─────────────────────────────────────────────
async function saveArticleJson(article) {
  const fs = await import('fs')
  const date = new Date().toISOString().slice(0, 10)
  const path = `seo-logs/article-${date}.json`
  fs.default.mkdirSync('seo-logs', { recursive: true })
  fs.default.writeFileSync(path, JSON.stringify(article, null, 2))
  return path
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export async function runBlog() {
  console.log('\n📝 TÂCHE : Génération article de blog SEO')
  console.log(`   ${new Date().toISOString()}`)

  let titles = []
  try {
    const { titles: t } = await getPublished()
    titles = t
    console.log(`   Articles existants : ${titles.length}`)
  } catch (e) {
    console.warn(`   ⚠️ Lecture articles existants échouée (proxy) : ${e.message}`)
  }

  const article = await generateArticle(titles)
  console.log(`   Article généré : "${article.title}"`)
  console.log(`   seoTitle (${article.seoTitle?.length} chars) : ${article.seoTitle}`)
  console.log(`   seoDesc (${article.seoDescription?.length} chars) : ${article.seoDescription}`)

  // ── Images : assigner UNIQUEMENT des photos de voitures chinoises du catalogue ──
  try {
    const catalog = await getCatalogImages()
    const pick = makeImagePicker(catalog)
    const brandHint = article.coverBrand || (article.tags || []).join(' ') || article.title
    article._coverRef = pick(brandHint)
    for (const s of article.sections || []) {
      if (s.type === 'image') s._ref = pick(s.brand || article.coverBrand || '')
    }
    const imgCount = (article.sections || []).filter(s => s.type === 'image' && s._ref).length
    console.log(`   Couverture : ${article._coverRef ? 'photo catalogue ✓' : '— aucune'} | images corps : ${imgCount}`)
  } catch (e) {
    console.warn(`   ⚠️ Photos catalogue indisponibles (${e.message}) — article publié sans image (jamais d'image générique)`)
  }

  const jsonPath = await saveArticleJson(article)
  console.log(`   JSON sauvegardé : ${jsonPath}`)


  // Tenter la publication directe (peut être bloquée par proxy)
  let published = null
  try {
    published = await publishArticle(article)
    if (published && VERCEL_DEPLOY_HOOK) {
      await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' })
      console.log('   🚀 Vercel redéploiement déclenché')
    }
  } catch (e) {
    console.warn(`   ⚠️ Publication Sanity directe échouée : ${e.message}`)

    console.log(`\n[SANITY_MCP_REQUIRED]`)
    console.log(`ACTION: Publie cet article dans Sanity avec "Create document(s)".`)
    console.log(`  IMAGES : utilise UNIQUEMENT des photos de voitures chinoises du catalogue (documents _type=="car", champ photos[]).`)
    console.log(`           N'utilise JAMAIS de banque d'images générique (Pexels, etc.).`)
    console.log(`  - mainImage : _coverRef indiqué dans le JSON (réf. asset d'une voiture chinoise).`)
    console.log(`  - chaque section image : utilise son _ref (réf. asset d'une voiture chinoise).`)
    console.log(`FILE: ${jsonPath}`)
    console.log(`SLUG: ${article.slug}`)
    console.log(`[/SANITY_MCP_REQUIRED]`)
  }

  return published ? 1 : 0
}
