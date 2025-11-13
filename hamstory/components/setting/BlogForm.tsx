"use client";

import { addBlogCategory } from "@/action/blog/addBlogCategory";
import { deleteBlogCategory } from "@/action/blog/deleteBlogCategory";
import { useState } from "react";

import AddIcon from "@/assets/images/icons/AddIcon";
import DeleteIcon from "@/assets/images/icons/DeleteIcon";
import DnDIcon from "@/assets/images/icons/DnDIcon";
import LoadingIndicator from "@/assets/images/icons/LoadingIndicator";
import PencilIcon from "@/assets/images/icons/PencilIcon";

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
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);

  const [isTitleLoading, setIsTitleLoading] = useState(false);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);

  async function handleTitleUpdate() {
    setIsTitleLoading(true);
    /* Todo : 블로그 제목 수정 액션 추가 */
    setIsTitleLoading(false);
  }

  async function handleDescriptionUpdate() {
    setIsDescriptionLoading(true);
    /* Todo : 블로그 설명 수정 액션 추가 */
    setIsDescriptionLoading(false);
  }

  return (
    <form className={styles.form_wrap}>
      {/* 블로그 제목 */}
      <div className={styles.input_wrap}>
        <label htmlFor="title">블로그 제목</label>
        <div className={styles.info}>
          <input
            type="text"
            name="title"
            defaultValue={initialData.title}
            className={styles.input}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            type="button"
            className={styles.main_bg_button}
            onClick={handleTitleUpdate}
            disabled={isTitleLoading}
          >
            {isTitleLoading && (
              <LoadingIndicator width={24} height={24} color="white" />
            )}
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
            defaultValue={initialData.description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
          />
          <button
            type="button"
            className={styles.main_bg_button}
            onClick={handleDescriptionUpdate}
          >
            수정
          </button>
        </div>
      </div>
      {/* 블로그 카테고리 */}
      <div className={styles.category_wrap}>
        <label htmlFor="category">블로그 카테고리</label>
        <div className={styles.info}>
          <ul className={styles.category_list}>
            {initialData.categories.map((category: Category) => (
              <li key={category._id} className={styles.category_item}>
                <span className={styles.category_name}>{category.name}</span>
                <button
                  type="button"
                  className={`${styles.icon_button} ${styles.dnd}`}
                  title="카테고리 순서 변경"
                  aria-label="카테고리 순서 변경"
                >
                  <DnDIcon width={24} height={24} />
                </button>
                <button
                  type="button"
                  className={styles.icon_button}
                  title="카테고리 수정"
                  aria-label="카테고리 수정"
                >
                  <PencilIcon width={24} height={24} />
                </button>
                <button
                  type="button"
                  className={styles.icon_button}
                  title="카테고리 삭제"
                  aria-label="카테고리 삭제"
                  onClick={() => {
                    deleteBlogCategory(category._id);
                  }}
                >
                  <DeleteIcon width={24} height={24} />
                </button>
              </li>
            ))}
            <button
              type="button"
              title="카테고리 추가"
              className={styles.add_category_button}
              onClick={() => {
                addBlogCategory(initialData.blogId, "새 카테고리");
              }}
            >
              <AddIcon width={24} height={24} />
            </button>
          </ul>
        </div>
      </div>
    </form>
  );
}
