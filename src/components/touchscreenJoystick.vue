<template>
  <v-circle :config="configBase"></v-circle>
  <v-circle :config="configStick"></v-circle>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";

export default {
  data() {
    return {
      configBase: {
        x: 100,
        y: 100,
        stroke: "brown",
        fill: "brown",
        opacity: 0.3,
      },

      configStick: {
        x: 100,
        y: 100,
        stroke: "brown",
        fill: "brown",
      },
    };
  },

  props: ["laneWidth"],

  mounted() {
    this.configBase.radius = Math.round(this.laneWidth * 1.5);
    this.configStick.radius = Math.round(this.laneWidth * 0.5);
  },

  methods: {},
};
</script>
