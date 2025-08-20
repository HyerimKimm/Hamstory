"use client";

import signup from "@/lib/user/signup";
import { useActionState } from "react";

import ModalHeader from "@/components/modal/ModalHeader";
import ModalLayout from "@/components/modal/ModalLayout";

import styles from "./page.module.scss";

export default function SignupModal() {
  const [state, formAction] = useActionState(signup, {
    success: false,
    message: "",
    data: null,
  });

  return (
    <ModalLayout width={330}>
      <ModalHeader title="회원가입" />
      <form className={styles.content_wrap} action={formAction}>
        <div className={styles.content_input_wrap}>
          <label className={styles.label}>닉네임</label>
          <input
            name="nickname"
            type="text"
            className={styles.content_input}
            placeholder="닉네임을 입력해 주세요."
            required
          />
        </div>

        <div className={styles.content_input_wrap}>
          <label className={styles.label}>이메일</label>
          <input
            name="email"
            type="email"
            className={styles.content_input}
            placeholder="이메일을 입력해 주세요."
            required
          />
        </div>

        <div className={styles.content_input_wrap}>
          <label className={styles.label}>비밀번호</label>
          <input
            name="password"
            type="password"
            className={styles.content_input}
            placeholder="비밀번호를 입력해 주세요."
            required
          />
        </div>

        {!state.success && state.message && (
          <div className={styles.error_message}>{state.message}</div>
        )}

        <button type="submit" className={styles.submit_button}>
          회원가입
        </button>
      </form>
    </ModalLayout>
  );
}
