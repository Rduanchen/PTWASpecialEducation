<template>
  <div class="fraction-for-answer" ref="container">
    <input
      ref="numerator"
      class="fraction-input numerator"
      type="text"
      @click="showNumPad('numerator', $event)"
    />
    <span class="line"></span>
    <input
      ref="denominator"
      class="fraction-input denominator"
      type="text"
      @click="showNumPad('denominator', $event)"
    />
  </div>
  <FloatNumPad
    v-if="virtualNumpadSwitch"
    :data="numPadPosition"
    @button-clicked="numPadButtonClicked"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "FractionForAnswer",
  props: {
    answerData: {
      type: Object,
      required: true,
    },
  },
  emits: ["validation"],
  components: {
    FloatNumPad: defineAsyncComponent(() =>
      import("@/components/FloatNumPad.vue")
    ),
  },
  data() {
    return {
      virtualNumpadSwitch: false,
      numPadPosition: {
        top: 0,
        left: 0,
      },
      activeInputRef: "",
    };
  },
  methods: {
    showNumPad(inputRef, event) {
      const inputRect = event.target.getBoundingClientRect();

      this.activeInputRef = inputRef;

      this.numPadPosition = {
        top: `${inputRect.bottom + window.scrollY + 10}px`,
        left: `${inputRect.left + window.scrollX}px`,
      };

      this.virtualNumpadSwitch = true;
    },
    numPadButtonClicked(label) {
      switch (label) {
        case "清除":
          this.clearActiveInput();
          break;
        case "關閉":
          this.closeNumPad();
          break;
        default:
          this.updateInputValue(label);
          this.validateAnswer();
          break;
      }
    },
    validateAnswer() {
      const userNumerator = this.$refs.numerator.value;
      const userDenominator = this.$refs.denominator.value;
      console.log("使用者答案：", userNumerator, userDenominator);

      const isCorrect =
        parseInt(userNumerator, 10) === this.answerData.numerator &&
        parseInt(userDenominator, 10) === this.answerData.denominator;

      this.$emit("validation", isCorrect);
    },
    closeNumPad() {
      this.virtualNumpadSwitch = false;
    },
    clearActiveInput() {
      if (this.activeInputRef) {
        this.$refs[this.activeInputRef].value = "";
      }
    },
    updateInputValue(label) {
      if (this.activeInputRef) {
        const input = this.$refs[this.activeInputRef];
        if (input.value.length < 4) {
          input.value += label;
        }
      }
    },
  },
};
</script>

<style scoped>
.fraction-for-answer {
  display: inline-block;
  text-align: center;
}

.fraction-input {
  width: 100%;
  padding: 5px;
  text-align: center;
}

.line {
  display: block;
  border-top: 2px solid black;
  width: 100%;
  margin: 2px 0;
}
</style>
