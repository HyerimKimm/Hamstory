"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import logout from "@/action/logout";
import { toast } from "react-toastify";

import logo from "@/assets/images/logos/logo.svg";

import styles from "./Header.module.scss";

export default function Header({ isLogin }: { isLogin: boolean }) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.header_logo}>
        <h3 className={styles.header_title}>
          <Image
            src={logo}
            alt="Hamstory Logo"
            width={45}
            priority
            className={styles.header_logo_img}
          />
          <span className={styles.brand}>H</span>amstory
        </h3>
      </Link>
      {isLogin ? (
        <form
          action={async () => {
            const result = await logout();

            if (result.success) {
              toast.success(result.message);
              router.refresh();
            } else {
              toast.error(result.message);
            }
          }}
        >
          <button type="submit">로그아웃</button>
        </form>
      ) : (
        <Link href="/login">로그인</Link>
      )}
    </header>
  );
}
