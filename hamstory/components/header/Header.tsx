"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import logout from "@/action/logout";
import { useState } from "react";
import { toast } from "react-toastify";

import FullArrowIcon from "@/assets/images/icons/FullArrowIcon";
import profile_default_darkmode from "@/assets/images/icons/profile_default_darkmode.svg";
import logo from "@/assets/images/logos/logo.svg";

import styles from "./Header.module.scss";

export default function Header({ isLogin }: { isLogin: boolean }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

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
          <>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.header_profile_button}
            >
              <Image
                src={profile_default_darkmode}
                alt="프로필 사진 기본 이미지"
                width={30}
                height={30}
                className={styles.header_profile_img}
              />
              <FullArrowIcon rotate={isOpen ? 180 : 0} />
            </button>
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
          </>
        ) : (
          <Link href="/login">로그인</Link>
        )}
      </div>
    </header>
  );
}
