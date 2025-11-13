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
      {/* 블로그 제목, 설명 */}
      <section className={styles.blog_info_wrap}>
        <h1 className={styles.title}>{blogInfo?.title}</h1>
        <p className={styles.description}>{blogInfo?.description}</p>
      </section>

      {/* 블로그 주인 프로필 정보 */}
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

      {/* 블로그 카테고리 목록 */}
      <section className={styles.post_list_wrap}>
        {/* 블로그 카테고리 목록 (테블릿, 모바일에서는 숨김) */}
        <aside className={styles.aside_category_list_wrap}>
          <h5 className={styles.aside_title}>카테고리</h5>
          <ul className={styles.category_list}>
            {categories.map((category: Category) => (
              <li key={category._id} className={styles.category_item}>
                <button type="button">{category.name}</button>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
