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
          <v-image :config="configImage" @dragmove="keepInBound"></v-image>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import { getGameAssets } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";
export default {
  components: {},
  data() {
    return {
      configKonva: {},
      configImage: {
        draggable: true,
      },
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
    this.initializeScene();
    this.setGrid();
    this.drawGrid();
    this.drawImage();
  },

  mounted() {},

  methods: {
    initializeScene() {
      this.gameWidth = document.getElementById("GameContainer").clientWidth;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height = this.gameWidth;
      this.gridWidth = this.gameWidth / this.ratio.width;
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
    drawImage() {
      const image = new window.Image();
      image.src = getGameAssets(this.ID, this.Data.image);
      this.configImage.image = image;
      this.configImage.x = this.gridWidth;
      this.configImage.y = this.gridWidth;
      this.configImage.width = this.gridWidth * this.Data.imageRatio[0];
      this.configImage.height = this.gridWidth * this.Data.imageRatio[1];
    },
    keepInBound(e) {
      e.target.x(Math.max(e.target.x(), 0));
      e.target.x(
        Math.min(e.target.x(), this.gameWidth - this.configImage.width)
      );
      e.target.y(Math.max(e.target.y(), 0));
      e.target.y(
        Math.min(e.target.y(), this.gameWidth - this.configImage.height)
      );
    },
  },
};
</script>
