<template>
  <div class="home-view">
    <h1 class="home-view__title">
      Про застосунок Vue Lottery
    </h1>
    <p class="home-view__description">
      Цей проєкт є односторінковим застосунком (SPA), розробленим у рамках
      лабораторної роботи №5. Він демонструє принципи маршрутизації, роботу з
      REST API через патерн Repository та управління станом за допомогою Pinia.
    </p>
    <h2 class="home-view__section-title">Використані технології:</h2>
    <ul class="home-view__technologies">
      <li>Vue 3 (Composition API) & TypeScript</li>
      <li>Vue Router (Navigation Guards, Lazy Loading)</li>
      <li>Pinia (State Management)</li>
      <li>VeeValidate & Yup (Валідація форм)</li>
      <li>Tailwind CSS & SCSS</li>
    </ul>
    <a
      href="https://github.com/KiOGo2805/vue-lottery-app"
      target="_blank"
      class="home-view__github-link"
    >
      Переглянути на GitHub
    </a>
  </div>
</template>

<style scoped>
.home-view {
  padding: 2rem;
  border: 1px solid #f3f4f6;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 5%);
}

.home-view__title {
  margin: 0 0 1rem;
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.25rem;
}

.home-view__description {
  margin: 0 0 1rem;
  color: #4b5563;
}

.home-view__section-title {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.75rem;
}

.home-view__technologies {
  margin: 0 0 1.5rem;
  padding-left: 1.25rem;
  color: #4b5563;
  list-style: disc inside;
}

.home-view__technologies li + li {
  margin-top: 0.25rem;
}

.home-view__github-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background: #1f2937;
  color: #fff;
  transition: background-color 150ms;
}

.home-view__github-link:hover {
  background: #374151;
}
</style>
