<template>
  <v-circle :config="configMole" @click="whacked" @touch="whacked"></v-circle>
  <v-rect :config="configSign" @click="whacked" @touch="whacked"></v-rect>
  <v-text :config="configOption" @click="whacked" @touch="whacked"></v-text>
</template>

<script>
export default {
  data() {
    return {
      configMole: {
        x: 0,
        y: 0,
        radius: 40,
        stroke: "brown",
        fill: "brown",
      },
      configSign: {
        x: 0,
        y: 0,
        width: 200,
        height: 60,
        stroke: "gray",
        fill: "gray",
        visible: false,
      },
      configOption: {
        x: 0,
        y: 0,
        stroke: "black",
        text: "test",
        fontSize: 50,
        visible: false,
      },
    };
  },

  props: ["X", "Y", "width", "moleId", "option"],

  emits: ["showSign", "whacked"],

  mounted() {
    this.configMole.radius = Math.floor(this.width * 0.04);
    this.configMole.x = this.X;
    this.configMole.y = this.Y + this.configMole.radius;
    this.configSign.width = Math.floor(this.width * 0.2);
    this.configSign.height = Math.floor(this.width * 0.06);
    this.configSign.x = this.X - this.configSign.width / 2;
    this.configSign.y = this.Y - Math.floor(this.width * 0.1);
    this.configOption.fontSize = Math.floor(this.width * 0.05);
    this.configOption.x =
      this.X - this.configSign.width / 2 + Math.floor(this.width * 0.01);
    this.configOption.y = this.Y - Math.floor(this.width * 0.09);
    var random = Math.random() * 5000;
    setTimeout(() => {
      this.updateInterval = setInterval(this.update, 20);
      this.status = "up";
    }, random);
  },

  methods: {
    update() {
      if (this.status == "up") {
        this.goUp();
      } else if (this.status == "down") {
        this.goDown();
      }
    },
    goUp() {
      this.configOption.text = this.option;
      this.configMole.y--;
      if (this.configMole.y <= this.Y) {
        this.configSign.visible = true;
        this.configOption.visible = true;
        this.status = "wait";
        setTimeout(() => {
          this.status = "down";
          this.configSign.visible = false;
          this.configOption.visible = false;
        }, 2000);
      } else if (this.configMole.y <= this.Y + 1) {
        this.$emit("showSign", this.moleId);
      }
    },
    goDown() {
      this.configMole.y++;
      if (this.configMole.y >= this.Y + this.configMole.radius) {
        this.status = "wait";
        var random = Math.random() * 5000;
        setTimeout(() => {
          this.status = "up";
        }, random);
      }
    },
    whacked() {
      this.configSign.visible = false;
      this.configOption.visible = false;
      //console.log(this.moleId);
      this.$emit("whacked", this.option);
      this.status = "down";
    },
  },
};
</script>
