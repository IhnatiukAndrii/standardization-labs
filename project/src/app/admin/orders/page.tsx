"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Очікує підтвердження" },
  { value: "CONFIRMED", label: "Підтверджено" },
  { value: "SHIPPED", label: "У дорозі" },
  { value: "DELIVERED", label: "Доставлено" },
  { value: "CANCELLED", label: "Скасовано" },
];

const STATUS_BADGE: Record<string, string> = {
  PENDING: "badge-warning", CONFIRMED: "badge-gold",
  SHIPPED: "badge-gold", DELIVERED: "badge-success", CANCELLED: "badge-error",
};

interface Order {
  id: number;
  status: string;
  total: string;
  address: string;
  phone: string;
  createdAt: string;
  user: { name: string; email: string };
  orderItems: { id: number; quantity: number; price: string; product: { name: string } }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = () => {
    fetch("/api/orders").then((r) => r.json()).then(setOrders);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Замовлення</h1>
          <p className={styles.pageSub}>{orders.length} замовлень</p>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Клієнт</th>
            <th>Сума</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Деталі</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <>
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  <div><strong>{order.user?.name}</strong></div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{order.user?.email}</div>
                </td>
                <td><strong style={{ color: "var(--gold)" }}>{parseFloat(order.total).toLocaleString("uk-UA")} ₴</strong></td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="form-input"
                    style={{ padding: "4px 8px", fontSize: "0.8rem", width: "auto" }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString("uk-UA")}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    {expanded === order.id ? "Згорнути" : "Деталі"}
                  </button>
                </td>
              </tr>
              {expanded === order.id && (
                <tr key={`${order.id}-detail`}>
                  <td colSpan={6}>
                    <div className={styles.expandedRow}>
                      <div>📍 {order.address} | 📞 {order.phone}</div>
                      <div className={styles.orderItems}>
                        {order.orderItems.map((item) => (
                          <div key={item.id} className={styles.orderItem}>
                            <span>{item.product.name}</span>
                            <span>× {item.quantity}</span>
                            <span style={{ color: "var(--gold)" }}>{(parseFloat(item.price) * item.quantity).toLocaleString("uk-UA")} ₴</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
