<template>
  <v-circle :config="configBase" @touchmove="getTouchPosition"></v-circle>
  <v-circle :config="configStick"></v-circle>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";

export default {
  data() {
    return {
      configBase: {
        stroke: "white",
        fill: "white",
        opacity: 0.3,
        visible: false,
      },

      configStick: {
        stroke: "white",
        fill: "white",
        visible: false,
      },
      touchPosition: {
        x: 0,
        y: 0,
      },
    };
  },

  props: ["laneWidth", "position", "visible"],

  emits: ["move"],

  mounted() {
    this.configBase.radius = Math.round(this.laneWidth * 1.5);
    this.configStick.radius = Math.round(this.laneWidth * 0.5);
    this.game = setInterval(this.update, 20);
  },

  methods: {
    update() {
      if (this.configBase.visible) {
        if (!this.visible) {
          this.$emit("move", "idle");
          this.configBase.visible = false;
          this.configStick.visible = false;
        } else {
          this.moveStick();
          this.getDirection();
        }
      } else {
        if (this.visible) {
          this.configBase.visible = true;
          this.configStick.visible = true;
          this.configBase.x = this.position.x;
          this.configBase.y = this.position.y;
          this.configStick.x = this.position.x;
          this.configStick.y = this.position.y;
          this.touchPosition.x = this.position.x;
          this.touchPosition.y = this.position.y;
        }
      }
    },
    getTouchPosition(e) {
      this.touchPosition = e.target.getStage().getPointerPosition();
    },
    moveStick() {
      this.configStick.x = this.touchPosition.x;
      this.configStick.y = this.touchPosition.y;
    },
    getDirection() {
      if (
        this.configStick.x -
          this.position.x -
          (this.configStick.y - this.position.y) <
          0 &&
        this.configStick.x -
          this.position.x +
          (this.configStick.y - this.position.y) <
          0
      ) {
        this.$emit("move", "left");
      } else if (
        this.configStick.x -
          this.position.x -
          (this.configStick.y - this.position.y) >
          0 &&
        this.configStick.x -
          this.position.x +
          (this.configStick.y - this.position.y) >
          0
      ) {
        this.$emit("move", "right");
      } else if (
        this.configStick.x -
          this.position.x -
          (this.configStick.y - this.position.y) >
          0 &&
        this.configStick.x -
          this.position.x +
          (this.configStick.y - this.position.y) <
          0
      ) {
        this.$emit("move", "up");
      } else if (
        this.configStick.x -
          this.position.x -
          (this.configStick.y - this.position.y) <
          0 &&
        this.configStick.x -
          this.position.x +
          (this.configStick.y - this.position.y) >
          0
      ) {
        this.$emit("move", "down");
      }
    },
  },
};
</script>
