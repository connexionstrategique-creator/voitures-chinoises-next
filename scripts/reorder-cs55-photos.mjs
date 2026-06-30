import pkg from '@next/env'
const { loadEnvConfig } = pkg
import { createClient } from '@sanity/client'

loadEnvConfig(process.cwd())

const sanity = createClient({
  projectId: 't3ow1rmc', dataset: 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01', useCdn: false,
})

// car-24 = Changan CS55 PLUS PHEV
// photo-7 (711x460) is the exterior 3/4 front shot → move it to index 0
const car = await sanity.fetch('*[_id=="car-24"][0]{ "photos": photos[]{ _key, "ref": asset._ref } }')

if (!car?.photos?.length) {
  console.error('No photos found for car-24')
  process.exit(1)
}

console.log(`Found ${car.photos.length} photos`)
console.log('Current photo-0 key:', car.photos[0]._key)
console.log('Current photo-7 key:', car.photos[7]._key)

// Move photo at index 7 to index 0
const reordered = [
  car.photos[7],
  ...car.photos.slice(0, 7),
  ...car.photos.slice(8),
]

// Build the patch array with proper Sanity asset references
const photosArray = reordered.map(p => ({
  _type: 'image',
  _key: p._key,
  asset: { _type: 'reference', _ref: p.ref },
}))

await sanity.patch('car-24').set({ photos: photosArray }).commit()
console.log('✅ Photos reordered — exterior shot is now first')
console.log('New photo-0:', reordered[0]._key)
