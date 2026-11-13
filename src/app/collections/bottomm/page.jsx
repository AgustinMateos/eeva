import BottomMens from '@/components/BottomMens';
import { getCategoryProducts } from '@/lib/products';

const Page = async () => {
  const initialProducts = await getCategoryProducts('BOTTOM', 'MALE');

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <BottomMens initialProducts={initialProducts} />
    </div>
  );
};

export default Page;
