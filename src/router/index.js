import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/admin/Dashboard.vue";
import ListAccount from "../views/admin/account/ListAccount.vue";
const routes = [
  {
    path: "/home",
    name: "home",
    meta: {
      layout: "default",
    },
    component: Home,
  },
  {
    path: "/admin/dashboard",
    name: "/admin/dashboard",
    meta: {
      layout: "admin",
    },
    component: Dashboard,
  },
  {
    path: "/admin/accounts",
    name: "/admin/accounts",
    meta: {
      layout: "admin",
    },
    component: ListAccount,
  },
  {
    path: "/login",
    name: "login",
    meta: {
      layout: "auth",
    },
    component: Login,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
