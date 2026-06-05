"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  published: boolean;
  createdAt: string;
}

const emptyForm = { title: "", content: "", imageUrl: "", published: false };

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () => {
    fetch("/api/news").then((r) => r.json()).then(setNews);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editId ? `/api/news/${editId}` : "/api/news";
    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    load();
    setLoading(false);
  };

  const handleEdit = (item: NewsItem) => {
    setForm({ title: item.title, content: item.content, imageUrl: item.imageUrl ?? "", published: item.published });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити новину?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    load();
  };

  const togglePublish = async (item: NewsItem) => {
    await fetch(`/api/news/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, published: !item.published }),
    });
    load();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Новини</h1>
          <p className={styles.pageSub}>{news.length} статей</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}>
          + Додати новину
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{editId ? "Редагувати" : "Нова новина"}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Заголовок</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Контент</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="form-input" rows={5} required />
            </div>
            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label">URL зображення</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="form-input" placeholder="https://..." />
              </div>
              <div className="form-group" style={{ justifyContent: "flex-end" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--text-secondary)" }}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    style={{ accentColor: "var(--gold)", width: 16, height: 16 }}
                  />
                  Опублікувати
                </label>
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Скасувати</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          </form>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Заголовок</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id}>
              <td><strong>{item.title}</strong></td>
              <td>
                <span className={`badge ${item.published ? "badge-success" : "badge-error"}`}>
                  {item.published ? "Опубліковано" : "Чернетка"}
                </span>
              </td>
              <td>{new Date(item.createdAt).toLocaleDateString("uk-UA")}</td>
              <td>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => togglePublish(item)}>
                    {item.published ? "Зняти" : "Опубл."}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(item)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
