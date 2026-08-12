import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UX/UI дизайн WMS и ТСД для склада | Кейс",
  description:
    "Кейс UX/UI-дизайна WMS и терминалов сбора данных: складские процессы, сортировка, комплектация, сканирование и контроль товара.",
  alternates: {
    canonical: "/wms-tsd/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/wms-tsd/",
    siteName: "Портфолио Юлии Черношей",
    title: "UX/UI дизайн WMS и ТСД для склада | Кейс",
    description:
      "Кейс UX/UI-дизайна WMS и терминалов сбора данных: складские процессы, сортировка, комплектация, сканирование и контроль товара.",
    images: [{ url: "/seo/og-wms-tsd.png", width: 1200, height: 630, alt: "UX/UI-кейс WMS и ТСД для склада" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UX/UI дизайн WMS и ТСД для склада | Кейс",
    description:
      "Кейс UX/UI-дизайна WMS и терминалов сбора данных: складские процессы, сортировка, комплектация, сканирование и контроль товара.",
    images: ["/seo/og-wms-tsd.png"],
  },
};

export default function WmsTsdLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
