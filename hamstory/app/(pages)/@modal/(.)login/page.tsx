import ModalLayout from "@/components/modal/ModalLayout";

import styles from "./page.module.scss";

export default function LoginModal() {
  return (
    <ModalLayout>
      <div className={styles.modal_wrap}>
        <div className={styles.header_wrap}>Header</div>
        <div className={styles.content_wrap}>Content</div>
      </div>
    </ModalLayout>
  );
}
