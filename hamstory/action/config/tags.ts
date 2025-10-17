const TAGS = {
  users: {
    tags: (userId: string) => ["users", userId],
    revalidate: 60 * 5,
    revalidateTag: ["users", "profiles"],
  },
  blogs: {
    tags: (userId: string) => ["blogs", userId],
    revalidate: 60 * 5,
    revalidateTag: ["blogs"],
  },
};

export default TAGS;
