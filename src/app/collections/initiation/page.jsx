import React from 'react';
import Initiation from '@/components/Initiation';
import { COLLECTIONS_URL, findInitiation, formatInitiation } from '@/lib/initiation';
import { pageMetadata, API_CACHE } from '@/lib/site';

// Refrescar los datos de la API cada 60 s (igual a API_REVALIDATE_SECONDS en lib/site.js).
// Tiene que ser un número literal: sin esto Next genera la página estática y no se actualiza nunca.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: 'Concrete Summer | Colección Initiation',
  description:
    'Concrete Summer, la colección Initiation de EEVA Studios: tops, pantalones, camperas, bikinis y accesorios con una visión futurista y dramática. Comprá online.',
  path: '/collections/initiation',
});

// Se pide en el servidor y se cachea (ver API_CACHE), así la página llega con los datos
async function getInitiationData() {
  try {
    const res = await fetch(COLLECTIONS_URL, API_CACHE);
    if (!res.ok) return null;
    const initiationCollection = findInitiation(await res.json());
    return initiationCollection ? formatInitiation(initiationCollection) : null;
  } catch (err) {
    console.error('Error al obtener INITIATION:', err);
    return null;
  }
}

const Page = async () => {
  const initialData = await getInitiationData();

  return (
    <div className="h-screen w-full bg-gradient-to-r from-[#303F48] to-[#6D7276] ">
      <div className="min-h-[100vh] w-full  bg-gradient-to-r from-[#303F48] to-[#6D7276]">
        <Initiation initialData={initialData} />
      </div>
    </div>
  );
};

export default Page;
