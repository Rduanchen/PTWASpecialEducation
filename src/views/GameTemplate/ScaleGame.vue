<template>
  <div class="gameContainer">
    <div class="gameTitle">title</div>
    <div class="gameArea">
      <div class="gameImage">image</div>
      <div class="scale">
        <scale :Data="scaleData" :ID="id"></scale>
        <button>btn</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getGameAssets } from "@/utilitys/get_assets.js";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    scale: defineAsyncComponent(() => import("@/components/Scale.vue")),
  },
  data() {
    return {
      scaleData: {},
    };
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    GameData: {
      type: Object,
      required: true,
    },
    GameConfig: {
      type: Object,
      required: true,
    },
  },

  emits: ["play-effect", "add-record", "next-question"],

  mounted() {
    console.log();
    this.initializeScene();
  },

  methods: {
    initializeScene() {},
    update() {},
  },
};
</script>
<style scoped>
.gameContainer {
  width: 100%;
  height: 100%;
  background-color: black;
}
.gameTitle {
  width: 100%;
  height: 15%;
  background-color: blueviolet;
}
.gameArea {
  width: 100%;
  height: 85%;
  display: flex;
  background-color: blue;
}
.gameImage {
  width: 60%;
  background-color: brown;
}
.scale {
  width: 40%;
  background-color: aquamarine;
}
button {
  width: 100%;
  height: 12%;
}
</style>
