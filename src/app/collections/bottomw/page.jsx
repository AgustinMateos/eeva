import Bottomw from '@/components/Bottomw';
import { getCategoryProducts } from '@/lib/products';

const Page = async () => {
  const initialProducts = await getCategoryProducts('BOTTOM', 'FEMALE');

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <Bottomw initialProducts={initialProducts} />
    </div>
  );
};

export default Page;
