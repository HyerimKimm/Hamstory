"use client";

import useFocusLock from "@/hooks/useFocusLock";
import { useRef } from "react";

import styles from "./ModalLayout.module.scss";

export default function ModalLayout({
  children,
  width,
  onClose,
}: {
  children: React.ReactNode;
  width?: number;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusLock({
    containerRef: modalRef,
    onClose,
    enabled: true,
  });

  return (
    <div className={styles.modal_overlay}>
      <div
        ref={modalRef}
        className={styles.modal_wrap}
        style={{ width: width ? `${width}px` : "auto" }}
      >
        {children}
      </div>
    </div>
  );
}
