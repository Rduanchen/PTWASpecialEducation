<template>
  <div class="word-problem">
    <div class="left-container">
      <Markdown
        :Data="markdownData"
        @ReplyAnswer="this.markdownAnswer"
      ></Markdown>
      <button class="submit" @click="checkAnswer">檢查答案</button>
    </div>
    <div class="right-container">
      <Calculator
        :Data="calculatorData"
        @ReplyAnswer="this.calculatorAnswer"
      ></Calculator>
    </div>
  </div>
</template>
<script>
import Calculator from "@/components/Calculator.vue";
import Markdown from "@/components/Markdown.vue";
import { wordProblemWithCalculator as emitter } from "@/utilitys/mitt.js";
import { toDisplayString } from "vue";
export default {
  name: "WordProblemWithCalculator",
  components: {
    Calculator,
    Markdown,
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
    id: {
      type: String,
      required: true,
    },
  },
  emits: ["addRecord", "playEffect", "nextQuestion"],
  data() {
    return {
      GameData: {
        calculator: {
          Unit: "Volume",
          CarryAmount: 1,
          CustomeUnit: null,
          NumberAmount: 4,
          decimalPoint: 0,
          Preset: {
            Number: ["1200", "1300"],
            Symbol: "+",
          },
          Answer: {
            Carry: [],
            Answer: "2500",
            Number: ["1200", "1300"],
            Symbol: "+",
          },
        },
        markdown: {
          Render: `# 請回答以下問題: $n$ 1公升 200毫升+1公升300毫升= $n$ $i$公升 $i$ 毫升`,
          Answer: [2, 500],
        },
      },
      calculatorData: {
        Unit: "Volume",
        CarryAmount: 1,
        CustomeUnit: null,
        NumberAmount: 4,
        decimalPoint: 0,
        Preset: {
          Number: ["1200", "1300"],
          Symbol: "+",
        },
        Answer: {
          Carry: [],
          Answer: "2500",
          Number: ["1200", "1300"],
          Symbol: "+",
        },
      },
      markdownData: {
        Render: `# 請回答以下問題: $n$ 1公升 200毫升+1公升300毫升= $n$ $i$公升 $i$ 毫升`,
        Answer: [2, 500],
      },
      markdownAnswerStatus: false,
      calculatorAnswerStatus: false,
    };
  },
  methods: {
    checkAnswer() {
      if ((this.GameConfig.calculatorVerify = false))
        this.calculatorAnswerStatus = true;
      if ((this.GameConfig.markdownVerify = false))
        this.markdownAnswerStatus = true;

      emitter.emit("checkAnswer");
      if (this.markdownAnswerStatus && this.calculatorAnswerStatus) {
        this.$emit("play-effect", "CorrectSound");
        this.$emit("addRecord", ["答案全對", "", "正確"]);
        this.$emit("next-question");
      } else if (
        this.markdownAnswerStatus == false &&
        this.calculatorAnswerStatus == false
      ) {
        this.$emit("addRecord", ["答案全錯", "", "錯誤"]);
        this.$emit("playEffect", "WrongSound");
      } else if (this.calculatorAnswerStatus == false) {
        this.$emit("addRecord", ["計算機答案錯誤", "", "錯誤"]);
        this.$emit("playEffect", "WrongSound");
      } else if (this.markdownAnswerStatus == false) {
        this.$emit("addRecord", ["填空部分出現錯誤", "", "錯誤"]);
        this.$emit("playEffect", "WrongSound");
      }
    },
    calculatorAnswer(answer) {
      this.calculatorAnswerStatus = answer;
    },
    markdownAnswer(answer) {
      console.log(answer);
      this.markdownAnswerStatus = answer;
    },
  },
  computed: {
    // Add your computed properties here
  },
  created() {},
  mounted() {
    // Lifecycle hook when component is mounted
  },
};
</script>
<style scoped lang="scss">
.word-problem {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: $gap--medium;
  width: 100%;
  height: 100%;
  .left-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: $gap--small;
    min-height: 50%;
    .markdown {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius;
      height: 80%;
      width: 50%;
    }
    .submit {
      @extend .button-basic;
      width: 100%;
      border: none;
      min-height: 50px;
      background-color: $submit-color;
      &:hover {
        @extend .button--animation;
        background-color: $submit-color;
      }
    }
  }
}
</style>
