"use client";

import { useRouter } from "next/navigation";

import styles from "./ModalLayout.module.scss";

export default function ModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className={styles.modal_overlay} onClick={router.back}>
      {children}
    </div>
  );
}
