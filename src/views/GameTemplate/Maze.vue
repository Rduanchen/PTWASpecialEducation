<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <h2>{{ GameData.Question }}</h2>
      <v-stage :config="configKonva">
        <v-layer>
          <v-rect :config="configBg"></v-rect>
        </v-layer>

        <v-layer>
          <safeArea
            v-for="i in safeMap"
            :x="i[0]"
            :y="i[1]"
            :width="laneWidth"
          ></safeArea>
        </v-layer>
        <v-layer>
          <bounds
            v-for="i in genMap"
            :x="i[0]"
            :y="i[1]"
            :width="laneWidth"
          ></bounds>
          <pacman
            :x="playerPos[0]"
            :y="playerPos[1]"
            :width="laneWidth"
          ></pacman>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import { Container } from "konva/lib/Container";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    bounds: defineAsyncComponent(() => import("@/components/mazeBounds.vue")),
    safeArea: defineAsyncComponent(() =>
      import("@/components/mazeSafeArea.vue")
    ),
    pacman: defineAsyncComponent(() => import("@/components/pacman.vue")),
  },
  data() {
    return {
      configKonva: {
        width: 1000,
        height: 500,
      },
      configBg: {
        x: 0,
        y: 0,
        fill: "black",
        stroke: "black",
      },

      map: [
        [
          [2, 2, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2],
          [2, 2, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 2, 2, 2],
          [2, 2, 2, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 2, 2, 2],
          [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
          [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
          [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          [2, 2, 2, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 2, 2, 2],
          [2, 2, 2, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 2, 2, 2],
          [2, 2, 2, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 2, 2, 2],
        ],
        [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
      ],
      randomMap: 0,
      genMap: [],
      safeMap: [],

      playerPos: [0, 0],
      keys: [0, 0],
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
    var gameWidth = document.getElementById("GameContainer").clientWidth;
    //var canvasCon = document.getElementById("canvasContainer");
    this.configKonva.width = Math.floor(gameWidth * 0.8);
    this.configKonva.height = Math.floor(this.configKonva.width / 2);
    this.generateMap();
  },

  mounted() {
    this.playerPos = [
      Math.floor(this.laneWidth * 9.5),
      Math.floor(this.laneWidth * 4.5),
    ];
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
    this.Update = window.setInterval(this.update, 20);
  },

  methods: {
    generateMap() {
      this.laneWidth = Math.floor(this.configKonva.width * 0.05);
      this.configBg.width = this.laneWidth * 20 - 3;
      this.configBg.height = this.laneWidth * 10 - 3;
      this.configBg.strokeWidth = Math.floor(this.laneWidth * 0.1);
      for (var i = 0; i < 10; ++i) {
        for (var j = 0; j < 20; ++j) {
          if (this.map[this.randomMap][i][j] == 1) {
            this.genMap.push([this.laneWidth * j, this.laneWidth * i]);
          } else if (this.map[this.randomMap][i][j] == 2) {
            this.safeMap.push([this.laneWidth * j, this.laneWidth * i]);
          }
        }
        //console.log(row);
      }
    },
    keyDown(e) {
      //W = 38/87; A = 37/65; S = 40/83; D = 39/68
      //console.log(e.keyCode);
      switch (e.keyCode) {
        case 37:
        case 65:
          this.keys[0] = -1;
          break;
        case 39:
        case 68:
          this.keys[0] = 1;
          break;
        case 38:
        case 87:
          this.keys[1] = -1;
          break;
        case 40:
        case 83:
          this.keys[1] = 1;
          break;
      }
    },
    keyUp(e) {
      //W = 38/87; A = 37/65; S = 40/83; D = 39/68
      //console.log(e.keyCode);
      switch (e.keyCode) {
        case 37:
        case 65:
        case 39:
        case 68:
          this.keys[0] = 0;
          break;
        case 38:
        case 87:
        case 40:
        case 83:
          this.keys[1] = 0;
          break;
      }
    },
    update() {
      this.checkCollision();
      this.playerPos[0] += Math.floor(this.keys[0] * this.laneWidth * 0.1);
      this.playerPos[1] += Math.floor(this.keys[1] * this.laneWidth * 0.1);
      //console.log(this.keys);
    },
    checkCollision() {
      var margin = Math.floor(this.laneWidth * 0.35);

      for (var i = 0; i < this.genMap.length; ++i) {
        if (this.keys[0] == -1) {
          if (this.playerPos[0] <= margin) {
            this.keys[0] = 0;
          } else if (
            this.playerPos[1] >= this.genMap[i][1] - margin &&
            this.playerPos[1] <= this.genMap[i][1] + margin + this.laneWidth
          ) {
            if (
              this.playerPos[0] - margin - this.genMap[i][0] - this.laneWidth <=
                Math.floor(this.laneWidth * 0.1) &&
              this.playerPos[0] - margin - this.genMap[i][0] - this.laneWidth >=
                0
            ) {
              this.keys[0] = 0;
            }
          }
        } else if (this.keys[0] == 1) {
          if (this.playerPos[0] >= this.configBg.width - margin) {
            this.keys[0] = 0;
          } else if (
            this.playerPos[1] >= this.genMap[i][1] - margin &&
            this.playerPos[1] <= this.genMap[i][1] + margin + this.laneWidth
          ) {
            if (
              this.genMap[i][0] - this.playerPos[0] - margin <=
                Math.floor(this.laneWidth * 0.1) &&
              this.genMap[i][0] - this.playerPos[0] - margin >= 0
            ) {
              this.keys[0] = 0;
            }
          }
        }

        if (this.keys[1] == -1) {
          if (this.playerPos[1] <= margin) {
            this.keys[1] = 0;
          } else if (
            this.playerPos[0] >= this.genMap[i][0] - margin &&
            this.playerPos[0] <= this.genMap[i][0] + margin + this.laneWidth
          ) {
            if (
              this.playerPos[1] - margin - this.genMap[i][1] - this.laneWidth <=
                Math.floor(this.laneWidth * 0.1) &&
              this.playerPos[1] - margin - this.genMap[i][1] - this.laneWidth >=
                0
            ) {
              this.keys[1] = 0;
            }
          }
        } else if (this.keys[1] == 1) {
          if (this.playerPos[1] >= this.configBg.height - margin) {
            this.keys[1] = 0;
          } else if (
            this.playerPos[0] >= this.genMap[i][0] - margin &&
            this.playerPos[0] <= this.genMap[i][0] + margin + this.laneWidth
          ) {
            if (
              this.genMap[i][1] - this.playerPos[1] - margin <=
                Math.floor(this.laneWidth * 0.1) &&
              this.genMap[i][1] - this.playerPos[1] - margin >= 0
            ) {
              this.keys[1] = 0;
            }
          }
        }
      }
    },
  },
};
</script>
