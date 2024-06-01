import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PetSoft - Pet daycare software",
  description: "Take care of people's pets responsible with PetSoft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Colors */}
      {/* https://tailwindcss.com/docs/customizing-colors#default-color-palette */}
      {/* Text Color */}
      {/* stick to neutral/gray colors - can go with "stone" for "warmer" or "zinc" for "cooler" feel */}
      {/* Background Color */}
      {/* Avoid pure white - hurts eyes */}
      <body
        className={`${inter.className} text-sm text-color-zinc-900 bg-[#E5E8EC] min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
