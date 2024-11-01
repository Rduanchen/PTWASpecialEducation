<template>
  <div class="gameContainer">
    <h2>{{ GameData.Question }}</h2>
    <v-stage :config="configKonva">
      <v-layer>
        <v-image :config="configBG"></v-image>
      </v-layer>

      <!--TO BE REPLACED-->
      <v-layer>
        <mole
          v-for="i in map"
          :X="i[1]"
          :Y="i[2]"
          :width="configKonva.width"
          :moleId="i[0]"
          :option="i[3]"
          @showSign="giveOption"
          @whacked="answer"
        ></mole>
      </v-layer>
      <v-layer>
        <hole
          v-for="i in map"
          :X="i[1]"
          :Y="i[2]"
          :width="configKonva.width"
        ></hole>
      </v-layer>
      <!--TO BE REPLACED-->

      <v-layer>
        <v-image v-for="board in configObjects.board" :config="board"></v-image>
        <v-text
          v-for="option in configObjects.option"
          :config="option"
        ></v-text>
        <v-image v-for="mole in configObjects.mole" :config="mole"></v-image>
        <v-image v-for="hole in configObjects.hole" :config="hole"></v-image>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { getSystemAssets } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    //TO BE REPLACED
    hole: defineAsyncComponent(() => import("@/components/moleHole.vue")),
    mole: defineAsyncComponent(() => import("@/components/mole.vue")),
  },
  data() {
    return {
      configKonva: {},
      configBG: {},
      configObjects: {
        position: [],
        status: [],
        cropPercent: [],
        burrow: [],
        board: [],
        option: [],
        mole: [],
        hole: [],
      },
      images: {},
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
    this.initializeScene();
    this.initializeOption();
  },

  mounted() {
    this.game = window.setInterval(this.update, 20);
  },

  methods: {
    initializeScene() {
      this.gameWidth =
        document.getElementById("GameContainer").clientWidth * 0.8;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height = this.gameWidth / 2;
      this.setAttributes();
      this.drawBG();
      this.spawnMole();
    },
    setAttributes() {
      this.images.bg = new window.Image();
      this.images.bg.src = getSystemAssets("background.png", "whackAMole");
      this.images.board = new window.Image();
      this.images.board.src = getSystemAssets("answerBoard.png", "whackAMole");
      this.images.hole = new window.Image();
      this.images.hole.src = getSystemAssets("hole.png", "whackAMole");
      this.images.holeup = new window.Image();
      this.images.holeup.src = getSystemAssets("holeup.png", "whackAMole");
      this.images.mole = new window.Image();
      this.images.mole.src = getSystemAssets("mole.png", "whackAMole");

      this.boardOffset = {
        x: 0,
        y: -this.gameWidth * 0.04,
      };
      this.moleOffset = {
        x: 0,
        y: this.gameWidth * 0.05,
      };

      this.boundaries = {
        up: this.gameWidth * 0.05,
        down: this.gameWidth * 0.39,
        left: this.gameWidth * 0.01,
        right: this.gameWidth * 0.89,
      };
    },
    drawBG() {
      this.configBG.image = this.images.bg;
      this.configBG.width = this.gameWidth;
      this.configBG.height = this.gameWidth;
    },
    spawnMole() {
      let id = this.configObjects.position.length;
      let position = canvasTools.randomPosition(this.boundaries);
      this.configObjects.position.push(position);
      this.configObjects.status.push("burrow");

      let cropPercent = 25;
      this.configObjects.cropPercent.push(cropPercent);

      let board = {
        visible: false,
        x: position.x,
        y: canvasTools.offset(position, this.boardOffset).y,
        width: this.gameWidth * 0.1,
        height: this.gameWidth * 0.05,
        image: this.images.board,
      };
      this.configObjects.board.push(board);

      let mole = {
        x: position.x,
        y: canvasTools.offset(position, this.moleOffset).y,
        width: this.gameWidth * 0.1,
        height: this.gameWidth * 0.001 * cropPercent,
        image: this.images.mole,
      };
      mole.crop = this.crop(cropPercent).crop;
      this.configObjects.mole.push(mole);

      let hole = {
        x: position.x,
        y: position.y,
        width: this.gameWidth * 0.1,
        height: this.gameWidth * 0.1,
        image: this.images.hole,
      };
      this.configObjects.hole.push(hole);
      this.configObjects.burrow.push(
        window.setInterval(this.burrowAnimation, 200, id)
      );
    },
    initializeOption() {
      this.allOptions = this.GameData.True.concat(this.GameData.False);
      this.trueOptions = this.GameData.True;
    },
    update() {
      for (let i = 0; i < this.configObjects.position.length; ++i) {
        this.moleAnimation(i);
      }
    },
    moleAnimation(i) {
      if (this.configObjects.status[i] == "up") {
        this.configObjects.mole[i].y--;
        if (this.configObjects.cropPercent[i] < 100) {
          this.configObjects.cropPercent[i] += 1.5;
          this.configObjects.mole[i].crop = this.crop(
            this.configObjects.cropPercent[i]
          ).crop;
          this.configObjects.mole[i].height = this.crop(
            this.configObjects.cropPercent[i]
          ).height;
        }
        if (this.configObjects.mole[i].y < this.configObjects.position[i].y) {
          this.configObjects.board[i].visible = true;
          this.configObjects.status[i] = "hold";
          window.setTimeout(() => {
            this.configObjects.board[i].visible = false;
            this.configObjects.status[i] = "down";
          }, 2000);
        }
      } else if (this.configObjects.status[i] == "down") {
        this.configObjects.mole[i].y++;
        if (this.configObjects.cropPercent[i] > 0) {
          this.configObjects.cropPercent[i] -= 1.5;
          this.configObjects.mole[i].crop = this.crop(
            this.configObjects.cropPercent[i]
          ).crop;
          this.configObjects.mole[i].height = this.crop(
            this.configObjects.cropPercent[i]
          ).height;
        }
        if (
          this.configObjects.mole[i].y >
          canvasTools.offset(this.configObjects.position[i], this.moleOffset).y
        ) {
          this.configObjects.status[i] = "hold";
          window.setTimeout(() => {
            this.configObjects.status[i] = "up";
            //this.destory(i);
          }, 1000);
        }
      }
    },
    burrowAnimation(id) {
      if (this.configObjects.hole[id].image == this.images.hole) {
        this.configObjects.hole[id].image = this.images.holeup;
      } else if (this.configObjects.hole[id].image == this.images.holeup) {
        this.configObjects.hole[id].image = this.images.hole;
        switch (this.configObjects.status[id]) {
          case "burrow":
            this.configObjects.status[id] = "burrowOnce";
            break;
          case "burrowOnce":
            this.configObjects.status[id] = "burrowTwice";
            break;
          case "burrowTwice":
            this.configObjects.status[id] = "up";
            window.clearInterval(this.configObjects.burrow[id]);
            break;
        }
      }
    },
    crop(cropPercent) {
      return {
        crop: {
          x: 0,
          y: 0,
          width: this.images.mole.width,
          height: this.images.mole.height * 0.01 * cropPercent,
        },
        height: this.gameWidth * 0.001 * cropPercent,
      };
    },
    destory(i) {
      for (let object in this.configObjects) {
        this.configObjects[object].splice(i, 1);
      }
    },

    answer(option) {
      var ans = false;
      for (let i in this.GameData.True) {
        if (option == this.GameData.True[i]) {
          this.true = this.true.filter(
            (option) => option != this.GameData.True[i]
          );
          ans = true;
          this.$emit("add-record", [this.GameData.True[i], option, "正確"]);
          break;
        }
      }
      if (ans) {
        this.$emit("play-effect", "CorrectSound");
        this.ansLeft--;
        if (this.ansLeft <= 0) this.$emit("next-question");
      } else {
        this.$emit("play-effect", "WrongSound");
        this.$emit("add-record", ["#", option, "錯誤"]);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.gameContainer {
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
