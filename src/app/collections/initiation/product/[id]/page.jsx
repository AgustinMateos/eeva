import Product from "@/components/Product";
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
export default function Page({ params }) {
  const { id } = params;
  return (
    <div className="min-h-[100vh] w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <Product id={id} />
      <div className="h-[100vh]"><Marquee/></div>
      <div className="h-[315px] md:h-[415px] flex md:min-w-[1315px]">
        <Footer />
      </div>
    </div>
  );
}