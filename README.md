 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 6f85828d351ecdf6d7c43b0802654572b40cab7b..1b70fbadf4436d29949fdd0e31f54b53f2f9b31b 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,11 @@
 # mega-trans-bridge
-Website for Mega Transport Company
+
+Landing page for Mega Trans Bridg Company.
+
+## Run locally
+
+```bash
+python3 -m http.server 4173
+```
+
+Open <http://localhost:4173>.
 
EOF
)
 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/index.html b/index.html
new file mode 100644
index 0000000000000000000000000000000000000000..6064122e58a7db57bb91254591cacd5aaa187643
--- /dev/null
+++ b/index.html
@@ -0,0 +1,105 @@
+<!doctype html>
+<html lang="ru">
+  <head>
+    <meta charset="UTF-8" />
+    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+    <title>Mega Trans Bridg Company — Международные грузоперевозки</title>
+    <meta
+      name="description"
+      content="Mega Trans Bridg Company — международные перевозки, логистика и таможенное сопровождение для бизнеса."
+    />
+    <link rel="stylesheet" href="styles.css" />
+  </head>
+  <body>
+    <header class="hero">
+      <nav class="container nav">
+        <div class="logo">Mega Trans Bridg Company</div>
+        <a href="#contact" class="btn btn-small">Связаться</a>
+      </nav>
+
+      <div class="container hero-content">
+        <p class="eyebrow">Надёжная логистика для вашего бизнеса</p>
+        <h1>Быстрые и безопасные грузоперевозки по миру</h1>
+        <p class="subtitle">
+          Организуем доставку "под ключ": от планирования маршрута и страхования до
+          отслеживания груза в реальном времени.
+        </p>
+        <div class="hero-actions">
+          <a href="#services" class="btn">Наши услуги</a>
+          <a href="#contact" class="btn btn-outline">Получить предложение</a>
+        </div>
+      </div>
+    </header>
+
+    <main>
+      <section id="services" class="section container">
+        <h2>Услуги</h2>
+        <div class="cards">
+          <article class="card">
+            <h3>Международные перевозки</h3>
+            <p>Авто, авиа, море и железная дорога — подбираем лучший маршрут по срокам и бюджету.</p>
+          </article>
+          <article class="card">
+            <h3>Таможенное оформление</h3>
+            <p>Подготовка документов, консультации и сопровождение на всех этапах оформления.</p>
+          </article>
+          <article class="card">
+            <h3>Складская логистика</h3>
+            <p>Консолидация, хранение, упаковка и распределение грузов для B2B клиентов.</p>
+          </article>
+        </div>
+      </section>
+
+      <section class="section section-alt">
+        <div class="container stats">
+          <div>
+            <strong>12+</strong>
+            <span>лет на рынке</span>
+          </div>
+          <div>
+            <strong>30+</strong>
+            <span>стран доставки</span>
+          </div>
+          <div>
+            <strong>98%</strong>
+            <span>грузов вовремя</span>
+          </div>
+        </div>
+      </section>
+
+      <section id="contact" class="section container">
+        <h2>Связаться с нами</h2>
+        <p>Оставьте заявку, и мы подготовим коммерческое предложение в течение рабочего дня.</p>
+        <form class="contact-form" id="contactForm">
+          <label>
+            Ваше имя
+            <input type="text" name="name" required />
+          </label>
+          <label>
+            Email
+            <input type="email" name="email" required />
+          </label>
+          <label>
+            Тип груза
+            <input type="text" name="cargo" required />
+          </label>
+          <label>
+            Сообщение
+            <textarea name="message" rows="4" required></textarea>
+          </label>
+          <button type="submit" class="btn">Отправить заявку</button>
+          <p class="form-note" id="formNote" aria-live="polite"></p>
+        </form>
+      </section>
+    </main>
+
+    <footer class="footer">
+      <div class="container footer-content">
+        <span>© <span id="year"></span> Mega Trans Bridg Company</span>
+        <span>Логистика без границ</span>
+      </div>
+    </footer>
+
+    <script src="script.js"></script>
+  </body>
+</html>
 
EOF
)
 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
