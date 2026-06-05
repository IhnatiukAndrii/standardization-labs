"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    imageUrl?: string | null;
    brand: { name: string };
  };
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/cart")
        .then((r) => r.json())
        .then((data) => { setItems(data); setLoading(false); });
    }
  }, [status, router]);

  const removeItem = async (productId: number) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone) { setError("Заповніть всі поля"); return; }
    setOrdering(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, phone }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Помилка оформлення");
      setOrdering(false);
    } else {
      router.push("/orders");
    }
  };

  const total = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div style={{ padding: "40px 0" }}>
      <div className="container">
        <div className="gold-line" />
        <h1 className="page-title">Кошик</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <p>Ваш кошик порожній</p>
            <button className="btn btn-primary" onClick={() => router.push("/catalog")}>
              Перейти до каталогу
            </button>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="80px"
                      />
                    ) : (
                      <span>⌚</span>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemBrand}>{item.product.brand.name}</div>
                    <div className={styles.itemName}>{item.product.name}</div>
                    <div className={styles.itemQty}>Кількість: {item.quantity}</div>
                  </div>
                  <div className={styles.itemPrice}>
                    {(parseFloat(item.product.price) * item.quantity).toLocaleString("uk-UA")} ₴
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item.product.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.orderBox}>
              <div className={styles.totalRow}>
                <span>Разом:</span>
                <span className={styles.totalPrice}>{total.toLocaleString("uk-UA")} ₴</span>
              </div>

              <hr className="divider" />

              <form onSubmit={handleOrder} className={styles.orderForm}>
                <h3 className={styles.orderTitle}>Оформлення замовлення</h3>
                <div className="form-group">
                  <label className="form-label">Адреса доставки</label>
                  <input
                    type="text"
                    placeholder="м. Київ, вул. Хрещатик, 1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Номер телефону</label>
                  <input
                    type="tel"
                    placeholder="+380XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={ordering}>
                  {ordering ? "Оформлення..." : "Оформити замовлення"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
