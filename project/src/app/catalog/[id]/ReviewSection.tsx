"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";

interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  user: { name: string };
}

export default function ReviewSection({ productId, reviews: initialReviews }: { productId: number; reviews: Review[] }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setError("Оберіть рейтинг"); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Помилка");
    } else {
      setReviews((prev) => [{ ...data, user: { name: (session?.user as { name: string }).name } }, ...prev]);
      setRating(0);
      setComment("");
    }
    setLoading(false);
  };

  return (
    <div className={styles.reviews}>
      <h2 className={styles.reviewsTitle}>Відгуки ({reviews.length})</h2>

      {session && (
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <div className={styles.starPicker}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                className={styles.starBtn}
                style={{ color: s <= (hovered || rating) ? "var(--gold)" : "var(--dark-4)" }}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            placeholder="Ваш відгук (необов'язково)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-input"
            rows={3}
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Надсилаємо..." : "Залишити відгук"}
          </button>
        </form>
      )}

      <div className={styles.reviewsList}>
        {reviews.length === 0 ? (
          <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>Відгуків ще немає. Будьте першим!</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <strong className={styles.reviewAuthor}>{r.user.name}</strong>
                <div>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ color: s <= r.rating ? "var(--gold)" : "var(--dark-4)" }}>★</span>
                  ))}
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  {new Date(r.createdAt).toLocaleDateString("uk-UA")}
                </span>
              </div>
              {r.comment && <p className={styles.reviewText}>{r.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
