/**
 * seo-links.mjs
 * Optimise le maillage interne SEO entre les articles de blog.
 * Analyse chaque article et ajoute des liens vers d'autres articles pertinents.
 * Tourne le dimanche après la génération du nouvel article.
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

let _k = 0
const key = () => `lnk${++_k}`

// ─── Portable Text helpers ────────────────────────────────────────────────────

function bodyToText(body) {
  return (body || [])
    .filter(b => b._type === 'block')
    .map(b => (b.children || []).map(c => c.text || '').join(''))
    .filter(Boolean)
    .join('\n')
}

function countExistingLinks(body) {
  return (body || []).reduce((total, block) => {
    if (block._type !== 'block') return total
    return total + (block.markDefs?.filter(m => m._type === 'link').length || 0)
  }, 0)
}

function applyLinksToBody(body, suggestions) {
  if (!suggestions?.length) return body
  const result = JSON.parse(JSON.stringify(body))

  for (const { phrase, href } of suggestions) {
    if (!phrase || !href) continue
    let linked = false

    for (const block of result) {
      if (linked) break
      if (block._type !== 'block') continue

      for (let i = 0; i < (block.children || []).length; i++) {
        const span = block.children[i]
        if (span._type !== 'span' || !span.text) continue

        // Ne pas re-lier un span déjà porteur d'un lien
        const hasLink = span.marks?.some(
          m => block.markDefs?.find(d => d._key === m && d._type === 'link')
        )
        if (hasLink) continue

        const idx = span.text.indexOf(phrase)
        if (idx === -1) continue

        const linkKey = key()
        const before = span.text.slice(0, idx)
        const middle = span.text.slice(idx, idx + phrase.length)
        const after  = span.text.slice(idx + phrase.length)

        const newSpans = []
        if (before) newSpans.push({ _type: 'span', _key: key(), text: before, marks: [...(span.marks || [])] })
        newSpans.push({ _type: 'span', _key: key(), text: middle, marks: [...(span.marks || []), linkKey] })
        if (after)  newSpans.push({ _type: 'span', _key: key(), text: after,  marks: [...(span.marks || [])] })

        block.children.splice(i, 1, ...newSpans)
        if (!block.markDefs) block.markDefs = []
        block.markDefs.push({ _type: 'link', _key: linkKey, href })

        linked = true
        break
      }
    }

    if (!linked) console.log(`     ⚠️  Phrase introuvable : "${phrase}"`)
  }

  return result
}

// ─── Trouver les opportunités de liens via Claude ─────────────────────────────

async function findLinkOpportunities(post, otherPosts) {
  const text = bodyToText(post.body)
  if (!text || otherPosts.length === 0) return []

  const prompt = `Tu es un expert SEO spécialisé dans le maillage interne.

ARTICLE SOURCE :
Titre : ${post.title}
URL : /blog/${post.slug?.current}
Contenu (extrait) :
${text.slice(0, 3000)}

ARTICLES CIBLES DISPONIBLES :
${otherPosts.map(p => `- "${p.title}" → /blog/${p.slug?.current}`).join('\n')}

MISSION : Trouve 3 à 5 phrases exactes de l'article source qui pourraient naturellement pointer vers un article cible.

Règles strictes :
- La phrase doit être copiée MOT POUR MOT depuis le contenu (majuscules, accents compris)
- Chaque article cible ne peut être lié qu'une seule fois
- Le lien doit être sémantiquement pertinent et apporter de la valeur au lecteur
- Préfère des expressions de 2 à 5 mots

Réponds UNIQUEMENT avec ce JSON (sans texte avant ni après) :
[
  {"phrase": "texte exact copié de l'article", "targetSlug": "slug-de-l-article-cible"},
  {"phrase": "autre texte exact", "targetSlug": "autre-slug"}
]`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function runLinksOptimization() {
  console.log('\n🔗 TÂCHE : Optimisation maillage interne SEO')
  console.log(`   ${new Date().toISOString()}`)

  let posts = []
  try {
    posts = await sanity.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id, title, slug, body, publishedAt
      }
    `)
    console.log(`   Total articles : ${posts.length}`)
  } catch (e) {
    console.warn(`   ⚠️ Lecture Sanity échouée (proxy) : ${e.message}`)
    console.log(`\n[SANITY_MCP_REQUIRED]`)
    console.log(`ACTION: Utilise le connecteur MCP Sanity pour lire tous les posts (_type=="post") avec leurs champs _id, title, slug, body, puis effectue le maillage interne via Claude API et patche les documents avec le champ "body" mis à jour.`)
    console.log(`[/SANITY_MCP_REQUIRED]`)
    return 0
  }

  if (posts.length < 2) {
    console.log(`   ⏭  Pas assez d'articles pour le maillage (minimum 2 requis)`)
    return 0
  }

  // Prioriser les articles avec le moins de liens existants
  const toProcess = posts
    .filter(p => p.body?.length > 0)
    .sort((a, b) => countExistingLinks(a.body) - countExistingLinks(b.body))
    .slice(0, 3)

  console.log(`   Articles à traiter : ${toProcess.length}`)

  let updated = 0
  const results = []

  for (const post of toProcess) {
    try {
      console.log(`\n   Analyse : "${post.title}"`)
      const existing = countExistingLinks(post.body)
      console.log(`     Liens internes existants : ${existing}`)

      const otherPosts = posts.filter(p => p._id !== post._id)
      const suggestions = await findLinkOpportunities(post, otherPosts)
      console.log(`     Suggestions Claude : ${suggestions.length}`)

      if (suggestions.length === 0) {
        console.log(`     ⏭  Aucune suggestion retournée`)
        continue
      }

      // Valider les slugs et construire les hrefs
      const valid = suggestions
        .filter(s => posts.find(p => p.slug?.current === s.targetSlug))
        .map(s => ({ phrase: s.phrase, href: `/blog/${s.targetSlug}` }))

      if (valid.length === 0) {
        console.log(`     ⚠️  Aucun slug valide dans les suggestions`)
        continue
      }

      console.log(`     Liens à appliquer : ${valid.length}`)
      valid.forEach(v => console.log(`       → "${v.phrase}" → ${v.href}`))

      const newBody = applyLinksToBody(post.body, valid)
      results.push({ _id: post._id, title: post.title, slug: post.slug?.current, links: valid })

      try {
        await sanity.patch(post._id).set({ body: newBody }).commit()
        console.log(`     ✅ ${valid.length} liens appliqués`)
        updated++
      } catch (patchErr) {
        console.warn(`     ⚠️ Patch Sanity échoué (proxy) : ${patchErr.message}`)
      }

      await new Promise(r => setTimeout(r, 1000))
    } catch (e) {
      console.error(`     ✗ Erreur : ${e.message}`)
    }
  }

  // Sauvegarder le log
  if (results.length > 0) {
    const fs = await import('fs')
    const date = new Date().toISOString().slice(0, 10)
    const path = `seo-logs/links-${date}.json`
    fs.default.mkdirSync('seo-logs', { recursive: true })
    fs.default.writeFileSync(path, JSON.stringify(results, null, 2))
    console.log(`\n   JSON sauvegardé : ${path}`)

    if (updated < results.length) {
      console.log(`\n[SANITY_MCP_REQUIRED]`)
      console.log(`ACTION: Utilise le connecteur MCP Sanity (outil "Patch document(s)") pour mettre à jour le champ "body" des articles non patchés. Les nouveaux corps sont dans le fichier JSON.`)
      console.log(`FILE: ${path}`)
      console.log(`[/SANITY_MCP_REQUIRED]`)
    }
  }

  if (updated > 0 && VERCEL_DEPLOY_HOOK) {
    await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' })
    console.log('\n   🚀 Vercel redéploiement déclenché')
  }

  console.log(`\n   Résultat : ${updated}/${toProcess.length} articles mis à jour`)
  return updated
}
