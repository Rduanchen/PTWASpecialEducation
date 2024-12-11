<template>
  <div class="game-over__container" id="Done">
    <img :src="fireworkSrc" class="effects" />
    <div class="game-over__button-group">
      <button class="action-btn" v-on:click="endGame">結束遊戲</button>
      <button class="action-btn" v-on:click="download">
        結束遊戲(下載紀錄)
      </button>
      <button class="action-btn" v-on:click="restartGame">重新開始</button>
    </div>
  </div>
</template>

<script>
import { getSystemEffectAssets } from "@/utilitys/get_assets.js";
export default {
  name: "GameOver",
  methods: {
    restartGame() {
      this.$emit("restart");
    },
    download() {
      this.$emit("download-record");
    },
    endGame() {
      this.$emit("previous-page");
    },
  },
  computed: {
    fireworkSrc() {
      return getSystemEffectAssets("Firework.gif");
    },
  },
};
</script>

<style scoped lang="scss">
.game-over__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .game-over__button-group {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    .action-btn {
      background-color: $primary-color;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      &:hover {
        transform: scale($transform-scale);
      }
    }
  }
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
.effects {
  height: 50vh;
  width: auto;
  max-width: 500px;
}
</style>
