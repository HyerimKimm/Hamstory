import { redirect } from "next/navigation";

import { verifyAuth } from "@/lib/user/auth";

export default async function SettingsPage() {
  const result = await verifyAuth();

  if (!result.success) {
    redirect("/login");
  }

  return <div>Settings Page.</div>;
}
