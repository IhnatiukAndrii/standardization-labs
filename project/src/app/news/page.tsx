import Link from "next/link";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Новини",
  description: "Останні новини зі світу дизайнерських годинників",
};

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: "40px 0" }}>
      <div className="container">
        <div className="gold-line" />
        <h1 className="page-title">Новини</h1>
        <p className="page-subtitle">Останні події зі світу дизайнерських годинників</p>

        {news.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
            Новин поки немає
          </div>
        ) : (
          <div className={styles.grid}>
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className={styles.card}>
                {item.imageUrl && (
                  <div
                    className={styles.image}
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  />
                )}
                <div className={styles.body}>
                  <div className={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h2 className={styles.title}>{item.title}</h2>
                  <p className={styles.excerpt}>{item.content.substring(0, 150)}...</p>
                  <div className={styles.readMore}>Читати далі →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
