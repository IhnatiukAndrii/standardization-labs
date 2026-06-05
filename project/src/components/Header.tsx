"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  const navLinks = [
    { href: "/", label: "Головна" },
    { href: "/catalog", label: "Каталог" },
    { href: "/news", label: "Новини" },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⌚</span>
          <span className={styles.logoText}>
            Time<span className={styles.logoAccent}>Elite</span>
          </span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {session ? (
            <>
              <Link href="/cart" className={styles.iconBtn} title="Кошик">
                🛒
              </Link>
              <Link href="/orders" className={styles.iconBtn} title="Замовлення">
                📦
              </Link>
              {isAdmin && (
                <Link href="/admin" className={`${styles.iconBtn} ${styles.adminBtn}`} title="Адмін-панель">
                  ⚙️
                </Link>
              )}
              <button
                className={`btn btn-secondary btn-sm ${styles.signOutBtn}`}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-secondary btn-sm">
                Увійти
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm">
                Реєстрація
              </Link>
            </>
          )}
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
