import Vue from "vue"
import Router from "vue-router"
import Cover from "./views/Cover.vue"
import Chapters from "./views/Chapters.vue"
import Stories from "./views/Stories.vue"
import Preview from "./views/Preview.vue"
import Test from "./views/Test.vue"
import Login from "./views/Login.vue"
import Register from "./views/Register.vue"
import Impression from "./views/Impression.vue"
import Profile from "./views/Profile.vue"
import Admin from "./views/Admin.vue"
import Welcome from "./views/Welcome.vue"
import ResetPassword from "./views/ResetPassword.vue"
import NotFound from "./views/NotFound.vue"
import axios from "axios"
import { serverUrl } from "./severUrl"
import store from "./store/index"
Vue.use(Router)

const router = new Router({
  linkExactActiveClass: "active",
  mode: "history",
  routes: [
    {
      path: "/",
      component: Chapters,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/stories",
      component: Stories,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/couverture",
      component: Cover,
      props: false,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/revue",
      component: Preview,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/test",
      component: Test,
      props: true,
      meta: {
        guest: true,
      },
    },
    {
      path: "/login",
      component: Login,
      props: true,
      meta: {
        guest: true,
      },
    },
    {
      path: "/register",
      component: Register,
      props: true,
      meta: {
        guest: true,
      },
    },
    {
      path: "/reset-password/:token",
      component: ResetPassword,
      props: true,
      meta: {
        guest: true,
      },
    },
    {
      path: "/impression",
      component: Impression,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/profile",
      component: Profile,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin",
      component: Admin,
      meta: {
        isAdmin: true,
        requiresAuth: true,
      },
    },
    {
      path: "/welcome",
      component: Welcome,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "*",
      component: NotFound,
      props: true,
    },
  ],
})

const checkUser = function () {
  return axios
    .get(serverUrl + "/auth/checkUser/", {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch(() => false)
}

router.beforeEach(async (to, from, next) => {
  const userData = await checkUser()

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!userData) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      })
    } else {
      if (to.matched.some((record) => record.meta.isAdmin)) {
        if (userData.role == "admin") {
          store.commit("setUser", userData)
          next()
        } else {
          next({ path: "/" })
        }
      } else {
        store.commit("setUser", userData)
        next()
      }
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (!userData) {
      next()
    } else {
      next({ path: "/" })
    }
  } else {
    next()
  }
})

export default router
