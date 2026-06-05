import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import AddToCartBtn from "./AddToCartBtn";
import ReviewSection from "./ReviewSection";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { brand: true },
  });
  if (!product) return { title: "Товар не знайдено" };
  return { title: `${product.name} | ${product.brand.name}` };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      brand: true,
      category: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div style={{ padding: "40px 0" }}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.imageWrap}>
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                className={styles.image}
              />
            ) : (
              <div className={styles.noImage}>⌚</div>
            )}
          </div>

          <div className={styles.info}>
            <div className={styles.badges}>
              <span className="badge badge-gold">{product.category.name}</span>
              {product.stock === 0 && (
                <span className="badge badge-error">Немає в наявності</span>
              )}
              {product.stock > 0 && (
                <span className="badge badge-success">В наявності: {product.stock} шт.</span>
              )}
            </div>

            <div className={styles.brand}>{product.brand.name}</div>
            <h1 className={styles.name}>{product.name}</h1>

            {avgRating > 0 && (
              <div className={styles.rating}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: s <= avgRating ? "var(--gold)" : "var(--dark-4)", fontSize: "1.1rem" }}>★</span>
                ))}
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginLeft: 6 }}>
                  {avgRating.toFixed(1)} ({product.reviews.length} відгуків)
                </span>
              </div>
            )}

            <div className={styles.price}>
              {parseFloat(String(product.price)).toLocaleString("uk-UA")} ₴
            </div>

            <p className={styles.desc}>{product.description}</p>

            <hr className="divider" />

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Бренд</span>
                <span>{product.brand.name}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Країна</span>
                <span>{product.brand.country ?? "—"}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Категорія</span>
                <span>{product.category.name}</span>
              </div>
            </div>

            <AddToCartBtn productId={product.id} inStock={product.stock > 0} />
          </div>
        </div>

        <ReviewSection productId={product.id} reviews={product.reviews} />
      </div>
    </div>
  );
}
