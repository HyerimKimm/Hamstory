"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./SettingTab.module.scss";

export default function SettingTab() {
  const pathname = usePathname();

  const isUserPage = pathname === "/settings/user";
  const isBlogPage = pathname === "/settings/blog";

  return (
    <nav className={styles.tab_wrap}>
      <Link
        href="/settings/user"
        className={`${styles.tab_item} ${isUserPage ? styles.active : ""}`}
      >
        내 정보 관리
      </Link>
      <Link
        href="/settings/blog"
        className={`${styles.tab_item} ${isBlogPage ? styles.active : ""}`}
      >
        블로그 관리
      </Link>
    </nav>
  );
}
