<template>
  <v-circle :config="configPlayer"></v-circle>
</template>

<script>
export default {
  data() {
    return {
      configPlayer: {
        fill: "yellow",
        stroke: "yellow",
      },
    };
  },

  props: ["x", "y", "width"],

  mounted() {
    this.configPlayer.radius = Math.floor(this.width * 0.35);
    this.configPlayer.x = this.x;
    this.configPlayer.y = this.y;
    //console.log(this.x, this.y);
    this.Update = window.setInterval(this.update, 20);
  },

  methods: {
    update() {
      this.configPlayer.x = this.x;
      this.configPlayer.y = this.y;
    },
  },
};
</script>
