<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <h2>{{ GameData.Question }}</h2>
      <v-stage :config="configKonva">
        <v-layer>
          <v-image :config="configBG_1"></v-image>
          <v-image :config="configBG_2"></v-image>
        </v-layer>

        <v-layer>
          <v-rect :config="configPlane" @dragmove="keepInBound"></v-rect>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import { Container } from "konva/lib/Container";
import { defineAsyncComponent } from "vue";

const Background = document.createElement("img");
Background.src = GamesGetAssetsFile("Dev02_Airplane", "sky.jpg");

export default {
  components: {},
  data() {
    return {
      configKonva: {
        width: 1000,
        height: 500,
      },

      configPlane: {
        fill: "gray",
        stroke: "gray",
        draggable: true,
      },

      configBG_1: {
        x: 0,
        y: 0,
        image: Background,
      },
      configBG_2: {
        x: 0,
        y: 0,
        image: Background,
      },

      game: true,

      speed: 1,
    };
  },

  props: {
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

  beforeMount() {
    this.initializeScene();
    this.game = window.setInterval(this.update, 20);
  },

  methods: {
    initializeScene() {
      this.gameWidth =
        document.getElementById("GameContainer").clientWidth * 0.8;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height = this.gameWidth / 2;
      this.configBG_1.width = this.gameWidth;
      this.configBG_1.height = this.gameWidth / 2;
      this.configBG_2.width = this.gameWidth;
      this.configBG_2.height = this.gameWidth / 2;
      this.configBG_2.x = this.gameWidth;
      this.configPlane.height = this.gameWidth * 0.075;
      this.configPlane.width = this.configPlane.height;
      this.configPlane.x = this.gameWidth * 0.05;
      this.configPlane.y =
        (this.gameWidth * 0.5 - this.configPlane.height) * 0.5;
    },
    update() {
      this.backgroundScroll();
    },
    backgroundScroll() {
      this.configBG_1.x--;
      this.configBG_2.x--;
      if (this.configBG_1.x <= -this.gameWidth)
        this.configBG_1.x = this.gameWidth;
      if (this.configBG_2.x <= -this.gameWidth)
        this.configBG_2.x = this.gameWidth;
    },
    keepInBound(e) {
      e.target.x(Math.max(e.target.x(), 0));
      e.target.x(
        Math.min(e.target.x(), this.gameWidth - this.configPlane.width)
      );
      e.target.y(Math.max(e.target.y(), 0));
      e.target.y(
        Math.min(e.target.y(), this.gameWidth * 0.5 - this.configPlane.height)
      );
    },
    end() {},
  },
};
</script>
