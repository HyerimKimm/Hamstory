"use client";

import Image from "next/image";

import { updateUserEmail, updateUserNickname } from "@/action/updateUserInfo";
import {
  deleteCloudinaryImage,
  updateUserProfileImage,
  uploadImageToCloudinary,
} from "@/action/updateUserProfileImage";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import defaultProfileImage from "@/assets/images/icons/profile_default_darkmode.svg";

import styles from "./ProfileForm.module.scss";

export default function ProfileForm({
  initialData,
}: {
  initialData: {
    userId: string;
    nickname: string;
    profile_image_public_id: string;
    profile_image_url: string;
    email: string;
  };
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileImage, setProfileImage] = useState<{
    publicId: string;
    url: string;
  }>({
    publicId: initialData.profile_image_public_id,
    url: initialData.profile_image_url,
  });

  const [nickname, setNickname] = useState(initialData.nickname);
  const [email, setEmail] = useState(initialData.email);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (1MB 제한)
    if (file.size > 1 * 1024 * 1024) {
      toast.error("파일 크기는 1MB 이하여야 합니다.");
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    try {
      const { data } = await uploadImageToCloudinary(file);

      if (!data) {
        toast.error("이미지 업로드에 실패했습니다.");
        return;
      }

      const result = await updateUserProfileImage(
        initialData.userId,
        data.publicId,
        data.url,
      );

      if (result.success) {
        setProfileImage({
          publicId: data.publicId,
          url: data.url,
        });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("이미지 업로드 에러:", error);
      toast.error("이미지 업로드에 실패했습니다.");
    }
  }

  async function handleImageDelete() {
    const result = await deleteCloudinaryImage(profileImage.publicId);

    if (result.success) {
      updateUserProfileImage(initialData.userId, "", "");
      setProfileImage({
        publicId: "",
        url: "",
      });
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  async function handleNicknameUpdate() {
    const result = await updateUserNickname(initialData.userId, nickname);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  async function handleEmailUpdate() {
    const result = await updateUserEmail(initialData.userId, email);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form className={styles.form_wrap}>
      {/* 프로필 이미지 */}
      <div className={styles.profile_input_wrap}>
        <Image
          src={profileImage.url || defaultProfileImage}
          alt="profile"
          width={100}
          height={100}
          className={styles.profile_image}
        />
        {/* 이미지 업로드 버튼과 삭제 버튼 */}
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
            onClick={handleImageDelete}
          >
            이미지 삭제
          </button>
        </div>
        {/* 이미지 업로드 인풋 ( 눈에 안보이게 설정 ) */}
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
            onChange={(e) => setNickname(e.target.value)}
          />
          <button
            type="button"
            className={styles.main_bg_button}
            onClick={handleNicknameUpdate}
          >
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
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            className={styles.main_bg_button}
            onClick={handleEmailUpdate}
          >
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
