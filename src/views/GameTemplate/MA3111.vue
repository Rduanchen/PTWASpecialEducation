<template>
  <div class="game">
    <FractionDisplay
      :data="GameData.question"
      class="fraction"
    ></FractionDisplay>
    <div ref="fractionChart" class="fraction-chart">
      <FractionChart
        :gameWidth="chartWidth"
        :gameHeight="chartHeight"
        :numerator="numerator"
        :denominator="denominator"
        :shape="shape"
        @mounted="calculateChartSize"
      ></FractionChart>
    </div>
    <DragFraction
      :Data="configFraction"
      :ID="id"
      @getAnswer="drag"
      class="answer-area"
    ></DragFraction>
    <button class="check-answer-btn" @click="checkAnswer">確認答案</button>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import FractionChart from "@/components/FractionChart.vue";
export default {
  props: {
    GameData: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    GameConfig: {
      type: Object,
      required: true,
    },
  },
  components: {
    FractionChart,
    FractionDisplay: defineAsyncComponent(() =>
      import("@/components/FractionDisplay.vue")
    ),
    DragFraction: defineAsyncComponent(() =>
      import("@/components/DragFraction.vue")
    ),
  },
  data() {
    return {
      configFraction: this.GameData.answerData,
      chartWidth: 0,
      chartHeight: 0,
      numerator: this.GameData.answerData.answer.numerator, // 分子
      denominator: this.GameData.answerData.answer.denominator, // 分母
      isAnswerCorrect: false,
      shape: this.GameData.answerData.shape,
    };
  },
  computed: {},
  methods: {
    drag(answer) {
      this.isAnswerCorrect = answer;
    },
    calculateChartSize() {
      const fractionChart = this.$refs.fractionChart;
      if (fractionChart) {
        this.chartWidth = fractionChart.offsetWidth * 0.85 || 150; // 確保有預設值
        this.chartHeight = fractionChart.offsetHeight * 0.85 || 150; // 確保有預設值
      } else {
        console.error("FractionChart not found!");
      }
    },
    checkAnswer() {
      if (this.isAnswerCorrect) {
        this.$emit("next-question", true);
      } else {
        this.$emit("play-effect", "WrongSound");
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.calculateChartSize);
    this.$nextTick(() => {
      setTimeout(() => {
        this.calculateChartSize();
      }, 200);
    });
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateChartSize); // 移除事件監聽器
  },
};
</script>

<style scoped lang="scss">
.game {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  gap: 0.5rem;
  position: relative; /* 為了讓按鈕的定位參考 .game 容器 */
}

.game-section {
  border: $border--normal solid #000;
  border-radius: $border-radius;
  gap: $gap--small;
  padding: $padding--small;
  height: 50vh;
}

.fraction {
  flex: 1;
  min-width: 150px; // 確保有最小寬高
  min-height: 150px; // 確保有最小寬高
  @extend .game-section;
}

.fraction-chart {
  flex: 1;
  @extend .game-section;
}

.answer-area {
  flex: 2;
  @extend .game-section;
}

/* 確認答案按鈕固定在右下角 */
.check-answer-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  @extend .button-basic;
}
</style>
