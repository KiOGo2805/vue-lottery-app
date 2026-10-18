<template>
  <div class="not-found-view">
    <h1 class="not-found-view__code">404</h1>
    <p class="not-found-view__message">Сторінку не знайдено</p>
    <RouterLink to="/" class="not-found-view__home-link"
      >Повернутися на головну</RouterLink
    >
  </div>
</template>

<style scoped>
.not-found-view {
  padding: 5rem 0;
  text-align: center;
}

.not-found-view__code {
  margin: 0 0 1rem;
  color: #1f2937;
  font-size: 3.75rem;
  font-weight: 700;
  line-height: 1;
}

.not-found-view__message {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.not-found-view__home-link {
  color: #3b82f6;
}

.not-found-view__home-link:hover {
  text-decoration: underline;
}
</style>
