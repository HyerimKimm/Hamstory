import { redirect } from "next/navigation";

import {
  getBlogCategory,
  getUserBlog,
  getUserProfile,
} from "@/action/user/getUserProfile";
import { verifyAuth } from "@/lib/user/auth";

import { Category } from "@/types/collection";

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
  const categories = await getBlogCategory(blogInfo?._id || "");

  return (
    <div className={styles.content_wrap}>
      <form className={styles.form_wrap}>
        {/* 블로그 제목 */}
        <div className={styles.input_wrap}>
          <label htmlFor="title">블로그 제목</label>
          <div className={styles.info}>
            <input
              type="text"
              name="title"
              defaultValue={blogInfo?.title || ""}
              className={styles.input}
            />
            <button type="button" className={styles.main_bg_button}>
              수정
            </button>
          </div>
        </div>
        {/* 블로그 설명 */}
        <div className={styles.input_wrap}>
          <label htmlFor="description">블로그 설명</label>
          <div className={styles.info}>
            <textarea
              name="description"
              defaultValue={blogInfo?.description || ""}
              className={styles.textarea}
            />
          </div>
        </div>
        {/* 블로그 카테고리 */}
        <div className={styles.input_wrap}>
          <label htmlFor="category">블로그 카테고리</label>
          <div className={styles.info}>
            <ul className={styles.category_list}>
              {categories.map((category: Category) => (
                <li key={category._id}>{category.name}</li>
              ))}
            </ul>
          </div>
          <button type="button" className={styles.main_bg_button}>
            +
          </button>
        </div>
      </form>
    </div>
  );
}
