import { Biography } from "@/components/biography";
import { Cursor } from "@/components/cursor";
import { Films } from "@/components/films";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Sources } from "@/components/sources";
import { TrailerProvider } from "@/components/trailer-context";

export default function Home() {
  return (
    <TrailerProvider>
      <Cursor />
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Films />
        <Biography />
        <Sources />
      </main>
      <Footer />
    </TrailerProvider>
  );
}
