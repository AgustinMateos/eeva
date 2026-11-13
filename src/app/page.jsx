import { permanentRedirect } from "next/navigation";

// Redirección permanente en el servidor: Google pasa toda la autoridad de "/" a la portada
export default function Home() {
  permanentRedirect("/collections/slider");
}
