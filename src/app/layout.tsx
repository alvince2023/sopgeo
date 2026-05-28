import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SopGeo — AI 搜索 GEO 平台 | 品牌可见度管理",
  description:
    "首个专注中文市场的AI搜索GEO平台。实时监控豆包、DeepSeek、Kimi、文心一言等AI引擎中的品牌可见度，按效果付费。",
  keywords: ["GEO", "生成式引擎优化", "AI搜索优化", "品牌可见度", "豆包", "DeepSeek", "Kimi"],
  openGraph: {
    title: "SopGeo — 让你的品牌在AI搜索结果中被看见",
    description:
      "首个专注中文市场的AI搜索GEO平台。监控品牌在AI引擎中的可见度，按效果付费。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
