import styles from "./AboutComponent.module.css";

export default function AboutComponent() {
  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>О нашей кладовой ореховых паст</h1>
        <p className={styles.subtitle}>Настоящий вкус природы с 2018 года</p>
      </header>

      <section
        className={styles.sectionHighlight}
        aria-labelledby="unique-heading"
      >
        <h2 className={styles.heading} id="unique-heading">
          Что делает нас особенными
        </h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🌿</span>
            <h3 className={styles.featureTitle}>Местное производство</h3>
            <p className={styles.featureText}>
              Наши пасты изготавливаются небольшими партиями на традиционной
              каменной мельнице, что сохраняет аутентичный вкус и питательную
              ценность каждого ингредиента.
            </p>
          </div>

          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🌱</span>
            <h3 className={styles.featureTitle}>Натуральные ингредиенты</h3>
            <p className={styles.featureText}>
              Мы используем только лучшие местные орехи и семена - без добавок,
              консервантов или лишней обработки.
            </p>
          </div>

          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>👨‍👩‍👧‍👦</span>
            <h3 className={styles.featureTitle}>Семейные ценности</h3>
            <p className={styles.featureText}>
              Как заботливые родители, мы создаём продукты, которыми гордимся
              кормить свою семью.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="philosophy-heading">
        <h2 className={styles.heading} id="philosophy-heading">
          Наша философия производства
        </h2>
        <ul className={styles.philosophyList}>
          <li className={styles.philosophyItem}>
            100% натуральные ингредиенты
          </li>
          <li className={styles.philosophyItem}>
            Без рафинированных сахаров и пальмового масла
          </li>
          <li className={styles.philosophyItem}>
            Холодный отжим для сохранения питательных веществ
          </li>
          <li className={styles.philosophyItem}>
            Доступны веганские и гипоаллергенные варианты
          </li>
        </ul>
      </section>

      <section className={styles.testimonialSection}>
        <h2 className={styles.heading}>Почему нас любят клиенты</h2>
        <div className={styles.testimonialGrid}>
          <blockquote className={styles.testimonial}>
            <p>
              "Наконец-то ореховые пасты, которые действительно на вкус как
              должны! В каждой ложке чувствуется забота."
            </p>
            <cite className={styles.citation}>- Мария, постоянный клиент</cite>
          </blockquote>
          <blockquote className={styles.testimonial}>
            <p>
              "Мои дети обожают ваши ореховые пасты на завтрак. Спасибо за
              качественные продукты!"
            </p>
            <cite className={styles.citation}>- Анна, мама двоих детей</cite>
          </blockquote>
        </div>
      </section>

      <section className={styles.productsSection}>
        <h2 className={styles.heading}>Наши продукты</h2>
        <p className={styles.productsIntro}>
          Идеально для здорового питания всей семьи:
        </p>
        <div className={styles.productsGrid}>
          <div className={styles.productCategory}>
            <h3 className={styles.productCategoryTitle}>Классические пасты</h3>
            <ul className={styles.productList}>
              <li>Миндальная</li>
              <li>Фундучная</li>
              <li>Грецкого ореха</li>
            </ul>
          </div>
          <div className={styles.productCategory}>
            <h3 className={styles.productCategoryTitle}>Смеси</h3>
            <ul className={styles.productList}>
              <li>Ореховая ассорти</li>
              <li>Миндаль + кешью</li>
              <li>Суперфуд микс</li>
            </ul>
          </div>
          <div className={styles.productCategory}>
            <h3 className={styles.productCategoryTitle}>Специальные</h3>
            <ul className={styles.productList}>
              <li>Детская серия</li>
              <li>С добавлением сухофруктов</li>
              <li>Без сахара</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Попробуйте настоящий вкус</h2>
          <p className={styles.ctaText}>
            Посетите наш магазин или закажите онлайн
          </p>
          <div className={styles.ctaButtons}>
            <a href="#location" className={styles.ctaButtonPrimary}>
              Адрес магазина
            </a>
            <a href="#shop" className={styles.ctaButtonSecondary}>
              Интернет-магазин
            </a>
          </div>
        </div>
      </footer>
    </article>
  );
}
