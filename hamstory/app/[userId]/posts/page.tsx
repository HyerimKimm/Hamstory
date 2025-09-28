import { verifyAuth } from "@/lib/user/auth";

import Header from "@/components/header/Header";

export default async function PostListPage({
  params,
}: {
  params: { userId: string };
}) {
  const session = await verifyAuth();

  return (
    <>
      <Header verifyAuth={session} />
      여기에 내 블로그 게시물 노출
    </>
  );
}
