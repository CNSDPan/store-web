import Home from "../views/Store.vue";
import { createRouter as _createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/store",
    name: "Store",
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( "../views/Store.vue"),
    },
  {
    path: "/oldLogin",
    name: "OldLogin",
    meta: {
      keepAlive: false,
    },
    component: () =>
      import( "../views/OldLogin.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      keepAlive: false,
    },
    component: () =>
      import( "../views/Login.vue"),
  },
];

const router = new _createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
