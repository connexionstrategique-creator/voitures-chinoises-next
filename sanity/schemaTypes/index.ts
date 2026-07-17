import { type SchemaTypeDefinition } from 'sanity'
import { carSchema } from '../schemas/car'
import { brandSchema } from '../schemas/brand'
import { siteSettingsSchema } from '../schemas/siteSettings'
import { postSchema } from '../schemas/post'
import { promoAutoSchema } from '../schemas/promoAuto'
import { promoBannerSchema } from '../schemas/promoBanner'
import promoInlineSchema from '../schemas/promoInline'
import { sparePartSchema } from '../schemas/sparePart'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [carSchema, brandSchema, siteSettingsSchema, postSchema, promoAutoSchema, promoBannerSchema, promoInlineSchema, sparePartSchema],
}
