<template>
  <v-rect :config="configBound"></v-rect>
</template>

<script>
export default {
  data() {
    return {
      configBound: {
        fill: "blue",
        stroke: "blue",
      },
    };
  },

  props: ["x", "y", "width"],

  mounted() {
    this.configBound.width = this.width - 2;
    this.configBound.height = this.width - 2;
    this.configBound.x = this.x;
    this.configBound.y = this.y;
    //console.log(this.x, this.y);
  },
};
</script>
