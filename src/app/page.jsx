import Image from "next/image";
import ComingSoon from "@/components/ComingSoon";


export default function Home() {
  // Fecha actual
  const today = new Date();

  // Fecha de activación del slider (20 de julio de 2025)
  const releaseDate = new Date("2025-07-20");

  return (
    <div>
      <ComingSoon />
      {today >= releaseDate && 
      <></>}
    </div>
  );
}

