import { createClient } from '@sanity/client'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const sanity = createClient({
  projectId: 't3ow1rmc', dataset: 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01', useCdn: false,
})

// IDs compilés depuis recherche AutoHome — format: "chemin/XXXXX" (ex: "ext/69960")
// URL finale : https://pano.autohome.com.cn/car/{autohomeId}?params...
const MAP = [
  { id: 'car-1',  model: 'BYD TITANIUM 7',               ext: 'ext/76557',        int: null },
  { id: 'car-2',  model: 'BYD LÉOPARD 8',                ext: 'ext/69960',        int: null },
  { id: 'car-3',  model: 'Changan UNI-K',                 ext: 'ext/65566',        int: null },
  { id: 'car-4',  model: 'Changan CS75 PLUS SMART',       ext: 'ext/67231',        int: null },
  { id: 'car-5',  model: 'Changan UNI-Z 2026',            ext: 'extseries/73190',  int: 'pano/73190' },
  { id: 'car-6',  model: 'Changan X5 PLUS',               ext: 'ext/62773',        int: null },
  { id: 'car-7',  model: 'Changan CS55',                  ext: 'ext/39610',        int: 'pano/35824' },
  { id: 'car-9',  model: 'Jetour DASHING',                ext: 'pano/65197',       int: null },
  { id: 'car-10', model: 'Jetour TRAVELER T2 5Pl',        ext: 'extseries/72102',  int: null },
  { id: 'car-12', model: 'Jetour X70 PLUS 7Pl',           ext: 'ext/69092',        int: 'pano/69094' },
  { id: 'car-14', model: 'GAC GS3',                       ext: 'ext/60609',        int: null },
  { id: 'car-15', model: 'Livan X3 PRO',                  ext: 'ext/67397',        int: null },
  { id: 'car-16', model: 'G700 IIIC',                     ext: 'panoseries/73550', int: null },
  { id: 'car-18', model: 'EXEED STELLAR RX 400T',         ext: 'extseries/69150',  int: null },
  { id: 'car-19', model: 'Geely COOLRAY CVT',             ext: 'extseries/44994',  int: 'pano/58131' },
  { id: 'car-20', model: 'Geely COOLRAY Manuel',          ext: 'extseries/44994',  int: 'pano/58131' },
  { id: 'car-24', model: 'Changan CS55 PLUS PHEV',        ext: 'ext/75529',        int: null },
  { id: 'car-28', model: 'Roewe i5',                      ext: 'extseries/50144',  int: 'pano/50144' },
  { id: 'car-29', model: 'MG MG5',                        ext: 'ext/47290',        int: 'panoseries/54387' },
  { id: 'car-30', model: 'Changan HUNTER K50',            ext: 'ext/1020911',      int: null },
  { id: 'car-31', model: 'Changan UNI-Z Hybride 2025',    ext: 'ext/73188',        int: null },
  { id: 'car-32', model: 'Bestune PONY 2026',             ext: 'pano/73973',       int: null },
  { id: 'car-33', model: 'BYD TANG L 2025',               ext: 'ext/71391',        int: null },
  { id: 'car-34', model: 'Changan UNI-T 2024',            ext: 'ext/61643',        int: 'pano/61568' },
  { id: 'car-35', model: 'BYD QIN PLUS DM-i 2025',       ext: 'ext/71685',        int: 'pano/71504' },
  { id: 'gTRUfa5Xcm746AkAPasbE7', model: 'GAC E8',       ext: 'ext/63807',        int: 'pano/63806' },
]

let ok = 0
for (const { id, model, ext, int } of MAP) {
  const patch = { autohomeId: ext }
  if (int) patch.autohomeInteriorId = int
  try {
    await sanity.patch(id).set(patch).commit()
    console.log(`✅ ${id.padEnd(30)} ${model.padEnd(35)} ext:${ext} ${int ? 'int:'+int : ''}`)
    ok++
  } catch (e) {
    console.error(`❌ ${id} ${model} — ${e.message}`)
  }
}

console.log(`\n✅ ${ok}/${MAP.length} voitures mises à jour avec viewer 3D`)
