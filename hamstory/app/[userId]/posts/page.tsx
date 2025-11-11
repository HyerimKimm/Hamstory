import Image from "next/image";

import { getBlogCategory, getUserBlog } from "@/action/blog/getUserBlog";
import { getUserProfile } from "@/action/user/getUserProfile";

import defaultProfileImage from "@/assets/images/icons/profile_default_darkmode.svg";

import { Category } from "@/types/collection";

import styles from "./page.module.scss";

/* 특정 유저의 블로그 */
export default async function PostListPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const userInfo = await getUserProfile(userId);
  const blogInfo = await getUserBlog(userId);
  const categories = await getBlogCategory(blogInfo?._id || "");

  return (
    <main className={styles.page_wrap}>
      <section className={styles.blog_info_wrap}>
        <h1 className={styles.title}>{blogInfo?.title}</h1>
        <p className={styles.description}>{blogInfo?.description}</p>
      </section>

      <section className={styles.profile_info_wrap}>
        <Image
          src={userInfo?.profile_image_url || defaultProfileImage}
          alt="profile image"
          width={100}
          height={100}
          className={styles.profile_image}
        />
        <div className={styles.profile_info_text_wrap}>
          <span className={styles.nickname}>{userInfo?.nickname}</span>
          <span className={styles.email}>{userInfo?.email}</span>
        </div>
      </section>

      <section className={styles.category_list_wrap}>
        <label htmlFor="category">카테고리</label>
        <ul className={styles.category_list}>
          {categories.map((category: Category) => (
            <li key={category._id} className={styles.category_item}>
              <span className={styles.category_name}>{category.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
