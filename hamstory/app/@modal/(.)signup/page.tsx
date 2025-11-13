"use client";

import { useRouter } from "next/navigation";

import signup from "@/action/user/signup";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import ModalHeader from "@/components/ui/modal/ModalHeader";
import ModalLayout from "@/components/ui/modal/ModalLayout";

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
      const result = await signup(prevState, formData);

      if (result.success) {
        alert("회원가입이 완료되었습니다.");
        router.back();
      }

      return result;
    },
    {
      success: false,
      message: "",
      data: null,
    },
  );

  const { pending } = useFormStatus();

  function handleClose() {
    if (pending) return;
    router.back();
  }

  return (
    <ModalLayout width={330} onClose={handleClose}>
      <ModalHeader
        title="회원가입"
        closeDisabled={pending}
        onClose={handleClose}
      />
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

        {state?.message && (
          <div className={styles.error_message}>{state.message}</div>
        )}

        <button type="submit" className={styles.submit_button}>
          회원가입
        </button>
      </form>
    </ModalLayout>
  );
}
