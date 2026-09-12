import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});
const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Nook — turn your to-do list into a study room",
  description:
    "A cozy life-RPG task tracker. Complete real tasks to earn focus, level up, and fill in your own late-night study room.",
  keywords: ["life rpg", "habit tracker", "gamified to-do list", "productivity app", "study room"],
  openGraph: {
    title: "Nook — turn your to-do list into a study room",
    description: "Complete real tasks, earn Embers, and grow your cozy study room.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable}`}>
      <body className="font-body min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
