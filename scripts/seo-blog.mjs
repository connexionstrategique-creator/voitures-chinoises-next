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

function sectionsToPortableText(sections, imageRefs) {
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
        const ref = imageRefs?.[s.pexelsId]
        if (ref) blocks.push(ptImage(ref, s.alt || ''))
        break
      }
    }
  }
  return blocks
}

// ─── Upload image Pexels → Sanity ────────────────────────────────────────────
async function uploadPexels(photoId) {
  const url = `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1920`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'voitureschinoise-bot/1.0' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const asset = await sanity.assets.upload('image', buf, {
      filename: `pexels-${photoId}.jpg`, contentType: 'image/jpeg',
    })
    console.log(`    Image #${photoId} → ${asset._id}`)
    return asset._id
  } catch (e) {
    console.warn(`    Image #${photoId} ignorée : ${e.message}`)
    return null
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

  const systemPrompt = `Tu es un expert SEO et rédacteur automobile spécialisé dans le marché africain francophone.
Tu rédiges des articles de blog longs, détaillés et optimisés SEO pour voitureschinoises.com.
Public cible : acheteurs de voitures en Bénin, Togo, Côte d'Ivoire, Sénégal, Mali, Burkina Faso.
Langue : français professionnel, adapté à l'Afrique de l'Ouest.
Objectif : ranker #1 sur Google pour les requêtes liées aux voitures chinoises en Afrique de l'Ouest.`

  const userPrompt = `Génère UN article de blog complet de 1 500 à 2 000 mots, hautement optimisé pour le SEO.

CONTEXTE DU SITE :
- voitureschinoises.com — import voitures chinoises neuves 0 km
- Marques : BYD, Changan, Jetour, Geely, GAC, Haval, Chery, MG, GWM, Omoda
- Marchés : Bénin (Cotonou), Togo (Lomé), Côte d'Ivoire (Abidjan), Sénégal (Dakar)
- Avantage clé : Prix CIF tout inclus (Coût + Assurance + Fret) 70% commande + 30% avant expédition
- Prix : 8 à 40 millions FCFA selon modèle
- Contact : WhatsApp +229 41 76 53 41

ARTICLES DÉJÀ PUBLIÉS (ne pas répéter ces sujets) :
${publishedTitles.slice(0, 25).map(t => `- ${t}`).join('\n') || 'Aucun pour l\'instant'}

SUJETS PRIORITAIRES (choisis le plus pertinent non encore couvert) :
1. "Voiture chinoise au Bénin : guide complet 2025" [MOT-CLÉ : voiture chinoise bénin]
2. "BYD en Afrique de l'Ouest : modèles, prix FCFA et avis 2025" [MOT-CLÉ : BYD afrique]
3. "Comment importer une voiture de Chine en Afrique : le guide étape par étape" [MOT-CLÉ : import voiture chine afrique]
4. "Top 5 SUV chinois 7 places pour familles africaines en 2025" [MOT-CLÉ : SUV chinois 7 places afrique]
5. "Voiture hybride ou essence pour l'Afrique : laquelle choisir ?" [MOT-CLÉ : voiture hybride afrique]
6. "Changan vs BYD vs Jetour : comparatif complet pour l'Afrique" [MOT-CLÉ : meilleure voiture chinoise afrique]
7. "Dédouanement voiture importée au Bénin et Togo : tout ce qu'il faut savoir" [MOT-CLÉ : dédouanement voiture importée bénin]
8. "Les voitures chinoises sont-elles fiables ? Notre analyse honnête" [MOT-CLÉ : voiture chinoise fiable avis]
9. "Prix CIF expliqué : pourquoi c'est l'avantage décisif pour acheter" [MOT-CLÉ : prix CIF voiture afrique]
10. "Meilleure voiture chinoise pour taxi en Afrique de l'Ouest 2025" [MOT-CLÉ : voiture chinoise taxi afrique]
11. "Acheter une voiture BYD Titanium 7 au Bénin : guide complet" [MOT-CLÉ : BYD Titanium 7 bénin]
12. "Changan CS75 Plus : le SUV le plus populaire en Afrique de l'Ouest" [MOT-CLÉ : Changan CS75 afrique]
13. "Voiture neuve 0 km à Cotonou : pourquoi choisir le direct usine ?" [MOT-CLÉ : voiture neuve cotonou]
14. "Jetour X70 : le SUV 7 places abordable pour les familles africaines" [MOT-CLÉ : Jetour X70 afrique]
15. "Arnaque ou opportunité ? Acheter une voiture depuis la Chine" [MOT-CLÉ : acheter voiture chine afrique]

EXIGENCES SEO OBLIGATOIRES :
1. seoTitle : exactement 55 à 62 caractères, avec le mot-clé principal au début
2. seoDescription : exactement 148 à 158 caractères, avec appel à l'action et mot-clé
3. H1 : contient le mot-clé principal (même si similaire au seoTitle)
4. H2s : 5 à 7 sections avec mots-clés secondaires naturellement intégrés
5. Mentions obligatoires : Cotonou, Lomé, Abidjan, Dakar + prix en FCFA + délai 45-90 jours
6. FAQ finale : 4 questions précises avec réponses de 50-70 mots (format featured snippet)
7. CTA final vers catalogue ou WhatsApp +229 41 76 53 41
8. IMAGES OBLIGATOIRES — tu DOIS inclure exactement :
   - Le champ "mainPexelsId" avec un ID de la liste ci-dessous (image principale de l'article)
   - 2 sections {"type":"image"} dans le corps, avec des IDs DIFFÉRENTS du mainPexelsId
   - Place une image après la 2e section H2 et une autre après la 4e section H2

IDs PEXELS VALIDES (choisis parmi cette liste uniquement) :
1519192 (voiture route), 116675 (SUV extérieur), 3802508 (route africaine), 3764984 (route coucher soleil), 1592384 (voiture ville), 6894528 (concessionnaire), 4489702 (intérieur voiture), 3807811 (autoroute), 7363029 (famille voiture)

RÉPONDS UNIQUEMENT avec un objet JSON valide, sans texte avant ni après :
{
  "title": "Titre H1 complet",
  "slug": "slug-kebab-case-sans-accents-ni-majuscules",
  "seoTitle": "Titre SEO 55-62 caractères exactement",
  "seoDescription": "Description 148-158 caractères avec appel à l'action.",
  "excerpt": "Résumé de 120-140 caractères pour les aperçus.",
  "category": "guides",
  "tags": ["voiture chinoise", "afrique", "tag3", "tag4"],
  "mainPexelsId": 1519192,
  "sections": [
    { "type": "paragraph", "text": "Introduction de 120-180 mots posant le problème et annonçant la solution..." },
    { "type": "h2", "text": "Titre de section avec mot-clé" },
    { "type": "paragraph", "text": "Contenu détaillé 200-300 mots..." },
    { "type": "bullet", "items": ["Point 1 avec détail", "Point 2 avec détail", "Point 3"] },
    { "type": "image", "pexelsId": 1519192, "alt": "Description image avec mot-clé" },
    { "type": "h2", "text": "Section suivante" },
    { "type": "paragraph", "text": "Contenu..." },
    { "type": "h3", "text": "Sous-section" },
    { "type": "paragraph", "text": "Contenu sous-section..." },
    { "type": "blockquote", "text": "Citation ou fait marquant avec contexte africain." },
    { "type": "image", "pexelsId": 116675, "alt": "Description" },
    { "type": "h2", "text": "Questions fréquentes" },
    { "type": "h3", "text": "Question 1 ?" },
    { "type": "paragraph", "text": "Réponse directe de 50-70 mots..." },
    { "type": "h3", "text": "Question 2 ?" },
    { "type": "paragraph", "text": "Réponse directe de 50-70 mots..." },
    { "type": "h3", "text": "Question 3 ?" },
    { "type": "paragraph", "text": "Réponse directe de 50-70 mots..." },
    { "type": "h3", "text": "Question 4 ?" },
    { "type": "paragraph", "text": "Réponse directe de 50-70 mots..." },
    { "type": "h2", "text": "Conclusion" },
    { "type": "paragraph", "text": "Conclusion 80-120 mots avec CTA vers catalogue voitureschinoises.com ou WhatsApp +229 41 76 53 41" }
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
async function publishArticle(article, imageRefs) {
  const existing = await sanity.fetch(
    `*[_type=="post" && slug.current==$s][0]._id`,
    { s: article.slug }
  )
  if (existing) {
    console.log(`  Slug déjà publié : ${article.slug} — ignoré`)
    return null
  }

  const body = sectionsToPortableText(article.sections, imageRefs)
  const mainRef = imageRefs?.[article.mainPexelsId]

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
  if (article.mainPexelsId) {
    console.log(`   mainPexelsId : ${article.mainPexelsId}`)
    const imgSections = (article.sections || []).filter(s => s.type === 'image')
    console.log(`   Images dans le corps : ${imgSections.length}`)
  } else {
    console.warn(`   ⚠️ Aucun mainPexelsId généré — images manquantes`)
  }

  const jsonPath = await saveArticleJson(article)
  console.log(`   JSON sauvegardé : ${jsonPath}`)

  // Tenter la publication directe (peut être bloquée par proxy)
  let published = null
  try {
    const allIds = new Set()
    if (article.mainPexelsId) allIds.add(article.mainPexelsId)
    for (const s of article.sections || []) {
      if (s.type === 'image' && s.pexelsId) allIds.add(s.pexelsId)
    }
    const imageRefs = {}
    for (const id of allIds) imageRefs[id] = await uploadPexels(id)
    published = await publishArticle(article, imageRefs)
    if (published && VERCEL_DEPLOY_HOOK) {
      await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' })
      console.log('   🚀 Vercel redéploiement déclenché')
    }
  } catch (e) {
    console.warn(`   ⚠️ Publication Sanity directe échouée : ${e.message}`)

    const pexelsIds = new Set()
    if (article.mainPexelsId) pexelsIds.add(article.mainPexelsId)
    for (const s of article.sections || []) {
      if (s.type === 'image' && s.pexelsId) pexelsIds.add(s.pexelsId)
    }

    console.log(`\n[SANITY_MCP_REQUIRED]`)
    console.log(`ACTION: Publie cet article dans Sanity avec images :`)
    console.log(`  1. Upload chaque image Pexels via l'outil "Upload asset" (URL: https://images.pexels.com/photos/ID/pexels-photo-ID.jpeg?auto=compress&cs=tinysrgb&w=1920)`)
    console.log(`     IDs Pexels : ${[...pexelsIds].join(', ') || 'aucun'}`)
    console.log(`  2. Crée le document post avec "Create document(s)" en renseignant mainImage et les images dans body`)
    console.log(`FILE: ${jsonPath}`)
    console.log(`SLUG: ${article.slug}`)
    console.log(`[/SANITY_MCP_REQUIRED]`)
  }

  return published ? 1 : 0
}
