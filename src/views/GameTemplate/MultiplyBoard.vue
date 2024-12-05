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
    <div class="function">
      <button>brush</button>
      <button>clear</button>
      <button>eraser</button>
      <button>hide</button>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {},
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

  mounted() {
    this.initializeScene();
  },

  methods: {
    initializeScene() {},
    update() {},
  },
};
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  width: auto;
}
.board {
  height: 90%;
  background-color: darkcyan;
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

.function {
  height: 10%;
  width: 100%;
  background-color: aqua;
  display: flex;
  justify-content: space-evenly;
}
.function button {
  border: none;
  margin: 2%;
  width: 20%;
}
</style>
