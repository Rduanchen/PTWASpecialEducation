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
      sides: [],
    };
  },

  props: ["Data", "ID"],

  emits: ["getAnswer"],

  beforeMount() {
    this.getData();
    this.initializeScene();
    this.setGrid();
    this.drawGrid();
    if (this.Data.givenPoints != null) {
      this.drawGiven();
    }
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
      console.log(this.isTriangle(), this.sides);
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
    slope(id) {
      let points = this.getPointsPositionFromLine(id);
      if (points[0].x == points[1].x) return "vertical";
      else return (points[0].y - points[1].y) / (points[0].x - points[1].x);
    },
    isParallel(id1, id2) {
      if (this.slope(id1) == this.slope(id2)) return true;
      else return false;
    },
    isPerpendicular(id1, id2) {
      if (this.slope(id1) == "vertical" || this.slope(id2) == "vertical") {
        if (this.slope(id1) == 0 || this.slope(id2) == 0) return true;
        else return false;
      } else if (this.slope(id1) * this.slope(id2) == -1) return true;
      else return false;
    },
    isLinked(id1, id2) {
      let points1 = this.getPointsPositionFromLine(id1),
        points2 = this.getPointsPositionFromLine(id2);
      if (this.isSameLine(id1, id2) || id1 == id2) return false;
      else if (
        this.isSamePoint(points1[0], points2[0]) ||
        this.isSamePoint(points1[0], points2[1]) ||
        this.isSamePoint(points1[1], points2[1]) ||
        this.isSamePoint(points1[1], points2[0])
      ) {
        return true;
      } else return false;
    },
    findLinks(id) {
      let links = [];
      for (let line in this.configLine) {
        if (this.isLinked(id, line)) {
          links.push(line);
        }
      }
      return links;
    },
    getPointsPositionFromLine(id) {
      return [
        {
          x: this.configLine[id].points[0].toFixed(),
          y: this.configLine[id].points[1].toFixed(),
        },
        {
          x: this.configLine[id].points[2].toFixed(),
          y: this.configLine[id].points[3].toFixed(),
        },
      ];
    },
    isSamePoint(point1, point2) {
      if (point1.x == point2.x && point1.y == point2.y) return true;
      else return false;
    },
    isSameLine(id1, id2) {
      let points1 = this.getPointsPositionFromLine(id1),
        points2 = this.getPointsPositionFromLine(id2);
      if (
        (this.isSamePoint(points1[0], points2[0]) &&
          this.isSamePoint(points1[1], points2[1])) ||
        (this.isSamePoint(points1[0], points2[1]) &&
          this.isSamePoint(points1[1], points2[0]))
      )
        return true;
      else return false;
    },
    isTriangle() {
      this.sides = [];
      for (let line in this.configLine) {
        if (this.findLinks(line).length >= 2) {
          this.sides.push(line);
          for (let i in this.findLinks(line)) {
            this.sides.push(this.findLinks(line)[i]);
            for (let j in this.findLinks(line)) {
              if (this.isLinked(i, j)) {
                this.sides.push(this.findLinks(line)[j]);
                return true;
              }
            }
            this.sides.pop();
          }
        }
        this.sides = [];
      }
      return false;
    },
  },
};
</script>
