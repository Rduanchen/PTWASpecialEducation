<template>
  <div ref="container">
    <canvas
      ref="canvas"
      @pointerdown="handlePointer"
      @pointermove="handlePointer"
      @pointerup="handlePointer"
      @pointerout="handlePointer"
    ></canvas>
  </div>
</template>

<script>
import { getGameAssets } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent, handleError } from "vue";
export default {
  components: {},
  data() {
    return {
      brush: {
        color: "blue",
        size: 5,
      },
      drawing: false,
    };
  },

  props: {},

  emits: [],

  mounted() {
    this.initializeScene();
  },

  methods: {
    initializeScene() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.gameWidth = this.$refs.container.clientWidth;
      this.gameHeight = this.$refs.container.clientHeight;
      this.canvas.width = this.gameWidth;
      this.canvas.height = this.gameHeight;
    },
    handlePointer(e) {
      switch (e.type) {
        case "pointerdown":
          this.drawing = true;
          this.draw(this.getPositon(e));
          break;
        case "pointermove":
          if (this.drawing) this.draw(this.getPositon(e));
          break;
        case "pointerup":
        case "pointerout":
          this.drawing = false;
          break;
      }
    },
    getPositon(e) {
      return {
        x: e.clientX - this.canvas.getBoundingClientRect().left,
        y: e.clientY - this.canvas.getBoundingClientRect().top,
      };
    },
    draw(pos) {
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, this.brush.size, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();
    },
  },
};
</script>
