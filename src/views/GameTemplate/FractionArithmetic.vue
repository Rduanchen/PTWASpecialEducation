<template>
  <div class="game">
    <div class="question-and-answer">
      <FractionDisplay
        :data="questionLeftTerm"
        class="fraction"
      ></FractionDisplay>
      <span class="math-symbol" v-html="operation"></span>
      <FractionDisplay
        :data="questionRightTerm"
        class="fraction"
      ></FractionDisplay>
      <span class="math-symbol">&#61;</span>
      <FractionForAnswer
        ref="fractionsComponent"
        :answerData="answerData"
        @validation="handleValidation"
      ></FractionForAnswer>
      <button @click="triggerValidation">送出答案</button>
    </div>
    <div class="check-calculation">
      <DragFraction
        :Data="checkCalculationData"
        class="check-calculation-components"
      ></DragFraction>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import FractionForAnswer from "@/components/FractionForAnswer.vue";

export default {
  name: "FractionArithmetic",
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
    FractionDisplay: defineAsyncComponent(() =>
      import("@/components/FractionDisplay.vue")
    ),
    DragFraction: defineAsyncComponent(() =>
      import("@/components/DragFraction.vue")
    ),
    FractionForAnswer,
  },
  data() {
    return {
      questionLeftTerm: this.GameData.Question.LeftTerm,
      questionRightTerm: this.GameData.Question.RightTerm,
      operation: this.GameData.Question.OperationType,
      checkCalculationData: this.GameData.AcheckCalculationData,
      answerData: this.GameData.Answer,
      isAnswerRight: false,
    };
  },
  methods: {
    handleValidation(result) {
      console.log(result);
      this.isAnswerRight = result;
    },
    triggerValidation() {
      if (this.isAnswerRight) {
        this.$emit("next-question", true);
      } else {
        this.$emit("play-effect", "WrongSound");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.game {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
}

.question-and-answer {
  display: flex;
  height: 15vh;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  gap: 3rem;
  width: 100%;
  @extend .game-section;
}

.math-symbol {
  font-size: 5rem;
}

.check-calculation {
  flex: 1;
  display: flex;
  height: 80%;
  width: 100%;
  align-items: center;
  justify-content: center;
  @extend .game-section;
}

.fraction {
  flex: 1;
}

.game-section {
  border: $border--normal solid #000;
  border-radius: $border-radius;
  gap: $gap--small;
  padding: $padding--small;
}

.check-calculation-components {
  width: 70%;
}

.check-answer {
  @extend .button-basic;
}
</style>
