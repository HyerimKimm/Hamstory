"use client";

import Link from "next/link";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import ModalHeader from "@/components/modal/ModalHeader";
import ModalLayout from "@/components/modal/ModalLayout";

import styles from "./page.module.scss";

export default function LoginModal() {
  const [state, formAction] = useActionState(
    async (prevState: { message: string | null }, formData: FormData) => {
      try {
        const email = formData.get("email");
        const password = formData.get("password");

        const response = await fetch("/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { message: data.message || "로그인에 실패했습니다." };
        }

        // 로그인 성공 시 처리
        if (data.success) {
          // 로그인 성공 후 리다이렉트 또는 상태 업데이트
          window.location.href = "/"; // 또는 원하는 페이지로 리다이렉트
          return { message: null };
        } else {
          return { message: data.message || "로그인에 실패했습니다." };
        }
      } catch (error) {
        console.error("로그인 에러:", error);
        return { message: "서버 오류가 발생했습니다." };
      }
    },
    { message: null },
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
