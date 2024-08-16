<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <h2>{{ GameData.Question }}</h2>
      <v-stage :config="configKonva">
        <v-layer>
          <v-rect :config="configLane"></v-rect>
        </v-layer>

        <v-layer>
          <v-rect :config="configMap"></v-rect>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import { Container } from "konva/lib/Container";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    //lane: defineAsyncComponent(() => import("@/components/lane.vue")),
    passage: defineAsyncComponent(() => import("@/components/passage.vue")),
  },
  data() {
    return {
      configKonva: {
        width: 1000,
        height: 500,
      },

      configMap: {
        x: 0,
        y: 0,
        width: 500,
        height: 250,
        fill: "gray",
        stroke: "gray",
      },
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

  beforeMount() {
    var gameWidth = document.getElementById("GameContainer").clientWidth;
    //var canvasCon = document.getElementById("canvasContainer");
    this.configKonva.width = Math.floor(gameWidth * 0.8);
    this.configKonva.height = Math.floor(this.configKonva.width / 2);
  },

  methods: {},
};
</script>
