import Image from "next/image";
import { redirect } from "next/navigation";

import { verifyAuth } from "@/lib/user/auth";

import defaultProfileImage from "@/assets/images/icons/profile_default_darkmode.svg";

export default async function SettingsPage() {
  const session = await verifyAuth();

  if (!session.success) {
    redirect("/");
  }

  return (
    <form>
      <Image src={defaultProfileImage} alt="profile" width={100} height={100} />
    </form>
  );
}
