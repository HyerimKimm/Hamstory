"use client";

import Image from "next/image";

import { uploadImageToCloudinary } from "@/action/updateUserProfileImage";
import { useRef } from "react";
import { toast } from "react-toastify";

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

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary(file);

      console.log(imageUrl);
    } catch (error) {
      console.error("이미지 업로드 에러:", error);
      toast.error("이미지 업로드에 실패했습니다.");
    }
  }

  return (
    <form className={styles.form_wrap}>
      {/* 프로필 이미지 */}
      <div className={styles.profile_input_wrap}>
        <Image
          src={initialData.profile_image || defaultProfileImage}
          alt="profile"
          width={100}
          height={100}
          className={styles.profile_image}
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
          onChange={handleImageChange}
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
