import Topw from '@/components/Topw';
import { getCategoryProducts } from '@/lib/products';

const Page = async () => {
  const initialProducts = await getCategoryProducts('TOP', 'FEMALE');

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <Topw initialProducts={initialProducts} />
    </div>
  );
};

export default Page;
