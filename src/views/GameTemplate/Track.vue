<template>
  <div class="container">
    <div class="life-bar">
      <div class="life-container">
        <img v-for="index in totalLives" :key="index" :src="index <= remainingLives ? heartImageUrl : deadHeartImageUrl" class="heart-icon" />
      </div>
      <div class="volume-control">
        <img :src="isMuted ? muteIconUrl : unmuteIconUrl" @click="toggleMute" class="volume-icon" />
        <div v-if="showVolumeSlider" class="slider-container">
          <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="adjustVolume" class="volume-slider" />
        </div>
      </div>
    </div>
    <!-- <div class="box ratio-7">
      <div class="conveyor-belt" :class="{ 'paused': isPaused }" :style="conveyorStyle">
        <div class="conveyor-item" v-for="(item, index) in conveyorItems" :key="index">
          <div class="question-container">
            <p class="question-text">{{ item }}</p>
          </div>
        </div>
      </div>
    </div> -->
    <div class="box ratio-7">
      <div class="conveyor-belt" :class="{ 'paused': isPaused }" :style="conveyorStyle">
        <div class="conveyor-item" v-for="(item, index) in conveyorItems" :key="index">
          <div class="question-container">
            <p class="question-text">{{ item }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="spacer"></div>
    <!-- <div class="box ratio-3" v-if="!showHomePage">
      <div class="button-container">
        <button class="big-button" @click="handleAnswer">A</button>
        <button class="big-button" @click="handleAnswer">B</button>
        <button class="big-button" @click="handleAnswer">C</button>
      </div>
    </div> -->
    <div class="box ratio-3" v-if="!showHomePage">
      <div class="button-container">
        <button class="big-button" @click="handleAnswer(index)" v-for="item in this.GameData.Selections">{{ item }}</button>
      </div>
    </div>
    <div class="box ratio-3" v-if="showHomePage">
      <div class="button-container">
        <button class="big-button" @click="startQuiz">Start Quiz</button>
      </div>
    </div>
    <!-- Hidden audio elements for sound effects and background music -->
    <audio ref="backgroundMusic" :src="gameplayMusic" loop></audio>
    <audio ref="startGameSound" :src="startGameSound"></audio>
  </div>
</template>

<script>
import heartImageUrl from '@/assets/images/pics/heart.png';
import deadHeartImageUrl from '@/assets/images/pics/dead_heart.png';
import muteIconUrl from '@/assets/images/pics/mute.png'; 
import unmuteIconUrl from '@/assets/images/pics/unmute.png'; 
import startGameSound from '@/assets/sounds/game_sounds/start-game.mp3';
import gameplayMusic from '@/assets/sounds/game_sounds/gameplay-music.mp3'
export default {
  name: 'QuizComponent',
  data() {
    return {
      heartImageUrl,
      deadHeartImageUrl,
      startGameSound,
      gameplayMusic,
      muteIconUrl,
      unmuteIconUrl,
      GameData: {
        "Questions": [
            {
                Questions: "What is the capital of France?",
                Selections: ["Paris", "London", "Berlin", "Madrid"],
                AnsewerIndex: 0
            }
        ]
      },
      showHomePage: true,  
    //   conveyorItems: [
    //     'Welcome!',
    //     'Question 1',
    //     'Question 2',
    //     'Question 3',
    //     'Question 4',
    //     'Question 5'
    //   ],
    conveyorItems: [
        'Welcome!',
      ],
      currentQuestion: 0,
      isPaused: true,
      totalLives: 3,
      remainingLives: 3,
      backgroundMusicVolume: 0.3,
      startGameSoundVolume: 1.0,
      isMuted: false,
      showVolumeSlider: false,
      volume: 0.3 // Initial volume level
    };
  },
  computed: {
    conveyorStyle() {
      return {
        transform: `translateX(-${(this.currentQuestion / this.conveyorItems.length) * 100}%)`,
        transition: 'transform 2s linear'
      };
    }
  },
  created(){
    for (let i in this.GameData.Questions){
        this.conveyorItems.push(this.GameData.Questions[i].Questions);
    }
  },
  methods: {
    startQuiz() {
      console.log('Starting quiz...');
      this.playSound(this.startGameSound, this.startGameSoundVolume);
      this.playBackgroundMusic();
      this.isPaused = false;
      setTimeout(() => {
        this.currentQuestion = 1;
        setTimeout(() => {
          this.pauseConveyor();
          this.showHomePage = false;
        }, 2000);
      }, 1000);
    },
    // handleAnswer() {
    //   this.isPaused = false;
    //   this.currentQuestion = (this.currentQuestion + 1) % this.conveyorItems.length;
    //   this.remainingLives -= 1;
    //   setTimeout(() => {
    //     this.pauseConveyor();
    //   }, 2000);
    // },
    handleAnswer(index){
        this.isPaused = false;
        this.currentQuestion = (this.currentQuestion + 1) % this.GameData.Questions.length;
        this.remainingLives -= 1;
        if (index == this.GameData.Questions[this.currentQuestion].AnsewerIndex){
            console.log('Correct Answer');
        }
        else{
            console.log('Wrong Answer');
            this.remainingLives -= 1;
        }
        setTimeout(() => {
            this.pauseConveyor();
        }, 2000);
    },
    pauseConveyor() {
      this.isPaused = true;
    },
    playSound(soundUrl, volume) {
      console.log('Playing sound:', soundUrl);
      const audio = new Audio(soundUrl);
      audio.volume = volume;
      audio.play().then(() => {
        console.log('Sound playing');
      }).catch(error => {
        console.error('Error playing sound:', error);
      });
    },
    playBackgroundMusic() {
      console.log('Playing background music...');
      const backgroundMusic = this.$refs.backgroundMusic;
      backgroundMusic.volume = this.volume; 
      backgroundMusic.play().then(() => {
        console.log('Background music playing');
      }).catch(error => {
        console.error('Error playing background music:', error);
      });
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      this.volume = this.isMuted ? 0 : 0.3;
      this.playBackgroundMusic(); 
    },
    adjustVolume() {
      if (!this.isMuted) {
        this.playBackgroundMusic(); 
      }
    }
  }
}
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: 95vw;
  margin: 5vh auto;
  padding: 0;
  box-sizing: border-box;
  background-color: transparent;
}

.life-bar {
  width: 100%;
  height: 50px;
  background-color: #f0f0f0;
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
  margin:7px;
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
  width: 600%; /* 6 items including welcome */
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.conveyor-item {
  width: 25%;
  height: 100%;
  background-image: url('@/assets/images/pics/track2.png');
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-container {
  padding: 20px;
  background-color: rgba(253, 255, 249, 0.8);
  border-radius: 10px;
  z-index: 10;
}

.question-text {
  font-size: 1.5rem;
  color: #333;
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
  flex: 1;
  margin: 10px;
  font-size: calc(1rem + 1vw);
  background-color: #4CAF50;
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
  right: 0;
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.volume-control:hover .slider-container {
  display: block;
}

.volume-slider {
  width: 100px;
}
</style>