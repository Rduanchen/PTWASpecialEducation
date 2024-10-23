<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <v-stage :config="configKonva">
        <v-layer>
          <v-rect :config="configBG"></v-rect>
          <v-rect :config="configSideBar"></v-rect>
        </v-layer>

        <v-layer>
          <v-shape :config="configCircleNumerator"></v-shape>
          <v-circle
            v-for="denominator in configCircleDenominator"
            :config="denominator"
          ></v-circle>
          <v-circle
            v-for="frame in configCircleFrame"
            :config="frame"
          ></v-circle>
        </v-layer>
        <v-layer v-for="slice in configCircleSlice">
          <v-line v-for="line in slice" :config="line"></v-line>
        </v-layer>

        <v-layer>
          <v-shape
            v-for="arrow in configArrow"
            :config="arrow"
            @mousedown="adjustNumber"
          ></v-shape>
          <v-text :config="configNumeratorNumber"></v-text>
          <v-text :config="configDenominatorNumber"></v-text>
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
      configBG: {
        fill: "lightgray",
        stroke: "lightgray",
      },
      configSideBar: {
        fill: "gray",
        stroke: "gray",
      },

      configCircleNumerator: {
        draggable: true,
        fill: "navy",
        stroke: "navy",
      },
      configCircleDenominator: [],
      configCircleFrame: [],
      configCircleSlice: [],

      configArrow: [],
      configNumeratorNumber: {},
      configDenominatorNumber: {},

      numerator: 2,
      denominator: 2,
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
  },

  mounted() {},

  methods: {
    initializeScene() {
      this.gameWidth =
        document.getElementById("GameContainer").clientWidth * 0.5;
      this.gameHeight = this.gameWidth * 0.75;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height = this.gameHeight;
      this.configBG.width = this.gameWidth;
      this.configBG.height = this.gameHeight;
      this.configSideBar.width = this.gameWidth * 0.25;
      this.configSideBar.height = this.gameHeight;
      this.configSideBar.x = this.gameWidth * 0.75;
      this.drawCircleNumerator();
      this.drawCircleDenominator();

      this.drawArrow();
      this.drawNumber();
    },
    update() {},

    drawCircleNumerator() {
      this.configCircleNumerator.radius = this.gameWidth * 0.075;
      this.configCircleNumerator.x = this.gameWidth * 0.875;
      this.configCircleNumerator.y = this.gameHeight * 0.2;
      this.configCircleNumerator.startRadians = Math.PI * 1.5;
      this.configCircleNumerator.endRadians =
        Math.PI * (2 / this.numerator - 0.5);
      this.configCircleNumerator.sceneFunc = this.circleSceneFunc;
    },
    drawCircleDenominator() {
      let denominator = {
        radius: this.gameWidth * 0.075,
        x: this.gameWidth * 0.875,
        y: this.gameHeight * 0.7,
        fill: "navy",
        stroke: "navy",
      };
      this.configCircleDenominator.push(denominator);
    },
    circleSceneFunc(context, shape) {
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(
        0,
        0,
        shape.getAttr("radius"),
        shape.getAttr("startRadians"),
        shape.getAttr("endRadians")
      );
      context.lineTo(0, 0);
      context.fillStrokeShape(shape);
      context.closePath();
    },

    drawArrow() {
      let arrowPosition = [
        {
          x: this.gameWidth * 0.825,
          y: this.gameHeight * 0.35,
          operator: "numeratorMinus",
        },
        {
          x: this.gameWidth * 0.925,
          y: this.gameHeight * 0.35,
          operator: "numeratorPlus",
        },
        {
          x: this.gameWidth * 0.825,
          y: this.gameHeight * 0.85,
          operator: "denominatorMinus",
        },
        {
          x: this.gameWidth * 0.925,
          y: this.gameHeight * 0.85,
          operator: "denominatorPlus",
        },
      ];
      for (let pos in arrowPosition) {
        let arrow = {
          stroke: "brown",
          fill: "brown",
          length: this.gameWidth * 0.05,
          sceneFunc: this.arrowSceneFunc,
        };
        arrow.x = arrowPosition[pos].x;
        arrow.y = arrowPosition[pos].y;
        arrow.operator = arrowPosition[pos].operator;
        this.configArrow.push(arrow);
      }
    },
    arrowSceneFunc(context, shape) {
      let length = shape.getAttr("length");
      context.beginPath();
      context.moveTo(0, length * -0.5);
      context.lineTo(0, length * 0.5);
      if (shape.getAttr("operator").includes("Plus"))
        context.lineTo(length * 0.5 * Math.sqrt(3), 0);
      else if (shape.getAttr("operator").includes("Minus"))
        context.lineTo(length * -0.5 * Math.sqrt(3), 0);
      context.lineTo(0, length * -0.5);
      context.fillStrokeShape(shape);
      context.closePath();
    },
    drawNumber() {
      this.configNumeratorNumber.x = this.gameWidth * 0.85;
      this.configNumeratorNumber.y = this.gameHeight * 0.325;
      this.configNumeratorNumber.text = this.numerator;
      this.configNumeratorNumber.fontSize = this.gameWidth * 0.05;

      this.configDenominatorNumber.x = this.gameWidth * 0.85;
      this.configDenominatorNumber.y = this.gameHeight * 0.825;
      this.configDenominatorNumber.text = this.denominator;
      this.configDenominatorNumber.fontSize = this.gameWidth * 0.05;
    },
    adjustNumber(e) {},
  },
};
</script>
