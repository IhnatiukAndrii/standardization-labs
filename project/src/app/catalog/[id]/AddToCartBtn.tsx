"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function AddToCartBtn({ productId, inStock }: { productId: number; inStock: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setLoading(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!inStock) {
    return (
      <button className={`btn ${styles.cartBtn}`} disabled>
        Немає в наявності
      </button>
    );
  }

  return (
    <button
      className={`btn btn-primary ${styles.cartBtn}`}
      onClick={handleAdd}
      disabled={loading}
    >
      {loading ? "Додаємо..." : added ? "✓ Додано до кошика!" : "🛒 До кошика"}
    </button>
  );
}
