import Link from "next/link";
import Image from "next/image";
import styles from "./ProductCard.module.css";

interface Review {
  rating: number;
}

interface ProductCardProps {
  id: number;
  name: string;
  price: number | string;
  imageUrl?: string | null;
  brandName?: string;
  categoryName?: string;
  reviews?: Review[];
  stock?: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductCard({ id, name, price, imageUrl, brandName, categoryName, reviews = [], stock = 0 }: ProductCardProps) {
  const avgRating = reviews.length > 0
    ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
    : 0;

  const formattedPrice = typeof price === "string" ? parseFloat(price) : price;

  return (
    <Link href={`/catalog/${id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
            className={styles.image}
          />
        ) : (
          <div className={styles.noImage}>⌚</div>
        )}
        {categoryName && (
          <span className={`badge badge-gold ${styles.categoryBadge}`}>{categoryName}</span>
        )}
        {stock === 0 && (
          <span className={`badge badge-error ${styles.stockBadge}`}>Немає в наявності</span>
        )}
      </div>

      <div className={styles.info}>
        {brandName && <div className={styles.brand}>{brandName}</div>}
        <h3 className={styles.name}>{name}</h3>

        {avgRating > 0 && (
          <div className={styles.rating}>
            <StarRating rating={avgRating} />
            <span className={styles.ratingCount}>({reviews.length})</span>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.price}>
            {formattedPrice.toLocaleString("uk-UA")} ₴
          </div>
          <div className={styles.arrow}>→</div>
        </div>
      </div>
    </Link>
  );
}
