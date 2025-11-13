import Image from "next/image";
import Link from "next/link";

import { getUserProfile } from "@/action/user/getUserProfile";
import { verifyAuth } from "@/lib/user/auth";

import logo from "@/assets/images/logos/logo.svg";

import styles from "./Header.module.scss";
import ProfileDropdown from "./profile_dropdown/ProfileDropdown";

export default async function Header() {
  const session = await verifyAuth();

  const isLogin = session.success;
  const userId = session.data?.user?.id || "";

  if (!!isLogin && !!userId) {
    const userInfo = await getUserProfile(userId);

    if (userInfo) {
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
          <div className={styles.header_right_wrapper}>
            <ProfileDropdown userInfo={userInfo} />
          </div>
        </header>
      );
    }
  }

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
      <div className={styles.header_right_wrapper}>
        <Link href="/login">로그인</Link>
      </div>
    </header>
  );
}
