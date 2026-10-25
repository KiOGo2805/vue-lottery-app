<template>
  <div class="about-view">
    <h1 class="about-view__title">Мельник Степан Романович</h1>
    <p class="about-view__subtitle">
      Студент 3 курсу, ЧНУ ім. Юрія Федьковича (Чернівці)
    </p>

    <h2 class="about-view__section-title">Technical Skills</h2>
    <div class="about-view__skills">
      <span class="about-view__skill">Python</span>
      <span class="about-view__skill">C#</span>
      <span class="about-view__skill">TypeScript / JavaScript</span>
      <span class="about-view__skill">Vue.js</span>
      <span class="about-view__skill">MySQL / PostgreSQL</span>
      <span class="about-view__skill">C++</span>
      <span class="about-view__skill">Spring Boot</span>
    </div>

    <a
      href="https://github.com/KiOGo2805"
      target="_blank"
      class="about-view__profile-link"
    >
      <svg
        class="about-view__profile-icon"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
        />
      </svg>
      Мій профіль на GitHub
    </a>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 42rem;
  padding: 2rem;
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgb(15 23 42 / 5%);
}

.about-view__title {
  margin: 0 0 0.5rem;
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.25rem;
}

.about-view__subtitle {
  margin: 0 0 1.5rem;
  color: #2563eb;
  font-weight: 500;
}

.about-view__section-title {
  margin: 0 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.75rem;
}

.about-view__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.about-view__skill {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.875rem;
  font-weight: 600;
}

.about-view__profile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
}

.about-view__profile-link:hover {
  text-decoration: underline;
}

.about-view__profile-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
