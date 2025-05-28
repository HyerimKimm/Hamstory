export default async function PostListPage() {
  const res = await fetch("http://localhost:3000/api", {
    method: "GET",
    headers: {
      "X-ID": "test",
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  console.log(data);

  return <div>Post List Page.</div>;
}
