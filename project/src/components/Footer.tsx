import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>⌚ TimeElite</div>
          <p className={styles.tagline}>Мистецтво часу у вашому житті</p>
        </div>
        <div className={styles.links}>
          <div className={styles.group}>
            <div className={styles.groupTitle}>Каталог</div>
            <Link href="/catalog?category=classic">Класичні</Link>
            <Link href="/catalog?category=sport">Спортивні</Link>
            <Link href="/catalog?category=chronograph">Хронографи</Link>
            <Link href="/catalog?category=diver">Дайверські</Link>
          </div>
          <div className={styles.group}>
            <div className={styles.groupTitle}>Інформація</div>
            <Link href="/news">Новини</Link>
            <Link href="/auth/login">Вхід</Link>
            <Link href="/auth/register">Реєстрація</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          <span>© 2026 TimeElite. Всі права захищені.</span>
        </div>
      </div>
    </footer>
  );
}
