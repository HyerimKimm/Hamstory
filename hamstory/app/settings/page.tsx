import Image from "next/image";
import { redirect } from "next/navigation";

import getUserProfile from "@/action/getUserProfile";
import { verifyAuth } from "@/lib/user/auth";

import ProfileForm from "@/components/settings/ProfileForm";

export default async function SettingsPage({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const session = await verifyAuth();

  if (!session.success || !session.data) {
    redirect("/");
  }

  // 이제 session.data가 존재함이 보장됨
  const userInfo = await getUserProfile(session.data.user.id);

  return (
    <ProfileForm
      initialData={{
        nickname: userInfo?.nickname || "",
        profile_image: userInfo?.profile_image || "",
      }}
    />
  );
}
