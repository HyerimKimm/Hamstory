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
  return <div>Signup Page.</div>;
}
