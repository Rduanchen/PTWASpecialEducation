<template>
  <v-rect :config="configLane"></v-rect>
</template>

<script>
export default {
  data() {
    return {
      configLane: {
        x: 0,
        y: 0,
        width: 1000,
        height: 225,
        fill: "gray",
        stroke: "gray",
      },
    };
  },

  props: ["Y", "w"],

  mounted() {
    this.configLane.y = this.Y;
    this.configLane.height = this.w;
  },
};
</script>
