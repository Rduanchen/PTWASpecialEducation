<template>
  <v-stage :config="{ width: gameWidth, height: gameHeight }">
    <!-- 分子（填滿部分）在下層 -->
    <v-layer>
      <v-shape :config="configNumerator"></v-shape>
    </v-layer>
    <!-- 分母（虛線部分）在上層 -->
    <v-layer>
      <v-shape :config="configDenominator"></v-shape>
    </v-layer>
  </v-stage>
</template>

<script>
export default {
  name: "FractionChart",
  props: {
    gameWidth: {
      type: Number,
      required: true,
    },
    gameHeight: {
      type: Number,
      required: true,
    },
    numerator: {
      type: Number,
      required: true,
    },
    denominator: {
      type: Number,
      required: true,
    },
    shape: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    // 分母：劃分圓形
    configDenominator() {
      return {
        radius: this.gameWidth * 0.4,
        stroke: "black",
        strokeWidth: 2,
        x: this.gameWidth * 0.5,
        y: this.gameHeight * 0.5,
        sceneFunc: this.sliceSceneFunc,
        slices: this.denominator,
      };
    },
    // 分子：填滿圓形
    configNumerator() {
      return {
        radius: this.gameWidth * 0.4,
        fill: "#4C5B3A",
        x: this.gameWidth * 0.5,
        y: this.gameHeight * 0.5,
        startRadians: 0,
        endRadians: (Math.PI * 2 * this.numerator) / this.denominator,
        sceneFunc: this.circleSceneFunc,
      };
    },
  },
  methods: {
    // 圓形分割的邏輯（分母）
    sliceSceneFunc(context, shape) {
      context.beginPath();
      context.setLineDash([5, 5]);
      context.lineWidth = shape.getAttr("strokeWidth");
      for (let i = 0; i < shape.getAttr("slices"); ++i) {
        context.moveTo(0, 0);
        context.lineTo(0, -shape.getAttr("radius"));
        context.moveTo(0, 0);
        context.rotate((Math.PI * 2) / shape.getAttr("slices"));
      }
      context.stroke();
      context.closePath();
    },
    // 圓形填滿的邏輯（分子）
    circleSceneFunc(context, shape) {
      context.beginPath();
      context.moveTo(0, 0);
      context.rotate(Math.PI * -0.5);
      context.arc(
        0,
        0,
        shape.getAttr("radius"),
        shape.getAttr("startRadians"),
        shape.getAttr("endRadians")
      );
      context.lineTo(0, 0);
      context.fillStrokeShape(shape);
      context.closePath();
    },
  },
};
</script>

<style scoped></style>
