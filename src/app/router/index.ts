import { createRouter, createWebHistory } from "vue-router";
import { useSessionStore } from "../../entities/session/model/session.store";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../../pages/HomeView.vue"),
    meta: { title: "Home | Vue Lottery", layout: "DefaultLayout" },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../../pages/AboutView.vue"),
    meta: { title: "About Author", layout: "DefaultLayout" },
  },
  {
    path: "/users",
    name: "users",
    component: () => import("../../pages/UsersView.vue"),
    meta: { title: "Users List", layout: "DefaultLayout", requiresAuth: true },
  },
  {
    path: "/users/new",
    name: "user-create",
    component: () => import("../../pages/UserCreateView.vue"),
    meta: {
      title: "Create User",
      layout: "DefaultLayout",
      requiresAuth: true,
    },
  },
  {
    path: "/users/:id",
    name: "user-details",
    component: () => import("../../pages/UserDetailsView.vue"),
    props: true,
    meta: {
      title: "User Details",
      layout: "DefaultLayout",
      requiresAuth: true,
    },
  },
  {
    path: "/users/:id/edit",
    name: "user-edit",
    component: () => import("../../pages/UserEditView.vue"),
    props: true,
    meta: { title: "Edit User", layout: "DefaultLayout", requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../../pages/LoginView.vue"),
    meta: { title: "Login", layout: "AuthLayout" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../../pages/NotFoundView.vue"),
    meta: { title: "404 Not Found", layout: "DefaultLayout" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  const auth = useSessionStore();

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
