"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Очікує підтвердження",
  CONFIRMED: "Підтверджено",
  SHIPPED: "У дорозі",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

const STATUS_BADGE: Record<string, string> = {
  PENDING: "badge-warning",
  CONFIRMED: "badge-gold",
  SHIPPED: "badge-gold",
  DELIVERED: "badge-success",
  CANCELLED: "badge-error",
};

interface Order {
  id: number;
  status: string;
  total: string;
  address: string;
  phone: string;
  createdAt: string;
  orderItems: {
    id: number;
    quantity: number;
    price: string;
    product: { name: string; imageUrl?: string | null };
  }[];
}

export default function OrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => { setOrders(data); setLoading(false); });
    }
  }, [status, router]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div style={{ padding: "40px 0" }}>
      <div className="container">
        <div className="gold-line" />
        <h1 className="page-title">Мої замовлення</h1>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <div>📦</div>
            <p>У вас ще немає замовлень</p>
            <button className="btn btn-primary" onClick={() => router.push("/catalog")}>
              Перейти до каталогу
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map((order) => (
              <div key={order.id} className={styles.order}>
                <div className={styles.orderHead}>
                  <div>
                    <div className={styles.orderId}>Замовлення #{order.id}</div>
                    <div className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className={styles.orderMeta}>
                    <span className={`badge ${STATUS_BADGE[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                    <div className={styles.orderTotal}>
                      {parseFloat(order.total).toLocaleString("uk-UA")} ₴
                    </div>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.orderItems.map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <span className={styles.orderItemName}>{item.product.name}</span>
                      <span className={styles.orderItemQty}>× {item.quantity}</span>
                      <span className={styles.orderItemPrice}>
                        {(parseFloat(item.price) * item.quantity).toLocaleString("uk-UA")} ₴
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    📍 {order.address}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    📞 {order.phone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
