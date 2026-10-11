import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"), // Ліниве завантаження
    meta: { title: "Home | Vue Lottery", layout: "DefaultLayout" },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
    meta: { title: "About Author", layout: "DefaultLayout" },
  },
  {
    path: "/users",
    name: "users",
    component: () => import("../views/UsersView.vue"),
    meta: { title: "Users List", layout: "DefaultLayout", requiresAuth: true },
  },
  {
    path: "/users/new",
    name: "user-create",
    component: () => import("../views/UserCreateView.vue"),
    meta: {
      title: "Create User",
      layout: "DefaultLayout",
      requiresAuth: true,
    },
  },
  {
    path: "/users/:id",
    name: "user-details",
    component: () => import("../views/UserDetailsView.vue"),
    props: true, // Передача id як props
    meta: {
      title: "User Details",
      layout: "DefaultLayout",
      requiresAuth: true,
    },
  },
  {
    path: "/users/:id/edit",
    name: "user-edit",
    component: () => import("../views/UserEditView.vue"),
    props: true,
    meta: { title: "Edit User", layout: "DefaultLayout", requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    meta: { title: "Login", layout: "AuthLayout" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFoundView.vue"),
    meta: { title: "404 Not Found", layout: "DefaultLayout" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard для захисту маршрутів
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (to.name === "login" && auth.isAuthenticated) {
    next({ name: "users" });
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) || "Vue Lottery App";
});

export default router;
