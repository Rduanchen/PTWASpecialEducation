<template>
  <div class="gameContainer" ref="container">
    <v-stage :config="configKonva">
      <v-layer>
        <v-line v-for="line in configNumberLine" :config="line"></v-line>
        <v-circle v-for="circle in configCircle" :config="circle"></v-circle>
        <v-text v-for="number in configNumber" :config="number"></v-text>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
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
      configCircle: [],

      configNumberLine: [],
      configNumber: [],
      numberX: [],

      startNum: 0,
      endNum: 300,

      isImage: true,

      config: {
        spacing: 50,
        max: 300,
        min: 0,
        init_pos: 0,
        blank_pos: {
          200: 1,
        },
      },
    };
  },

  // props: ["config"], //{spacing, max, min, image, init_pos}

  beforeMount() {},
  mounted() {
    this.initializeScene();
    this.initializeNumberLine();
  },
  methods: {
    initializeScene() {
      this.gameWidth = this.$refs.container.clientWidth;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height = this.gameWidth / 4;
      this.configBG.width = this.gameWidth;
      this.configBG.height = this.gameWidth / 4;
    },
    initializeNumberLine() {
      this.drawBaseLine();
      this.drawNumberLine();
      this.drawNumbers();
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

        if (this.config.blank_pos[i]) {
          number.text = this.config.blank_pos[i];
          this.configCircle.push({
            x: this.numberX[j],
            y: this.numberY,
            radius: this.gameWidth * 0.01,
            fill: "black",
          });
        } else {
          number.text = i;
        }
        number.fontSize = this.gameWidth * 0.03;
        number.x = this.numberX[j] - offset;
        number.y = this.numberY;
        this.configNumber.push(number);
      }
    },
  },
};
</script>
