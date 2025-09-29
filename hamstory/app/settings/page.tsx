import { redirect } from "next/navigation";

import { verifyAuth } from "@/lib/user/auth";

export default async function SettingsPage() {
  const session = await verifyAuth();

  if (!session.success) {
    redirect("/");
  }

  return <div>여기서 내 블로그 설정 수정</div>;
}
