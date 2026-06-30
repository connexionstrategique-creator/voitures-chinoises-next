import pkg from '@next/env'
const { loadEnvConfig } = pkg
import { createClient } from '@sanity/client'

loadEnvConfig(process.cwd())

const sanity = createClient({
  projectId: 't3ow1rmc', dataset: 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01', useCdn: false,
})

const car = await sanity.fetch('*[_id=="car-24"][0]{ model, "photos": photos[]{ _key, asset->{ url } }, colorGroups }')
console.log('Model:', car.model)
console.log('colorGroups count:', car.colorGroups?.length)
console.log('top-level photos count:', car.photos?.length)
car.photos?.slice(0, 5).forEach((p, j) => console.log(`  photo ${j}: ${p._key} → ${p.asset?.url?.slice(-50)}`))
