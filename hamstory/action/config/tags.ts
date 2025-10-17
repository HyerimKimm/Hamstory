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
};

export default TAGS;
