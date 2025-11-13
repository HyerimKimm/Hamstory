import SettingTab from "@/components/setting/SettingTab";

import styles from "./layout.module.scss";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.page_wrap}>
      <SettingTab />
      {children}
    </main>
  );
}
