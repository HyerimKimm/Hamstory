"use client";

import Link from "next/link";

import login from "@/lib/user/login";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import ModalHeader from "@/components/modal/ModalHeader";
import ModalLayout from "@/components/modal/ModalLayout";

import styles from "./page.module.scss";

export default function LoginModal() {
  const [state, formAction] = useActionState(
    async (
      prevState: {
        success: boolean;
        message: string;
        data: string | object | null;
      },
      formData: FormData,
    ) => {
      const result = await login(prevState, formData);

      return result;
    },
    {
      success: false,
      message: "",
      data: null,
    },
  );

  const { pending, data, method } = useFormStatus();

  return (
    <ModalLayout width={330}>
      <ModalHeader title="로그인" />
      <form className={styles.content_wrap} action={formAction}>
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
        {state.message && (
          <div className={styles.error_message}>{state.message}</div>
        )}
        <button
          type="submit"
          className={styles.submit_button}
          disabled={pending}
        >
          {pending ? "로그인 중..." : "로그인"}
        </button>
        <div className={styles.signup_link_wrap}>
          <span className={styles.signup_link_text}>회원이 아니신가요?</span>
          <Link href="signup" className={styles.signup_link}>
            회원가입
          </Link>
        </div>
      </form>
    </ModalLayout>
  );
}
