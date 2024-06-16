import { type RouteRecordRaw, createRouter } from "vue-router"
import { history, flatMultiLevelRoutes } from "./helper"
import routeSettings from "@/config/route"
import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/news-search",
    children: [
      {
        path: "news-search",
        component: () => import("@/views/news-search/index.vue"),
        name: "NewsSearch",
        meta: {
          title: "新闻查询",
          svgIcon: "search",
          affix: true,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/lifecircle",
    component: Layouts,
    redirect: "/lifecircle/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/lifecircle/index.vue"),
        name: "LifeCircle",
        meta: {
          elIcon: "Clock",
          title: "生命周期",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/news-type",
    component: Layouts,
    redirect: "/news-type/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/news-type/index.vue"),
        name: "NewsType",
        meta: {
          elIcon: "Reading",
          title: "种类变化",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/interest",
    component: Layouts,
    redirect: "/interest/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/interest/index.vue"),
        name: "Interest",
        meta: {
          elIcon: "Star",
          title: "兴趣偏好",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/combine-search",
    component: Layouts,
    redirect: "/combine-search/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/combine-search/index.vue"),
        name: "CombineSearch",
        meta: {
          elIcon: "Connection",
          title: "组合查询",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/recommend",
    component: Layouts,
    redirect: "/recommend/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/recommend/index.vue"),
        name: "Recommend",
        meta: {
          elIcon: "Paperclip",
          title: "新闻推荐",
          keepAlive: true
        }
      }
    ]
  },
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  // {
  //   path: "/permission",
  //   component: Layouts,
  //   redirect: "/permission/page",
  //   name: "Permission",
  //   meta: {
  //     title: "权限管理",
  //     svgIcon: "lock",
  //     roles: ["admin", "editor"], // 可以在根路由中设置角色
  //     alwaysShow: true // 将始终显示根菜单
  //   },
  //   children: [
  //     {
  //       path: "page",
  //       component: () => import("@/views/permission/page.vue"),
  //       name: "PagePermission",
  //       meta: {
  //         title: "页面权限",
  //         roles: ["admin"] // 或者在子导航中设置角色
  //       }
  //     },
  //     {
  //       path: "directive",
  //       component: () => import("@/views/permission/directive.vue"),
  //       name: "DirectivePermission",
  //       meta: {
  //         title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
  //       }
  //     }
  //   ]
  // },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
