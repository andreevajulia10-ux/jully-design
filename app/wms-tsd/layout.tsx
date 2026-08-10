import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WMS/TSD — кейс @Jully_Ch",
  description:
    "Кейс WMS/TSD: интерфейсы терминалов сбора данных для складских процессов, сортировки, комплектации и контроля товара.",
  alternates: {
    canonical: "/wms-tsd/",
  },
};

export default function WmsTsdLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
