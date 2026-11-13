import TopMens from '@/components/TopMens';
import { getCategoryProducts } from '@/lib/products';

const Page = async () => {
  const initialProducts = await getCategoryProducts('TOP', 'MALE');

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <TopMens initialProducts={initialProducts} />
    </div>
  );
};

export default Page;
