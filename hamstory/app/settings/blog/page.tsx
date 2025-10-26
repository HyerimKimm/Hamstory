import { redirect } from "next/navigation";

import { getUserBlog, getUserProfile } from "@/action/user/getUserProfile";
import { verifyAuth } from "@/lib/user/auth";

import styles from "./page.module.scss";

export default async function BlogSettingPage({
  params,
}: {
  params: Promise<{
    userId: string;
  }>;
}) {
  const session = await verifyAuth();

  if (!session.success || !session.data) {
    redirect("/");
  }

  // 이제 session.data가 존재함이 보장됨
  const userInfo = await getUserProfile(session.data.user.id);
  const blogInfo = await getUserBlog(session.data.user.id);

  return <div className={styles.content_wrap}>블로그 관리</div>;
}
