import { type SchemaTypeDefinition } from 'sanity'
import { carSchema } from '../schemas/car'
import { brandSchema } from '../schemas/brand'
import { siteSettingsSchema } from '../schemas/siteSettings'
import { postSchema } from '../schemas/post'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [carSchema, brandSchema, siteSettingsSchema, postSchema],
}
