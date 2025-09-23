"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import logout from "@/action/logout";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import FullArrowIcon from "@/assets/images/icons/FullArrowIcon";
import profile_default_darkmode from "@/assets/images/icons/profile_default_darkmode.svg";

import styles from "./ProfileDropdown.module.scss";

export default function ProfileDropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

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
            animate={{ height: 96 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.15 }}
            className={styles.header_profile_dropdown_content}
          >
            <button className={styles.header_profile_dropdown_content_item}>
              내 블로그
            </button>
            <button className={styles.header_profile_dropdown_content_item}>
              설정
            </button>
            <button
              className={styles.header_profile_dropdown_content_item}
              onClick={async () => {
                const result = await logout();

                if (result.success) {
                  toast.success(result.message);
                  router.refresh();
                } else {
                  toast.error(result.message);
                }
              }}
            >
              로그아웃
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
