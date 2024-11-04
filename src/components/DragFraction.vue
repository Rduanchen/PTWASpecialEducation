<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <v-stage :config="configKonva">
        <v-layer>
          <v-rect :config="configBG"></v-rect>
          <v-rect :config="configSideBar"></v-rect>
        </v-layer>

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

          <v-rect
            v-if="Data.shape == 'rect'"
            v-for="frame in configRectDenominator.frame"
            :config="frame"
            @dragmove="rectDenominatorDragMove"
            @dragend="rectDenominatorDragEnd"
          ></v-rect>
          <v-rect
            v-if="Data.shape == 'rect'"
            v-for="rect in configRectDenominator.rect"
            :config="rect"
            @dragmove="rectDenominatorDragMove"
            @dragend="rectDenominatorDragEnd"
          ></v-rect>
          <v-shape
            v-if="Data.shape == 'rect'"
            v-for="slice in configRectDenominator.slice"
            :config="slice"
          ></v-shape>
        </v-layer>

        <v-layer>
          <v-shape
            v-if="Data.shape == 'circle'"
            :config="configCircleNumerator"
            @dragend="numeratorDragEnd"
          ></v-shape>

          <v-rect
            v-if="Data.shape == 'rect'"
            :config="configRectNumerator"
            @dragend="numeratorDragEnd"
          ></v-rect>
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
import { left } from "@popperjs/core";
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

      configRectNumerator: {
        draggable: true,
        fill: "#4C5B3A",
        stroke: "#4C5B3A",
      },
      configRectDenominator: {
        frame: [],
        rect: [],
        slice: [],
      },

      configArrow: [],
      configNumeratorNumber: {},
      configDenominatorNumber: {},
      fill: [],

      numerator: 3,
      denominator: 3,
    };
  },

  props: ["Data", "ID"],

  emits: ["play-effect", "add-record", "next-question"],

  beforeMount() {
    this.initializeScene();
  },

  mounted() {
    if (this.Data.shape == "circle") window.setInterval(this.circleUpdate, 20);
    if (this.Data.shape == "rect") window.setInterval(this.rectUpdate, 20);
  },

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
      this.setAttributes();
      if (this.Data.shape == "circle") {
        this.drawCircles();
      } else if (this.Data.shape == "rect") {
        this.drawRects();
      }
      this.drawArrow();
      this.drawNumber();
      this.drawBoundaries();
    },
    setAttributes() {
      this.numeratorSnapTo.x = this.gameWidth * 0.875;
      this.numeratorSnapTo.y = this.gameHeight * 0.2;
      this.denominatorSnapTo.x = this.gameWidth * 0.875;
      this.denominatorSnapTo.y = this.gameHeight * 0.7;
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
    drawBoundaries() {
      if (this.Data.shape == "circle") {
        let radius = this.circleRadius;
      } else if (this.Data.shape == "rect") {
      }
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
      if (this.Data.shape == "circle") {
        this.configCircleDenominator.slice[this.fill.length - 1].slices =
          this.denominator;
      } else if (this.Data.shape == "rect") {
      }

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
      if (this.Data.shape == "circle") this.addCircleFill(e.target.position());
      else if (this.Data.shape == "rect") this.addRectFill(e.target.position());
      e.target.x(this.numeratorSnapTo.x);
      e.target.y(this.numeratorSnapTo.y);
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

    drawRects() {
      this.rectAttr = {
        width: this.gameWidth * 0.2,
        height: this.gameHeight * 0.15,
      };
      this.boundaries = {
        up: 0,
        down: this.gameHeight - this.rectAttr.height,
        left: 0,
        right: this.gameWidth * 0.75 - this.rectAttr.width,
      };
      this.adjustSnapTo();
      this.drawRectNumerator();
      this.drawRectDenominator();
    },
    adjustSnapTo() {
      this.numeratorSnapTo = canvasTools.corner({
        x: this.numeratorSnapTo.x,
        y: this.numeratorSnapTo.y,
        width: this.rectAttr.width,
        height: this.rectAttr.height,
      });
      this.denominatorSnapTo = canvasTools.corner({
        x: this.denominatorSnapTo.x,
        y: this.denominatorSnapTo.y,
        width: this.rectAttr.width,
        height: this.rectAttr.height,
      });
    },
    rectUpdate() {
      this.configRectNumerator.width = this.rectAnimation(
        this.configRectNumerator.width,
        (this.gameWidth * 0.2) / this.numerator
      );
      for (let i = 0; i < this.fill.length; ++i) {
        if (this.fill[i] > 0) {
          this.configRectDenominator.rect[i].width = this.rectAnimation(
            this.configRectDenominator.rect[i].width,
            this.rectAttr.width * this.fill[i]
          );
        }
      }
    },
    rectAnimation(currentWidth, targetWidth) {
      if (Math.abs(currentWidth - targetWidth) < 1) {
        currentWidth = targetWidth;
      } else if (currentWidth < targetWidth) {
        currentWidth += 1;
      } else if (currentWidth > targetWidth) {
        currentWidth -= 1;
      }
      return currentWidth;
    },
    drawRectNumerator() {
      this.configRectNumerator.width = this.rectAttr.width / this.numerator;
      this.configRectNumerator.height = this.rectAttr.height;
      this.configRectNumerator.x = this.numeratorSnapTo.x;
      this.configRectNumerator.y = this.numeratorSnapTo.y;
    },
    drawRectDenominator() {
      let frame = {
        width: this.rectAttr.width,
        height: this.rectAttr.height,
        x: this.denominatorSnapTo.x,
        y: this.denominatorSnapTo.y,
        fill: "white",
        stroke: "white",
        draggable: true,
        name: this.fill.length.toString(),
      };
      let rect = {
        strokeEnabled: false,
        visible: false,
        width: 0,
        height: this.rectAttr.height,
        x: this.denominatorSnapTo.x,
        y: this.denominatorSnapTo.y,
        fill: "#4C5B3A",
        draggable: true,
        name: this.fill.length.toString(),
      };
      this.configRectDenominator.frame.push(frame);
      this.configRectDenominator.rect.push(rect);
      this.configRectDenominator.slice.push(this.drawRectSlice());
      this.fill.push(0);
    },
    drawRectSlice() {
      let slice = {
        width: this.rectAttr.width,
        height: this.rectAttr.height,
        stroke: "black",
        x: this.denominatorSnapTo.x,
        y: this.denominatorSnapTo.y,
        sceneFunc: this.rectSliceSceneFunc,
        slices: this.denominator,
      };
      return slice;
    },
    rectSliceSceneFunc(context, shape) {
      context.beginPath();
      context.setLineDash([5, 5]);
      let sliceWidth = shape.getAttr("width") / shape.getAttr("slices");
      for (let i = 1; i < shape.getAttr("slices"); ++i) {
        context.moveTo(sliceWidth * i, 0);
        context.lineTo(sliceWidth * i, shape.getAttr("height"));
      }
      context.stroke();
      context.closePath();
    },
    rectDenominatorDragMove(e) {
      let id = e.target.attrs.name;
      if (this.configRectDenominator.rect[id].visible) {
        e.target.x(Math.max(e.target.x(), this.boundaries.left));
        e.target.x(Math.min(e.target.x(), this.boundaries.right));
        e.target.y(Math.max(e.target.y(), this.boundaries.up));
        e.target.y(Math.min(e.target.y(), this.boundaries.down));
      }
      this.configRectDenominator.frame[id].x = e.target.x();
      this.configRectDenominator.frame[id].y = e.target.y();
      this.configRectDenominator.rect[id].x = e.target.x();
      this.configRectDenominator.rect[id].y = e.target.y();
      this.configRectDenominator.slice[id].x = e.target.x();
      this.configRectDenominator.slice[id].y = e.target.y();
    },
    rectDenominatorDragEnd(e) {
      let id = e.target.attrs.name;
      if (!this.configRectDenominator.rect[id].visible) {
        if (canvasTools.isInBound(e.target.position(), this.boundaries)) {
          this.drawRectDenominator();
          this.configRectDenominator.rect[id].visible = true;
        } else {
          e.target.position(this.denominatorSnapTo);
          this.configRectDenominator.slice[id].x = this.denominatorSnapTo.x;
          this.configRectDenominator.slice[id].y = this.denominatorSnapTo.y;
        }
      }
    },
    addRectFill(position) {
      for (let i = 0; i < this.fill.length; ++i) {
        if (this.configRectDenominator.rect[i].visible) {
          let range = {
            up: this.configRectDenominator.rect[i].y,
            down: this.configRectDenominator.rect[i].y + this.rectAttr.height,
            left: this.configRectDenominator.rect[i].x,
            right: this.configRectDenominator.rect[i].x + this.rectAttr.width,
          };
          if (canvasTools.isInBound(position, range)) {
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
