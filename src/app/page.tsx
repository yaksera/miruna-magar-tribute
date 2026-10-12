import { About } from "@/components/about";
import { Cursor } from "@/components/cursor";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Films } from "@/components/films";
import { Sources } from "@/components/sources";

export default function Home() {
  return (
    <>
      <Cursor />
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Films />
        <About />
        <Sources />
      </main>
      <Footer />
    </>
  );
}
