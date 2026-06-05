"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Невірний email або пароль");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>⌚ TimeElite</div>
        <h1 className={styles.title}>Вхід до акаунту</h1>
        <p className={styles.sub}>Ласкаво просимо назад!</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "14px" }}
            disabled={loading}
          >
            {loading ? "Входимо..." : "Увійти"}
          </button>
        </form>

        <div className={styles.hint}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "4px" }}>
            Тестові акаунти:
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
            Адмін: admin@watches.ua / admin123
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
            Користувач: user@watches.ua / user123
          </p>
        </div>

        <p className={styles.link}>
          Немає акаунту?{" "}
          <Link href="/auth/register" className={styles.linkAccent}>
            Зареєструватись
          </Link>
        </p>
      </div>
    </div>
  );
}
