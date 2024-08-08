<template>
  <div class="container">
    <div>
      <h2>{{ GameConfig.GlobalTitle }}</h2>
      <v-stage :config="configKonva">
        <v-layer>
          <v-rect :config="configLane"></v-rect>
        </v-layer>

        <v-layer>
          <v-image :config="configCar"></v-image>
        </v-layer>

        <v-layer>
          <passage
            v-for="i in map"
            :Y="i[1]"
            :w="laneWidth"
            :option="GameData.Options[i[0]]"
            :speed="speed"
            @end="end"
            @onClick="moveOnClick"
          >
          </passage>
        </v-layer>
      </v-stage>
    </div>
    <div class="btnContainer">
      <img :src="upBtn" class="controlBtn" @click="move(1)" />
      <img :src="rightBtn" class="controlBtn" @click="move(0)" />
      <img :src="downBtn" class="controlBtn" @click="move(-1)" />
    </div>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import { defineAsyncComponent } from "vue";

const carImg = document.createElement("img");
carImg.src = GamesGetAssetsFile("MA3029", "RacingCar.png");

export default {
  components: {
    //lane: defineAsyncComponent(() => import("@/components/lane.vue")),
    passage: defineAsyncComponent(() => import("@/components/passage.vue")),
  },
  data() {
    return {
      configKonva: {
        width: 1000,
        height: 500,
      },

      configCar: {
        image: carImg,
        x: 50,
        y: 0,
        width: 150,
        height: 150,
        key: 0,
      },

      configLane: {
        x: 0,
        y: 0,
        width: 1000,
        height: 500,
        fill: "gray",
        stroke: "gray",
      },

      map: [
        [0, 0, false],
        //[225, false],
      ],

      laneWidth: 0,

      game: true,

      speed: 1,

      upBtn: GamesGetAssetsFile("MA3029", "arrowUp.jpg"),
      rightBtn: GamesGetAssetsFile("MA3029", "arrowRight.jpg"),
      downBtn: GamesGetAssetsFile("MA3029", "arrowDown.jpg"),
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

  beforeMount() {
    this.options = this.GameData.Options.length;
    this.ans = this.GameData.Answer;
    //console.log(this.GameData.Options.length);

    window.addEventListener("keydown", this.input);
    this.laneWidth = Math.floor(this.configKonva.height / this.options);
    for (var i = 1; i < this.options; i++) {
      //console.log(i);
      this.map.push([i, this.laneWidth * i, false]);
    }
    this.map[this.ans][2] = true;
    this.configCar.y = this.laneWidth / 2 - this.configCar.height / 2;
    //this.randomPassage();
  },

  methods: {
    input(e) {
      //W = 38/87; A = 37/65; S = 40/83; D = 39/68
      //console.log(e.keyCode);
      switch (e.keyCode) {
        case 38:
        case 87:
          this.move(1);
          break;

        case 40:
        case 83:
          this.move(-1);
          break;

        case 32:
          this.move(0);
          break;
      }
    },
    move(key) {
      if (key == 1) this.configCar.key--;
      else if (key == -1) this.configCar.key++;
      else if (key == 0) {
        this.speed = 10;
        window.removeEventListener("keydown", this.input);
      }
      if (this.configCar.key <= 0) this.configCar.key = 0;
      else if (this.configCar.key >= this.options)
        this.configCar.key = this.options - 1;
      //console.log(this.configCar.key);
      this.configCar.y =
        this.map[this.configCar.key][1] +
        this.laneWidth / 2 -
        this.configCar.height / 2;
    },
    end() {
      if (this.game) {
        this.game = false;
        if (this.configCar.key == this.ans) {
          //this.configTemp.text = "SUCCESS";
          this.$emit("play-effect", "CorrectSound");
          this.$emit("add-record", [
            this.GameData.Answer,
            this.configCar.key,
            "正確",
          ]);
          this.$emit("next-question");
          console.log("check answer : True");
        } else {
          this.$emit("play-effect", "WrongSound");
          this.$emit("add-record", [
            this.GameData.Answer,
            this.configCar.key,
            "錯誤",
          ]);
          setTimeout(this.replay, 1000);
          console.log("check answer : False");
        }
        //this.configTemp.visible = true;
      }
      //alert("end");
    },

    replay() {
      this.game = true;
      this.speed = 1;
      window.addEventListener("keydown", this.input);
    },

    moveOnClick(Y) {
      this.configCar.key = Y / this.laneWidth;
      this.configCar.y =
        this.map[this.configCar.key][1] +
        this.laneWidth / 2 -
        this.configCar.height / 2;
    },
  },
};
</script>

<style>
.container {
  display: flex;
}

.btnContainer {
  height: 100%;
  margin: 10px;
}

.controlBtn {
  height: 200px;
  aspect-ratio: 1/1;
  margin: 5px;
  border: 5px solid black;
}
</style>