new file mode 100644
index 0000000000000000000000000000000000000000..1a5771fabbcecbcfa2faf081d443ed574a3cf355
--- /dev/null
+++ b/script.js
@@ -0,0 +1,13 @@
+const yearEl = document.getElementById("year");
+const form = document.getElementById("contactForm");
+const note = document.getElementById("formNote");
+
+yearEl.textContent = new Date().getFullYear();
+
+form.addEventListener("submit", (event) => {
+  event.preventDefault();
+  const formData = new FormData(form);
+  const name = formData.get("name");
+  note.textContent = `${name}, спасибо! Ваша заявка отправлена.`;
+  form.reset();
+});
 
EOF
)
 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/styles.css b/styles.css
new file mode 100644
index 0000000000000000000000000000000000000000..637c55fd18883da3f911b3e5201b4bca60caa862
--- /dev/null
+++ b/styles.css
@@ -0,0 +1,179 @@
+:root {
+  --bg: #0b1320;
+  --surface: #111c2f;
+  --accent: #f39c12;
+  --text: #f3f6fb;
+  --muted: #b6c2d4;
+}
+
+* {
+  box-sizing: border-box;
+}
+
+body {
+  margin: 0;
+  font-family: Inter, Arial, sans-serif;
+  color: var(--text);
+  background: #0f1b30;
+  line-height: 1.5;
+}
+
+.container {
+  width: min(1100px, 92%);
+  margin: 0 auto;
+}
+
+.hero {
+  background: linear-gradient(120deg, var(--bg), #132744);
+  padding-bottom: 4rem;
+}
+
+.nav {
+  display: flex;
+  justify-content: space-between;
+  align-items: center;
+  padding: 1.2rem 0;
+}
+
+.logo {
+  font-weight: 700;
+}
+
+.hero-content {
+  padding: 4rem 0 2rem;
+  max-width: 760px;
+}
+
+.eyebrow {
+  color: var(--accent);
+  text-transform: uppercase;
+  letter-spacing: 0.08em;
+  font-size: 0.8rem;
+}
+
+h1 {
+  font-size: clamp(1.8rem, 4.5vw, 3rem);
+  line-height: 1.2;
+  margin: 0.5rem 0 1rem;
+}
+
+.subtitle {
+  color: var(--muted);
+  max-width: 640px;
+}
+
+.hero-actions {
+  margin-top: 1.4rem;
+  display: flex;
+  gap: 0.8rem;
+  flex-wrap: wrap;
+}
+
+.btn {
+  display: inline-block;
+  background: var(--accent);
+  color: #111;
+  text-decoration: none;
+  border: none;
+  border-radius: 8px;
+  padding: 0.75rem 1rem;
+  cursor: pointer;
+  font-weight: 600;
+}
+
+.btn-small {
+  padding: 0.55rem 0.85rem;
+}
+
+.btn-outline {
+  background: transparent;
+  color: var(--text);
+  border: 1px solid #7f8fa8;
+}
+
+.section {
+  padding: 3.5rem 0;
+}
+
+.section h2 {
+  margin-top: 0;
+}
+
+.cards {
+  display: grid;
+  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
+  gap: 1rem;
+}
+
+.card {
+  background: var(--surface);
+  padding: 1rem;
+  border-radius: 12px;
+}
+
+.section-alt {
+  background: #0c1729;
+}
+
+.stats {
+  display: flex;
+  justify-content: space-between;
+  gap: 1rem;
+  flex-wrap: wrap;
+}
+
+.stats div {
+  background: var(--surface);
+  border-radius: 10px;
+  padding: 1rem 1.2rem;
+  min-width: 150px;
+}
+
+.stats strong {
+  display: block;
+  font-size: 1.4rem;
+}
+
+.stats span {
+  color: var(--muted);
+  font-size: 0.95rem;
+}
+
+.contact-form {
+  margin-top: 1rem;
+  display: grid;
+  gap: 0.8rem;
+  max-width: 650px;
+}
+
+label {
+  display: grid;
+  gap: 0.35rem;
+}
+
+input,
+textarea {
+  padding: 0.65rem;
+  border-radius: 8px;
+  border: 1px solid #44526a;
+  background: #0c1524;
+  color: var(--text);
+}
+
+.form-note {
+  color: #7dd3fc;
+  min-height: 1.2rem;
+}
+
+.footer {
+  border-top: 1px solid #24344e;
+  padding: 1rem 0;
+}
+
+.footer-content {
+  display: flex;
+  justify-content: space-between;
+  gap: 1rem;
+  flex-wrap: wrap;
+  color: var(--muted);
+}
 
EOF
)
