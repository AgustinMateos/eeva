import Accesoriesm from '@/components/Accesoriesm';
import { getCategoryProducts } from '@/lib/products';

const Page = async () => {
  const initialProducts = await getCategoryProducts('ACCESSORIES', 'MALE');

  return (
    <div className="h-screen w-full">
      <div className="min-h-[100vh] w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
        <Accesoriesm initialProducts={initialProducts} />
      </div>
    </div>
  );
};

export default Page;
