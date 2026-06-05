import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 20px",
    }}>
      <div style={{ fontSize: "5rem", marginBottom: "24px" }}>⌚</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", color: "var(--text-primary)", marginBottom: "12px" }}>
        404
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "32px" }}>
        Сторінку не знайдено
      </p>
      <Link href="/" className="btn btn-primary">
        Повернутись на головну
      </Link>
    </div>
  );
}
