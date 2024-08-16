<template>
  <v-rect :config="configSlot"></v-rect>
</template>

<script>
export default {
  data() {
    return {
      configSlot: {
        x: 0,
        y: 0,
        width: 100,
        height: 80,
        stroke: "black",
        fill: "black",
      },
    };
  },

  props: ["X", "Y", "width"],

  mounted() {
    console.log("hole" + this.width);
    this.configSlot.width = Math.floor(this.width * 0.1);
    this.configSlot.height = Math.floor(this.width * 0.08);
    this.configSlot.x = this.X - this.configSlot.width / 2;
    this.configSlot.y = this.Y;
  },

  methods: {},
};
</script>
