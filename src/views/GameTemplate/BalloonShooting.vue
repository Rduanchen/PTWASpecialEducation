<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <h2>{{ GameData.Question }}</h2>
      <v-stage
        :config="configKonva"
        @mousedown="aimStart"
        @mousemove="aimMove"
        @mouseup="shoot"
        @touchstart="aimStart"
        @touchmove="aimMove"
        @touchend="shoot"
      >
        <v-layer>
          <v-rect :config="configBG"></v-rect>
        </v-layer>

        <v-layer>
          <v-circle
            v-for="balloon in configBalloon"
            :config="balloon"
          ></v-circle>
          <v-text v-for="option in configOptions" :config="option"></v-text>
        </v-layer>
        <v-layer>
          <v-circle v-if="isAiming" :config="configScope"></v-circle>
          <v-line
            v-if="isAiming"
            v-for="line in configCross"
            :config="line"
          ></v-line>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";

export default {
  components: {},
  data() {
    return {
      configKonva: {},

      configBG: {
        fill: "gray",
        stroke: "gray",
      },
      configScope: {
        stroke: "red",
      },
      configCross: [
        {
          stroke: "red",
        },
        {
          stroke: "red",
        },
      ],

      configBalloon: [],
      configOptions: [],
      balloonTemplate: ["pink", "lightblue", "yellow"],

      speed: 2,
      isAiming: false,

      allOptions: [],
      trueOptions: [],
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

  beforeMount() {
    this.initializeScene();
    this.initializeOptions();
  },

  mounted() {
    this.balloonSpawner();
    this.game = window.setInterval(this.update, 20);
    this.spawner = window.setInterval(this.balloonSpawner, 1000);
  },

  methods: {
    initializeScene() {
      this.gameWidth =
        document.getElementById("GameContainer").clientWidth * 0.8;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height = this.gameWidth / 2;
      this.configBG.width = this.gameWidth;
      this.configBG.height = this.gameWidth / 2;
      this.configScope.radius = this.gameWidth * 0.08;
    },
    initializeOptions() {
      this.allOptions = this.GameData.True.concat(this.GameData.False);
      this.trueOptions = this.GameData.True;
    },
    update() {
      this.moveBalloon();
    },

    balloonSpawner() {
      let balloonType = Math.floor(Math.random() * this.balloonTemplate.length);
      let balloon = {};
      balloon.radius = this.gameWidth * 0.07;
      balloon.y = this.gameWidth * 0.5 + balloon.radius;
      balloon.x =
        Math.random() * (this.gameWidth - balloon.radius * 2) + balloon.radius;
      balloon.fill = this.balloonTemplate[balloonType];
      balloon.stroke = this.balloonTemplate[balloonType];
      this.configBalloon.push(balloon);

      let option = canvasTools.offset(balloon, {
        x: balloon.radius * -0.8,
        y: balloon.radius * -0.3,
      });
      option.text =
        this.allOptions[Math.floor(Math.random() * this.allOptions.length)];
      option.fontSize = balloon.radius * 0.6;
      this.configOptions.push(option);
    },
    moveBalloon() {
      for (let i = 0; i < this.configBalloon.length; ++i) {
        this.configBalloon[i].y -= this.speed;
        this.configOptions[i].y =
          this.configBalloon[i].y - this.configBalloon[i].radius * 0.3;
        if (this.configBalloon[i].y < -this.configBalloon[i].radius) {
          this.configBalloon.splice(i, 1);
          this.configOptions.splice(i, 1);
        }
      }
    },
    aimStart() {
      this.isAiming = true;
      clearInterval(this.game);
      clearInterval(this.spawner);
      this.game = window.setInterval(this.update, 20 * 5);
      this.spawner = window.setInterval(this.balloonSpawner, 1000 * 5);
    },
    aimMove(e) {
      this.aimPosition = e.target.getStage().getPointerPosition();
      let x = this.aimPosition.x,
        y = this.aimPosition.y,
        radius = this.configScope.radius;
      this.configScope.x = x;
      this.configScope.y = y;
      this.configCross[0].points = [x, y + radius, x, y - radius];
      this.configCross[1].points = [x + radius, y, x - radius, y];
    },
    shoot() {
      this.isAiming = false;
      clearInterval(this.game);
      clearInterval(this.spawner);
      this.game = window.setInterval(this.update, 20);
      this.spawner = window.setInterval(this.balloonSpawner, 1000);
      for (let i = 0; i < this.configBalloon.length; ++i) {
        if (
          canvasTools.distance(this.aimPosition, this.configBalloon[i]) <=
          this.configBalloon[i].radius
        ) {
          this.checkAnswer(this.configOptions[i].text);
          this.configBalloon.splice(i, 1);
          this.configOptions.splice(i, 1);
          break;
        }
      }
    },
    checkAnswer(selectedOption) {
      let checkAnswer = false;
      for (let answer in this.GameData.True) {
        if (this.GameData.True[answer] == selectedOption) checkAnswer = true;
      }
      if (checkAnswer) {
        this.$emit("play-effect", "CorrectSound");
        this.$emit("add-record", ["#", selectedOption, "正確"]);
        this.allOptions = this.allOptions.filter(
          (option) => option != selectedOption
        );
        this.trueOptions = this.trueOptions.filter(
          (option) => option != selectedOption
        );
      } else {
        this.$emit("play-effect", "WrongSound");
        this.$emit("add-record", ["#", selectedOption, "錯誤"]);
      }
      if (this.trueOptions.length == 0) this.$emit("next-question");
    },
  },
};
</script>
