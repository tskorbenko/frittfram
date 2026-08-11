"use client";

import { useState } from "react";

const services = [
  ["/icon-sites.png", "Сайти", "Корпоративні сайти будь-якої складності з сучасним дизайном та швидкою роботою."],
  ["/icon-wordpress.png", "WordPress", "Розробка надійних та зручних сайтів на WordPress із гнучким функціоналом."],
  ["/icon-seo.png", "SEO", "Просування сайтів у пошукових системах для зростання трафіку та продажів."],
  ["/icon-ecommerce.png", "E-commerce", "Інтернет-магазини, що продають: зручні, швидкі та безпечні рішення."],
  ["/icon-branding.png", "Брендинг", "Створюємо айдентику, яка вирізняє ваш бренд і формує довіру клієнтів."],
  ["/icon-automation.png", "Автоматизація", "Автоматизуємо процеси, інтегруємо сервіси та заощаджуємо ваш час."],
];

const projects = [
  ["/portfolio-bormantech.webp", "BorManTech", "Сайт сервісної компанії", "https://bormantech.se/"],
  ["/portfolio-aloniss.webp", "Aloniss", "Сайт клінінгової компанії", "https://aloniss.com/"],
  ["/portfolio-layout24.webp", "Layout24", "Інтернет-магазин", "https://layout24.se/"],
  ["/portfolio-geotop.webp", "GeoTop", "Корпоративний сайт", "https://geotop.se/"],
  ["/portfolio-rentavnatalia.webp", "Rent av Natalia", "Сайт клінінгової компанії", "https://rentavnatalia.se/"],
  ["/portfolio-rekonstruktionsverket.webp", "Rekonstruktionsverket", "Корпоративний сайт", "https://www.rekonstruktionsverket.se/"],
  ["/portfolio-positiva.webp", "Positiva Vagnar", "Інформаційний сайт", "https://positiva.digitalkungen.se/"],
  ["/portfolio-fuktpatrullen.webp", "Fuktpatrullen", "Сайт сервісної компанії", "https://www.fuktpatrullen.se/"],
];

const steps = [
  ["/process-discussion.png", "Обговорення", "Аналізуємо ваші цілі та потреби, формуємо стратегію."],
  ["/process-planning.png", "Планування", "Готуємо план робіт, прототипи та узгоджуємо деталі."],
  ["/process-development.png", "Розробка", "Створюємо дизайн, верстку та функціонал вашого проєкту."],
  ["/process-launch.png", "Запуск і підтримка", "Тестуємо, запускаємо та забезпечуємо підтримку проєкту."],
];

