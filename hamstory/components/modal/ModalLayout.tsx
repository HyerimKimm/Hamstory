"use client";

import { useRouter } from "next/navigation";

import styles from "./ModalLayout.module.scss";

export default function ModalLayout({
  children,
  width,
}: {
  children: React.ReactNode;
  width?: number;
}) {
  const router = useRouter();

  return (
    <div className={styles.modal_overlay} onClick={router.back}>
      <div
        className={styles.modal_wrap}
        style={{ width: width ? `${width}px` : "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
