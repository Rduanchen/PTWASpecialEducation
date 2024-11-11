<template>
  <div class="gameContainer">
    <dragFraction
      :Data="configFraction"
      :ID="id"
      @getAnswer="drag"
    ></dragFraction>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    dragFraction: defineAsyncComponent(() =>
      import("@/components/DragFraction.vue")
    ),
  },
  data() {
    return {
      configFraction: {
        verifyOption: "answer",
        shape: "circle",
        answer: {
          numerator: 1,
          denominator: 4,
        },
      },
      id: "MA3029",
    };
  },

  props: {},

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
