import { type SchemaTypeDefinition } from 'sanity'
import { carSchema } from '../schemas/car'
import { brandSchema } from '../schemas/brand'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [carSchema, brandSchema],
}
