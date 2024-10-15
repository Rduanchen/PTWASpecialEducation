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

//const image = document.createElement("img");
//image.src = GamesGetAssetsFile("MA3029", "RacingCar.png");

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

      isImage: true,
    };
  },

  props: ["config"], //{spacing, max, min, image, init_pos}

  emits: ["get_drag_position"],

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
        ((this.config.max - this.config.min) / this.config.spacing + 1);
      let tempX = this.gameWidth * 0.05 + this.intervalLength * 0.5;
      for (
        let i = this.config.min;
        i <= this.config.max;
        i += this.config.spacing
      ) {
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
        let i = this.config.min, j = 0;
        i <= this.config.max;
        i += this.config.spacing, ++j
      ) {
        let number = {};
        let offset;
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
      let initX = 0;
      if (this.config.init_pos) {
        for (
          let i = this.config.min;
          i <= this.config.max;
          i += this.config.spacing, ++initX
        ) {
          if (i == this.config.init_pos) break;
        }
      }

      if (this.config.image.includes("undefined")) {
        this.isImage = false;
        this.circleY = this.gameWidth * 0.075;
        this.configCircle.radius = this.intervalLength * 0.5;
        this.configCircle.x = this.numberX[initX];
        this.configCircle.y = this.circleY;
        this.configCircle.dragBoundFunc = this.horizontalBound;
      } else {
        const draggableImage = document.createElement("img");
        draggableImage.src = this.config.image;

        this.configImage.image = draggableImage;
        this.configImage.width = this.intervalLength;
        this.configImage.height = this.intervalLength;
        this.imageY = this.gameWidth * 0.075 - this.intervalLength * 0.5;
        this.configImage.x = this.numberX[initX] - this.intervalLength * 0.5;
        this.configImage.y = this.imageY;
        this.configImage.dragBoundFunc = this.horizontalBound;
      }
    },
    handleDragmove(e) {
      this.configCircle.x = e.target.x();
      this.configCircle.y = e.target.y();
    },
    handleDragend(e) {
      let snapTo,
        distance = 999,
        output,
        dragendPosition;
      if (this.isImage)
        dragendPosition = e.target.x() + this.intervalLength * 0.5;
      else dragendPosition = e.target.x();
      for (
        let i = this.config.min, j = 0;
        i <= this.config.max;
        i += this.config.spacing, ++j
      ) {
        if (Math.abs(dragendPosition - this.numberX[j]) < distance) {
          distance = Math.abs(dragendPosition - this.numberX[j]);
          snapTo = this.numberX[j];
          output = i;
        }
      }
      if (this.isImage) this.configImage.x = snapTo - this.intervalLength * 0.5;
      else this.configCircle.x = snapTo;

      this.$emit("get_drag_position", output);
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
