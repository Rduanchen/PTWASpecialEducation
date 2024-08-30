<template>
  <v-circle :config="configGhost"></v-circle>
</template>

<script>
export default {
  data() {
    return {
      configGhost: {
        fill: "red",
        stroke: "red",
      },
    };
  },

  props: ["x", "y", "width"],

  mounted() {
    this.configGhost.radius = Math.floor(this.width * 0.35);
    this.configGhost.x = this.x;
    this.configGhost.y = this.y;
    //console.log(this.x, this.y);
    this.Update = window.setInterval(this.update, 20);
  },

  methods: {
    update() {
      this.configGhost.x = this.x;
      this.configGhost.y = this.y;
    },
  },
};
</script>
