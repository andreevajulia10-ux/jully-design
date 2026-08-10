import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Архив — @Jully_Ch",
  description:
    "Архив визуальных экспериментов, интерфейсов и рабочих набросков Юлии Черношей.",
  alternates: {
    canonical: "/archives/",
  },
};

export default function ArchivesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