export function LandingPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="FrittFram — на головну"><img src="/logo.webp" alt="FrittFram" /></a>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-nav"><span /><span /><span /><b className="sr-only">Меню</b></button>
          <nav id="main-nav" className={open ? "nav open" : "nav"} aria-label="Головна навігація">
            <a href="#services" onClick={() => setOpen(false)}>Послуги</a>
            <a href="#portfolio" onClick={() => setOpen(false)}>Портфоліо</a>
            <a href="#about" onClick={() => setOpen(false)}>Про нас</a>
            <a href="#contacts" onClick={() => setOpen(false)}>Контакти</a>
            <a className="button button-small" href="#contacts" onClick={() => setOpen(false)}>Замовити консультацію</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow badge">Цифрові рішення для бізнесу у Швеції</span>
              <h1>Створюємо цифрові рішення, що працюють на <em>ваш бізнес</em></h1>
              <p>Вебсайти, інтернет-магазини, SEO, брендинг та автоматизація — поєднуємо дизайн, технології й маркетинг, щоб допомагати бізнесу розвиватися на шведському ринку.</p>
              <div className="actions"><a className="button" href="#contacts">Замовити консультацію</a><a className="button button-outline" href="#portfolio">Переглянути роботи</a></div>
              <div className="trust"><span>◉ Індивідуальний підхід</span><span>◉ Розуміння шведського ринку</span><span>◉ Прозора комунікація</span></div>
            </div>
            <div className="hero-art" aria-label="Ілюстрація цифрового продукту" role="img">
              <img src="/hero-illustration.webp" alt="Інтерфейс цифрового продукту FrittFram" width="1030" height="700" fetchPriority="high" />
            </div>
          </div>
        </section>

        <section id="services" className="section services-section"><div className="container"><div className="section-heading"><span className="eyebrow">Послуги</span><h2>Комплексні рішення<br/>для вашого бізнесу</h2></div><div className="services-grid">{services.map(([icon,title,text])=><article className="service-card" key={title}><img className="service-icon" src={icon} alt="" width="46" height="46"/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

        <section id="portfolio" className="section portfolio-section"><div className="container"><div className="section-heading"><span className="eyebrow">Зразки робіт</span><h2>Наші роботи</h2></div><div className="portfolio-grid">{projects.map(([src,title,type,url])=><a className="project-card" href={url} target="_blank" rel="noreferrer" key={title} aria-label={`${title} — відкрити сайт`}><img src={src} alt={`Головна сторінка сайту ${title}`} loading="lazy" width="720" height="428"/><div><span><h3>{title}</h3><p>{type}</p></span><b aria-hidden="true">↗</b></div></a>)}</div><div className="center"><a className="button button-outline" href="#contacts">Обговорити свій проєкт</a></div></div></section>

        <section id="about" className="section about-section"><div className="container about-card"><div><span className="eyebrow">Про нас</span><h2>Digital без зайвої складності</h2></div><div><p>FrittFram допомагає малому та середньому бізнесу у Швеції створювати й розвивати цифрову присутність — від сайту та SEO до e-commerce, брендингу й автоматизації.</p><p>Працюємо зі шведськомовним контентом і враховуємо особливості локального пошуку, digital-комунікації та очікування шведської аудиторії.</p></div></div></section>

        <section className="section process-section"><div className="container process-box"><div className="section-heading"><span className="eyebrow">Як ми працюємо</span><h2>Простий процес — від ідеї до результату</h2></div><div className="steps">{steps.map(([icon,title,text])=><article className="step" key={title}><img className="step-icon" src={icon} alt="" width="164" height="136"/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

        <section id="contacts" className="contact-section"><div className="container contact-card"><div className="contact-copy"><span className="eyebrow">Контакти</span><h2>Готові обговорити ваш проєкт?</h2><p>Розкажіть нам про ваш бізнес і завдання. Ми допоможемо визначити практичне digital-рішення, яке відповідатиме вашим цілям і особливостям шведського ринку.</p><a className="button" href="mailto:tskorbenko@gmail.com">Замовити консультацію</a></div><div className="contact-list"><a href="mailto:tskorbenko@gmail.com"><img className="contact-icon" src="/contact-email.png" alt="" width="80" height="80"/><small>Email</small><b>tskorbenko@gmail.com</b></a><a href="tel:+46720328094"><img className="contact-icon" src="/contact-phone.png" alt="" width="80" height="80"/><small>Телефон</small><b>+46 72 032 80 94</b></a><div><img className="contact-icon" src="/contact-location.png" alt="" width="80" height="80"/><small>Місто</small><b>Stockholm, Sverige</b></div></div><img className="contact-corner" src="/contact-corner.png" alt="" width="316" height="330"/></div></section>
      </main>

      <footer><div className="container footer-grid"><div className="footer-brand"><img src="/logo.webp" alt="FrittFram"/><p>Цифрові рішення, що допомагають бізнесу зростати на шведському ринку.</p></div><div><h3>Послуги</h3>{services.map(([,t])=><a href="#services" key={t}>{t}</a>)}</div><div><h3>Компанія</h3><a href="#portfolio">Портфоліо</a><a href="#about">Про нас</a><a href="#contacts">Контакти</a></div><div><h3>Зв’язатися</h3><a href="mailto:tskorbenko@gmail.com">tskorbenko@gmail.com</a><a href="tel:+46720328094">+46 72 032 80 94</a><p>Stockholm, Sverige</p></div></div><div className="container footer-bottom"><span>© 2026 FrittFram</span><span><a href="#">Політика конфіденційності</a><a href="#">Умови використання</a></span></div></footer>
    </>
  );
}

export default function Home() {
  return (
    <main className="logo-splash" aria-label="FrittFram">
      <img src="/splash-logo.png" alt="FrittFram" width="800" height="300" />
    </main>
  );
}
