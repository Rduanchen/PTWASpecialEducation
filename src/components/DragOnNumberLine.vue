<template>
  <div class="gameContainer">
    <v-stage :config="configKonva">
      <v-layer>
        <v-rect :config="configBG"></v-rect>
      </v-layer>
      <v-layer>
        <v-line v-for="line in configNumberLine" :config="line"></v-line>
        <v-text v-for="number in configNumber" :config="number"></v-text>
        <v-circle
          v-if="!isImage"
          :config="configCircle"
          @dragmove="handleDragmove"
          @dragend="handleDragend"
        ></v-circle>
        <v-image
          v-if="isImage"
          :config="configImage"
          @dragmove="handleDragmove"
          @dragend="handleDragend"
        >
        </v-image>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";

const image = document.createElement("img");
image.src = GamesGetAssetsFile("MA3029", "RacingCar.png");

export default {
  components: {},
  data() {
    return {
      configKonva: {},
      configBG: {
        x: 0,
        y: 0,
        fill: "gray",
        stroke: "gray",
        visible: false,
      },
      configCircle: {
        fill: "green",
        stroke: "green",
        draggable: true,
      },
      configImage: {
        draggable: true,
      },

      configNumberLine: [],
      configNumber: [],
      numberX: [],

      startNum: 0,
      endNum: 300,
      interval: 20,

      isImage: true,
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
    this.initializeNumberLine();
  },

  mounted() {},

  methods: {
    initializeScene() {
      this.gameWidth =
        document.getElementById("GameContainer").clientWidth * 0.8;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height = this.gameWidth / 4;
      this.configBG.width = this.gameWidth;
      this.configBG.height = this.gameWidth / 4;
    },
    initializeNumberLine() {
      this.drawBaseLine();
      this.drawNumberLine();
      this.drawNumbers();
      this.drawDraggable();
    },
    drawBaseLine() {
      this.numberLineY = this.gameWidth * 0.15;
      let points = [
        [
          this.gameWidth * 0.05,
          this.numberLineY,
          this.gameWidth * 0.95,
          this.numberLineY,
        ],
        [
          this.gameWidth * 0.94,
          this.numberLineY - this.gameWidth * 0.01,
          this.gameWidth * 0.95,
          this.numberLineY,
        ],
        [
          this.gameWidth * 0.94,
          this.numberLineY + this.gameWidth * 0.01,
          this.gameWidth * 0.95,
          this.numberLineY,
        ],
      ];
      for (let p in points) {
        let line = {};
        line.stroke = "black";
        line.points = points[p];
        this.configNumberLine.push(line);
      }
    },
    drawNumberLine() {
      this.intervalLength =
        (this.gameWidth * 0.9) /
        ((this.endNum - this.startNum) / this.interval + 1);
      let tempX = this.gameWidth * 0.05 + this.intervalLength * 0.5;
      for (let i = this.startNum; i <= this.endNum; i += this.interval) {
        let line = {};
        line.stroke = "black";
        line.points = [
          tempX,
          this.numberLineY - this.gameWidth * 0.01,
          tempX,
          this.numberLineY + this.gameWidth * 0.01,
        ];
        this.configNumberLine.push(line);
        this.numberX.push(tempX);
        tempX += this.intervalLength;
      }
    },
    drawNumbers() {
      this.numberY = this.gameWidth * 0.175;
      for (
        let i = this.startNum, j = 0;
        i <= this.endNum;
        i += this.interval, ++j
      ) {
        let number = {};
        let offset = 0;
        if (i == 0) offset = this.gameWidth * 0.0085;
        else
          offset =
            Math.ceil(Math.log(i + 1) / Math.log(10)) * this.gameWidth * 0.0085;
        number.text = i;
        number.fontSize = this.gameWidth * 0.03;
        number.x = this.numberX[j] - offset;
        number.y = this.numberY;
        this.configNumber.push(number);
      }
    },
    drawDraggable() {
      if (image.src.includes("undefined")) {
        this.isImage = false;
        this.circleY = this.gameWidth * 0.075;
        this.configCircle.radius = this.intervalLength * 0.5;
        this.configCircle.x = this.numberX[0];
        this.configCircle.y = this.circleY;
        this.configCircle.dragBoundFunc = this.horizontalBound;
      } else {
        this.configImage.image = image;
        this.configImage.width = this.intervalLength;
        this.configImage.height = this.intervalLength;
        this.imageY = this.gameWidth * 0.075 - this.intervalLength * 0.5;
        this.configImage.x = this.numberX[0] - this.intervalLength * 0.5;
        this.configImage.y = this.imageY;
        this.configImage.dragBoundFunc = this.horizontalBound;
      }
    },
    handleDragmove(e) {
      this.configCircle.x = e.target.x();
      this.configCircle.y = e.target.y();

      /*e.target.y(Math.max(e.target.y(), 0));
      e.target.y(
        Math.min(e.target.y(), this.gameWidth * 0.5 - this.configPlane.height)
      );
      */
    },
    handleDragend(e) {
      let snapTo = 0;
      let distance = 999;
      let output = -100;
      let dragendPosition = 0;
      if (image.src.includes("undefined")) dragendPosition = e.target.x();
      else dragendPosition = e.target.x() + this.intervalLength * 0.5;
      for (
        let i = this.startNum, j = 0;
        i <= this.endNum;
        i += this.interval, ++j
      ) {
        if (Math.abs(dragendPosition - this.numberX[j]) < distance) {
          distance = Math.abs(dragendPosition - this.numberX[j]);
          snapTo = this.numberX[j];
          output = i;
        }
      }
      if (image.src.includes("undefined")) this.configCircle.x = snapTo;
      else this.configImage.x = snapTo - this.intervalLength * 0.5;

      console.log(output);
    },
    horizontalBound(pos) {
      if (this.isImage) {
        return {
          x: pos.x,
          y: this.imageY,
        };
      } else {
        return {
          x: pos.x,
          y: this.circleY,
        };
      }
    },
    update() {},
  },
};
</script>
