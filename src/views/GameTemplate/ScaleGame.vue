<template>
  <div class="gameContainer">
    <div class="gameTitle">
      {{ GameData.Question }}
    </div>
    <div class="gameArea">
      <div class="gameImage">image</div>
      <div class="scaleArea">
        <div class="scaleContainer">
          <div class="scale"><scale :Data="scaleData" :ID="id"></scale></div>
        </div>

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
}
.gameTitle {
  display: flex;
  align-items: center;
  border: 2px solid black;
  border-radius: 25px;
  width: 98%;
  height: 10%;
  margin: 1%;
  padding-left: 1%;
}
.gameArea {
  width: 100%;
  height: 85%;
  display: flex;
}
.gameImage {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  border-radius: 25px;
  width: 46%;
  margin: 1%;
}
.scaleArea {
  width: 50%;
  margin: 1%;
}
.scaleContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  border-radius: 25px;
  width: 100%;
  height: 88%;
  margin-bottom: 1%;
}
.scale {
  background-color: blue;
  height: 95%;
  aspect-ratio: 1;
}
button {
  border: 2px solid black;
  border-radius: 25px;
  width: 100%;
  height: 10%;
  margin-top: 1%;
}
</style>
