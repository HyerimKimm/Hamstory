import { verifyAuth } from "@/lib/user/auth";

import Header from "@/components/header/Header";

export default async function SettingsPage() {
  const session = await verifyAuth();

  return (
    <>
      <Header verifyAuth={session} />
      여기서 내 블로그 설정 수정
    </>
  );
}
