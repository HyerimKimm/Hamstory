"use client";

import "@/styles/common.scss";

import { uiStore } from "@/stores/uiStore";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = uiStore((state) => state.theme);

  return (
    <html>
      <body className={theme === "DARK" ? "dark" : "light"}>{children}</body>
    </html>
  );
}
