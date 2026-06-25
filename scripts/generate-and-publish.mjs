/**
 * generate-and-publish.mjs
 * Génère 3 articles via l'API Claude, les publie dans Sanity et déclenche Vercel.
 * Utilisé par GitHub Actions — exécution hebdomadaire automatique.
 */

import { createClient } from '@sanity/client'

// ─── Config ──────────────────────────────────────────────────────────────────
const SANITY_PROJECT_ID = 't3ow1rmc'
const SANITY_DATASET    = 'production'
const SANITY_TOKEN      = process.env.SANITY_TOKEN
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK  // optionnel

if (!SANITY_TOKEN)      throw new Error('SANITY_TOKEN manquant')
if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY manquant')

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  apiVersion: '2021-06-07',
  useCdn: false,
})

// ─── Portable Text helpers ────────────────────────────────────────────────────
let _k = 0
const key = () => `k${++_k}`
const ptBlock = (text, style = 'normal') => ({
  _type: 'block', _key: key(), style, markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})
const ptListItem = (text, listItem) => ({
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
    switch (s.type) {
      case 'paragraph':  blocks.push(ptBlock(s.text)); break
      case 'h2':         blocks.push(ptBlock(s.text, 'h2')); break
      case 'h3':         blocks.push(ptBlock(s.text, 'h3')); break
      case 'blockquote': blocks.push(ptBlock(s.text, 'blockquote')); break
      case 'bullet':     s.items.forEach(t => blocks.push(ptListItem(t, 'bullet'))); break
      case 'numbered':   s.items.forEach(t => blocks.push(ptListItem(t, 'number'))); break
      case 'image': {
        const assetId = imageRefs[s.pexelsId]
        if (assetId) blocks.push(ptImage(assetId, s.alt || ''))
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
    const res = await fetch(url, { headers: { 'User-Agent': 'voiturechinoise-bot/1.0' } })
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

// ─── Récupérer les slugs déjà publiés ────────────────────────────────────────
async function getPublishedSlugs() {
  const posts = await sanity.fetch(`*[_type=="post"]{slug, title}`)
  return {
    slugs: posts.map(p => p.slug?.current).filter(Boolean),
    titles: posts.map(p => p.title).filter(Boolean),
  }
}

// ─── Générer 3 articles via l'API Claude ─────────────────────────────────────
async function generateArticles(publishedSlugs, publishedTitles) {
  console.log('Appel API Claude pour générer 3 articles...')

  const systemPrompt = `Tu es un rédacteur SEO expert en automobile chinoise et import de véhicules en Afrique francophone.
Tu rédiges des articles de blog complets pour le site voiturechinoise.com.
Ton public : acheteurs et passionnés de voitures chinoises en Afrique francophone (Sénégal, Mali, Côte d'Ivoire, Cameroun, Congo, Gabon, Niger, Burkina Faso, etc.)
Langue : français, style éditorial professionnel.`

  const userPrompt = `Génère exactement 3 articles de blog DIFFÉRENTS de ceux déjà publiés.

ARTICLES DÉJÀ PUBLIÉS (ne pas répéter ces sujets) :
${publishedTitles.map(t => `- ${t}`).join('\n') || 'Aucun pour l\'instant'}

SUJETS POSSIBLES (choisis 3 non couverts) :
- Comparatifs de modèles (Omoda, Jaecoo, Haval, GAC, SAIC, Changan, Dongfeng...)
- Guides par pays (Sénégal, Mali, Cameroun, Niger, Burkina Faso, Congo, Gabon, Togo...)
- Guides pratiques (assurance, entretien SUV, financement, dédouanement...)
- Actualités marché (nouveaux modèles 2026, records de vente, expansion africaine...)
- Conseils acheteurs (négocier, vérifier à la livraison, pièges à éviter, financement...)
- SEO local (voiture neuve Abidjan, SUV pas cher Dakar, acheter voiture Lomé...)

RÈGLES DE RÉDACTION :
- 1 500 à 2 000 mots par article (adapte la longueur des sections)
- Structure obligatoire : intro → H2 avec contenu → H3 si besoin → listes → blockquote → conclusion
- Mentionne des prix en FCFA, des villes africaines, les ports (Cotonou, Lomé, Abidjan, Dakar)
- SEO : seoTitle 55-60 caractères MAX, seoDescription 145-155 caractères avec appel à l'action
- Slug en kebab-case sans accents

IMAGES PEXELS :
Pour chaque article, fournis 2-3 IDs de photos Pexels pertinentes (nombres entiers).
IDs connus qui fonctionnent : 1519192 (SUV noir), 116675 (SUV blanc), 3802508 (recharge VE), 3764984 (technologie auto), 1592384 (showroom voitures).
Utilise ces IDs ou propose d'autres IDs plausibles.

RÉPONDS UNIQUEMENT avec un objet JSON valide, sans texte avant ni après, sans balises markdown :
{
  "articles": [
    {
      "title": "Titre complet de l'article",
      "slug": "slug-kebab-case-sans-accents",
      "category": "guides",
      "seoTitle": "Titre SEO 55-60 car max",
      "seoDescription": "Description SEO 145-155 caractères avec appel à l'action.",
      "tags": ["tag1", "tag2", "tag3"],
      "mainPexelsId": 1519192,
      "sections": [
        { "type": "paragraph", "text": "Texte d'introduction..." },
        { "type": "h2", "text": "Titre de section H2" },
        { "type": "paragraph", "text": "Contenu de la section..." },
        { "type": "bullet", "items": ["Point 1", "Point 2", "Point 3"] },
        { "type": "image", "pexelsId": 1519192, "alt": "Description de l'image" },
        { "type": "h2", "text": "Autre section H2" },
        { "type": "h3", "text": "Sous-section H3" },
        { "type": "paragraph", "text": "Contenu..." },
        { "type": "numbered", "items": ["Etape 1", "Etape 2"] },
        { "type": "image", "pexelsId": 116675, "alt": "Description" },
        { "type": "blockquote", "text": "Citation pertinente avec source." },
        { "type": "h2", "text": "Conclusion" },
        { "type": "paragraph", "text": "Conclusion de l'article..." }
      ]
    }
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
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic API ${response.status}: ${err}`)
  }

  const data = await response.json()
  const raw = data.content[0].text.trim()

  // Extraire le JSON si entouré de markdown
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, raw]
  const parsed = JSON.parse(jsonMatch[1])

  console.log(`  ${parsed.articles.length} articles générés par Claude`)
  return parsed.articles
}

// ─── Publier un article dans Sanity ──────────────────────────────────────────
async function publish(article, imageRefs) {
  // Vérifier si le slug existe déjà
  const existing = await sanity.fetch(
    `*[_type=="post"&&slug.current==$s][0]._id`,
    { s: article.slug }
  )
  if (existing) {
    console.log(`  Déjà publié : ${article.slug} — ignoré`)
    return null
  }

  const body = sectionsToPortableText(article.sections, imageRefs)
  const mainImageRef = imageRefs[article.mainPexelsId]

  const doc = {
    _type: 'post',
    title: article.title,
    slug: { current: article.slug },
    publishedAt: new Date().toISOString(),
    category: article.category,
    tags: article.tags || [],
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    body,
    ...(mainImageRef && {
      mainImage: { _type: 'image', asset: { _type: 'reference', _ref: mainImageRef } },
    }),
  }

  const created = await sanity.create(doc)
  console.log(`  ✅ Publié : "${article.title}"`)
  return created
}

// ─── Déclencher un redéploiement Vercel ──────────────────────────────────────
async function triggerVercel() {
  if (!VERCEL_DEPLOY_HOOK) {
    console.log('  (VERCEL_DEPLOY_HOOK non configuré — déploiement Vercel ignoré)')
    return
  }
  const res = await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' })
  if (res.ok) {
    console.log('  🚀 Déploiement Vercel déclenché')
  } else {
    console.warn(`  ⚠ Vercel deploy hook : HTTP ${res.status}`)
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('='.repeat(55))
  console.log('VoitureChinoise.com — Publication automatique')
  console.log(`Date : ${new Date().toISOString()}`)
  console.log('='.repeat(55))

  // 1. Récupérer ce qui est déjà publié
  const { slugs, titles } = await getPublishedSlugs()
  console.log(`\nArticles déjà publiés : ${slugs.length}`)

  // 2. Générer 3 nouveaux articles via Claude
  const articles = await generateArticles(slugs, titles)

  // 3. Collecter tous les IDs Pexels à uploader
  const allPexelsIds = new Set()
  for (const article of articles) {
    if (article.mainPexelsId) allPexelsIds.add(article.mainPexelsId)
    for (const s of article.sections) {
      if (s.type === 'image' && s.pexelsId) allPexelsIds.add(s.pexelsId)
    }
  }

  // 4. Uploader toutes les images
  console.log(`\nUpload de ${allPexelsIds.size} images Pexels...`)
  const imageRefs = {}
  for (const id of allPexelsIds) {
    imageRefs[id] = await uploadPexels(id)
  }

  // 5. Publier chaque article
  console.log('\nPublication dans Sanity...')
  const published = []
  for (const article of articles) {
    try {
      const doc = await publish(article, imageRefs)
      if (doc) published.push(article)
    } catch (e) {
      console.error(`  ✗ Erreur sur "${article.title}" : ${e.message}`)
    }
  }

  // 6. Déclencher Vercel si des articles ont été publiés
  if (published.length > 0) {
    console.log('\nDéclenchement du redéploiement Vercel...')
    await triggerVercel()
  }

  // 7. Résumé
  console.log('\n' + '='.repeat(55))
  console.log(`Résultat : ${published.length}/${articles.length} articles publiés`)
  console.log('='.repeat(55))
  published.forEach(a => {
    console.log(`\n  • ${a.title}`)
    console.log(`    → https://www.voitureschinoises.com/blog/${a.slug}`)
  })

  if (published.length === 0) {
    process.exit(1) // Signaler l'échec à GitHub Actions
  }
}

main().catch(e => {
  console.error('\nErreur fatale :', e.message)
  process.exit(1)
})
