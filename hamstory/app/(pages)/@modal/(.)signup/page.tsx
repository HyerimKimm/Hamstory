"use client";

import { useRouter } from "next/navigation";

import { useActionState } from "react";

import ModalHeader from "@/components/modal/ModalHeader";
import ModalLayout from "@/components/modal/ModalLayout";

import styles from "./page.module.scss";

export default function SignupModal() {
  const router = useRouter();

  const [state, formAction] = useActionState(
    async (
      prevState: {
        success: boolean;
        message: string;
        data: string | object | null;
      },
      formData: FormData,
    ) => {
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

        // API 응답을 그대로 반환하여 상태와 일치시킴
        if (data.success) {
          // 회원가입 성공 후 리다이렉트 또는 상태 업데이트
          router.back();
        }

        return data;
      } catch (error) {
        console.error("회원가입 에러:", error);
        return {
          success: false,
          message: "서버 오류가 발생했습니다.",
          data: null,
        };
      }
    },
    { success: false, message: "", data: null },
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
