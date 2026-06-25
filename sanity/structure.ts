import type {StructureResolver} from 'sanity/structure'

type StructureWithOrderable = (S: any, context: any, orderableDocumentListDeskItem?: any) => any

export const structure: StructureWithOrderable = (S, context, orderableDocumentListDeskItem) =>
  S.list()
    .title('Contenu')
    .items([
      // Singleton — paramètres du site
      S.listItem()
        .title('⚙️ Paramètres du site')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      // Voitures — drag & drop
      orderableDocumentListDeskItem
        ? orderableDocumentListDeskItem({type: 'car', title: '🚗 Voitures', S, context})
        : S.documentTypeListItem('car').title('🚗 Voitures'),
      // Marques
      S.documentTypeListItem('brand').title('🏷️ Marques'),
      S.divider(),
      // Blog — drag & drop
      orderableDocumentListDeskItem
        ? orderableDocumentListDeskItem({type: 'post', title: '📝 Articles Blog', S, context})
        : S.documentTypeListItem('post').title('📝 Articles Blog'),
    ])
