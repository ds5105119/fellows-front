import type { Metadata } from "next";
import localFont from "next/font/local";
import LenisProvider from "@/lib/lenisprovider";
import GoogleAnalytics from "@/lib/googleanalytics";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
      <GoogleAnalytics />

      <body className={cn(pretendard.className, GeistSans.className, " overflow-x-hidden")}>
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
