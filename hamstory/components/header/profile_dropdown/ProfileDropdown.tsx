"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import logout from "@/action/logout";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import FullArrowIcon from "@/assets/images/icons/FullArrowIcon";
import profile_default_darkmode from "@/assets/images/icons/profile_default_darkmode.svg";

import styles from "./ProfileDropdown.module.scss";

export default function ProfileDropdown({ userId }: { userId: string }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  async function handleLogout() {
    const result = await logout();

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  // 클릭 외부 영역 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 라우트 변경 감지하여 드롭다운 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div ref={dropdownRef} className={styles.header_profile_dropdown}>
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 100 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.15 }}
            className={styles.header_profile_dropdown_content}
          >
            <Link
              className={styles.header_profile_dropdown_content_item}
              href={`/${userId}/posts`}
            >
              내 블로그
            </Link>
            <Link
              className={styles.header_profile_dropdown_content_item}
              href="/settings"
            >
              설정
            </Link>
            <button
              className={styles.header_profile_dropdown_content_item}
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
