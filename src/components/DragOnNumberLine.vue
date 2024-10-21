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

      configNumberLine: [],
      configNumber: [],
      numberX: [],

      startNum: 0,
      endNum: 300,

      isImage: true,
    };
  },

  props: ["Data", "ID"], //{spacing, max, min, image, init_pos}

  emits: ["getDragPosition"],

  beforeMount() {
    this.initializeScene();
    this.initializeNumberLine();
  },

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
        ((this.Data.max - this.Data.min) / this.Data.spacing + 1);
      let tempX = this.gameWidth * 0.05 + this.intervalLength * 0.5;
      for (let i = this.Data.min; i <= this.Data.max; i += this.Data.spacing) {
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
        let i = this.Data.min, j = 0;
        i <= this.Data.max;
        i += this.Data.spacing, ++j
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
      let initId = 0;
      if (this.Data.init_pos) initId = this.getInitialPositionId();

      if (GamesGetAssetsFile(this.ID, this.Data.image).includes("undefined"))
        this.isImage = false;

      let configDraggable = {
        x: this.numberX[initId],
        y: this.gameWidth * 0.075,
        draggable: true,
        dragBoundFunc: this.horizontalBound,
      };

      if (this.isImage) {
        const draggableImage = new window.Image();
        draggableImage.src = GamesGetAssetsFile(this.ID, this.Data.image);
        configDraggable.image = draggableImage;
        configDraggable.width = this.intervalLength;
        configDraggable.height = this.intervalLength;
        configDraggable.x = canvasTools.corner(configDraggable).x;
        configDraggable.y = canvasTools.corner(configDraggable).y;
        this.configImage = configDraggable;
      } else {
        configDraggable.radius = this.intervalLength * 0.5;
        configDraggable.fill = "green";
        configDraggable.stroke = "green";
        this.configCircle = configDraggable;
      }
    },
    getInitialPositionId() {
      let initId = 0;
      for (
        let i = this.Data.min;
        i <= this.Data.max;
        i += this.Data.spacing, ++initId
      ) {
        if (i == this.Data.init_pos) return initId;
      }
    },
    handleDragend(e) {
      let snapTo,
        distance = 999,
        output,
        dragendPosition;
      if (this.isImage) {
        this.configImage.x = e.target.x();
        dragendPosition = canvasTools.center(this.configImage).x;
      } else {
        this.configCircle.x = e.target.x();
        dragendPosition = this.configCircle.x;
      }

      for (
        let i = this.Data.min, j = 0;
        i <= this.Data.max;
        i += this.Data.spacing, ++j
      ) {
        if (Math.abs(dragendPosition - this.numberX[j]) < distance) {
          distance = Math.abs(dragendPosition - this.numberX[j]);
          snapTo = this.numberX[j];
          output = i;
        }
      }

      if (this.isImage) e.target.x(snapTo - this.configImage.width * 0.5);
      else this.configCircle.x = e.target.x(snapTo);

      this.$emit("getDragPosition", output);
    },
    horizontalBound(pos) {
      if (this.isImage) {
        return {
          x: pos.x,
          y: this.configImage.y,
        };
      } else {
        return {
          x: pos.x,
          y: this.configCircle.y,
        };
      }
    },
  },
};
</script>
