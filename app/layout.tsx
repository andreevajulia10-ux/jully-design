import type { Metadata } from "next";
import "@fontsource/bebas-neue/400.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist/wght-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jully-design.ru"),
  title: "@Jully_Ch — UX/UI Designer & Vibe Coder",
  description:
    "Портфолио Юлии Черношей: продуктовый дизайн, UX/UI, вайбкодинг и самостоятельная сборка сайтов от идеи до публикации.",
  alternates: {
    canonical: "/",
  },
  other:
    process.env.STATIC_EXPORT === "1"
      ? undefined
      : {
          "codex-preview": "development",
        },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
