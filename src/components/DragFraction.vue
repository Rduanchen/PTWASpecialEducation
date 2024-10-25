<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <v-stage :config="configKonva">
        <v-layer>
          <v-rect :config="configBG"></v-rect>
          <v-rect :config="configSideBar"></v-rect>
        </v-layer>

        <v-layer>
          <v-shape
            :config="configCircleNumerator"
            @dragend="numeratorDragEnd"
          ></v-shape>
        </v-layer>
        <v-layer
          v-for="denominator in configCircleDenominator"
          :draggable="true"
          @dragend="denominatorDragEnd"
        >
          <v-circle :config="denominator.frame"></v-circle>
          <v-shape :config="denominator.circle"></v-shape>
          <v-shape :config="denominator.slice"></v-shape>
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
        fill: "#DDF0FF",
        stroke: "#DDF0FF",
      },
      configSideBar: {
        fill: "#84919B",
        stroke: "#84919B",
      },

      configCircleNumerator: {
        draggable: true,
        fill: "#4C5B3A",
        stroke: "#4C5B3A",
      },
      numeratorPos: {},
      denominatorPos: {},
      configCircleDenominator: [],

      configArrow: [],
      configNumeratorNumber: {},
      configDenominatorNumber: {},
      fill: [],

      numerator: 3,
      denominator: 3,
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
      this.numeratorPos.x = this.gameWidth * 0.875;
      this.numeratorPos.y = this.gameHeight * 0.2;
      this.configCircleNumerator.radius = this.gameWidth * 0.075;
      this.configCircleNumerator.x = this.numeratorPos.x;
      this.configCircleNumerator.y = this.numeratorPos.y;
      this.configCircleNumerator.startRadians = 0;
      this.configCircleNumerator.endRadians = (Math.PI * 2) / this.numerator;
      this.configCircleNumerator.sceneFunc = this.circleSceneFunc;
    },
    drawCircleDenominator() {
      this.denominatorPos.x = this.gameWidth * 0.875;
      this.denominatorPos.y = this.gameHeight * 0.7;
      let denominator = {};
      let frame = {
        radius: this.gameWidth * 0.075,
        x: this.denominatorPos.x,
        y: this.denominatorPos.y,
        fill: "white",
        stroke: "white",
      };
      let circle = {
        visible: false,
        radius: this.gameWidth * 0.075,
        startRadians: 0,
        endRadians: 0,
        x: this.denominatorPos.x,
        y: this.denominatorPos.y,
        fill: "#4C5B3A",
        stroke: "#4C5B3A",
        sceneFunc: this.circleSceneFunc,
      };
      denominator.frame = frame;
      denominator.circle = circle;
      denominator.slice = this.drawCircleSlice();
      this.configCircleDenominator.push(denominator);
      this.fill.push(0.3);
    },
    drawCircleSlice() {
      let slice = {
        radius: this.gameWidth * 0.075,
        stroke: "black",
        x: this.denominatorPos.x,
        y: this.denominatorPos.y,
        sceneFunc: this.circleSliceSceneFunc,
        slices: this.denominator,
      };
      return slice;
    },
    circleSceneFunc(context, shape) {
      context.beginPath();
      context.moveTo(0, 0);
      context.rotate(Math.PI * -0.5);
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
    circleSliceSceneFunc(context, shape) {
      context.beginPath();
      context.setLineDash([5, 5]);
      for (let i = 0; i < shape.getAttr("slices"); ++i) {
        context.moveTo(0, 0);
        context.lineTo(0, -shape.getAttr("radius"));
        context.moveTo(0, 0);
        context.rotate((Math.PI * 2) / shape.getAttr("slices"));
      }
      context.stroke();
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
          stroke: "#BA3F38",
          fill: "#BA3F38",
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
    adjustNumber(e) {
      switch (e.target.attrs.operator) {
        case "numeratorMinus":
          if (this.numerator > 2) this.numerator--;
          break;
        case "numeratorPlus":
          if (this.numerator < 12) this.numerator++;
          break;
        case "denominatorMinus":
          if (this.denominator > 2) this.denominator--;
          break;
        case "denominatorPlus":
          if (this.denominator < 12) this.denominator++;
          break;
      }
      this.drawAfterAdjusted();
    },
    drawAfterAdjusted() {
      this.configNumeratorNumber.text = this.numerator;
      this.configDenominatorNumber.text = this.denominator;
      this.configCircleNumerator.endRadians = (Math.PI * 2) / this.numerator;
      this.configCircleDenominator[0].slice.slices = this.denominator;
      if (this.numerator == 2) {
        this.configArrow[0].fill = "#505050";
        this.configArrow[0].stroke = "#505050";
      } else if (this.numerator == 12) {
        this.configArrow[1].fill = "#505050";
        this.configArrow[1].stroke = "#505050";
      } else {
        this.configArrow[0].fill = "#BA3F38";
        this.configArrow[0].stroke = "#BA3F38";
        this.configArrow[1].fill = "#BA3F38";
        this.configArrow[1].stroke = "#BA3F38";
      }

      if (this.denominator == 2) {
        this.configArrow[2].fill = "#505050";
        this.configArrow[2].stroke = "#505050";
      } else if (this.denominator == 12) {
        this.configArrow[3].fill = "#505050";
        this.configArrow[3].stroke = "#505050";
      } else {
        this.configArrow[2].fill = "#BA3F38";
        this.configArrow[2].stroke = "#BA3F38";
        this.configArrow[3].fill = "#BA3F38";
        this.configArrow[3].stroke = "#BA3F38";
      }
    },

    numeratorDragEnd(e) {
      e.target.x(this.numeratorPos.x);
      e.target.y(this.numeratorPos.y);
    },
    denominatorDragEnd(e) {
      let id = e.target.index - 2;
      let boundaries = {};

      if (this.configCircleDenominator[id].circle.x > this.gameWidth * 0.75) {
        console.log(e.target.position());
        console.log(e.target.absolutePosition());
        e.target.x(0);
        e.target.y(0);
      }
    },
  },
};
</script>
