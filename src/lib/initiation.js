export const COLLECTIONS_URL = 'https://eeva-api.vercel.app/api/v1/collections';

export function findInitiation(collections) {
  return collections.find((collection) => collection.title.toUpperCase() === 'INITIATION');
}

// Normaliza la colección INITIATION de la API al formato que usa el componente
export function formatInitiation(initiationCollection) {
  const products = initiationCollection.products
    .map((product) => {
      const price = Number(product.price);
      const discount = Number(product.discount) || 0;
      return {
        id: product._id,
        title: product.displayName || product.name || 'Producto sin título',
        subtitle: product.subtitle ?? null,
        image: `/static/${product.models.images.static}.webp`,
        gender: product.gender || 'unknown',
        price: isNaN(price) ? 'N/A' : price,
        discount: isNaN(discount) ? 0 : discount,
        createdAt: product.createdAt || product.date || product.updatedAt || null,
      };
    })
    // ORDEN: MÁS NUEVO PRIMERO
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return {
    products,
    description: initiationCollection.description || 'Descripción no disponible',
    title: initiationCollection.title || 'Sin título',
    subtitle: initiationCollection.subtitle || 'Subtítulo no disponible',
    middleImages: initiationCollection.images.middle.map((image, index) => ({
      id: index + 1,
      image: `/${image}.webp`,
    })),
    footerImage: initiationCollection.images.footer
      ? `/${initiationCollection.images.footer}.webp`
      : '/footer_initiation.webp',
  };
}
