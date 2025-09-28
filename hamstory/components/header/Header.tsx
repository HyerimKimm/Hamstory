import Image from "next/image";
import Link from "next/link";

import { Session, User } from "lucia";

import logo from "@/assets/images/logos/logo.svg";

import styles from "./Header.module.scss";
import ProfileDropdown from "./profile_dropdown/ProfileDropdown";

export default function Header({
  verifyAuth,
}: {
  verifyAuth: {
    success: boolean;
    message: string;
    data:
      | {
          user: User;
          session: Session;
        }
      | {
          user: null;
          session: null;
        }
      | null;
  };
}) {
  const isLogin = verifyAuth.success;
  const userId = verifyAuth.data?.user?.id || "";

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
        {isLogin ? (
          <ProfileDropdown userId={userId} />
        ) : (
          <Link href="/login">로그인</Link>
        )}
      </div>
    </header>
  );
}
