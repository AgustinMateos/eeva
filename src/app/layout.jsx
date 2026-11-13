import { ibmMono } from "./ui/fonts";
import "./globals.css";
import { CartProvider } from "@/components/context/CartContext";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, INSTAGRAM_URL, CONTACT_EMAIL, DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Ropa de diseño argentina`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "EEVA",
    "EEVA Studios",
    "ropa de diseño",
    "moda argentina",
    "ropa de autor",
    "Concrete Summer",
    "streetwear",
    "ropa hombre",
    "ropa mujer",
    "tienda online",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Ropa de diseño argentina`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Ropa de diseño argentina`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.ico" },
  formatDetection: { telephone: false },
  other: {
    "google-site-verification": "-aSvPMVt_0To09-nAayMutsKf4wXugkmApyPYVNsaxY",
  },
};

export const viewport = {
  themeColor: "#182025",
};

// Datos estructurados de la marca (Google Knowledge Panel / resultados enriquecidos)
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/LogoFullEEVA.svg`,
      email: CONTACT_EMAIL,
      sameAs: [INSTAGRAM_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "es-AR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${ibmMono.className} antialiased bg-[#182025]`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
