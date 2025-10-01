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
    email: string;
  };
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form className={styles.form_wrap}>
      {/* 프로필 이미지 */}
      <div className={styles.profile_input_wrap}>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }
          }}
        />
        <div>
          <button
            type="button"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            className={`${styles.non_bg_button} ${styles.main}`}
          >
            이미지 업로드
          </button>
          <button
            type="button"
            className={`${styles.non_bg_button} ${styles.white}`}
          >
            이미지 삭제
          </button>
        </div>
        <input
          type="file"
          name="profile_image"
          tabIndex={-1}
          ref={fileInputRef}
          accept="image/*"
        />
      </div>

      {/* 닉네임 */}
      <div className={styles.input_wrap}>
        <label htmlFor="nickname">닉네임</label>
        <div className={styles.info}>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            defaultValue={initialData.nickname}
            className={styles.input}
          />
          <button type="button" className={styles.main_bg_button}>
            수정
          </button>
        </div>
      </div>

      {/* 이메일 */}
      <div className={styles.input_wrap}>
        <label htmlFor="email">이메일</label>
        <div className={styles.info}>
          <input
            type="text"
            name="nickname"
            placeholder="이메일"
            defaultValue={initialData.email}
            className={styles.input}
          />
          <button type="button" className={styles.main_bg_button}>
            수정
          </button>
        </div>
      </div>

      {/* 비밀번호 */}
      <div className={styles.input_wrap}>
        <label htmlFor="password">비밀번호</label>
        <div className={styles.info}>
          <button type="button" className={styles.main_bg_button}>
            비밀번호 수정
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 */}
      <div className={styles.input_wrap}>
        <label htmlFor="withdraw">회원 탈퇴</label>
        <div className={styles.info}>
          <button type="button" className={styles.main_bg_button}>
            회원 탈퇴
          </button>
        </div>
      </div>
    </form>
  );
}
