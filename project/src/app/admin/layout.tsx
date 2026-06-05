"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import styles from "./layout.module.css";

const adminNav = [
  { href: "/admin", label: "Огляд", icon: "📊" },
  { href: "/admin/products", label: "Товари", icon: "⌚" },
  { href: "/admin/news", label: "Новини", icon: "📰" },
  { href: "/admin/orders", label: "Замовлення", icon: "📦" },
  { href: "/admin/users", label: "Користувачі", icon: "👥" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="loading"><div className="spinner" /></div>;
  }

  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitle}>Адмін-панель</div>
          <div className={styles.sidebarSub}>TimeElite</div>
        </div>
        <nav className={styles.nav}>
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navItem}>
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.adminName}>{session?.user?.name}</div>
          <Link href="/" className={styles.backLink}>← На сайт</Link>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
