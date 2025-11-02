import type { Metadata } from "next";
import localFont from "next/font/local";
import LenisProvider from "@/lib/lenisprovider";
import ClientLocaleInit from "@/lib/clientlocaleinit";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager } from "@next/third-parties/google";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import Footer from "@/components/section/work/footer";
import "../globals.css";
import "lenis/dist/lenis.css";

const pretendard = localFont({
  src: "../../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const leagueGothic = localFont({
  src: "../../fonts/LeagueGothic-Regular-VariableFont_wdth.ttf",
  display: "swap",
  weight: "400",
  variable: "--font-leaguegothic",
});

export const metadata: Metadata = {
  title: "Fellows",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en h-screen overflow-y-auto">
      <Analytics />
      <SpeedInsights />
      <ClientLocaleInit />
      <GoogleTagManager gtmId="GTM-W3M5P7KT" />

      <body
        className={cn(GeistSans.variable, pretendard.variable, leagueGothic.variable, "overflow-x-hidden")}
        style={
          {
            "--app-font": "var(--font-geist-sans), var(--font-pretendard), Helvetica, Arial, sans-serif",
          } as React.CSSProperties
        }
      >
        <LenisProvider>
          <div className="relative overscroll-none">
            <main className="scrollbar-hide break-keep">{children}</main>
            <Footer />
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
