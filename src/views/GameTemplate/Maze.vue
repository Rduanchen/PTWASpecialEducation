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
        </v-layer>
        <v-layer>
          <v-circle :config="configPlayer"></v-circle>
          <v-circle :config="configGhost_1"></v-circle>
          <v-circle :config="configGhost_2"></v-circle>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import { fasK } from "@quasar/extras/fontawesome-v6";
import { Container } from "konva/lib/Container";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    bounds: defineAsyncComponent(() => import("@/components/mazeBounds.vue")),
    safeArea: defineAsyncComponent(() =>
      import("@/components/mazeSafeArea.vue")
    ),
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
      configPlayer: {
        fill: "yellow",
        stroke: "yellow",
      },
      configGhost_1: {
        fill: "red",
        stroke: "red",
      },
      configGhost_2: {
        fill: "red",
        stroke: "red",
      },

      map: [
        [
          [2, 2, 2, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 2, 2, 2],
          [2, 2, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 2, 2, 2],
          [2, 2, 2, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 2, 2, 2],
          [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
          [1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
          [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
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
      randomMapId: 0,
      genMap: [],
      safeMap: [],

      entityInfo: {
        player: {
          collision: {
            left: true,
            right: true,
            up: true,
            down: true,
          },
          xyGrid: {
            x: 0,
            y: 0,
          },
          keys: {
            vertical: "idle",
            horizontal: "idle",
          },
        },
        ghost_1: {
          collision: {
            left: true,
            right: true,
            up: true,
            down: true,
          },
          xyGrid: {
            x: 0,
            y: 0,
          },
          movement: "right",
        },
        ghost_2: {
          collision: {
            left: true,
            right: true,
            up: true,
            down: true,
          },
          xyGrid: {
            x: 0,
            y: 0,
          },
          movement: "left",
        },
      },
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
    this.fitCanvasInScreen();
    this.generateMap();
  },

  mounted() {
    this.initializeEntityConfig();
    this.initializeEntityPosition();
    this.bootGame();
  },

  methods: {
    fitCanvasInScreen() {
      var gameWidth = document.getElementById("GameContainer").clientWidth;
      this.configKonva.width = Math.floor(gameWidth * 0.8);
      this.configKonva.height = Math.floor(this.configKonva.width / 2);
    },
    generateMap() {
      this.laneWidth = Math.floor(this.configKonva.width * 0.05);
      this.configBg.width = this.laneWidth * 20 - 3;
      this.configBg.height = this.laneWidth * 10 - 3;
      this.configBg.strokeWidth = Math.floor(this.laneWidth * 0.1);
      for (var i = 0; i < 10; ++i) {
        for (var j = 0; j < 20; ++j) {
          if (this.map[this.randomMapId][i][j] == 1) {
            this.genMap.push([this.laneWidth * j, this.laneWidth * i]);
          } else if (this.map[this.randomMapId][i][j] == 2) {
            this.safeMap.push([this.laneWidth * j, this.laneWidth * i]);
          }
        }
        //console.log(row);
      }
    },

    initializeEntityPosition() {
      this.configPlayer.x = Math.floor(this.laneWidth * 9.5);
      this.configPlayer.y = Math.floor(this.laneWidth * 3.5);
      this.configGhost_1.x = Math.floor(this.laneWidth * 3.5);
      this.configGhost_1.y = Math.floor(this.laneWidth * 1.5);
      this.configGhost_2.x = Math.floor(this.laneWidth * 18.5);
      this.configGhost_2.y = Math.floor(this.laneWidth * 8.5);
    },
    initializeEntityConfig() {
      this.configPlayer.radius = Math.floor(this.laneWidth * 0.35);
      this.configGhost_1.radius = Math.floor(this.laneWidth * 0.35);
      this.configGhost_2.radius = Math.floor(this.laneWidth * 0.35);
    },
    bootGame() {
      window.addEventListener("keydown", this.keyDown);
      window.addEventListener("keyup", this.keyUp);
      this.Update = window.setInterval(this.update, 20);
    },

    keyDown(e) {
      //W = 38/87; A = 37/65; S = 40/83; D = 39/68
      //console.log(e.keyCode);
      switch (e.keyCode) {
        case 37:
        case 65:
          this.entityInfo.player.keys.horizontal = "left";
          break;
        case 39:
        case 68:
          this.entityInfo.player.keys.horizontal = "right";
          break;
        case 38:
        case 87:
          this.entityInfo.player.keys.vertical = "up";
          break;
        case 40:
        case 83:
          this.entityInfo.player.keys.vertical = "down";
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
          this.entityInfo.player.keys.horizontal = "idle";
          break;
        case 38:
        case 87:
        case 40:
        case 83:
          this.entityInfo.player.keys.vertical = "idle";
          break;
      }
    },
    update() {
      this.entityInfo.player.xyGrid = this.mapInxyGrid(this.configPlayer);
      this.entityInfo.player.collision = this.checkCollision(
        this.entityInfo.player
      );
      this.movePlayer();
      this.entityInfo.ghost_1.xyGrid = this.mapInxyGrid(this.configGhost_1);
      this.entityInfo.ghost_2.xyGrid = this.mapInxyGrid(this.configGhost_2);
      this.entityInfo.ghost_1.collision = this.checkCollision(
        this.entityInfo.ghost_1
      );
      this.entityInfo.ghost_2.collision = this.checkCollision(
        this.entityInfo.ghost_2
      );
      this.moveGhost();
      //console.log(this.keys);
    },
    mapInxyGrid(config) {
      return {
        x: config.x / this.laneWidth - 0.5,
        y: config.y / this.laneWidth - 0.5,
      };
    },
    checkCollision(entity) {
      var collision = {
        left: true,
        right: true,
        up: true,
        down: true,
      };
      var XY = entity.xyGrid;
      if (entity.keys) {
        if (XY.x % 1 >= 0.8 || XY.x % 1 <= 0.1) {
          XY.x = Math.round(XY.x);
          collision.up = false;
          collision.down = false;
        }
        if (XY.y % 1 > 0.8 || XY.y % 1 < 0.1) {
          XY.y = Math.round(XY.y);
          collision.left = false;
          collision.right = false;
        }
      } else {
        if (XY.x % 1 >= 0.95 || XY.x % 1 <= 0.05) {
          XY.x = Math.round(XY.x);
          collision.up = false;
          collision.down = false;
        }
        if (XY.y % 1 > 0.95 || XY.y % 1 < 0.05) {
          XY.y = Math.round(XY.y);
          collision.left = false;
          collision.right = false;
        }
      }

      if (
        collision.left == false &&
        collision.right == false &&
        collision.up == false &&
        collision.down == false
      ) {
        //console.log(this.playerXY);
        if (XY.x <= 0) collision.left = true;
        else if (this.map[this.randomMapId][XY.y][XY.x - 1] == 1) {
          collision.left = true;
        }

        if (XY.x >= 19) collision.right = true;
        else if (this.map[this.randomMapId][XY.y][XY.x + 1] == 1) {
          collision.right = true;
        }

        if (XY.y <= 0) collision.up = true;
        else if (this.map[this.randomMapId][XY.y - 1][XY.x] == 1) {
          collision.up = true;
        }

        if (XY.y >= 9) collision.down = true;
        else if (this.map[this.randomMapId][XY.y + 1][XY.x] == 1) {
          collision.down = true;
        }
      }

      return {
        left: collision.left,
        right: collision.right,
        up: collision.up,
        down: collision.down,
      };
    },

    movePlayer() {
      var collision = this.entityInfo.player.collision;
      var keys = this.entityInfo.player.keys;

      if (keys.horizontal == "left") {
        if (collision.left) keys.horizontal = "idle";
      }
      if (keys.horizontal == "right") {
        if (collision.right) keys.horizontal = "idle";
      }
      if (keys.vertical == "up") {
        if (collision.up) keys.vertical = "idle";
      }
      if (keys.vertical == "down") {
        if (collision.down) keys.vertical = "idle";
      }

      if (keys.horizontal == "left") {
        this.configPlayer.x -= Math.floor(this.laneWidth * 0.1);
      } else if (keys.horizontal == "right") {
        this.configPlayer.x += Math.floor(this.laneWidth * 0.1);
      }

      if (keys.vertical == "up") {
        this.configPlayer.y -= Math.floor(this.laneWidth * 0.1);
      } else if (keys.vertical == "down") {
        this.configPlayer.y += Math.floor(this.laneWidth * 0.1);
      }
    },
    moveGhost() {
      /*
      for (var i = 0; i < 2; ++i) {
        if (this.ghostXY[i][0] % 1 == 0 || this.ghostXY[i][1] % 1 == 0) {
          var randomDirec = [];
          if (this.ghostCollision[i][this.ghostMovement[i]] != 0) {
            for (var j = 0; j < 10; ++j) {
              randomDirec.push(this.ghostMovement[i]);
            }
          }

          if (this.ghostMovement[i] == 0 || this.ghostMovement[i] == 1) {
            if (this.ghostCollision[i][2] == 1) randomDirec.push(2);
            if (this.ghostCollision[i][3] == 1) randomDirec.push(3);
          } else if (this.ghostMovement[i] == 2 || this.ghostMovement[i] == 3) {
            if (this.ghostCollision[i][0] == 1) randomDirec.push(0);
            if (this.ghostCollision[i][1] == 1) randomDirec.push(1);
          }
          this.ghostMovement[i] =
            randomDirec[Math.floor(Math.random() * randomDirec.length)];
        }

        if (this.ghostMovement[i] == 0) {
          this.ghostPos[i][0] -= Math.floor(this.laneWidth * 0.03);
        } else if (this.ghostMovement[i] == 1) {
          this.ghostPos[i][0] += Math.floor(this.laneWidth * 0.03);
        } else if (this.ghostMovement[i] == 2) {
          this.ghostPos[i][1] -= Math.floor(this.laneWidth * 0.03);
        } else if (this.ghostMovement[i] == 3) {
          this.ghostPos[i][1] += Math.floor(this.laneWidth * 0.03);
        }
      }*/
    },
  },
};
</script>
