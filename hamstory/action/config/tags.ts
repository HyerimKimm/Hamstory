const TAGS = {
  users: {
    tags: (userId: string) => ["user", userId],
    revalidate: 60 * 5,
    revalidateTag: ["user"],
  },
  blogs: {
    tags: (userId: string) => ["blog", userId],
    revalidate: 60 * 5,
    revalidateTag: ["blog"],
  },
  categories: {
    tags: (blogId: string) => ["category", blogId],
    revalidate: 60 * 5,
    revalidateTag: ["category"],
  },
};

export default TAGS;
