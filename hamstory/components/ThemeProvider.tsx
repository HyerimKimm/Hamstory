"use client";

import localFont from "next/font/local";

import "@/styles/common.scss";

import { uiStore } from "@/stores/uiStore";

const pretendard = localFont({
  src: [
    {
      path: "../assets/fonts/pretendard/Pretendard-Light.woff",
      weight: "300",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-Normal.woff",
      weight: "400",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-SemiBold.woff",
      weight: "500",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-Bold.woff",
      weight: "600",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-ExtraBold.woff",
      weight: "700",
    },
  ],
  variable: "--font-pretendard",
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = uiStore((state) => state.theme);

  return (
    <html>
      <body
        className={`${theme === "DARK" ? "dark" : "light"} ${
          pretendard.variable
        }`}
      >
        {children}
      </body>
    </html>
  );
}
