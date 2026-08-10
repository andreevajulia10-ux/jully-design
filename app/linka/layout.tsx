import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Linka — кейс @Jully_Ch",
  description:
    "Кейс Linka: образовательная платформа для логопедов, дефектологов и педагогов коррекционного профиля.",
  alternates: {
    canonical: "/linka/",
  },
};

export default function LinkaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
