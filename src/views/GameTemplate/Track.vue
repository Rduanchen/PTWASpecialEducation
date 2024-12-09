<template>
  <div class="container">
    <div class="progress">
      <div
        class="progress-bar"
        role="progressbar"
        :style="{ width: progressBarWidth }"
        aria-valuenow="progressPercentage"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
    <div class="gameAndQuestion">
      <!-- Life bar section -->
      <!-- <div class="life-bar">
      <div class="life-container">
        <img v-for="index in totalLives" :key="index" :src="index <= remainingLives ? heartImageUrl : deadHeartImageUrl"
          class="heart-icon" />
      </div>
      <div class="volume-control">
        <img :src="isMuted ? muteIconUrl : unmuteIconUrl" @click="toggleMute" class="volume-icon" />
        <div v-if="showVolumeSlider" class="slider-container">
          <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="adjustVolume"
            class="volume-slider" />
        </div>
      </div>
    </div> -->

      <!-- Conveyor belt section -->
      <div class="box ratio-7">
        <div
          class="conveyor-belt"
          :class="{ paused: isPaused }"
          :style="conveyorStyle"
        >
          <div
            class="conveyor-item"
            v-for="(item, index) in currentQuestions"
            :key="index"
          >
            <div class="question-container">
              <component
                :is="this.GameData.Question[currentQuestions[index]].name"
                :Data="this.GameData.Question[currentQuestions[index]].Data"
                :ID="this.ID"
              ></component>
              <!-- <p class="question-text">{{ item.Question }}</p> -->
            </div>
          </div>
        </div>
      </div>
      <!-- Spacer between conveyor belt and answer buttons -->
      <!-- <div class="spacer"></div> -->
      <!-- Answer buttons or home page -->
      <div class="box ratio-3">
        <div class="button-container">
          <button
            v-for="(selection, index) in this.GameData.Question[
              currentQuestions[currentQuestionIndex]
            ].Selections"
            :key="index"
            :class="[
              'big-button',
              { 'wrong-answer': wrongAnswerIndex === index },
            ]"
            @click="handleAnswer(index)"
          >
            {{ selection }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import heartImageUrl from "@/assets/images/pics/heart.png";
import deadHeartImageUrl from "@/assets/images/pics/dead_heart.png";
import muteIconUrl from "@/assets/images/pics/mute.png";
import unmuteIconUrl from "@/assets/images/pics/unmute.png";
import gameplayMusic from "@/assets/sounds/game_sounds/gameplay-music.mp3";
import clickSound from "@/assets/sounds/game_sounds/click-sound.mp3";
import wrongSound from "@/assets/sounds/game_sounds/wrong_sound_effect.mp3";
import { getComponents } from "@/utilitys/get-components.js";
import { soundManager } from "@/utilitys/sound-manager.js";

export default {
  name: "QuizComponent",
  data() {
    return {
      heartImageUrl,
      deadHeartImageUrl,
      gameplayMusic,
      muteIconUrl,
      unmuteIconUrl,
      clickSound,
      wrongSound,
      showHomePage: true,
      totalLives: 3,
      remainingLives: 3,
      backgroundMusicVolume: 0.01,
      clickSoundVolume: 0.7,
      wrongSoundVolume: 1.0,
      isMuted: false,
      showVolumeSlider: false,
      volume: 0.15,
      wrongAnswerIndex: null,
      currentQuestions: [], //題目陣列位置
      currentQuestionIndex: 0, //目前的題目
      isPaused: true,
    };
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
    ID: {
      type: String,
      required: true,
    },
  },
  computed: {
    conveyorStyle() {
      const numQuestions = this.currentQuestions.length;
      const widthPercentage = numQuestions * 100; // Each question contributes 100% to the width
      const translateX = (this.currentQuestionIndex / numQuestions) * 100;

      return {
        width: `${widthPercentage}%`,
        transform: `translateX(-${translateX}%)`,
        transition: "transform 1.5s linear",
        whiteSpace: "nowrap",
      };
    },
    progressPercentage() {
      return (this.currentQuestionIndex / this.currentQuestions.length) * 100;
    },
    progressBarWidth() {
      return `${this.progressPercentage}%`;
    },
  },
  methods: {
    startQuiz() {
      this.playBackgroundMusic();
      this.playCkickSound();
      this.currentQuestionIndex = 0;
      this.isPaused = false;
      this.wrongAnswerIndex = null;
      this.currentQuestions = this.generateRandomOrder(
        this.GameData.Question.length
      );
      this.pauseConveyor();
    },
    handleAnswer(selectedIndex) {
      var ansIndex =
        this.GameData.Question[this.currentQuestions[this.currentQuestionIndex]]
          .AnswerIndex;
      this.isPaused = false;
      if (selectedIndex === ansIndex) {
        this.$emit("add-record", [
          this.GameData.Question[
            this.currentQuestions[this.currentQuestionIndex]
          ].Selections[ansIndex],
          this.GameData.Question[
            this.currentQuestions[this.currentQuestionIndex]
          ].Selections[selectedIndex],
          "正確",
        ]);
        this.currentQuestionIndex += 1;
        if (this.currentQuestionIndex === this.GameData.Question.length) {
          this.$emit("next-question", true);
        } else {
          this.$emit("play-effect", "CorrectSound");
        }
        this.wrongAnswerIndex = null;
        // this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.currentQuestions.length;
      } else {
        this.$emit("add-record", [
          this.GameData.Question[
            this.currentQuestions[this.currentQuestionIndex]
          ].Selections[ansIndex],
          this.GameData.Question[
            this.currentQuestions[this.currentQuestionIndex]
          ].Selections[selectedIndex],
          "錯誤",
        ]);
        this.remainingLives -= 1;
        this.wrongAnswerIndex = selectedIndex;
        this.$emit("play-effect", "WrongSound");
      }
      setTimeout(() => {
        this.pauseConveyor();
      }, 2000);
    },
    pauseConveyor() {
      this.isPaused = true;
    },
    playCkickSound() {
      soundManager.playSoundImmediately("trackClickSound", true, false);
    },
    playBackgroundMusic() {
      soundManager.playSoundLoop("trackBackgroundMusic", true, true);
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      this.$refs.backgroundMusic.volume = this.isMuted ? 0 : 0.15;
      if (this.isMuted) {
        this.$refs.backgroundMusic.pause();
      } else {
        this.$refs.backgroundMusic.play();
      }
    },
    adjustVolume(event) {
      this.volume = event.target.value;
      if (!this.isMuted) {
        this.$refs.backgroundMusic.volume = this.volume;
      }
    },
    generateRandomOrder(total) {
      const order = [];
      while (order.length < total) {
        let randomIndex = Math.floor(Math.random() * total);
        if (!order.includes(randomIndex)) {
          order.push(randomIndex);
        }
      }
      return order;
    },
  },
  components: {
    TextOnly: getComponents("TextOnly"),
    ImageContainer: getComponents("ImageContainer"),
  },
  created() {
    soundManager.registerSound(
      "trackBackgroundMusic",
      `${gameplayMusic}`,
      true
    );
    soundManager.registerSound("trackClickSound", `${clickSound}`, true);
    this.startQuiz();
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.gameAndQuestion {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: transparent;
}

.life-bar {
  width: 100%;
  height: 50px;
  /* background-color: #f0f0f0; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}

.life-container {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.heart-icon {
  width: 40px;
  height: 38px;
  margin: 7px;
}

.box {
  flex: 1;
  background-size: cover;
  background-position: center;
  position: relative;
}

.ratio-7 {
  flex: 7;
  position: relative;
  overflow: hidden;
}

.conveyor-belt {
  display: flex;
  flex-direction: row;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.conveyor-item {
  width: calc(100% / 3);
  height: 100%;
  background-image: url("@/assets/images/pics/track2.png");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-container {
  height: 90%;
  width: 90%;
  padding: 0;
  background-color: transparent;
  border-radius: 10px;
  z-index: 10;
}

.question-text {
  font-size: 7.5rem;
  color: #ffffff;
  text-align: center;
}

.ratio-3 {
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d3d3d3;
}

.button-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: space-between;
}

.big-button {
  flex: 2;
  margin: 10px;
  font-size: calc(2rem + 1vw);
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.big-button:hover {
  background-color: #45a049;
}

.big-button.wrong-answer {
  background-color: #f44336;
}

.volume-control {
  display: flex;
  align-items: center;
  position: absolute;
  top: -5px;
  right: 0;
  padding: 10px;
  box-sizing: border-box;
  z-index: 20;
}

.volume-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.slider-container {
  display: none;
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
}

.volume-control:hover .slider-container {
  display: block;
}

.volume-slider {
  width: 100px;
}

@media (min-height: 600px) {
  .question-container {
    height: 80%;
  }
}

.progress {
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 20px;
  background-color: #4caf50;
  transition: width 0.5s ease;
}

:deep(.word) {
  color: #fff;
}
</style>
