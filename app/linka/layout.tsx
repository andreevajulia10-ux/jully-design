import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UX/UI дизайн образовательной платформы Linka | Кейс",
  description:
    "Кейс UX/UI-дизайна Linka: образовательная платформа для логопедов, дефектологов и педагогов коррекционного профиля.",
  robots: {
  index: false,
  follow: true,
},
  alternates: {
    canonical: "/linka/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/linka/",
    siteName: "Портфолио Юлии Черношей",
    title: "UX/UI дизайн образовательной платформы Linka | Кейс",
    description:
      "Кейс UX/UI-дизайна Linka: образовательная платформа для логопедов, дефектологов и педагогов коррекционного профиля.",
    images: [{ url: "/seo/og-linka.png", width: 1200, height: 630, alt: "UX/UI-кейс образовательной платформы Linka" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UX/UI дизайн образовательной платформы Linka | Кейс",
    description:
      "Кейс UX/UI-дизайна Linka: образовательная платформа для логопедов, дефектологов и педагогов коррекционного профиля.",
    images: ["/seo/og-linka.png"],
  },
};

export default function LinkaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
