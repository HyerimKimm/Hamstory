"use client";

import { addBlogCategory } from "@/action/blog/addBlogCategory";
import { deleteBlogCategory } from "@/action/blog/deleteBlogCategory";

import { Category } from "@/types/collection";

import styles from "./BlogForm.module.scss";

export default function BlogForm({
  initialData,
}: {
  initialData: {
    blogId: string;
    userId: string;
    title: string;
    description: string;
    categories: Category[];
  };
}) {
  return (
    <form className={styles.form_wrap}>
      {/* 블로그 제목 */}
      <div className={styles.input_wrap}>
        <label htmlFor="title">블로그 제목</label>
        <div className={styles.info}>
          <input
            type="text"
            name="title"
            defaultValue={initialData.title || ""}
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
            defaultValue={initialData.description || ""}
            className={styles.textarea}
          />
        </div>
      </div>
      {/* 블로그 카테고리 */}
      <div className={styles.input_wrap}>
        <label htmlFor="category">블로그 카테고리</label>
        <div className={styles.info}>
          <ul className={styles.category_list}>
            {initialData.categories.map((category: Category) => (
              <li key={category._id} className={styles.category_item}>
                <span className={styles.category_name}>{category.name}</span>
                <button
                  type="button"
                  className={styles.delete_button}
                  onClick={() => {
                    deleteBlogCategory(category._id);
                  }}
                >
                  -
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className={styles.main_bg_button}
          onClick={() => {
            addBlogCategory(initialData.blogId, "새 카테고리");
          }}
        >
          +
        </button>
      </div>
    </form>
  );
}
