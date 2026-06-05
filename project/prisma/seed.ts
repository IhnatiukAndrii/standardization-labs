import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  await prisma.user.upsert({
    where: { email: "admin@watches.ua" },
    update: {},
    create: {
      name: "Адміністратор",
      email: "admin@watches.ua",
      password: adminPass,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@watches.ua" },
    update: {},
    create: {
      name: "Іван Петренко",
      email: "user@watches.ua",
      password: userPass,
      role: "USER",
    },
  });

  const categories = [
    { name: "Класичні", slug: "classic" },
    { name: "Спортивні", slug: "sport" },
    { name: "Смарт-годинники", slug: "smart" },
    { name: "Хронографи", slug: "chronograph" },
    { name: "Дайверські", slug: "diver" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const brands = [
    { name: "Rolex", description: "Швейцарський люксовий годинниковий бренд", country: "Швейцарія" },
    { name: "Omega", description: "Офіційний хронометрист Олімпійських ігор", country: "Швейцарія" },
    { name: "TAG Heuer", description: "Піонер хронографічних механізмів", country: "Швейцарія" },
    { name: "Patek Philippe", description: "Один із найстаріших годинникових будинків світу", country: "Швейцарія" },
    { name: "Seiko", description: "Японська точність та інновації", country: "Японія" },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { name: brand.name },
      update: {},
      create: brand,
    });
  }

  const classicCat = await prisma.category.findUnique({ where: { slug: "classic" } });
  const sportCat = await prisma.category.findUnique({ where: { slug: "sport" } });
  const chronoCat = await prisma.category.findUnique({ where: { slug: "chronograph" } });
  const smartCat = await prisma.category.findUnique({ where: { slug: "smart" } });
  const diverCat = await prisma.category.findUnique({ where: { slug: "diver" } });

  const rolex = await prisma.brand.findUnique({ where: { name: "Rolex" } });
  const omega = await prisma.brand.findUnique({ where: { name: "Omega" } });
  const tag = await prisma.brand.findUnique({ where: { name: "TAG Heuer" } });
  const patek = await prisma.brand.findUnique({ where: { name: "Patek Philippe" } });
  const seiko = await prisma.brand.findUnique({ where: { name: "Seiko" } });

  const products = [
    {
      name: "Rolex Datejust 41",
      description: "Класичний годинник з датою, корпус з нержавіючої сталі, сапфірове скло. Автоматичний механізм Cal. 3235. Водонепроникність 100 м.",
      price: 285000,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      stock: 3,
      categoryId: classicCat!.id,
      brandId: rolex!.id,
    },
    {
      name: "Omega Seamaster Diver 300M",
      description: "Легендарний дайверський годинник, водонепроникність 300 м. Коаксіальний механізм Master Chronometer. Керамічний безель.",
      price: 95000,
      imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500",
      stock: 7,
      categoryId: diverCat!.id,
      brandId: omega!.id,
    },
    {
      name: "TAG Heuer Carrera Chronograph",
      description: "Спортивний хронограф з таховиметричною шкалою. Механізм Calibre Heuer 02. Корпус 44 мм.",
      price: 65000,
      imageUrl: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=500",
      stock: 5,
      categoryId: chronoCat!.id,
      brandId: tag!.id,
    },
    {
      name: "Patek Philippe Calatrava",
      description: "Вершина годинникового мистецтва. Тонкий класичний корпус 38 мм, ручний завод. Номер референції 5119.",
      price: 1250000,
      imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500",
      stock: 1,
      categoryId: classicCat!.id,
      brandId: patek!.id,
    },
    {
      name: "Seiko Prospex Alpinist",
      description: "Японський альпіністський годинник з компасом. Автоматичний механізм 6R35. Сапфірове скло.",
      price: 28000,
      imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500",
      stock: 12,
      categoryId: sportCat!.id,
      brandId: seiko!.id,
    },
    {
      name: "Omega Constellation Co-Axial",
      description: "Елегантний унісекс-годинник з зірочковим безелем. Коаксіальний механізм Master Chronometer Calibre 8700.",
      price: 78000,
      imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500",
      stock: 4,
      categoryId: classicCat!.id,
      brandId: omega!.id,
    },
    {
      name: "Rolex Submariner Date",
      description: "Іконічний дайверський годинник. Корпус Oystersteel 41 мм, ротація безеля, водонепроникність 300 м.",
      price: 320000,
      imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500",
      stock: 2,
      categoryId: diverCat!.id,
      brandId: rolex!.id,
    },
    {
      name: "Seiko Astron GPS Solar",
      description: "Перший у світі GPS сонячний годинник. Автоматична синхронізація часового поясу. Титановий корпус.",
      price: 45000,
      imageUrl: "https://images.unsplash.com/photo-1509941943102-10c232535736?w=500",
      stock: 8,
      categoryId: smartCat!.id,
      brandId: seiko!.id,
    },
  ];

  for (const product of products) {
    const exists = await prisma.product.findFirst({
      where: { name: product.name },
    });
    if (!exists) {
      await prisma.product.create({ data: product });
    }
  }

  const newsItems = [
    {
      title: "Нова колекція Rolex 2026: що нового?",
      content: "Rolex представив оновлену лінійку годинників на Watches and Wonders 2026. Серед новинок — оновлений Datejust з новим безелем та вдосконаленим механізмом Cal. 3235. Також було анонсовано нові варіанти кольорів циферблата для моделі Day-Date. Компанія зберегла свій фірмовий стиль, додавши сучасні нотки в класичний дизайн.",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      published: true,
    },
    {
      title: "Omega та James Bond: 60 років партнерства",
      content: "У 2025 році бренд Omega відзначає 60-річне партнерство з франшизою Джеймса Бонда. З моменту появи Seamaster в фільмі 'GoldenEye' 1995 року, годинники Omega стали невід'ємною частиною образу агента 007. До ювілею було випущено обмежену серію Seamaster Diver 300M з гравіюванням на задній кришці.",
      imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600",
      published: true,
    },
    {
      title: "Як обрати перший механічний годинник",
      content: "Вибір першого механічного годинника — важливе рішення для кожного колекціонера. Варто звернути увагу на: надійність бренду, тип механізму (ручний або автоматичний), водонепроникність та сервісний інтервал. Для початківців рекомендуємо звернути увагу на моделі Seiko та Omega серії Planet Ocean — відмінне співвідношення ціни та якості.",
      imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600",
      published: true,
    },
    {
      title: "TAG Heuer Formula 1: еволюція легенди",
      content: "Колекція TAG Heuer Formula 1 пройшла довгий шлях від моделей 1986 року до сучасних варіантів із сонячним живленням. Остання ітерація використовує рекуперацію енергії та може функціонувати без зарядки до 10 місяців. Карбоновий та керамічний безель роблять годинник справжнім атрибутом автоентузіаста.",
      imageUrl: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600",
      published: true,
    },
    {
      title: "Догляд за механічним годинником: поради майстра",
      content: "Механічний годинник вимагає регулярного технічного обслуговування. Рекомендований інтервал ТО — кожні 5 років. Важливо уникати ударів, сильного магнітного поля та екстремальних температур. Зберігайте годинник на підставці або у спеціальній коробці. Автоматичні моделі краще зберігати у вайндері, щоб механізм не пересихав.",
      imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600",
      published: true,
    },
  ];

  for (const news of newsItems) {
    const exists = await prisma.news.findFirst({ where: { title: news.title } });
    if (!exists) {
      await prisma.news.create({ data: news });
    }
  }

  console.log("Дані успішно додано!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
