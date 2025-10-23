import Image from "next/image";
import { redirect } from "next/navigation";

import { getUserBlog, getUserProfile } from "@/action/user/getUserProfile";
import { verifyAuth } from "@/lib/user/auth";

import ProfileForm from "@/components/setting/ProfileForm";

import styles from "./page.module.scss";

export default async function UserSettingPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await verifyAuth();

  if (!session.success || !session.data) {
    redirect("/");
  }

  // 이제 session.data가 존재함이 보장됨
  const userInfo = await getUserProfile(session.data.user.id);

  return (
    <div className={styles.page_wrap}>
      <ProfileForm
        initialData={{
          userId: session.data.user.id,
          nickname: userInfo?.nickname || "",
          profile_image_public_id: userInfo?.profile_image_public_id || "",
          profile_image_url: userInfo?.profile_image_url || "",
          email: userInfo?.email || "",
        }}
      />
    </div>
  );
}
