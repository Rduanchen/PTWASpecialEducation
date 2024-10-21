<template>
  <div class="gameContainer">
    <numberLine
      :Data="configNumberLine"
      :ID="id"
      @getDragPosition="drag"
    ></numberLine>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    numberLine: defineAsyncComponent(() =>
      import("@/components/DragOnNumberLine.vue")
    ),
  },
  data() {
    return {
      configNumberLine: {
        spacing: 1,
        max: 10,
        min: 2,
        init_pos: 5,
        image: "RacingCar.png",
      },
      id: "MA3029",
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
    this.initializeScene();
  },

  mounted() {},

  methods: {
    initializeScene() {},
    update() {},
    drag(x) {
      console.log(x);
    },
  },
};
</script>
