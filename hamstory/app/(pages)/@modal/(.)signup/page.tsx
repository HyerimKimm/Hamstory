"use client";

import { useActionState } from "react";

import ModalHeader from "@/components/modal/ModalHeader";
import ModalLayout from "@/components/modal/ModalLayout";

import styles from "./page.module.scss";

export default function SignupModal() {
  const [state, formAction] = useActionState(
    async (prevState: { message: string | null }, formData: FormData) => {
      try {
        const nickname = formData.get("nickname");
        const email = formData.get("email");
        const password = formData.get("password");

        const response = await fetch("/api/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nickname, email, password }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          return { message: data.message || "회원가입에 실패했습니다." };
        }

        // 회원가입 성공 시 처리
        if (data.success) {
          // 회원가입 성공 후 리다이렉트 또는 상태 업데이트
          return { message: null };
        } else {
          return { message: data.message || "회원가입에 실패했습니다." };
        }
      } catch (error) {
        console.error("회원가입 에러:", error);
        return { message: "서버 오류가 발생했습니다." };
      }
    },
    { message: null },
  );

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

        {state.message && (
          <div className={styles.error_message}>{state.message}</div>
        )}

        <button type="submit" className={styles.submit_button}>
          회원가입
        </button>
      </form>
    </ModalLayout>
  );
}
