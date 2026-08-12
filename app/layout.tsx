import type { Metadata } from "next";
import Script from "next/script";
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
      <body>
  {children}

  <Script
    id="yandex-metrika"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j=0; j<document.scripts.length; j++) {
            if (document.scripts[j].src === r) { return; }
          }
          k=e.createElement(t);
          a=e.getElementsByTagName(t)[0];
          k.async=1;
          k.src=r;
          a.parentNode.insertBefore(k,a);
        })(window, document, "script",
          "https://mc.yandex.ru/metrika/tag.js?id=111542132", "ym");

        ym(111542132, "init", {
          ssr: true,
          webvisor: true,
          clickmap: true,
          accurateTrackBounce: true,
          trackLinks: true
        });
      `,
    }}
  />
</body>
    </html>
  );
}
