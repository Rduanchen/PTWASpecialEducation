<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <v-stage :config="configKonva">
        <v-layer>
          <v-line
            v-for="pointSet in configGrid"
            :points="pointSet"
            :stroke="'black'"
          ></v-line>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import { getSystemAssets } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";
export default {
  components: {},
  data() {
    return {
      configKonva: {},
      ratio: {
        width: 15,
        height: 15,
      },
      gridPos: {
        x: [],
        y: [],
      },
      configGrid: [],
    };
  },

  props: ["Data", "ID"],

  beforeMount() {
    this.getData();
    this.initializeScene();
    this.setGrid();
    this.drawGrid();
  },

  mounted() {},

  methods: {
    getData() {
      if (this.Data.bgRatio != null) {
        this.ratio = this.Data.bgRatio;
      }
    },
    initializeScene() {
      this.gameWidth =
        document.getElementById("GameContainer").clientWidth * 0.5;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height =
        (this.gameWidth * this.ratio.height) / this.ratio.width;
    },
    setGrid() {
      for (let i = 0; i <= this.ratio.width; ++i)
        this.gridPos.x.push((i * this.configKonva.width) / this.ratio.width);
      for (let i = 0; i <= this.ratio.height; ++i)
        this.gridPos.y.push((i * this.configKonva.height) / this.ratio.height);
    },
    drawGrid() {
      for (let i = 1; i < this.ratio.width; ++i) {
        this.configGrid.push([
          this.gridPos.x[i],
          0,
          this.gridPos.x[i],
          this.configKonva.height,
        ]);
      }
      for (let i = 1; i < this.ratio.height; ++i) {
        this.configGrid.push([
          0,
          this.gridPos.y[i],
          this.configKonva.width,
          this.gridPos.y[i],
        ]);
      }
    },
  },
};
</script>
