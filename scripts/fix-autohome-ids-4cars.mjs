import pkg from '@next/env'
const { loadEnvConfig } = pkg
import { createClient } from '@sanity/client'

loadEnvConfig(process.cwd())

const sanity = createClient({
  projectId: 't3ow1rmc', dataset: 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01', useCdn: false,
})

// Corrections des IDs AutoHome 3D pour les bonnes versions 2026
const UPDATES = [
  {
    id: 'car-6',
    model: 'Changan X5 PLUS 2026 第二代 1.5T 超越PRO',
    // Était: ext/62773
    ext: 'extseries/70461',   // série 7552, vue extérieure 2026 2nd gen
    int: 'pano/74137',        // spec 74137 = 超越PRO, vue intérieure confirmée
  },
  {
    id: 'car-7',
    model: 'Changan CS55 PLUS 2026 第四代 新蓝鲸 1.5T 天枢豪华型',
    // Était: ext/39610 pano/35824
    ext: 'extseries/72642',   // série 5498, extseries confirmée
    int: 'pano/72642',        // intérieur 天枢豪华型 confirmé
  },
  {
    id: 'car-4',
    model: 'Changan CS75 PLUS 2026 智慧冠军版 1.5T 新蓝鲸 智航型',
    // Était: ext/67231
    ext: 'ext/75339',         // spec 75339 = 智航型, extérieur confirmé
    int: 'pano/75339',        // intérieur 智航型 confirmé
  },
  {
    id: 'car-5',
    model: 'Changan UNI-Z 2026 智慧新蓝鲸 500Bar MAX',
    // Était: extseries/73190 + pano/73190 (2025款)
    ext: 'extseries/73190',   // pas d'ext 2026 disponible — on garde le viewer série
    int: 'pano/76811',        // spec 76811 = 2026款 500Bar MAX, intérieur confirmé
  },
]

let ok = 0
for (const { id, model, ext, int: interior } of UPDATES) {
  try {
    await sanity.patch(id).set({ autohomeId: ext, autohomeInteriorId: interior }).commit()
    console.log(`✅ ${id.padEnd(8)} ${model}`)
    console.log(`        ext: ${ext}  int: ${interior}`)
    ok++
  } catch (e) {
    console.error(`❌ ${id} ${model} — ${e.message}`)
  }
}

console.log(`\n✅ ${ok}/${UPDATES.length} voitures mises à jour`)
