<template>
  <v-layer>
    <v-circle
      v-if="Data.shape == 'circle'"
      v-for="frame in configCircleDenominator.frame"
      :config="frame"
      @dragmove="circleDenominatorDragMove"
      @dragend="circleDenominatorDragEnd"
    ></v-circle>
    <v-shape
      v-if="Data.shape == 'circle'"
      v-for="circle in configCircleDenominator.circle"
      :config="circle"
      @dragmove="circleDenominatorDragMove"
      @dragend="circleDenominatorDragEnd"
    ></v-shape>
    <v-shape
      v-if="Data.shape == 'circle'"
      v-for="slice in configCircleDenominator.slice"
      :config="slice"
    ></v-shape>
  </v-layer>
  <v-layer>
    <v-shape
      v-if="Data.shape == 'circle'"
      :config="configCircleNumerator"
      @dragend="numeratorDragEnd"
    ></v-shape>
  </v-layer>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";
export default {
  components: {},
  data() {
    return {
      numeratorSnapTo: {},
      denominatorSnapTo: {},

      configCircleNumerator: {
        draggable: true,
        fill: "#4C5B3A",
        stroke: "#4C5B3A",
      },
      configCircleDenominator: {
        frame: [],
        circle: [],
        slice: [],
      },
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

  beforeMount() {},

  mounted() {
    if (this.Data.shape == "circle") window.setInterval(this.circleUpdate, 20);
  },

  methods: {
    setAttributes() {
      this.numeratorSnapTo.x = this.gameWidth * 0.875;
      this.numeratorSnapTo.y = this.gameHeight * 0.2;
      this.denominatorSnapTo.x = this.gameWidth * 0.875;
      this.denominatorSnapTo.y = this.gameHeight * 0.7;
    },
    drawCircles() {
      this.circleRadius = this.gameWidth * 0.075;
      this.boundaries = {
        up: this.circleRadius,
        down: this.gameHeight - this.circleRadius,
        left: this.circleRadius,
        right: this.gameWidth * 0.75 - this.circleRadius,
      };
      this.drawCircleNumerator();
      this.drawCircleDenominator();
    },
    circleUpdate() {
      this.configCircleNumerator.endRadians = this.circleAnimation(
        this.configCircleNumerator.endRadians,
        (Math.PI * 2) / this.numerator
      );
      for (let i = 0; i < this.fill.length; ++i) {
        if (this.fill[i] > 0) {
          this.configCircleDenominator.circle[i].endRadians =
            this.circleAnimation(
              this.configCircleDenominator.circle[i].endRadians,
              Math.PI * 2 * this.fill[i]
            );
        }
      }
    },
    circleAnimation(currentRadians, targetRadians) {
      if (Math.abs(currentRadians - targetRadians) < 0.02) {
        currentRadians = targetRadians;
      } else if (currentRadians < targetRadians) {
        currentRadians += 0.02;
      } else if (currentRadians > targetRadians) {
        currentRadians -= 0.02;
      }
      return currentRadians;
    },
    drawCircleNumerator() {
      this.configCircleNumerator.radius = this.circleRadius;
      this.configCircleNumerator.x = this.numeratorSnapTo.x;
      this.configCircleNumerator.y = this.numeratorSnapTo.y;
      this.configCircleNumerator.startRadians = 0;
      this.configCircleNumerator.endRadians = (Math.PI * 2) / this.numerator;
      this.configCircleNumerator.sceneFunc = this.circleSceneFunc;
    },
    drawCircleDenominator() {
      let frame = {
        radius: this.circleRadius,
        x: this.denominatorSnapTo.x,
        y: this.denominatorSnapTo.y,
        fill: "white",
        stroke: "white",
        draggable: true,
        name: this.fill.length.toString(),
      };
      let circle = {
        strokeEnabled: false,
        visible: false,
        radius: this.circleRadius,
        startRadians: 0,
        endRadians: 0,
        x: this.denominatorSnapTo.x,
        y: this.denominatorSnapTo.y,
        fill: "#4C5B3A",
        sceneFunc: this.circleSceneFunc,
        draggable: true,
        name: this.fill.length.toString(),
      };
      this.configCircleDenominator.frame.push(frame);
      this.configCircleDenominator.circle.push(circle);
      this.configCircleDenominator.slice.push(this.drawCircleSlice());
      this.fill.push(0);
    },
    drawCircleSlice() {
      let slice = {
        radius: this.circleRadius,
        stroke: "black",
        x: this.denominatorSnapTo.x,
        y: this.denominatorSnapTo.y,
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
    circleDenominatorDragMove(e) {
      let id = e.target.attrs.name;
      if (this.configCircleDenominator.circle[id].visible) {
        e.target.x(Math.max(e.target.x(), this.boundaries.left));
        e.target.x(Math.min(e.target.x(), this.boundaries.right));
        e.target.y(Math.max(e.target.y(), this.boundaries.up));
        e.target.y(Math.min(e.target.y(), this.boundaries.down));
      }
      this.configCircleDenominator.frame[id].x = e.target.x();
      this.configCircleDenominator.frame[id].y = e.target.y();
      this.configCircleDenominator.circle[id].x = e.target.x();
      this.configCircleDenominator.circle[id].y = e.target.y();
      this.configCircleDenominator.slice[id].x = e.target.x();
      this.configCircleDenominator.slice[id].y = e.target.y();
    },
    circleDenominatorDragEnd(e) {
      let id = e.target.attrs.name;
      if (!this.configCircleDenominator.circle[id].visible) {
        if (canvasTools.isInBound(e.target.position(), this.boundaries)) {
          this.drawCircleDenominator();
          this.configCircleDenominator.circle[id].visible = true;
        } else {
          e.target.position(this.denominatorSnapTo);
          this.configCircleDenominator.slice[id].x = this.denominatorSnapTo.x;
          this.configCircleDenominator.slice[id].y = this.denominatorSnapTo.y;
        }
      }
    },
    addCircleFill(position) {
      for (let i = 0; i < this.fill.length; ++i) {
        if (this.configCircleDenominator.circle[i].visible) {
          if (
            canvasTools.distance(
              position,
              this.configCircleDenominator.circle[i]
            ) <= this.circleRadius
          ) {
            if (this.fill[i] + 1 / this.numerator <= 1)
              this.fill[i] += 1 / this.numerator;
            break;
          }
        }
      }
    },
  },
};
</script>
