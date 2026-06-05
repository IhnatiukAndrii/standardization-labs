import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.news.findUnique({ where: { id: parseInt(id) } });
  if (!item) return { title: "Новину не знайдено" };
  return { title: item.title };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.news.findUnique({
    where: { id: parseInt(id), published: true },
  });

  if (!item) notFound();

  return (
    <div style={{ padding: "40px 0" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        <Link href="/news" className={styles.back}>← Всі новини</Link>

        {item.imageUrl && (
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          />
        )}

        <div className={styles.date}>
          {new Date(item.createdAt).toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
        <h1 className={styles.title}>{item.title}</h1>
        <div className={styles.content}>
          {item.content.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
