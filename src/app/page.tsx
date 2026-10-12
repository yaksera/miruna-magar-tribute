import { Credits } from "@/components/credits";
import { Cursor } from "@/components/cursor";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Reel } from "@/components/reel";
import { Sources } from "@/components/sources";
import { Story } from "@/components/story";
import { Ticker } from "@/components/ticker";
import { TrailerProvider } from "@/components/trailer-context";

export default function Home() {
  return (
    <TrailerProvider>
      <Cursor />
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Ticker />
        <Reel />
        <Story />
        <Credits />
        <Sources />
      </main>
      <Footer />
    </TrailerProvider>
  );
}
