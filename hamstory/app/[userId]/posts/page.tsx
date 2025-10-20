import Image from "next/image";
import { redirect } from "next/navigation";

import { getUserBlog, getUserProfile } from "@/action/user/getUserProfile";
import { verifyAuth } from "@/lib/user/auth";

import styles from "./page.module.scss";

export default async function PostListPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = await params;

  const userInfo = await getUserProfile(userId);
  const blogInfo = await getUserBlog(userId);

  return (
    <main className={styles.page_wrap}>
      <div>
        <h1>{blogInfo?.title}</h1>
        <p>{blogInfo?.description}</p>
      </div>

      <div>
        {userInfo?.profile_image_url ? (
          <Image
            src={userInfo.profile_image_url}
            alt="profile image"
            width={100}
            height={100}
            className={styles.profile_image}
          />
        ) : (
          <div
            className={styles.profile_image}
            style={{
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Image
          </div>
        )}
        <div>{userInfo?.nickname}</div>
        <div>{userInfo?.email}</div>
      </div>
    </main>
  );
}
