import { headers } from "next/headers";

import SettingTab from "@/components/setting/SettingTab";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <SettingTab />
      {children}
    </main>
  );
}
