<template>
  <div class="container">
    <div class="board">
      <div class="question">
        <button v-for="i in buttons" :style="i.style"></button>
      </div>
      <hr />
      <div class="calculation">
        <button v-for="i in buttons" :style="i.style"></button>
      </div>
      <hr />
      <div class="answer">
        <button v-for="i in buttons" :style="i.style"></button>
      </div>
    </div>
    <div class="drawingBoard" :style="canvasStyle">
      <drawingBoard :Data="configBrush"></drawingBoard>
    </div>
    <div class="function">
      <button @click="drawingFunc('brush')">{{ brushStatusBtn }}</button>
      <button @click="drawingFunc('clear')">clear</button>
      <button @click="drawingFunc('eraser')">eraser</button>
      <button @click="drawingFunc('visibility')">
        {{ drawingBoardStatusBtn }}
      </button>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    drawingBoard: defineAsyncComponent(() =>
      import("@/components/DrawingBoard.vue")
    ),
  },
  data() {
    return {
      buttons: [
        {
          style: {
            backgroundColor: "blue",
            gridColumn: 9,
            gridRow: 1,
          },
        },
        {
          style: {
            backgroundColor: "red",
            gridColumn: 3,
            gridRow: 1,
          },
        },
      ],
      brushStatusBtn: "brush",
      drawingBoardStatusBtn: "hide",
      configBrush: {
        color: "red",
        size: 5,
      },
      canvasStyle: {
        visibility: "visible",
        zIndex: -1,
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

  emits: ["play-effect", "add-record", "next-question"],

  mounted() {},

  methods: {
    drawingFunc(btn) {
      switch (btn) {
        case "visibility":
          if (this.canvasStyle.visibility == "visible") {
            this.canvasStyle.visibility = "hidden";
            this.drawingBoardStatusBtn = "show";
          } else if (this.canvasStyle.visibility == "hidden") {
            this.canvasStyle.visibility = "visible";
            this.drawingBoardStatusBtn = "hide";
          }
          break;
        case "brush":
          if (this.canvasStyle.zIndex == -1) this.canvasStyle.zIndex = 0;
          else if (this.canvasStyle.zIndex == 0) this.canvasStyle.zIndex = -1;
          break;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
}

.board {
  height: 90%;
  width: fit-content;
  margin: auto;
}
.question {
  height: 35%;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 5%;
  padding: 2%;
}
.calculation {
  height: 35%;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 5%;
  padding: 2%;
}
.answer {
  height: 17.5%;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 5%;
  padding: 2%;
}
.board button {
  aspect-ratio: 3/4;
  border: none;
}
hr {
  opacity: 100;
  border: 1px solid black;
}

.function {
  z-index: 2;
  height: 10%;
  width: 70%;
  background-color: aqua;
  display: flex;
  justify-content: space-evenly;
  margin: auto;
}
.function button {
  border: none;
  margin: 2%;
  width: 20%;
}

.drawingBoard {
  height: 95%;
  width: 95%;
  position: absolute;
  top: 0;
}
</style>
