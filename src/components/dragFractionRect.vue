<template>
  <v-layer>
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
    <v-rect
      v-if="Data.shape == 'rect'"
      :config="configRectNumerator"
      @dragend="numeratorDragEnd"
    ></v-rect>
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
    if (this.Data.shape == "rect") window.setInterval(this.rectUpdate, 20);
  },

  methods: {
    setAttributes() {
      this.numeratorSnapTo.x = this.gameWidth * 0.875;
      this.numeratorSnapTo.y = this.gameHeight * 0.2;
      this.denominatorSnapTo.x = this.gameWidth * 0.875;
      this.denominatorSnapTo.y = this.gameHeight * 0.7;
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
