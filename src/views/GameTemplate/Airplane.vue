<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <h2>{{ GameData.Question }}</h2>
      <v-stage :config="configKonva">
        <v-layer>
          <v-image :config="configBG"></v-image>
        </v-layer>

        <v-layer>
          <v-rect :config="configPlane"></v-rect>
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
      },

      configBG: {
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
    this.gameWidth = document.getElementById("GameContainer").clientWidth;
    this.configKonva.width = Math.floor(this.gameWidth * 0.8);
    this.configKonva.height = Math.floor(this.configKonva.width / 2);
    this.configBG.width = this.configKonva.width;
    this.configBG.height = this.configKonva.height;
    this.configPlane.height = Math.round(this.gameWidth * 0.075);
    this.configPlane.width = this.configPlane.height;
  },

  mounted() {},

  methods: {
    input(e) {
      //W = 38/87; A = 37/65; S = 40/83; D = 39/68
      //console.log(e.keyCode);
      switch (e.keyCode) {
        case 38:
        case 87:
          this.move(1);
          break;

        case 40:
        case 83:
          this.move(-1);
          break;

        case 32:
          this.move(0);
          break;
      }
    },
    move(key) {},
    end() {},
  },
};
</script>
