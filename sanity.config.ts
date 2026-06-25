'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      structure: ((S: any, context: any) => structure(S, context, orderableDocumentListDeskItem)) as any,
    }),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
