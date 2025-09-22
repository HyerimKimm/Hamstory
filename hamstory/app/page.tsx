import { useRouter } from "next/navigation";

import { verifyAuth } from "@/lib/user/auth";

import Header from "@/components/header/Header";

export default async function MainPage() {
  const session = await verifyAuth();

  return <Header isLogin={session.success} />;
}
