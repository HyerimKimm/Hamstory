import type { Metadata } from "next";

import ThemeProvider from "@/components/provider/ThemeProvider";

export const metadata: Metadata = {
  title: "Hamstory",
  description: "햄스토리는 블로그 서비스입니다.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  modal,
  children,
}: Readonly<{
  modal: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      {modal}
      {children}
    </ThemeProvider>
  );
}
