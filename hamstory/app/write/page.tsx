import { redirect } from "next/navigation";

import { verifyAuth } from "@/lib/user/auth";

export default async function WritePostPage() {
  const session = await verifyAuth();

  if (!session.success || !session.data) {
    redirect("/");
  }

  return <div>Write Post Page.</div>;
}
