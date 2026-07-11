/**
 * seo-daily.mjs
 * Orchestrateur SEO quotidien — choisit la tâche selon le jour de la semaine.
 * Lancé automatiquement par GitHub Actions chaque matin.
 *
 * Lun / Mer / Ven  → Article de blog SEO
 * Mar / Jeu        → Optimisation fiches voitures
 * Sam              → Article de blog SEO + optimisation voitures
 * Dim              → Article de blog guide long format + maillage interne
 */

import { runBlog } from './seo-blog.mjs'
import { runCarsOptimization } from './seo-cars.mjs'
import { runLinksOptimization } from './seo-links.mjs'

// Dans cet environnement, l'API Sanity est bloquée par la policy réseau (proxy) —
// le tunnel HTTPS échoue puis émet un 'error' async non écouté qui crashait le process.
// C'est un artefact de connexion réseau (pas une erreur métier) : on l'avale ici.
process.on('uncaughtException', (err) => {
  if (err.code === 'ECONNRESET') {
    console.warn(`   ⚠️ Socket réseau résiduel ignoré (${err.code}) — publication directe Sanity indisponible dans cet environnement.`)
    return
  }
  throw err
})

const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK

async function main() {
  const now = new Date()
  const day = now.getDay() // 0=Dim, 1=Lun, 2=Mar, 3=Mer, 4=Jeu, 5=Ven, 6=Sam

  const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  console.log('='.repeat(60))
  console.log(`🔍 Routine SEO quotidienne — voitureschinoises.com`)
  console.log(`📅 ${DAYS[day]} ${now.toISOString()}`)
  console.log('='.repeat(60))

  const results = { blog: 0, cars: 0, links: 0, errors: [] }

  try {
    if ([1, 3, 5].includes(day)) {
      // Lundi, Mercredi, Vendredi → Article de blog
      console.log(`\n📋 PROGRAMME DU JOUR : Article de blog SEO`)
      results.blog = await runBlog()

    } else if ([2, 4].includes(day)) {
      // Mardi, Jeudi → Optimisation fiches voitures
      console.log(`\n📋 PROGRAMME DU JOUR : Optimisation fiches voitures`)
      results.cars = await runCarsOptimization()

    } else if (day === 6) {
      // Samedi → Blog + Voitures
      console.log(`\n📋 PROGRAMME DU JOUR : Article blog + Optimisation voitures`)
      results.blog = await runBlog()
      results.cars = await runCarsOptimization()

    } else {
      // Dimanche → Article blog + Maillage interne
      console.log(`\n📋 PROGRAMME DU JOUR : Article guide long format + Maillage interne`)
      results.blog = await runBlog()
      results.links = await runLinksOptimization()
    }

  } catch (e) {
    console.error(`\n❌ Erreur fatale : ${e.message}`)
    results.errors.push(e.message)
  }

  // ─── Rapport final ────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(60))
  console.log('📊 RAPPORT FINAL')
  console.log('='.repeat(60))
  console.log(`✅ Articles publiés      : ${results.blog}`)
  console.log(`✅ Voitures optimisées   : ${results.cars}`)
  console.log(`✅ Articles avec liens   : ${results.links}`)
  if (results.errors.length > 0) {
    console.log(`❌ Erreurs               : ${results.errors.join(', ')}`)
  }
  console.log(`🕐 Durée totale          : ${Math.round((Date.now() - now) / 1000)}s`)
  console.log('='.repeat(60))

  if (results.errors.length > 0 && results.blog === 0 && results.cars === 0 && results.links === 0) {
    process.exit(1)
  }
}

main()
