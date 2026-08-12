import type { Metadata } from "next";
import "@fontsource/bebas-neue/400.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist/wght-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jully-design.ru"),
  title: "UX/UI дизайнер | Создание и разработка сайтов",
  description:
    "Создаю современный и удобный дизайн сайтов, интерфейсов и цифровых продуктов. UX/UI дизайн, адаптивные макеты и разработка сайтов",
  authors: [{ name: "Юлия Черношей", url: "https://jully-design.ru" }],
  creator: "Юлия Черношей",
  publisher: "Юлия Черношей",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Портфолио Юлии Черношей",
    title: "UX/UI дизайнер | Создание и разработка сайтов",
    description:
      "Создаю современный и удобный дизайн сайтов, интерфейсов и цифровых продуктов. UX/UI дизайн, адаптивные макеты и разработка сайтов",
    images: [
      {
        url: "/seo/og-main.png",
        width: 1200,
        height: 630,
        alt: "Юлия Черношей — UX/UI дизайнер и разработчик сайтов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UX/UI дизайнер | Создание и разработка сайтов",
    description:
      "Создаю современный и удобный дизайн сайтов, интерфейсов и цифровых продуктов. UX/UI дизайн, адаптивные макеты и разработка сайтов",
    images: ["/seo/og-main.png"],
  },
  other:
    process.env.STATIC_EXPORT === "1"
      ? undefined
      : {
          "codex-preview": "development",
        },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
