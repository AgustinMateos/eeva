import Product from "@/components/Product";
import Footer from "@/components/Footer";

export default async function Page({ params }) {
  const id = (await params).id;
  return (
    <div className="min-h-[100vh] w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <Product id={id} />
      
      <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px]">
            <Footer />
          </div>
    </div>
  );
}
