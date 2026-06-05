"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";

interface Brand { id: number; name: string; }
interface Category { id: number; name: string; slug: string; }
interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl?: string | null;
  stock: number;
  brand: Brand;
  category: Category;
  reviews: { rating: number }[];
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
    fetch("/api/brands").then((r) => r.json()).then(setBrands);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    router.replace(`/catalog?${params.toString()}`, { scroll: false });

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); });
  }, [search, selectedCategory, selectedBrand, minPrice, maxPrice, router]);

  const resetFilters = () => {
    setSearch(""); setSelectedCategory(""); setSelectedBrand(""); setMinPrice(""); setMaxPrice("");
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBlock}>
          <div className={styles.sidebarTitle}>Пошук</div>
          <input
            type="text"
            placeholder="Назва або бренд..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>

        <div className={styles.sidebarBlock}>
          <div className={styles.sidebarTitle}>Категорія</div>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="cat" checked={selectedCategory === ""} onChange={() => setSelectedCategory("")} />
              <span>Всі категорії</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className={styles.radioLabel}>
                <input type="radio" name="cat" checked={selectedCategory === cat.slug} onChange={() => setSelectedCategory(cat.slug)} />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.sidebarBlock}>
          <div className={styles.sidebarTitle}>Бренд</div>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="form-input">
            <option value="">Всі бренди</option>
            {brands.map((b) => (
              <option key={b.id} value={String(b.id)}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.sidebarBlock}>
          <div className={styles.sidebarTitle}>Ціна, ₴</div>
          <div className={styles.priceRow}>
            <input type="number" placeholder="Від" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="form-input" />
            <input type="number" placeholder="До" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="form-input" />
          </div>
        </div>

        <button className="btn btn-secondary" style={{ width: "100%" }} onClick={resetFilters}>
          Скинути фільтри
        </button>
      </aside>

      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <h1 className="page-title" style={{ fontSize: "1.8rem", marginBottom: 0 }}>
            Каталог годинників
          </h1>
          <span className={styles.count}>{products.length} товарів</span>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <p>Товарів не знайдено</p>
            <button className="btn btn-secondary" onClick={resetFilters}>Скинути фільтри</button>
          </div>
        ) : (
          <div className="grid-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={parseFloat(product.price)}
                imageUrl={product.imageUrl}
                brandName={product.brand.name}
                categoryName={product.category.name}
                reviews={product.reviews}
                stock={product.stock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div style={{ padding: "40px 0" }}>
      <div className="container">
        <Suspense fallback={<div className="loading"><div className="spinner" /></div>}>
          <CatalogContent />
        </Suspense>
      </div>
    </div>
  );
}
