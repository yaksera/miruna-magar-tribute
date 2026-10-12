import type { Metadata } from "next";
import { Archivo, Dancing_Script } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const dancing = Dancing_Script({ variable: "--font-dancing", subsets: ["latin"], weight: ["600", "700"] });

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role} | Fan tribute`,
  description: profile.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${dancing.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
