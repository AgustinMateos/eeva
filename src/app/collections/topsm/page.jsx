import TopMens from '@/components/TopMens';
import { getCategoryProducts } from '@/lib/products';

// Refrescar los datos de la API cada 60 s (igual a API_REVALIDATE_SECONDS en lib/site.js).
// Tiene que ser un número literal: sin esto Next genera la página estática y no se actualiza nunca.
export const revalidate = 60;

const Page = async () => {
  const initialProducts = await getCategoryProducts('TOP', 'MALE');

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <TopMens initialProducts={initialProducts} />
    </div>
  );
};

export default Page;
