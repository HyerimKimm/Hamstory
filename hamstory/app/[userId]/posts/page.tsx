type PostType = {
  id: number;
  title: string;
};

export default async function PostListPage() {
  const res = await fetch("http://localhost:3000/api/1/posts", {
    method: "GET",
    headers: {
      "X-ID": "test",
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  const posts: PostType[] = data.posts;

  return (
    <div>
      {posts.map((post: PostType) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </div>
  );
}
