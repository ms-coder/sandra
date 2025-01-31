import "@/styles/globals.css";

import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#fff] to-[#e5e3ff] text-black">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Sa<span className="text-gray-300">N</span>dra
          </h1>
          <nav>
            <div className="container flex items-center justify-between py-4">
              <Link
                className="mr-3 inline-block border bg-blue-500 px-3 py-1 text-white"
                href="/"
              >
                Home
              </Link>
              <Link
                className="mr-3 inline-block rounded px-3 py-1 text-blue-500 hover:bg-gray-200"
                href="/discipline/math"
              >
                Mathe
              </Link>
              <Link
                className="mr-3 inline-block rounded px-3 py-1 text-blue-500 hover:bg-gray-200"
                href="/discipline/english"
              >
                English
              </Link>
              <Link
                className="mr-3 inline-block rounded px-3 py-1 text-blue-500 hover:bg-gray-200"
                href="/german"
              >
                Deutsch
              </Link>
            </div>
          </nav>
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </div>
        </main>
      </body>
    </html>
  );
}
