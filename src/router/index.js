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
      path:"/CoulorBarChart",
      name:"CoulorBarChart",
      component:()=>import("@/components/CoulorBarChart.vue"),
    },
    {
      path:"/ImageWithText",
      name:"ImageWithText",
      component:()=>import("@/components/ImageWithText.vue"),
    },
    {
      path: '/test', 
      name: 'test',
      component: () => import('@/components/test.vue'),
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
    {
      path: '/TestNumberBoard',
      name: 'TestNumberBoard',
      component: () => import('@/components/NumberBoard.vue'),
    },{
      path: '/DrawImageTable',
      name: 'DrawImageTable',
      component: () => import('@/components/DrawImageTable.vue'),
    },
    {
      path: '/DrawImage',
      name: 'DrawImage',
      component: () => import('@/components/DrawImage.vue'),
    },
    {
      path: '/NumberBoard',
      name: 'NumberBoard',
      component: () => import('@/components/NumberBoard.vue'),
    },
    {
      path: '/Numberline',
      name: 'Numberline',
      component: () => import('@/components/NumberLine.vue'),
    },
    {
      path: '/PairingGame',
      name: 'PairingGame',
      component: () => import('@/views/GameTemplate/PairingGame.vue'),
    },
    {
      path: '/NumberLock',
      name: 'NumberLock',
      component: () => import('@/views/GameTemplate/NumberLock.vue'),
    },
    {
      path: '/MarkDownLite',
      name: 'MarkDownLite',
      component: () => import('@/components/Markdown.vue'),
    },
    {
      path:'/Calculator',
      name:'Calculator',
      component:()=>import('@/components/calculator.vue'),
    },
    {
      path:'/CalculatorGame',
      name:'CalculatorGame',
      component:()=>import('@/views/GameTemplate/CalculatorGame.vue'),
    },
    {
      path: '/MoneyGenerator',
      name: 'MoneyGenerator',
      component: () => import('@/components/MoneyGenerator.vue'),
    },{
      path: '/LinktoImage',
      name: 'LinktoImage',
      component: () => import('@/views/GameTemplate/LinktoImage.vue'),
    },
    {
      path: '/SelectGameMulti',
      name: 'SelectGameMulti',
      component: () => import('@/views/GameTemplate/SelectGameMulti.vue'),
    },
    {
      path: '/Track',
      name: 'Track',
      component: () => import('@/views/GameTemplate/Track.vue'),
    },
    {
      path: '/CopyItem',
      name: 'CopyItem',
      component: () => import('@/views/GameTemplate/CopyItem.vue'),
    },
    {
      path: '/FindItemGameMaker',
      name: 'FindItemGameMaker',
      component: () => import('@/components/FindItemGameMaker.vue'),
    },
    {
      path: '/NumberLineWithBlank',
      component: () => import('@/components/NumberLineWithBlank.vue'),
    },
    {
      path: '/3056',
      component: () => import('@/views/PrivateTemplate/Grade3/MA3056.vue'),
    },
    {
      path: '/tester',
      component: () => import('@/views/GameTemplate/componentTesters.vue'),
    },
    {
      path: '/LinktoImageGameMaker',
      component: () => import('@/components/maker/LinktoImageGameMaker.vue'),
    }
  ]
});
router.beforeEach((to, from, next) => {
  console.warn(`route: ${from.path} -> ${to.path}`);
  const grade = parseInt(to.params.Grade, 10);
  const id = parseInt(to.params.id, 10);
  if ((!isNaN(grade) && grade <= 3) || (!isNaN(id) && id <= 3)) {
    document.body.style.fontFamily = 'YuanQuan, sans-serif'; // 動態設置字體
  } else {
    document.body.style.fontFamily = ''; // 重置為默認字體
  }
  next();
});

export default router;