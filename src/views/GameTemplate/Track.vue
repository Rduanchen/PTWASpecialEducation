<template>
    <div class="Container">
      <!-- Life bar section -->
      <div class="life-bar">
        <div class="volume-control">
          <img :src="isMuted ? muteIconUrl : unmuteIconUrl" @click="toggleMute" class="volume-icon" />
          <div v-if="showVolumeSlider" class="slider-container">
            <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="adjustVolume" class="volume-slider" />
          </div>
        </div>
      </div>


      <!-- Conveyor belt section -->
      <div class="ratio-7">
        <div class="conveyor-belt" :class="{ 'paused': isPaused }" :style="conveyorStyle">
          <div class="conveyor-item" v-for="(item, index) in currentQuestions" :key="index">
            <div class="question-container">
              <p class="question-text">{{ item.Question }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Spacer between conveyor belt and answer buttons -->
      <div class="spacer"></div>
      <!-- Answer buttons or home page -->
      <div class="Selections" v-if="!showHomePage">
        <div class="button-container">
          <button v-for="(selection, index) in currentQuestions[currentQuestionIndex].Selections" 
                  :key="index" 
                  :class="['Select-Button', { 'wrong-answer': wrongAnswerIndex === index }]" 
                  @click="handleAnswer(index)">
            {{ selection }}
          </button>
        </div>
      </div>
      <div class="box ratio-3" v-if="showHomePage">
        <div class="button-container">
          <button class="big-button" @click="startQuiz">開始游戲</button>
        </div>
      </div>
  
      <!-- Hidden audio elements for sound effects and background music -->
      <audio ref="backgroundMusic" :src="gameplayMusic" loop></audio>
    </div>
  </template>
  
  <script>
  import heartImageUrl from '@/assets/images/pics/heart.png';
  import deadHeartImageUrl from '@/assets/images/pics/dead_heart.png';
  import muteIconUrl from '@/assets/images/pics/mute.png'; 
  import unmuteIconUrl from '@/assets/images/pics/unmute.png'; 
  import gameplayMusic from '@/assets/sounds/game_sounds/gameplay-music.mp3';
  import clickSound from '@/assets/sounds/game_sounds/click-sound.mp3';
  import wrongSound from '@/assets/sounds/game_sounds/wrong_sound_effect.mp3';
  
  export default {
    name: 'Track',
    props:{
      GameData: {
        type: Object,
        required: true
      },
      GameConfig: {
        type: Object,
        required: true,
      },
      id: {
        type: Number,
        required: true
      }
    },
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
        currentQuestions: [],
        currentQuestionIndex: 0,
        isPaused: true
      };
    },
    computed: {
      conveyorStyle() {
        const numQuestions = this.currentQuestions.length;
        const widthPercentage = numQuestions * 100; // Each question contributes 100% to the width
        const translateX = (this.currentQuestionIndex / numQuestions) * 100;
        return {
          width: `${widthPercentage}%`,
          transform: `translateX(-${translateX}%)`,
          transition: 'transform 2s linear',
          whiteSpace: 'nowrap' 
        };
      }
    },
    methods: {
      startQuiz() {
        this.playBackgroundMusic();
        this.playSound(this.clickSound, this.clickSoundVolume);
        this.isPaused = false;
        this.wrongAnswerIndex = null; 
        // this.currentQuestions = this.getQuestionsFromEachLevel();
        this.currentQuestions = this.GameData.Data;
        this.currentQuestionIndex = 0;
        setTimeout(() => {
          this.pauseConveyor();
          this.showHomePage = false;
        }, );
      },
      handleAnswer(selectedIndex) {
        this.playSound(this.clickSound, this.clickSoundVolume);
        this.isPaused = false;
        if (selectedIndex === this.currentQuestions[this.currentQuestionIndex].AnswerIndex) {
          this.$emit('play-effect', 'CorrectSound');          
          this.wrongAnswerIndex = null;
          if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
            this.$emit('next-question');
          }
          this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.currentQuestions.length;
          setTimeout(() => {
            this.pauseConveyor();
          }, 2000);
        } else {
          console.log('Wrong answer!');
          this.$emit('play-effect', 'WrongSound');
          this.remainingLives -= 1;
          this.wrongAnswerIndex = selectedIndex; 
          this.playSound(this.wrongSound, this.wrongSoundVolume);
          this.pauseConveyor();
        }
      },
      pauseConveyor() {
        this.isPaused = true;
      },
      playSound(soundUrl, volume) {
        const audio = new Audio(soundUrl);
        audio.volume = volume;
        audio.play();
      },
      playBackgroundMusic() {
        const backgroundMusic = this.$refs.backgroundMusic;
        backgroundMusic.volume = this.isMuted ? 0 : 0.15; 
        if (this.isMuted) {
          backgroundMusic.pause();
        } else {
          backgroundMusic.play();
        }
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
      }
    }
  };
  </script>
  
  <style scoped>
  .Container {
    display: flex;
    flex-direction: column;
    margin: 5vh auto;
    padding: 0;
    box-sizing: border-box;
    background-color: transparent;
    width: 100%;
  }
  .Selections{
    .button-container{
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 10vh;
      justify-content: space-between;
      .Select-Button{
        flex: 1;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow: hidden;
      }
    }
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
    position: relative;
    overflow: hidden;
    height: 30vh !important;
  }
  
  .conveyor-belt {
    display: flex;
    flex-direction: row;
    max-height: 40vh;
    position: absolute;
    top: 0;
    left: 0;
  }
  
  .conveyor-item {
    width: calc(100% / 3); 
    height: 100%;
    background-image: url('@/assets/images/pics/track2.png');
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .question-container {
    /* padding: 100px;
    background-color: transparent; */
    display: flex;
    align-items: center;
    justify-content: center;
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
    
  .big-button {
    flex: 2;
    margin: 10px;
    font-size: calc(2rem + 1vw);
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
  </style>
  