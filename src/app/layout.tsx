import type { Metadata } from "next";
import { Dancing_Script, Fraunces, IBM_Plex_Mono, Outfit } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const dancing = Dancing_Script({ variable: "--font-dancing", subsets: ["latin"], weight: ["600", "700"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz", "SOFT"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role} | Fan tribute`,
  description: profile.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${dancing.variable} ${fraunces.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
