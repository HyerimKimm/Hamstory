import { redirect } from "next/navigation";

import { getBlogCategory, getUserBlog } from "@/action/blog/getUserBlog";
import { verifyAuth } from "@/lib/user/auth";

import BlogForm from "@/components/setting/BlogForm";

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
  const blogInfo = await getUserBlog(session.data.user.id);
  const categories = await getBlogCategory(blogInfo?._id || "");

  const initialData = {
    blogId: blogInfo?._id || "",
    userId: session.data.user.id,
    title: blogInfo?.title || "",
    description: blogInfo?.description || "",
    categories: categories || [],
  };

  return (
    <div className={styles.content_wrap}>
      <BlogForm initialData={initialData} />
    </div>
  );
}
