import Product from "@/components/Product";

export default function Page({ params }) {
  const { id } = params;
  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <Product id={id} />
    </div>
  );
}