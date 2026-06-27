@AGENTS.md

# Routine SEO — Instructions MCP Sanity

## Utilisation du connecteur MCP Sanity

Le connecteur Sanity est disponible dans cette session. Quand les scripts Node.js affichent `[SANITY_MCP_REQUIRED]`, utilise les outils MCP Sanity pour publier :

### Publier un article de blog
1. Lis le fichier JSON indiqué (ex: `seo-logs/article-YYYY-MM-DD.json`)
2. Utilise l'outil MCP Sanity **"Create document(s)"** avec `_type: "post"` et les champs du JSON : `title`, `slug`, `seoTitle`, `seoDescription`, `excerpt`, `body`, `tags`, `category`, `publishedAt`

### Mettre à jour les SEO des voitures
1. Lis le fichier JSON indiqué (ex: `seo-logs/cars-seo-YYYY-MM-DD.json`)
2. Pour chaque voiture, utilise l'outil MCP Sanity **"Patch document(s)"** avec l'`_id` et les champs `seoTitle`, `seoDescription`, `desc`

### Après publication
- Si la publication réussit, déclenche le hook Vercel si disponible (`VERCEL_DEPLOY_HOOK`)
- Note le résultat dans `seo-logs/YYYY-MM-DD.md`
