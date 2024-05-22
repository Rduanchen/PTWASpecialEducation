import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      meta: { 
        requiresAuth: false,
        transition: 'fade'
      },
      component: () => import("@/views/index.vue"),
    },
    //將遊戲選擇整合至一個頁面
    {
      path: "/GameSelect/:id",
      name: "GameSelect",
      meta: { transition: 'fade' },
      component: () => import("@/views/GameSelect.vue"),
    },
    {
      path:"/Game/:Subject/:Grade/:id/:GameName",
      name:"Game",
      meta: { transition: 'fade' },
      component:()=>import("@/views/Game.vue"),
    },
    {
      path:"/Link",
      name:"Link",
      component:()=>import("@/components/link.vue"),
    },
    {
      path:"/countertest",
      name:"countertest",
      component:()=>import("@/components/countertest.vue"),
    },
    {
      path:"/CompareGame",
      name:"CompareGame",
      component:()=>import("@/views/GameTemplate/CompareGame.vue"),
    },
    {
      path:"/ImageWithText",
      name:"ImageWithText",
      component:()=>import("@/views/GameTemplate/ImageWithText.vue"),
    },
    {
      path: '/Water' ,
      name: 'Water',
      component: () => import('@/components/Water.vue'),
    },
    {
      path: '/Calculator',
      name: 'Calculator',
      component: () => import('@/views/GameTemplate/CalculatorGame.vue'),
    },
    {
      path: '/TextOnly',
      name: 'TextOnly',
      component: () => import('@/components/TextOnly.vue'),
    },
    {
      path: '/FreeDrag',
      name: 'FreeDrag',
      component: () => import('@/components/FreeDrag.vue'),
    },
    ]
});
router.beforeEach((to, from, next) => {
  console.warn(`route: ${from.path} -> ${to.path}`);
  next();
});

export default router;
