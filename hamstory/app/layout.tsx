import type { Metadata } from "next";

import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Hamstory",
  description: "햄스토리는 블로그 서비스입니다.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
