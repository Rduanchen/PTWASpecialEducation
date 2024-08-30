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
          <pacman
            :x="entityInfo.player.position.x"
            :y="entityInfo.player.position.y"
            :width="laneWidth"
          ></pacman>
          <ghost
            :x="entityInfo.ghost_1.position.x"
            :y="entityInfo.ghost_1.position.y"
            :width="laneWidth"
          >
          </ghost>
          <ghost
            :x="entityInfo.ghost_2.position.x"
            :y="entityInfo.ghost_2.position.y"
            :width="laneWidth"
          >
          </ghost>
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
    pacman: defineAsyncComponent(() => import("@/components/pacman.vue")),
    ghost: defineAsyncComponent(() => import("@/components/ghost.vue")),
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
          position: {
            x: 0,
            y: 0,
          },
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
          position: {
            x: 0,
            y: 0,
          },
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
          position: {
            x: 0,
            y: 0,
          },
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

      playerPos: [0, 0],
      playerCollision: [0, 0, 0, 0],
      playerXY: [0, 0],

      ghostPos: [
        [3.5, 1.5],
        [16.5, 8.5],
      ],
      ghostMovement: [1, 0],
      ghostCollision: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      ghostXY: [
        [0, 0],
        [0, 0],
      ],
      ghostTurn: [1, 1],
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
    this.generateMap();
  },

  mounted() {
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
      this.entityInfo.player.position.x = Math.floor(this.laneWidth * 9.5);
      this.entityInfo.player.position.y = Math.floor(this.laneWidth * 3.5);
      this.entityInfo.ghost_1.position.x = Math.floor(this.laneWidth * 3.5);
      this.entityInfo.ghost_1.position.y = Math.floor(this.laneWidth * 1.5);
      this.entityInfo.ghost_2.position.x = Math.floor(this.laneWidth * 18.5);
      this.entityInfo.ghost_2.position.y = Math.floor(this.laneWidth * 8.5);
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
          this.keys.horizontal = "left";
          break;
        case 39:
        case 68:
          this.keys.horizontal = "right";
          break;
        case 38:
        case 87:
          this.keys.vertical = "up";
          break;
        case 40:
        case 83:
          this.keys.vertical = "down";
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
          this.keys.horizontal = "idle";
          break;
        case 38:
        case 87:
        case 40:
        case 83:
          this.keys.vertical = "idle";
          break;
      }
    },
    update() {
      this.mapInxyGrid(this.entityInfo.player);
      this.checkPlayerCollision(this.entityInfo.player);
      this.movePlayer();
      this.mapInxyGrid(this.entityInfo.ghost_1);
      this.mapInxyGrid(this.entityInfo.ghost_2);
      this.checkGhostCollision(this.entityInfo.ghost_1);
      this.checkGhostCollision(this.entityInfo.ghost_2);
      this.moveGhost();
      //console.log(this.keys);
    },
    mapInxyGrid(entity) {
      entity.xy.x = entity.position.x / this.laneWidth - 0.5;
      entity.xy.y = entity.position.y / this.laneWidth - 0.5;
    },
    checkPlayerCollision(entity) {
      var collision = [false, false, false, false];
      //left, right, up, down

      if (entity.xy.x % 1 >= 0.8 || entity.xy.x % 1 <= 0.1) {
        entity.xy.x = Math.round(entity.xy.x);
        collision[2] = true;
        collision[3] = true;
      }
      if (entity.xy.y % 1 > 0.8 || entity.xy.y % 1 < 0.1) {
        entity.xy.y = Math.round(entity.xy.y);
        collision[0] = true;
        collision[1] = true;
      }
      entity.collision.left = collision[0];
      entity.collision.right = collision[1];
      entity.collision.up = collision[2];
      entity.collision.down = collision[3];
    },
    checkGhostCollision(entity) {
      var collision = [false, false, false, false];
      //left, right, up, down

      if (entity.xy.x % 1 >= 0.95 || entity.xy.x % 1 <= 0.05) {
        entity.xy.x = Math.round(entity.xy.x);
        collision[2] = true;
        collision[3] = true;
      }
      if (entity.xy.y % 1 > 0.95 || entity.xy.y % 1 < 0.05) {
        entity.xy.y = Math.round(entity.xy.y);
        collision[0] = true;
        collision[1] = true;
      }
      entity.collision.left = collision[0];
      entity.collision.right = collision[1];
      entity.collision.up = collision[2];
      entity.collision.down = collision[3];
    },
    movePlayer() {
      var collision = this.entityInfo.player.collision;
      var XY = this.playerXY;
      if (
        collision[0] == 1 &&
        collision[1] == 1 &&
        collision[2] == 1 &&
        collision[3] == 1
      ) {
        //console.log(this.playerXY);
        if (XY[0] == 0) collision[0] = 0;
        else if (this.map[this.randomMapId][XY[1]][XY[0] - 1] == 1) {
          collision[0] = 0;
        }

        if (XY[0] == 19) collision[1] = 0;
        else if (this.map[this.randomMapId][XY[1]][XY[0] + 1] == 1) {
          collision[1] = 0;
        }

        if (XY[1] == 0) collision[2] = 0;
        else if (this.map[this.randomMapId][XY[1] - 1][XY[0]] == 1) {
          collision[2] = 0;
        }

        if (XY[1] == 9) collision[3] = 0;
        else if (this.map[this.randomMapId][XY[1] + 1][XY[0]] == 1) {
          collision[3] = 0;
        }
      }

      if (this.keys.horizontal == "left") {
        if (!this.entityInfo.player.collision.left)
          this.keys.horizontal == "idle";
      }
      if (this.keys.horizontal == "right") {
        if (!this.entityInfo.player.collision.right)
          this.keys.horizontal == "idle";
      }
      if (this.keys.vertical == "up") {
        if (!this.entityInfo.player.collision.up) this.keys.vertical == "idle";
      }
      if (this.keys.vertical == "down") {
        if (!this.entityInfo.player.collision.down)
          this.keys.vertical == "idle";
      }

      if (this.keys.horizontal == "left") {
        this.entityInfo.player.position.x -= Math.floor(this.laneWidth * 0.1);
      } else if (this.keys.horizontal == "right") {
        this.entityInfo.player.position.x += Math.floor(this.laneWidth * 0.1);
      }

      if (this.keys.horizontal == "up") {
        this.entityInfo.player.position.y -= Math.floor(this.laneWidth * 0.1);
      } else if (this.keys.horizontal == "down") {
        this.entityInfo.player.position.y += Math.floor(this.laneWidth * 0.1);
      }
    },
    moveGhost() {
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
          if (i == 0)
            console.log(i, this.ghostCollision[i], this.ghostMovement[i]);
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
      }
    },
  },
};
</script>
