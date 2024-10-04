<template>
  <div class="d-flex flex-column min-vh-100">
    <NavBar></NavBar>
    <header class="header container d-flex align-items-center flex-wrap">
      <p class="text-center text-white h1 mb-0">請選擇年級</p>
    <div class="row GradeSelectMenu flex-nowrap d-flex justify-content-center">
        <div class="col-2">
          <router-link :to="{ name: 'GameSelect', params: { id: 1 } }" class="submenu-link-block">
            <img src="@/assets/images/grade_btn/g1_hover.png" class="img-fluid" alt="一年遊戲">
          </router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'GameSelect', params: { id: 2 } }" alt="二年遊戲" class="submenu-link-block">
            <img src="@/assets/images/grade_btn/g2_hover.png" class="img-fluid" >
          </router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'GameSelect', params: { id: 3 } }" alt="三年遊戲" class="submenu-link-block">
            <img src="@/assets/images/grade_btn/g3_hover.png" class="img-fluid" >
          </router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'GameSelect', params: { id: 4 } }" alt="四年遊戲" class="submenu-link-block">
            <img src="@/assets/images/grade_btn/g4_hover.png" class="img-fluid" >
          </router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'GameSelect', params: { id: 5 } }" alt="五年遊戲" class="submenu-link-block">
            <img src="@/assets/images/grade_btn/g5_hover.png" class="img-fluid" >
          </router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'GameSelect', params: { id: 6 } }" alt="六年遊戲" class="submenu-link-block">
            <img src="@/assets/images/grade_btn/g6_hover.png" class="img-fluid" >
          </router-link>
        </div>
      </div>
  </header>

<!-- /**
  * Renders a selection of grade buttons.
  * Each grade button is a router link that navigates to the GameSelect view with a specific grade ID.
  * The grade buttons are displayed as images.
  * 
  * @component
  * @example
  * <GradeSelection></GradeSelection>
  */ -->
  <!-- <header class="header">
        <button class="start-the-game" @click="goToGame()">開始遊戲</button>
  </header> -->
  <!-- NF 頁尾設定 -->
  <!-- <section class="">
    <footer class="text-center text-white" style="background-color: #0a4275;">
      <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
        © 2023 Copyright:
        <a class="text-white" href="https://programtheworld.tw/">programtheworld.tw</a>
      </div>
    </footer>
  </section> -->
  <footer class="mt-auto text-center text-white" style="background-color: #F19C79;">
    <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
      © 2024 版權所有:
      <a class="text-white" href="https://programtheworld.tw/">programtheworld.tw</a>
    </div>
  </footer>
</div>

</template>

<script>
import NavBar from "./NavBar.vue";
export default {
  data() {
    return {
      grade: 0,
    };
  },
  methods: {
    goToGame() {
      this.$router.push({ name: 'GameSelect', params: { id: 'Sample' } });
    },
  },
  components: {
    NavBar,
  }
};
</script>

<style lang="scss" scoped>

.navbar {
  background-color: #F19C79;
  height: 10vh; 
  width: 100%; 
  margin: 0;
  .navbar-brand {
    img{
        max-width: 70%
    }
  }
  img {
    max-width: 80%;
  }
  
}

.header {
  // display: flex;
  height: 78vh; 
  // position: relative; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(../assets/images/pics/cover_info.png);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  filter: brightness(60%);
  z-index: -1; /* 確保背景圖片位於內容之後 */
}
.content {
  z-index: 1; /* 將這個元素放置於 ::before 元素上方 */
}


.GradeSelectMenu {
  .col-2 {  
    transition: transform 0.3s ease;
    img {
      transition: transform 0.3s ease;
    }
    &:hover {
      transform: scale(1.1);
      img {
        transform: scale(1.1);
      }
    }
  }
}
footer {
  position: relative;
  top: auto;
}

.start-the-game {
  width: 50vw;
  height: 40vh;
  font-size: 3rem;
  background-color: $primary-color;
}
.start-the-game:hover {
  transform: scale(1.07);
}

</style>