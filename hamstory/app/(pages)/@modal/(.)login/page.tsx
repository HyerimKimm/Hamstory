import ModalHeader from "@/components/modal/ModalHeader";
import ModalLayout from "@/components/modal/ModalLayout";

import styles from "./page.module.scss";

export default function LoginModal() {
  return (
    <ModalLayout width={330}>
      <ModalHeader title="로그인" />
      <form className={styles.content_wrap}>
        <div className={styles.content_input_wrap}>
          <label className={styles.label}>이메일</label>
          <input
            type="email"
            className={styles.content_input}
            placeholder="이메일을 입력해 주세요."
          />
        </div>

        <div className={styles.content_input_wrap}>
          <label className={styles.label}>비밀번호</label>
          <input
            type="password"
            className={styles.content_input}
            placeholder="비밀번호를 입력해 주세요."
          />
        </div>
      </form>
    </ModalLayout>
  );
}
