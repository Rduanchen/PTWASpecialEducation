<template>
  <div>
    <select @change="(event) => (tester = event.target.value)">
      <option>numberLine</option>
      <option>fraction</option>
      <option selected>drawShapes</option>
    </select>
  </div>
  <div v-if="tester == 'fraction'">
    <dragFraction
      :Data="configFraction"
      :ID="id"
      @getAnswer="drag"
    ></dragFraction>
  </div>
  <div v-if="tester == 'numberLine'">
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
    dragFraction: defineAsyncComponent(() =>
      import("@/components/DragFraction.vue")
    ),
    numberLine: defineAsyncComponent(() =>
      import("@/components/DragOnNumberLine.vue")
    ),
  },
  data() {
    return {
      tester: "drawShapes",
      configFraction: {
        verifyOption: "answer",
        shape: "circle",
        answer: {
          numerator: 1,
          denominator: 4,
        },
      },
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

  props: {},

  emits: ["play-effect", "add-record", "next-question"],

  methods: {
    drag(x) {
      console.log(x);
    },
  },
};
</script>
