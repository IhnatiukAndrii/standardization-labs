"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const load = () => {
    fetch("/api/users").then((r) => r.json()).then(setUsers);
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (user: User) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити користувача?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Користувачі</h1>
          <p className={styles.pageSub}>{users.length} зареєстровано</p>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ім&apos;я</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Замовлень</th>
            <th>Дата реєстрації</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td><strong>{user.name}</strong></td>
              <td style={{ color: "var(--text-muted)" }}>{user.email}</td>
              <td>
                <span className={`badge ${user.role === "ADMIN" ? "badge-gold" : "badge-success"}`}>
                  {user.role === "ADMIN" ? "Адмін" : "Користувач"}
                </span>
              </td>
              <td>{user._count.orders}</td>
              <td>{new Date(user.createdAt).toLocaleDateString("uk-UA")}</td>
              <td>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleRole(user)}
                    title={user.role === "ADMIN" ? "Зробити користувачем" : "Зробити адміном"}
                  >
                    {user.role === "ADMIN" ? "→ User" : "→ Admin"}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
