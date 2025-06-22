import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/images/logos/logo.svg";

import styles from "./page.module.scss";

export default function MainPage() {
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
      <Link href="/login">로그인</Link>
    </header>
  );
}
