'use client'; // Necesario para usar useRouter y useEffect

import Image from "next/image";
import ComingSoon from "@/components/ComingSoon";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter para redirecciones

export default function Home() {
  const router = useRouter(); // Hook para manejar redirecciones

  // Fecha actual
  const today = new Date();

  // Fecha de activación del slider (23 de abril de 2025)
  const releaseDate = new Date("2025-05-8");

  // Redirección si la fecha se cumple
  useEffect(() => {
    if (today >= releaseDate) {
      router.push("/collections/slider"); // Redirige a /collections/slider
    }
  }, [today, releaseDate, router]); // Dependencias para useEffect

  // Si la fecha no se ha cumplido, muestra ComingSoon
  if (today < releaseDate) {
    return (
      <div>
        <ComingSoon />
      </div>
    );
  }

  // Si la fecha se cumplió, el useEffect manejará la redirección, así que no renderizamos nada aquí
  return null;
}
