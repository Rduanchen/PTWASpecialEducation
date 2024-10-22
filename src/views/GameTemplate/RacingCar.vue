<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <h2>{{ GameData.Question }}</h2>
      <v-stage :config="configKonva">
        <v-layer>
          <v-rect :config="configBG"></v-rect>
        </v-layer>

        <v-layer>
          <v-image :config="configCar"></v-image>
        </v-layer>

        <v-layer>
          <v-image v-for="passage in configPassage" :config="passage"></v-image>
          <v-text v-for="option in configOption" :config="option"></v-text>
        </v-layer>
      </v-stage>
    </div>
    <div id="btnContainer">
      <img :src="upBtn" class="controlBtn" @click="getCurrentOptionId('up')" />
      <br />
      <img
        :src="rightBtn"
        class="controlBtn"
        @click="getCurrentOptionId('right')"
      />
      <br />
      <img
        :src="downBtn"
        class="controlBtn"
        @click="getCurrentOptionId('down')"
      />
    </div>
  </div>
</template>

<script>
import { getSystemAssets } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      configKonva: {},
      configBG: {
        x: 0,
        y: 0,
        fill: "gray",
        stroke: "gray",
      },
      configPassage: [],
      configOption: [],
      configCar: {},

      speed: 1,
      canMove: true,
      movement: "idle",
      currentOptionId: 0,

      upBtn: getSystemAssets("arrowUp.jpg", "racingCar"),
      rightBtn: getSystemAssets("arrowRight.jpg", "racingCar"),
      downBtn: getSystemAssets("arrowDown.jpg", "racingCar"),
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
    this.options = canvasTools.shuffleOptions(this.GameData.Options);
    this.currentOptionId = Math.floor(Math.random() * this.options.length);
    this.initializeScene();
    window.addEventListener("keydown", this.input);
  },

  mounted() {
    var btnCon = document.getElementById("btnContainer");
    btnCon.style.height = this.configKonva.height + "px";
    this.game = window.setInterval(this.update, 20);
  },

  methods: {
    initializeScene() {
      this.gameWidth =
        document.getElementById("GameContainer").clientWidth * 0.8;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height = this.gameWidth / 2;
      this.configBG.width = this.gameWidth;
      this.configBG.height = this.gameWidth / 2;
      this.drawPassage();
      this.drawOptions();
      this.drawCar();
    },
    drawPassage() {
      const passageImg = new window.Image();
      passageImg.src = getSystemAssets("Passage.png", "racingCar");
      this.laneWidth = this.gameWidth / 2 / this.options.length;
      this.passageX = 0;
      for (var i = 0; i < this.options.length; i++) {
        let passage = {
          x: 0,
          y: this.laneWidth * i,
          width: this.gameWidth * 2.225,
          height: this.laneWidth,
          image: passageImg,
        };
        this.configPassage.push(passage);
      }
    },
    drawOptions() {
      this.optionOffset = {
        x: this.gameWidth * 1.05,
        y: this.gameWidth * 0.04,
      };
      for (var i = 0; i < this.options.length; i++) {
        let option = {
          x: canvasTools.offset(this.configPassage[i], this.optionOffset).x,
          y: canvasTools.offset(this.configPassage[i], this.optionOffset).y,
          fontSize: this.gameWidth * 0.05,
          text: this.options[i],
        };
        this.configOption.push(option);
      }
    },
    drawCar() {
      const carImg = new window.Image();
      carImg.src = getSystemAssets("RacingCar.png", "racingCar");
      this.configCar.image = carImg;
      this.configCar.height = this.laneWidth * 0.8;
      this.configCar.width = this.laneWidth * 0.8;
      this.carOffset = { x: this.laneWidth * 0.2, y: this.laneWidth * 0.1 };
      this.configCar.x = canvasTools.offset(
        this.configPassage[this.currentOptionId],
        this.carOffset
      ).x;
      this.configCar.y = canvasTools.offset(
        this.configPassage[this.currentOptionId],
        this.carOffset
      ).y;
    },
    update() {
      this.movePassage();
      this.moveCar();
      /*
      if (this.configPassage.x <= -Math.floor(this.l * 1.2)) {
        this.$emit("end");
        this.configPassage.x = 0;
        //this.speed = 1;
        clearInterval(this.Update);
        setTimeout(this.replay, 1000);
      }*/
    },
    movePassage() {
      this.passageX -= this.speed;
      for (let passage in this.configPassage)
        this.configPassage[passage].x = this.passageX;
      for (let option in this.configOption)
        this.configOption[option].x = canvasTools.offset(
          this.configPassage[0],
          this.optionOffset
        ).x;
    },
    moveCar() {
      switch (this.movement) {
        case "up":
          if (
            this.configCar.y >
            canvasTools.offset(
              this.configPassage[this.currentOptionId],
              this.carOffset
            ).y
          ) {
            this.configCar.y -= this.speed * 4;
            this.configCar.rotation = -10;
          } else {
            this.configCar.rotation = 0;
            this.canMove = true;
            this.movement = "idle";
          }
          break;
        case "down":
          if (
            this.configCar.y <
            canvasTools.offset(
              this.configPassage[this.currentOptionId],
              this.carOffset
            ).y
          ) {
            this.configCar.y += this.speed * 4;
            this.configCar.rotation = 10;
          } else {
            this.configCar.rotation = 0;
            this.canMove = true;
            this.movement = "idle";
          }
          break;
      }
    },
    input(e) {
      //W = 38/87; A = 37/65; S = 40/83; D = 39/68
      //console.log(e.keyCode);
      switch (e.keyCode) {
        case 38:
        case 87:
          this.getCurrentOptionId("up");
          break;

        case 40:
        case 83:
          this.getCurrentOptionId("down");
          break;

        case 32:
          this.getCurrentOptionId("right");
          break;
      }
    },
    getCurrentOptionId(direction) {
      if (this.canMove) {
        switch (direction) {
          case "up":
            this.currentOptionId--;
            if (this.currentOptionId < 0) this.currentOptionId = 0;
            else {
              this.movement = "up";
              this.canMove = false;
            }
            break;
          case "down":
            this.currentOptionId++;
            if (this.currentOptionId > this.options.length - 1)
              this.currentOptionId = this.options.length - 1;
            else {
              this.movement = "down";
              this.canMove = false;
            }
            break;
          case "right":
            this.speed = 10;
            this.canMove = false;
        }
      }
    },
    end() {
      if (this.game) {
        this.game = false;
        if (this.configCar.key == this.ans) {
          //this.configTemp.text = "SUCCESS";
          this.$emit("play-effect", "CorrectSound");
          this.$emit("add-record", [
            this.GameData.Options[this.GameData.Answer],
            this.GameData.Options[this.configCar.key],
            "正確",
          ]);
          this.$emit("next-question");
        } else {
          this.$emit("play-effect", "WrongSound");
          this.$emit("add-record", [
            this.GameData.Options[this.GameData.Answer],
            this.GameData.Options[this.configCar.key],
            "錯誤",
          ]);
          setTimeout(this.replay, 1000);
        }
      }
    },

    replay() {
      this.game = true;
      this.speed = 1;
      window.addEventListener("keydown", this.input);
    },
  },
};
</script>

<style>
.gameContainer {
  display: flex;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}

#btnContainer {
  height: 100%;
  margin: 10px;
}

.controlBtn {
  height: 30%;
  aspect-ratio: 1/1;
  margin: 5%;
  border: 5px solid black;
}
</style>
