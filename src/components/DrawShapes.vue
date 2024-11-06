<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <v-stage
        :config="configKonva"
        @mousedown="drawNewLine"
        @mousemove="moveLine"
        @mouseup="stopDrawing"
      >
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
      links: [],

      drawing: false,
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
      for (let point in this.points) {
        this.configGivenPoint.push({
          x: this.gridPos.x[this.points[point][0]],
          y: this.gridPos.y[this.points[point][1]],
          radius: this.configKonva.width * 0.01,
          stroke: "brown",
          fill: "white",
        });
      }
      if (this.points.length > 1) {
        for (let i = 0; i < this.points.length - 1; ++i) {
          this.links.push([i, i + 1]);
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
    drawNewLine(e) {
      this.drawing = true;
      let id = this.points.length;

      this.points.push(
        this.getClosestPoint(e.target.getStage().getPointerPosition())
      );
      this.configLine.push({
        points: [
          this.gridPos.x[this.points[id][0]],
          this.gridPos.y[this.points[id][1]],
          e.target.getStage().getPointerPosition().x,
          e.target.getStage().getPointerPosition().y,
        ],
        stroke: "green",
      });
    },
    moveLine(e) {
      if (this.drawing) {
        let id = this.configLine.length - 1;
        this.configLine[id].points = [
          this.gridPos.x[this.points[id][0]],
          this.gridPos.y[this.points[id][1]],
          e.target.getStage().getPointerPosition().x,
          e.target.getStage().getPointerPosition().y,
        ];
      }
    },
    stopDrawing(e) {
      let id = this.configLine.length - 1;
      let getPoint = this.getClosestPoint(
        e.target.getStage().getPointerPosition()
      );
      this.drawing = false;
      this.configLine[id].points = [
        this.gridPos.x[this.points[id][0]],
        this.gridPos.y[this.points[id][1]],
        this.gridPos.x[getPoint[0]],
        this.gridPos.y[getPoint[1]],
      ];
    },
    getClosestPoint(pos) {
      let x, y;
      let distance = 999;
      for (let i = 0; i <= this.ratio.width; ++i) {
        if (Math.abs(pos.x - this.gridPos.x[i]) < distance) {
          x = i;
          distance = Math.abs(pos.x - this.gridPos.x[i]);
        }
      }
      distance = 999;
      for (let i = 0; i <= this.ratio.height; ++i) {
        if (Math.abs(pos.y - this.gridPos.y[i]) < distance) {
          y = i;
          distance = Math.abs(pos.y - this.gridPos.y[i]);
        }
      }
      return [x, y];
    },
  },
};
</script>
