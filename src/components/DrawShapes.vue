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

      drawing: false,
      currentPoint: {},
    };
  },

  props: ["Data", "ID"],

  emits: ["getAnswer"],

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
      if (this.Data.givenPoints != null) {
        this.drawGiven();
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
    drawNewLine(e) {
      this.drawing = true;

      this.currentPoint = this.getClosestPoint(
        e.target.getStage().getPointerPosition()
      );
      this.configLine.push({
        points: [
          this.gridPos.x[this.currentPoint.x],
          this.gridPos.y[this.currentPoint.y],
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
          this.gridPos.x[this.currentPoint.x],
          this.gridPos.y[this.currentPoint.y],
          e.target.getStage().getPointerPosition().x,
          e.target.getStage().getPointerPosition().y,
        ];
      }
    },
    stopDrawing(e) {
      let id = this.configLine.length - 1;
      let pointerPoint = this.getClosestPoint(
        e.target.getStage().getPointerPosition()
      );
      this.drawing = false;
      this.configLine[id].points = [
        this.gridPos.x[this.currentPoint.x],
        this.gridPos.y[this.currentPoint.y],
        this.gridPos.x[pointerPoint.x],
        this.gridPos.y[pointerPoint.y],
      ];
      if (this.Data.varifyOption == "rect") {
      } else if (this.Data.varifyOption == "shape") {
      }
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
      return { x: x, y: y };
    },
    slope(line) {
      let point1 = {
          x: line.points[0],
          y: line.points[1],
        },
        point2 = {
          x: line.points[2],
          y: line.points[3],
        };
      if (point1.x == point2.x) return "vertical";
      else return (point1.y - point2.y) / (point1.x - point2.x);
    },
    isParallel(line1, line2) {
      if (this.slope(line1) == this.slope(line2)) return true;
      else return false;
    },
    isPerpendicular(line1, line2) {
      if (this.slope(line1) == "vertical" || this.slope(line2) == "vertical") {
        if (this.slope(line1) == 0 || this.slope(line2) == 0) return true;
        else return false;
      } else if (this.slope(line1) * this.slope(line2) == -1) return true;
      else return false;
    },
  },
};
</script>
