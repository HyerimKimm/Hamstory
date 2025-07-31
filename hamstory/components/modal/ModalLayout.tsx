"use client";

import styles from "./ModalLayout.module.scss";

export default function ModalLayout({
  children,
  width,
}: {
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <div className={styles.modal_overlay}>
      <div
        className={styles.modal_wrap}
        style={{ width: width ? `${width}px` : "auto" }}
      >
        {children}
      </div>
    </div>
  );
}
