<template>
  <div
    class="row levelbutton d-sm-none d-md-block d-none d-sm-block"
    v-if="GameStatus == 'Progressing'"
  >
    <div class="d-grid gap-2 d-flex justify-content-center mb-3 levebar">
      <button
        type="button"
        class="btn btn-primary flex-fill text-nowrap"
        disabled
      >
        關卡
      </button>
      <div
        v-for="(i, key) in questions"
        :key="key"
        class="grid-item flex-fill d-flex justify-content-between"
      >
        <button
          type="button"
          class="btn btn-success flex-fill"
          :class="{ active: Nowlevel == key + 1 }"
          @click="changelevel(key + 1)"
        >
          {{ key + 1 }}
        </button>
      </div>
      <button
        type="button"
        class="btn btn-primary flex-fill text-nowrap"
        disabled
        v-if="GameStatus == 'Progressing'"
      >
        時間 : {{ time }}
      </button>
      <button
        type="button"
        class="btn btn-primary flex-fill text-nowrap"
        disabled
        v-if="GameStatus == 'Progressing'"
      >
        總計時間 : {{ totaltime }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import gameStore from "@/stores/game";

export default {
  data() {
    return {};
  },
  props: {
    time: {
      type: Number,
    },
    totaltime: {
      type: Number,
    },
    questions: {
      type: Array,
    },
  },
  methods: {
    changelevel(change2level) {
      this.resetWrongTimes();
      if (change2level > this.questions.length || change2level < 1) {
        console.log("The level is out of range");
      } else {
        if (this.Nowlevel > change2level) {
          this.transitionName = "slide-right";
        } else if (this.Nowlevel < change2level) {
          this.transitionName = "slide-left";
        }
        this.Nowlevel = change2level;
        this.pauseTimer();
        //FIXME 傳資料進入CSV
        this.resetTimer();
        this.startTimer();
      }
    },
    pauseTimer() {
      this.$emit("pause-timer");
    },
    resetTimer() {
      this.$emit("reset-timer");
    },
    startTimer() {
      this.$emit("start-timer");
    },
    resetWrongTimes() {
      this.$emit("reset-wrong-timer");
    },
  },
  computed: {
    ...mapWritableState(gameStore, [
      "transitionName",
      "GameStatus",
      "Nowlevel",
    ]),
  },
};
</script>

<style scoped lang="scss">
.levebar {
  // overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
