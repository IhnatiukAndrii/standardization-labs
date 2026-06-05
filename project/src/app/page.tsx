import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      brand: true,
      category: true,
      reviews: { select: { rating: true } },
    },
  });

  const latestNews = await prisma.news.findMany({
    where: { published: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany();
  const brandsCount = await prisma.brand.count();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLabel}>Преміум колекція 2026</div>
          <h1 className={styles.heroTitle}>
            Мистецтво часу<br />
            <span className={styles.heroAccent}>у вашому житті</span>
          </h1>
          <p className={styles.heroDesc}>
            Відкрийте світ дизайнерських годинників від провідних швейцарських
            та японських майстрів. Кожен годинник — це витвір мистецтва.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/catalog" className="btn btn-primary">
              Переглянути каталог
            </Link>
            <Link href="/news" className="btn btn-secondary">
              Читати новини
            </Link>
          </div>
        </div>
        <div className={styles.heroDecor}>
          <div className={styles.heroWatch}>⌚</div>
          <div className={styles.heroRing1} />
          <div className={styles.heroRing2} />
        </div>
      </section>

      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <div className={styles.statNum}>{featuredProducts.length > 0 ? "8+" : "0"}</div>
              <div className={styles.statLabel}>Преміум моделей</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>{brandsCount}</div>
              <div className={styles.statLabel}>Провідних брендів</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>{categories.length}</div>
              <div className={styles.statLabel}>Категорій</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>100%</div>
              <div className={styles.statLabel}>Автентичні товари</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <div className="gold-line" />
              <h2 className={styles.sectionTitle}>Нові надходження</h2>
              <p className={styles.sectionSub}>Найновіші моделі від провідних брендів</p>
            </div>
            <Link href="/catalog" className="btn btn-secondary">
              Весь каталог →
            </Link>
          </div>
          <div className="grid-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                imageUrl={product.imageUrl}
                brandName={product.brand.name}
                categoryName={product.category.name}
                reviews={product.reviews}
                stock={product.stock}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.categoriesSection}>
        <div className="container">
          <div className="gold-line" />
          <h2 className={styles.sectionTitle}>Категорії</h2>
          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className={styles.catCard}
              >
                <span className={styles.catIcon}>⌚</span>
                <span className={styles.catName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {latestNews.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <div className="gold-line" />
                <h2 className={styles.sectionTitle}>Останні новини</h2>
              </div>
              <Link href="/news" className="btn btn-secondary">
                Всі новини →
              </Link>
            </div>
            <div className="grid-3">
              {latestNews.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className={styles.newsCard}>
                  {item.imageUrl && (
                    <div
                      className={styles.newsImage}
                      style={{ backgroundImage: `url(${item.imageUrl})` }}
                    />
                  )}
                  <div className={styles.newsBody}>
                    <div className={styles.newsDate}>
                      {new Date(item.createdAt).toLocaleDateString("uk-UA")}
                    </div>
                    <h3 className={styles.newsTitle}>{item.title}</h3>
                    <p className={styles.newsExcerpt}>
                      {item.content.substring(0, 100)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
