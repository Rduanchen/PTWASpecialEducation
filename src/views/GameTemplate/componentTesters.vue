<template>
  <div>
    <select @change="(event) => (tester = event.target.value)">
      <option>numberLine</option>
      <option>fraction</option>
      <option>drawShapes</option>
      <option>dragToAlign</option>
      <option selected>dragImages</option>
    </select>
  </div>
  <div v-if="tester == 'fraction'">
    <dragFraction
      :Data="configFraction"
      :ID="id"
      @replyAnswer="printAns"
    ></dragFraction>
  </div>
  <div v-if="tester == 'numberLine'">
    <numberLine
      :Data="configNumberLine"
      :ID="id"
      @getDragPosition="printAns"
    ></numberLine>
  </div>
  <div v-if="tester == 'drawShapes'">
    <drawShapes
      :Data="configDrawShapes"
      :ID="id"
      @replyAnswer="printAns"
    ></drawShapes>
  </div>
  <div v-if="tester == 'dragToAlign'">
    <dragToAlign :Data="configDragToAlign" :ID="id"></dragToAlign>
  </div>
  <div v-if="tester == 'dragImages'">
    <dragImages :Data="configDragImages" :ID="id"></dragImages>
  </div>
</template>

<script>
import { getGameAssets } from "@/utilitys/get_assets.js";
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
    drawShapes: defineAsyncComponent(() =>
      import("@/components/DrawShapes.vue")
    ),
    dragToAlign: defineAsyncComponent(() =>
      import("@/components/DragToAlign.vue")
    ),
    dragImages: defineAsyncComponent(() =>
      import("@/components/DragImages.vue")
    ),
  },
  data() {
    return {
      tester: "dragImages",
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
        image: "apple.png",
      },
      configDrawShapes: {
        //bgRatio: [],
        /*givenPoints: [
          [2, 2],
          [2, 5],
        ],*/
        verifyOption: "rect", //none, rect, shape
        answer: [5, 3], //[5, 3], // triangle, rectangle, trapezium, parallelogram
      },
      configDragToAlign: {
        imageRatio: [5, 3],
        image: "apple.png",
      },
      configDragImages: {
        images: [
          {
            path: "apple.png",
            ratio: {
              width: 3,
              height: 3,
            },
          },
          {
            path: "sugar.png",
            ratio: {
              width: 2,
              height: 5,
            },
          },
        ],
        background: "black",
      },
      id: "Dev0105",
    };
  },
  methods: {
    printAns(x) {
      console.log(x);
    },
  },
};
</script>
