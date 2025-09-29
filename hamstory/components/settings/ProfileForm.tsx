"use client";

import Image from "next/image";

import { useRef } from "react";

import defaultProfileImage from "@/assets/images/icons/profile_default_darkmode.svg";

import styles from "./ProfileForm.module.scss";

export default function ProfileForm({
  initialData,
}: {
  initialData: {
    nickname: string;
    profile_image: string;
  };
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form className={styles.form_wrap}>
      <Image
        src={
          !initialData.profile_image
            ? defaultProfileImage
            : initialData.profile_image
        }
        alt="profile"
        width={100}
        height={100}
        className={styles.profile_image}
        tabIndex={0}
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }
        }}
      />
      <input
        type="file"
        name="profile_image"
        tabIndex={-1}
        ref={fileInputRef}
        accept="image/*"
        className={styles.profile_hidden_input}
      />

      <div className={styles.nickname_wrap}>
        <label htmlFor="nickname">닉네임</label>
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          defaultValue={initialData.nickname}
          className={styles.nickname_input}
        />
      </div>
      <button type="submit" className={styles.submit_button}>
        저장하기
      </button>
    </form>
  );
}
