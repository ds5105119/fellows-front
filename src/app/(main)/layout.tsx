import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "@/components/footer/footer";
import LenisProvider from "@/lib/lenisprovider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import MainHeader from "@/components/header/mainheader";

const pretendard = localFont({
  src: "../../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const satoshi = localFont({
  src: "../../fonts/Satoshi-Variable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} ${satoshi.variable}`}>
        <LenisProvider>
          <div className="relative overscroll-none">
            <MainHeader />
            <main className="scrollbar-hide break-keep">{children}</main>
            <Footer />
          </div>
        </LenisProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
