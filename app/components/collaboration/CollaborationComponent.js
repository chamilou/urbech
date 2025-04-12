// CollaboratePage.js
"use client";
import { useState } from "react";
import styles from "./CollaborationComponent.module.css";

export default function CollaborationComponent() {
  const [activeForm, setActiveForm] = useState(null);
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name?.value || "",
      email: form.email?.value || "",
      phone: form.phone?.value || "",
      message: form.message?.value || "",
      type,
    };

    const res = await fetch("/api/collaboration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Заявка успешно отправлена!");
      form.reset();
    } else {
      alert("Ошибка отправки. Попробуйте позже.");
    }
  };

  const toggleForm = (formType) => {
    setActiveForm(activeForm === formType ? null : formType);
  };

  return (
    <div className={styles.container}>
      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Варианты сотрудничества</h2>
          <div className={styles.collaborationTypes}>
            <div className={styles.typeCard}>
              <h3 className={styles.typeTitle}>Для магазинов</h3>
              <ul className={styles.typeList}>
                <li>Оптовые поставки нашей продукции</li>
                <li>Фирменные стойки в вашем магазине</li>
                <li>Совместные маркетинговые акции</li>
              </ul>
              <button
                className={styles.typeButton}
                onClick={() => toggleForm("shop")}
              >
                {activeForm === "shop" ? "Скрыть форму" : "Оставить заявку"}
              </button>

              {activeForm === "shop" && (
                <div className={styles.formContainer}>
                  <h4 className={styles.formTitle}>Заявка для магазинов</h4>
                  <form className={styles.contactForm}>
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        placeholder="Название магазина"
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        name="name"
                        placeholder="Ваше имя"
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Телефон"
                        className={styles.formInput}
                      />
                    </div>

                    <textarea
                      name="message"
                      placeholder="Опишите ваше предложение"
                      rows="3"
                    ></textarea>
                    <button
                      className={styles.contactForm}
                      type="submit"
                      onSubmit={(e) => handleSubmit(e, "private")}
                    >
                      Отправить
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className={styles.typeCard}>
              <h3 className={styles.typeTitle}>Для частных лиц</h3>
              <ul className={styles.typeList}>
                <li>Продажа нашей продукции на ярмарках</li>
                <li>Партнёрская программа</li>
                <li>Совместные мастер-классы</li>
              </ul>
              <button
                className={styles.typeButton}
                onClick={() => toggleForm("private")}
              >
                {activeForm === "private" ? "Скрыть форму" : "Оставить заявку"}
              </button>

              {activeForm === "private" && (
                <div className={styles.formContainer}>
                  <h4 className={styles.formTitle}>Заявка для частных лиц</h4>
                  <form className={styles.contactForm}>
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        name=""
                        placeholder="Ваше имя"
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Телефон"
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <textarea
                        placeholder="Опишите ваше предложение"
                        className={styles.formTextarea}
                        rows="3"
                      ></textarea>
                    </div>
                    <button
                      className={styles.contactForm}
                      onSubmit={(e) => handleSubmit(e, "shop")}
                      type="submit"
                    >
                      Отправить
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.partnersSection}`}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Наши партнёры</h2>
          <div className={styles.partnersGrid}>
            <div className={styles.partnerLogo}>Магазин "Здоровье"</div>
            <div className={styles.partnerLogo}>Кафе "Эко-Ланч"</div>
            <div className={styles.partnerLogo}>Фермерский рынок</div>
            <div className={styles.partnerLogo}>Ярмарка "Вкус природы"</div>
          </div>
        </div>
      </section>
    </div>
  );
}
