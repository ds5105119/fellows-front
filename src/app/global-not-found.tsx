import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import MainHeader from "@/components/header/mainheader";
import ErrorPage from "@/components/animation/errorpage";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-satoshi",
});

export default function GlobalNotFound() {
  return (
    <html lang="ko_KR" className="scroll-smooth">
      <body className={`${satoshi.className} h-screen overflow-hidden selection:bg-blue-400 selection:text-white`}>
        <div className="relative overscroll-none">
          <MainHeader />
          <main className="scrollbar-hide break-keep">
            <ErrorPage />
          </main>
        </div>
      </body>
    </html>
  );
}
