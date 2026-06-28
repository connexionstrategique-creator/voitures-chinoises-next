@AGENTS.md

# Routine SEO — Instructions MCP Sanity

## Utilisation du connecteur MCP Sanity

Le connecteur Sanity est disponible dans cette session. Quand les scripts Node.js affichent `[SANITY_MCP_REQUIRED]`, utilise les outils MCP Sanity pour publier :

### Publier un article de blog
1. Lis le fichier JSON indiqué (ex: `seo-logs/article-YYYY-MM-DD.json`)
2. **Images : UNIQUEMENT des photos de voitures chinoises du catalogue.** N'utilise JAMAIS de banque d'images générique (Pexels, Unsplash, etc.). Les références d'images sont déjà dans le JSON : `_coverRef` (couverture) et le `_ref` de chaque section image — ce sont des réfs d'assets de voitures chinoises (documents `_type=="car"`, champ `photos[]`). Si une réf manque, choisis une photo d'un document `car` de la marque pertinente (`*[_type=="car" && brand=="BYD"]{photos}`).
3. Utilise l'outil MCP Sanity **"Create document(s)"** avec `_type: "post"` et les champs du JSON : `title`, `slug`, `seoTitle`, `seoDescription`, `excerpt`, `body`, `tags`, `category`, `publishedAt`, `mainImage` (depuis `_coverRef`)

### Mettre à jour les SEO des voitures
1. Lis le fichier JSON indiqué (ex: `seo-logs/cars-seo-YYYY-MM-DD.json`)
2. Pour chaque voiture, utilise l'outil MCP Sanity **"Patch document(s)"** avec l'`_id` et les champs `seoTitle`, `seoDescription`, `desc`

### Maillage interne
1. Lis le fichier JSON indiqué (ex: `seo-logs/links-YYYY-MM-DD.json`)
2. Pour chaque article, utilise **"Patch document(s)"** avec l'`_id` et le champ `body` mis à jour

### Après publication
- Si la publication réussit, déclenche le hook Vercel si disponible (`VERCEL_DEPLOY_HOOK`)
- Note le résultat dans `seo-logs/YYYY-MM-DD.md`
