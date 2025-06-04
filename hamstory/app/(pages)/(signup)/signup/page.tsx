"use client";

import { useRef } from "react";

export default function SignUpPage() {
  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      nicknameInputRef.current &&
      emailInputRef.current &&
      passwordInputRef.current
    ) {
      fetch(`/api/user/signup`, {
        method: "POST",
        body: JSON.stringify({
          nickname: nicknameInputRef.current.value,
          email: emailInputRef.current.value,
          password: passwordInputRef.current.value,
        }),
      });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      Root Page.
      <input
        ref={nicknameInputRef}
        type="text"
        placeholder="닉네임을 입력해 주세요."
      />
      <input
        ref={emailInputRef}
        type="email"
        placeholder="이메일을 입력해 주세요."
      />
      <input
        ref={passwordInputRef}
        type="password"
        placeholder="비밀번호를 입력해 주세요."
      />
      <button>제출</button>
    </form>
  );
}
