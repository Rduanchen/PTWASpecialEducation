<template>
  <div class="outter-container container">
    <div class="head-container">
      {{ this.GameData.headQuestion }}
    </div>
    <div class="game-area" style="border: solid">
      <DrawShapes
        :Data="configDrawShapes"
        :ID="this.id"
        @replyAnswer="getComponentsReply"
      ></DrawShapes>
    </div>
  </div>
  {{ componentsReplyAnswer }}
</template>

<script>
import DrawShapes from "@/components/DrawShapes.vue";
export default {
  name: "MA3056",
  components: {
    DrawShapes,
  },
  data() {
    return {
      id: "MA3056",
      componentsReplyAnswer: false,
      GameData: {
        headQuestion: "Draw a rectangle with 5 units long and 3 units wide.",
        formVerify: {
          type: "rect",
          answer: [2, 2],
        },
      },
      configDrawShapes: {
        verifyOption: "rect", //none, rect, shape
        answer: [5, 3], //[5, 3], // triangle, rectangle, trapezium, parallelogram
      },
    };
  },
  methods: {
    // Add your component methods here
    getComponentsReply(answer) {
      this.componentsReplyAnswer = answer;
    },
  },
  computed: {
    // Add your computed properties here
  },
};
</script>

<style scoped lang="scss">
.outter-container {
  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: $gap--medium;
  max-height: 100vh !important;
  .head-container {
    @extend .container-basic;
    background-color: $primary-color;
    padding: $gap--small;
  }
  .game-area {
    border-radius: $border-radius;
    padding: $gap--small;
    DrawShapes {
      width: 500px;
      height: 500px;
    }
  }
}
</style>
