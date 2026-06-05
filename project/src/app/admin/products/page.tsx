"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../admin.module.css";

interface Brand { id: number; name: string; }
interface Category { id: number; name: string; slug: string; }
interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  imageUrl?: string | null;
  brand: Brand;
  category: Category;
}

const emptyForm = { name: "", description: "", price: "", imageUrl: "", stock: 0, categoryId: 0, brandId: 0 };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
    fetch("/api/brands").then((r) => r.json()).then(setBrands);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = editId ? `/api/products/${editId}` : "/api/products";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(String(form.stock)), categoryId: parseInt(String(form.categoryId)), brandId: parseInt(String(form.brandId)) }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Помилка");
    } else {
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      load();
    }
    setLoading(false);
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, description: "", price: String(p.price), imageUrl: p.imageUrl ?? "", stock: p.stock, categoryId: p.category.id, brandId: p.brand.id });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити товар?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Товари</h1>
          <p className={styles.pageSub}>{products.length} позицій у каталозі</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}>
          + Додати товар
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{editId ? "Редагувати товар" : "Новий товар"}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label">Назва</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Ціна (₴)</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="form-input" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Опис</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-input" rows={3} required />
            </div>
            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label">URL зображення</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="form-input" placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Кількість на складі</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className="form-input" />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className="form-group">
                <label className="form-label">Категорія</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })} className="form-input" required>
                  <option value={0}>Оберіть категорію</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Бренд</label>
                <select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: parseInt(e.target.value) })} className="form-input" required>
                  <option value={0}>Оберіть бренд</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className={styles.formActions}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Скасувати</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Збереження..." : editId ? "Зберегти зміни" : "Додати товар"}
              </button>
            </div>
          </form>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Фото</th>
            <th>Назва</th>
            <th>Бренд</th>
            <th>Категорія</th>
            <th>Ціна</th>
            <th>Склад</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                {p.imageUrl ? (
                  <div style={{ width: 48, height: 48, position: "relative", borderRadius: 8, overflow: "hidden" }}>
                    <Image src={p.imageUrl} alt={p.name} fill style={{ objectFit: "cover" }} sizes="48px" />
                  </div>
                ) : <span>⌚</span>}
              </td>
              <td><strong>{p.name}</strong></td>
              <td>{p.brand.name}</td>
              <td>{p.category.name}</td>
              <td>{parseFloat(p.price).toLocaleString("uk-UA")} ₴</td>
              <td>
                <span className={`badge ${p.stock > 0 ? "badge-success" : "badge-error"}`}>
                  {p.stock} шт.
                </span>
              </td>
              <td>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
