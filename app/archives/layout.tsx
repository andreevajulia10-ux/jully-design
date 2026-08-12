import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Работы UX/UI и веб-дизайнера | Архив",
  description:
    "Архив работ Юлии Черношей: веб-дизайн, UX/UI-интерфейсы, лендинги, интернет-магазины и визуальные эксперименты.",
  alternates: {
    canonical: "/archives/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/archives/",
    siteName: "Портфолио Юлии Черношей",
    title: "Работы UX/UI и веб-дизайнера | Архив",
    description:
      "Архив работ Юлии Черношей: веб-дизайн, UX/UI-интерфейсы, лендинги, интернет-магазины и визуальные эксперименты.",
    images: [{ url: "/seo/og-archives.png", width: 1200, height: 630, alt: "Архив работ UX/UI и веб-дизайнера Юлии Черношей" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Работы UX/UI и веб-дизайнера | Архив",
    description:
      "Архив работ Юлии Черношей: веб-дизайн, UX/UI-интерфейсы, лендинги, интернет-магазины и визуальные эксперименты.",
    images: ["/seo/og-archives.png"],
  },
};

export default function ArchivesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
