<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <v-stage :config="configKonva">
        <v-layer>
          <v-line
            v-for="points in configGrid"
            :points="points"
            :stroke="'black'"
          ></v-line>
        </v-layer>
        <v-layer>
          <v-line
            v-for="line in configLine"
            :config="line"
            :strokeWidth="5"
          ></v-line>
          <v-circle
            v-for="point in configGivenPoint"
            :config="point"
          ></v-circle>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
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
      configLine: [],
      configGivenPoint: [],
      points: [],
    };
  },

  props: ["Data", "ID"],

  emits: ["getAnswer"],

  beforeMount() {
    this.getData();
    this.initializeScene();
    this.setGrid();
    this.drawGrid();
    if (this.points != []) {
      this.drawGiven();
    }
  },

  mounted() {},

  methods: {
    getData() {
      if (this.Data.bgRatio != null) {
        this.ratio = this.Data.bgRatio;
      }
      if (this.Data.givenPoints != null) {
        this.points = this.Data.givenPoints;
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
    drawGiven() {
      for (let point in this.Data.givenPoints) {
        this.configGivenPoint.push({
          x: this.gridPos.x[this.Data.givenPoints[point][0]],
          y: this.gridPos.y[this.Data.givenPoints[point][1]],
          radius: this.configKonva.width * 0.01,
          stroke: "brown",
          fill: "white",
        });
      }
      if (this.Data.givenPoints.length > 1) {
        for (let i = 0; i < this.Data.givenPoints.length - 1; ++i) {
          this.configLine.push({
            points: [
              this.configGivenPoint[i].x,
              this.configGivenPoint[i].y,
              this.configGivenPoint[i + 1].x,
              this.configGivenPoint[i + 1].y,
            ],
            stroke: "brown",
          });
        }
      }
    },
    update() {},
  },
};
</script>
