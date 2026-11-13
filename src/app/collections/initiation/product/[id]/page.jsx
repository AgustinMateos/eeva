import Product from "@/components/Product";
import Footer from "@/components/Footer";
import { SITE_URL, SITE_NAME, API_URL, API_CACHE } from "@/lib/site";

// Next deduplica este fetch entre generateMetadata y la página
async function getProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, API_CACHE);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

const cleanText = (text = "") => text.replace(/\s+/g, " ").trim();

function productImages(product) {
  const images = [];
  if (product.imageUrl) images.push(product.imageUrl);
  if (product.models?.images?.static) images.push(`${SITE_URL}/static/${product.models.images.static}.webp`);
  return images;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Producto no encontrado", robots: { index: false } };

  const name = product.displayName || product.name;
  const description = cleanText(product.details).slice(0, 155) || `${name} de ${SITE_NAME}.`;
  const path = `/collections/initiation/product/${id}`;
  const images = productImages(product).map((url) => ({ url, alt: name }));

  return {
    title: name,
    description,
    keywords: product.tags,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_AR", siteName: SITE_NAME, title: name, description, url: path, images },
    twitter: { card: "summary_large_image", title: name, description, images: images.map((i) => i.url) },
  };
}

function productJsonLd(product, id) {
  const price = Number(product.price);
  const discount = Number(product.discount) || 0;
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
  const inStock = (product.colors || []).some((c) => (c.sizes || []).some((s) => s.stock > 0));
  const url = `${SITE_URL}/collections/initiation/product/${id}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.displayName || product.name,
    description: cleanText(product.details),
    image: productImages(product),
    sku: id,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: product.type,
    color: (product.colors || []).map((c) => c.color?.name).filter(Boolean).join(", ") || undefined,
    // La primera línea de productCare es la composición (ej. "100% Nylon")
    material: product.productCare?.split("\n")[0].trim() || undefined,
    audience: product.gender
      ? { "@type": "PeopleAudience", suggestedGender: product.gender === "MALE" ? "male" : "female" }
      : undefined,
    offers: isNaN(price)
      ? undefined
      : {
          "@type": "Offer",
          url,
          priceCurrency: "ARS",
          price: Math.round(finalPrice),
          availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE_URL}/#organization` },
        },
  };
}

function breadcrumbJsonLd(product, id) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Concrete Summer", item: `${SITE_URL}/collections/initiation` },
      {
        "@type": "ListItem",
        position: 2,
        name: product.displayName || product.name,
        item: `${SITE_URL}/collections/initiation/product/${id}`,
      },
    ],
  };
}

export default async function Page({ params }) {
  const id = (await params).id;
  const product = await getProduct(id);
  return (
    <div className="min-h-[100vh] w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([productJsonLd(product, id), breadcrumbJsonLd(product, id)]),
          }}
        />
      )}
      <Product id={id} />

      <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px] 2xl:w-[100%]">
            <Footer />
          </div>
    </div>
  );
}
