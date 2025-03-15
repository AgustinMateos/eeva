import { IBM_Plex_Mono,  } from "next/font/google";

export const ibmMono = IBM_Plex_Mono({ 
  subsets: ["latin"], 
  weight: ["100","200", "300", "400", "500", "700"] // O agrega más pesos: ["300", "400", "500", "700"]
});