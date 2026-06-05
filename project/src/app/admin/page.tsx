"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, news: 0 });
  const [recentOrders, setRecentOrders] = useState<{ id: number; status: string; total: string; user: { name: string }; createdAt: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/news?all=true").then((r) => r.json()),
    ]).then(([products, orders, users, news]) => {
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        orders: Array.isArray(orders) ? orders.length : 0,
        users: Array.isArray(users) ? users.length : 0,
        news: Array.isArray(news) ? news.length : 0,
      });
      if (Array.isArray(orders)) {
        setRecentOrders(orders.slice(0, 5));
      }
    });
  }, []);

  const cards = [
    { label: "Товарів", value: stats.products, icon: "⌚", color: "#c9a84c" },
    { label: "Замовлень", value: stats.orders, icon: "📦", color: "#4caf82" },
    { label: "Користувачів", value: stats.users, icon: "👥", color: "#5b9bd5" },
    { label: "Новин", value: stats.news, icon: "📰", color: "#e0a855" },
  ];

  const STATUS_LABELS: Record<string, string> = {
    PENDING: "Очікує", CONFIRMED: "Підтверджено",
    SHIPPED: "У дорозі", DELIVERED: "Доставлено", CANCELLED: "Скасовано",
  };

  return (
    <div>
      <div className="gold-line" />
      <h1 className="page-title" style={{ fontSize: "2rem" }}>Огляд</h1>
      <p className="page-subtitle">Статистика магазину</p>

      <div className={styles.statsGrid}>
        {cards.map((card) => (
          <div key={card.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: card.color }}>{card.icon}</div>
            <div className={styles.statValue}>{card.value}</div>
            <div className={styles.statLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      {recentOrders.length > 0 && (
        <div className={styles.recentOrders}>
          <h2 className={styles.sectionTitle}>Останні замовлення</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Клієнт</th>
                <th>Сума</th>
                <th>Статус</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.user?.name ?? "—"}</td>
                  <td>{parseFloat(order.total).toLocaleString("uk-UA")} ₴</td>
                  <td>{STATUS_LABELS[order.status] ?? order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString("uk-UA")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
