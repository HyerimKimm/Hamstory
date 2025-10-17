import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <Link href="/settings/user">내 정보 관리</Link>
        <Link href="/settings/blog">블로그 관리</Link>
      </div>
      {children}
    </div>
  );
}
