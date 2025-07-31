import ModalHeader from "@/components/modal/ModalHeader";
import ModalLayout from "@/components/modal/ModalLayout";

import styles from "./page.module.scss";

export default function LoginModal() {
  return (
    <ModalLayout width={330}>
      <ModalHeader title="로그인" />
      <div className={styles.content_wrap}>Content</div>
    </ModalLayout>
  );
}
