<template>
  <div ref="container">
    <v-stage :config="configKonva">
      <v-layer>
        <v-rect :config="configBG"></v-rect>
        <v-rect :config="configSideBar"></v-rect>
      </v-layer>
      <v-layer v-if="Data.shape == 'circle'">
        <circleFraction
          :gameWidth="gameWidth"
          :gameHeight="gameHeight"
          :numerator="numerator"
          :denominator="denominator"
          @addFill="addFill"
        ></circleFraction>
      </v-layer>

      <v-layer v-if="Data.shape == 'rect'">
        <rectFraction
          :gameWidth="gameWidth"
          :gameHeight="gameHeight"
          :numerator="numerator"
          :denominator="denominator"
          @addFill="addFill"
        ></rectFraction>
      </v-layer>
      <v-layer>
        <v-shape
          v-for="arrow in configArrow"
          :config="arrow"
          @pointerdown="adjustNumber"
        ></v-shape>
        <v-text :config="configNumeratorNumber"></v-text>
        <v-text :config="configDenominatorNumber"></v-text>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { getGameAssets } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    circleFraction: defineAsyncComponent(() =>
      import(
        "@/components/components-utilitys/drag-fraction/DragFractionCircle.vue"
      )
    ),
    rectFraction: defineAsyncComponent(() =>
      import(
        "@/components/components-utilitys/drag-fraction/DragFractionRect.vue"
      )
    ),
  },
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

      gameWidth: 0,
      gameHeight: 0,

      configArrow: [],
      configNumeratorNumber: {},
      configDenominatorNumber: {},
      fill: [],

      numerator: 3,
      denominator: 3,
    };
  },

  props: ["Data", "ID"],

  emits: ["replyAnswer"],

  mounted() {
    this.initializeScene();
  },

  methods: {
    initializeScene() {
      this.gameWidth = this.$refs.container.clientWidth;
      this.gameHeight = this.gameWidth * 0.75;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height = this.gameHeight;
      this.configBG.width = this.gameWidth;
      this.configBG.height = this.gameHeight;
      this.configSideBar.width = this.gameWidth * 0.25;
      this.configSideBar.height = this.gameHeight;
      this.configSideBar.x = this.gameWidth * 0.75;
      this.drawArrow();
      this.drawNumber();
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
    addFill(fill) {
      let total = 0;
      for (let fraction in fill) {
        total += fill[fraction];
      }
      if (this.Data.verifyOption == "answer") {
        let answer = this.Data.answer.numerator / this.Data.answer.denominator;
        if (answer.toFixed(2) == total.toFixed(2)) {
          this.$emit("replyAnswer", true);
        } else {
          this.$emit("replyAnswer", false);
        }
      } else if (this.Data.verifyOption == "value") {
        this.$emit("replyAnswer", total.toFixed(2));
      }
    },
  },
};
</script>
