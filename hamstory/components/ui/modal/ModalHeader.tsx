"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import closeIcon from "@/assets/images/icons/close_icon.svg";

import styles from "./ModalHeader.module.scss";

export default function ModalHeader({
  title,
  onClose,
  closeDisabled,
}: {
  title: string;
  onClose: () => void;
  closeDisabled: boolean;
}) {
  const router = useRouter();

  return (
    <div className={styles.header_wrap}>
      <h3 className={styles.header_title}>{title}</h3>
      <button
        className={styles.close_button}
        onClick={onClose}
        disabled={closeDisabled}
      >
        <Image src={closeIcon} alt="닫기" className={styles.icon} />
      </button>
    </div>
  );
}
