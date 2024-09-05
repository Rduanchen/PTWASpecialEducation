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
          movement: "idle",
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
          this.entityInfo.player.movement = "left";
          break;
        case 39:
        case 68:
          this.entityInfo.player.movement = "right";
          break;
        case 38:
        case 87:
          this.entityInfo.player.movement = "up";
          break;
        case 40:
        case 83:
          this.entityInfo.player.movement = "down";
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
        case 38:
        case 87:
        case 40:
        case 83:
          this.entityInfo.player.movement = "idle";
          break;
      }
    },
    update() {
      this.entityInfo.player.xyGrid = this.mapInxyGrid(this.configPlayer);
      this.checkCollision(this.entityInfo.player);
      this.movePlayer();
      this.entityInfo.ghost_1.xyGrid = this.mapInxyGrid(this.configGhost_1);
      this.entityInfo.ghost_2.xyGrid = this.mapInxyGrid(this.configGhost_2);
      this.checkCollision(this.entityInfo.ghost_1);
      this.checkCollision(this.entityInfo.ghost_2);
      this.moveGhost({
        config: this.configGhost_1,
        entity: this.entityInfo.ghost_1,
      });
    },
    mapInxyGrid(config) {
      return {
        x: config.x / this.laneWidth - 0.5,
        y: config.y / this.laneWidth - 0.5,
      };
    },
    checkCollision(entity) {
      entity.collision = {
        left: false,
        right: false,
        up: false,
        down: false,
      };
      var margin = 0.1;
      var roundedX = Math.round(entity.xyGrid.x);
      var roundedY = Math.round(entity.xyGrid.y);

      if (
        entity.movement == "left" &&
        entity.xyGrid.x % 1 >= 1 - margin &&
        entity.xyGrid.x < roundedX &&
        this.map[this.randomMapId][roundedY][roundedX - 1] == 1
      )
        entity.collision.left = true;

      if (
        entity.movement == "right" &&
        entity.xyGrid.x % 1 <= margin &&
        entity.xyGrid.x > roundedX &&
        this.map[this.randomMapId][roundedY][roundedX + 1] == 1
      )
        entity.collision.right = true;

      if (
        entity.movement == "up" &&
        entity.xyGrid.y % 1 >= 1 - margin &&
        entity.xyGrid.y < roundedY &&
        this.map[this.randomMapId][roundedY - 1][roundedX] == 1
      )
        entity.collision.up = true;

      if (
        entity.movement == "down" &&
        entity.xyGrid.y % 1 <= margin &&
        entity.xyGrid.y > roundedY &&
        this.map[this.randomMapId][roundedY + 1][roundedX] == 1
      )
        entity.collision.down = true;
    },

    movePlayer() {
      if (
        this.entityInfo.player.movement == "left" &&
        !this.entityInfo.player.collision.left
      ) {
        this.configPlayer.x -= Math.floor(this.laneWidth * 0.1);
        this.configPlayer.y = Math.floor(
          (Math.round(this.entityInfo.player.xyGrid.y) + 0.5) * this.laneWidth
        );
      }

      if (
        this.entityInfo.player.movement == "right" &&
        !this.entityInfo.player.collision.right
      ) {
        this.configPlayer.x += Math.floor(this.laneWidth * 0.1);
        this.configPlayer.y = Math.floor(
          (Math.round(this.entityInfo.player.xyGrid.y) + 0.5) * this.laneWidth
        );
      }

      if (
        this.entityInfo.player.movement == "up" &&
        !this.entityInfo.player.collision.up
      ) {
        this.configPlayer.y -= Math.floor(this.laneWidth * 0.1);
        this.configPlayer.x = Math.floor(
          (Math.round(this.entityInfo.player.xyGrid.x) + 0.5) * this.laneWidth
        );
      }

      if (
        this.entityInfo.player.movement == "down" &&
        !this.entityInfo.player.collision.down
      ) {
        this.configPlayer.y += Math.floor(this.laneWidth * 0.1);
        this.configPlayer.x = Math.floor(
          (Math.round(this.entityInfo.player.xyGrid.x) + 0.5) * this.laneWidth
        );
      }
    },
    moveGhost({ config, entity }) {
      var possibleDirection = [];
      if (!entity.collision[entity.movement])
        possibleDirection.push(entity.movement);

      switch (entity.movement) {
        case "left":
          config.x -= Math.floor(this.laneWidth * 0.1);
          break;
        case "right":
          config.x += Math.floor(this.laneWidth * 0.1);
          break;
        case "up":
          config.y -= Math.floor(this.laneWidth * 0.1);
          break;
        case "down":
          config.y += Math.floor(this.laneWidth * 0.1);
          break;
      }

      switch (entity.movement) {
        case "left":
          config.x -= Math.floor(this.laneWidth * 0.1);
          config.y = Math.floor(
            (Math.round(entity.xyGrid.y) + 0.5) * this.laneWidth
          );
          break;
        case "right":
          config.x += Math.floor(this.laneWidth * 0.1);
          config.y = Math.floor(
            (Math.round(entity.xyGrid.y) + 0.5) * this.laneWidth
          );
          break;
        case "up":
          config.y -= Math.floor(this.laneWidth * 0.1);
          config.x = Math.floor(
            (Math.round(entity.xyGrid.x) + 0.5) * this.laneWidth
          );
          break;
        case "down":
          config.y += Math.floor(this.laneWidth * 0.1);
          config.x = Math.floor(
            (Math.round(entity.xyGrid.x) + 0.5) * this.laneWidth
          );
          break;
      }
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
