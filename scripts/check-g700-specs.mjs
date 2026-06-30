import pkg from '@next/env'
const { loadEnvConfig } = pkg
import { createClient } from '@sanity/client'
loadEnvConfig(process.cwd())
const sanity = createClient({ projectId:'t3ow1rmc', dataset:'production', token:process.env.SANITY_TOKEN, apiVersion:'2024-01-01', useCdn:false })
const car = await sanity.fetch('*[_id=="car-16"][0]{ model, specs }')
console.log('Model:', car.model)
console.log('Specs keys:')
car.specs?.forEach(s => console.log(`  "${s.key}": "${s.value}"`))
