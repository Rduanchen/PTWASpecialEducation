<template>
  <div id="GameView" ref="GameView">
    <Header
      :grade="this.Grade"
      :gameName="this.Name"
      :subject="Subjects[Subject]"
      @previous-page="PreviousPage" />
    <section>
      <div class="">
        <div class="Container">
          <div class="col-10 GameArea">
            <LevelAndTime
              :time="time"
              :totaltime="totaltime"
              :questions="GameData.Questions"
              :nowlevel="Nowlevel"
              @pause-timer="pauseTimer"
              @reset-timer="resetTimer"
              @start-timer="startTimer"
              @reset-wrong-timer="resetWrongTimes"
            />
            <div class="row Game_Component">
              <!-- Dynamic import component -->
              <div
                class="games"
                v-if="GameStatus == 'Progressing'"
                id="GameContainer"
              >
                <EffectWindow
                  id="CorrecIncorrect"
                  :Data="CorrectIncorrect"
                  v-if="ShowReply"
                ></EffectWindow>
                <transition :name="transitionName" mode="out-in">
                  <component
                    class="GameComponent111"
                    v-if="GameType != 'SelfDefine'"
                    v-bind:is="this.GameType"
                    ref="GameComponent"
                    :key="this.Nowlevel"
                    :id="this.GameID"
                    :GameData="this.GameData.Questions[this.Nowlevel - 1]"
                    :GameConfig="this.GameConfig"
                    @add-record="GameDataRecord"
                    @play-effect="EffectPlayer"
                    @next-question="NextQuestion"
                  >
                  </component>
                </transition>

                <component
                  v-if="GameType == 'SelfDefine'"
                  :key="this.Nowlevel"
                  :is="selfdefinetemplate"
                  :id="this.GameID"
                  :GameData="this.GameData.Questions[this.Nowlevel - 1]"
                  :GameConfig="this.GameConfig"
                  :EnviromerntInfo="GetAllInfo()"
                  @get-info="GetAllInfo"
                  @add-record="GameDataRecord"
                  @download-data="ToCSV"
                  @config-header="ConfigHeader"
                  @play-effect="EffectPlayer"
                  @next-question="NextQuestion"
                  @previous-question="PreviousQuestion"
                  @change-level="changelevel"
                  @start-game="StartGame"
                  @reload-page="reloadPage"
                  @change-status="ChangeGameStatus"
                  @timer-start="startTimer"
                  @timer-pause="pauseTimer"
                  @timer-reset="resetTimer"
                >
                </component>
              </div>
              <div class="intro" v-else>
                <GameStartandOver
                  v-if="Dataloaded"
                  :Status="GameStatus"
                  :intro="GameData.IntroText"
                  :GameName="Name"
                  :key="this.Dataloaded"
                  @start-game="StartGame"
                  @download-record="ToCSV"
                  @restart="reloadPage"
                  @previous-page="PreviousPage"
                  @open-teaching-modal="loadMediaForModal"
                ></GameStartandOver>
              </div>
            </div>
          </div>
          <SideBar
            class="SideBar col-2"
            v-if="Dataloaded"
            :GameStatus="GameStatus"
            :HintInfo="HintInfo"
            :Hint="Hint"
            :download_data="download_data"
            :levelAmount="this.GameData.Questions.length"
            :reAppeareCode="questionOrder"
            @to-csv="ToCSV"
            @previous-question="PreviousQuestion"
            @next-question="NextQuestion"
            @start-game="StartGame"
            @reload-page="reloadPage"
            @scratch-sheet="() => {scratchSheetVisible = true}"
            @reappear-code="reappearCode"
          >
            <template #hint>
              <hintbutton
                :HintInfo="HintInfo"
                v-if="
                  GameStatus == 'Progressing' && this.Hint['Type'] != 'Method'
                "
                @open-teaching-modal="loadMediaForModal"
              >
              </hintbutton>
            </template>
          </SideBar>

          <scratchSheet v-if="scratchSheetVisible" @closeSheet="closeSratSheet"></scratchSheet>

          <MediaModal
            :showMediaModal="showMediaModal"
            :modalTitle="modalTitle"
            :modalContent="modalContent"
            :mediaSrc="mediaSrc"
            :mediaType="mediaType"
            @closeModal="closeMediaModal"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import fetchJson from "@/utilitys/fetch-json.js";
import * as Arr2CSV from "@/utilitys/array2csv.js";
import loading from "@/components/loading.vue";
import GameStartandOver from "@/components/GameSystem/GameStartandOver.vue";
import Header from "@/components/GameSystem/header.vue";
import LevelAndTime from "@/components/GameSystem/LevelAndTime.vue";
import MediaModal from '@/components/GameSystem/MediaModal.vue';
import scratchSheet from "@/components/ScratchSheets.vue";
import hintbutton from "@/components/GameSystem/hintbutton.vue";
import * as ImportUrl from "@/utilitys/get_assets.js";
import { defineAsyncComponent } from "vue";
import EffectWindow from "@/components/GameSystem/EffectWindow.vue";
import gameStore from '@/stores/game';
import { mapWritableState } from "pinia";
import { soundManager } from '@/utilitys/sound-manager.js';

export default {
  data() {
    return {
      Dataloaded: false,
      introvideo: false,
      VideoSrc: "",
      GameType: "loading",
      download_data: [[]], //下載的資料，格式為二維陣列。
      header: [],
      GameID: "",
      Subject: "",
      Grade: "",
      Name: "",
      Subjects: {
        Math: "數學",
        Chinese: "國語",
        Technology: "多元科技",
      },
      GameConfig: {},
      GameData: {},
      time: 0,
      totaltime: 0,
      finaltime: 0,
      intervalId: null,
      EffectWindow: false,
      EffectSrc: "",
      scratchSheetVisible: false,
      QuestionsSequence: [],
      AllQuestions: [],
      ShowReply: false,
      Hint: {
        Type: "None",
        Data: {
          FilePath: "",
          SourceType: "",
        },
      },
      WrongTimes: 0,
      MaxWrongTimes: 2,
      CorrectIncorrect: {
        Status: null,
      },
      isPassLevel: [],
      questionOrder : [],
      questionCopy: [],
      isGif: false,
      showMediaModal:false,
      modalTitle:"",
      mediaType:"none",
      mediaSrc:"",
      modalContent: '',
      // SentData2ChildComponent: {},
    };
  },
  computed: {
    ...mapWritableState(gameStore, ['gameCode','transitionName','GameStatus','Nowlevel']),
    selfdefinetemplate() {
      return defineAsyncComponent(() =>
        import(
          `@/views/PrivateTemplate/Grade${this.$route.params.Grade}/${this.$route.params.id}.vue`
        )
      );
    },
    HintInfo() {
      return {
        WrongTimes: this.WrongTimes,
        MaxWrongTimes: this.MaxWrongTimes,
      };
    },
  },
  created() {
    this.GameID = this.$route.params.id;
    this.Subject = this.$route.params.Subject;
    this.Grade = this.$route.params.Grade;
    this.Name = this.$route.params.GameName;
    this.GameStatus = 'NotStart';
    this.Nowlevel = 1;
    (async () => {
      try {
        let res = await fetchJson(`./Grade${this.Grade}/${this.GameID}.json`);
        this.GameData = res.data;
        this.GameType = this.GameData.GameType;
        this.GameConfig = this.GameData.GameConfig;
        this.questionCopy = this.GameData.Questions;
        this.InitHint();
        // this.InitIntroVideo();
        this.Dataloaded = true;
        this.RamdonChoice();
        for(let x in this.GameData.Questions){
          this.isPassLevel.push(false);
        }
      } catch (error) {
        console.error("Fetch Game Data Error: ", error);
      }
    })();
      console.log(this.gameCode);
      soundManager.registerSound('Correct', `${ImportUrl.getSystemEffectAssets("CorrectAnswer.mp3")}`,false);
      soundManager.registerSound('Wrong', `${ImportUrl.getSystemEffectAssets("WrongAnswer.mp3")}`,false);
      soundManager.registerSound('FireWorkAnimation', `${ImportUrl.getSystemEffectAssets("harray.mp3")}`,false);
  },
  mounted() {
    this.FullScreen();
  },
  methods: {
    RamdonChoice() {
      //Radom Select Questions via level
      let question = [];
      let temp = [];
      let checkcorrect = true;
      let record = [];
      for (let i in this.GameData.Questions) {
        if (this.GameData.Questions[i].length != undefined) {
          let num = this.GameData.Questions[i].length;
          let rand = Math.floor(Math.random() * (num - 0 + 0));
          console.log('rand',rand);
          question.push(this.GameData.Questions[i][rand]);
          record.push(rand);
        } else {
          checkcorrect = false;
          break;
        }
      }
      this.gameCode = record.toString().replaceAll(',','-');
      if (checkcorrect) {
        console.log(question);
        this.GameData.Questions = question;
      } else {
        this.gameCode = 'origin'
        console.warn(
          "Radom Select Questions via level Fail, this could be the question is not a array (Format Error)"
        );
      }
    },
    reappearCode() {
      if (this.gameCode == 'origin') return;
      let reappear = this.gameCode.split('-');
      let question = [];
      reappear.forEach((element,index) => {
        question.push(this.questionCopy[index][element]);
      });
      this.GameData.Questions = question;
      this.questionOrder = this.gameCode;
    },
    loadMediaForModal(contentType) {
      let mediaSource = null;

      if (contentType === 'hint') {
        this.modalTitle = '需要提示嗎?';
        this.modalContent = '以下是遊戲的提示內容。';
        mediaSource = this.fetchHintMedia();
      } else if (contentType === 'teach') {
        this.modalTitle = '不會玩嗎?請看教學影片:';
        this.modalContent = '以下是遊戲的教學內容。';
        mediaSource = this.fetchIntroVideo();
      }

      if (mediaSource) {
        this.mediaSrc = mediaSource.filePath;
        this.mediaType = mediaSource.sourceType === 'video' ? 'video' : 'image';
      } else {
        this.modalContent = '喔喔，沒有提供相關的資源';
        this.mediaType = 'none';
        console.warn('No media available for content type:', contentType);
      }
      this.openMediaModal();
    },

    fetchHintMedia() {
      let hintType = this.Hint.Type;
      let filePath, sourceType;

      try {
        if (hintType === 'Level') {
          filePath = this.GameData.Hint.Data[this.Nowlevel - 1].FilePath;
          sourceType = this.GameData.Hint.Data[this.Nowlevel - 1].SourceType;
          this.modalContent = '這是關卡提示';
        } else if (hintType === 'Single') {
          this.modalContent = '這是單一提示';
          filePath = this.GameData.Hint.Data.FilePath;
          sourceType = this.GameData.Hint.Data.SourceType;
        }
        
        return {
          filePath: ImportUrl.GamesGetAssetsFile(this.GameID, filePath),
          sourceType
        };
      } catch {
        console.warn('Missing data in Hint, type:', hintType);
        return null;
      }
    },

    fetchIntroVideo() {
      let introFilePath;
      let pattern = /undefined/;

      try {
        introFilePath = ImportUrl.GamesGetAssetsFile(this.GameID, this.GameData.introvideo).toString();
        if (pattern.test(introFilePath) || this.GameData.introvideo === undefined) {
          throw new Error("Invalid intro video URL");
        }
        return {
          filePath: introFilePath,
          sourceType: 'video'
        };
      } catch {
        console.warn('No Intro Video');
        
        // Check for default GIF as fallback
        let defaultGif = ImportUrl.getDefaultHintAssets(`${this.GameType}.gif`);
        if (defaultGif) {
          return {
            filePath: defaultGif,
            sourceType: 'image'
          };
        } else {
          return null;
        }
      }
    },
    openMediaModal() {
      this.showMediaModal = true;
    },
    closeMediaModal() {
      this.showMediaModal = false;
    },
    ChangeGameStatus(status) {
      //改變遊戲狀態
      this.GameStatus = status;
    },
    StartGame() {
      this.GameStatus = "Progressing";
      this.startTimer();
    },
    ConfigHeader(arr) {
      this.header = arr;
    },
    ToCSV(data = this.download_data, defaultheader = true) {
      if (defaultheader) {
        let download = Arr2CSV.MadeCsvFile(
          this.GameID,
          this.Name,
          this.Grade,
          this.Subject,
          data,
          this.finaltime,
          this.gameCode
        );
        Arr2CSV.DownloadCSV(download, this.Name);
      } else {
        let download = Arr2CSV.MadeCsvFile(
          this.GameID,
          this.Name,
          this.Grade,
          this.Subject,
          data,
          this.finaltime,
          this.gameCode,
          this.header,
        );
        Arr2CSV.DownloadCSV(download, this.Name);
      }
    },
    reloadPage() {
      this.GameStatus = "NotStart";
      this.Nowlevel = 1;
      this.resetWrongTimes();
      this.pauseTimer();
      this.resetTimer();
      this.time = 0;
      this.totaltime = 0;
      this.finaltime = 0;
      this.download_data = [[]];
      this.isPassLevel = [];
      for(let x in this.GameData.Questions){
        this.isPassLevel.push(false);
      }
    },
    NextQuestion() {
      this.isPassLevel[this.Nowlevel-1] = true;
      this.resetWrongTimes();
      if(this.checkUnansweredQuestions()){
        this.GameStatus = "Done";
        soundManager.stopAllSounds();
        this.EffectPlayer("FireWorkAnimation");
        this.finaltime = this.totaltime;
      }
      this.pauseTimer();
      this.resetTimer();
      this.startTimer();
    },
    checkUnansweredQuestions() {
      const totalQuestions = this.GameData.Questions.length;
      let allQuestionsAnswered = true;

      // 檢查是否有未回答的問題
      if (this.isAnyQuestionUnanswered()) {
        allQuestionsAnswered = false;

        // 嘗試從當前等級以後尋找未回答的問題
        if (!this.findNextUnansweredQuestion(this.Nowlevel, totalQuestions)) {
          
          // 如果找不到且當前是最後一題，則允許回到之前的未答題目
          if (this.Nowlevel === totalQuestions) {
            this.findNextUnansweredQuestion(0, totalQuestions);
          }
        }
      }

      return allQuestionsAnswered;
    },

    isAnyQuestionUnanswered() {
      return this.isPassLevel.some((answered) => !answered);
    },

    findNextUnansweredQuestion(startLevel, totalQuestions) {
      for (let i = startLevel; i < totalQuestions; i++) {
        if (!this.isPassLevel[i]) {
          this.Nowlevel = i + 1;
          this.transitionName = 'slide-left';
          return true;
        }
      }
      return false;
    },
    PreviousQuestion() {
      this.resetWrongTimes();
      if (this.Nowlevel > 1) {
        this.Nowlevel--;
        this.transitionName = 'slide-right';
      }
      this.pauseTimer();
      //FIXME 傳資料進入CSV
      this.resetTimer();
      this.startTimer();
    },

    startTimer() {
      if (this.intervalId) {
        return;
      }
      this.intervalId = window.setInterval(() => {
        this.time++;
        this.totaltime++;
      }, 1000);
    },
    pauseTimer() {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    },
    resetTimer() {
      this.pauseTimer();
      this.time = 0;
    },
    GameDataRecord(data, SelfDefine = false) {
      //紀錄遊戲資料
      // default ["正確答案","學生作答答案","是否正確","作答秒數(關卡)","作答秒數(總時間)"]
      // data格式[正確答案,學生作答答案,是否正確]
      let record = [];
      if (SelfDefine) {
        record = Arr2CSV.ArrayTemplate2Record(
          data,
          this.Nowlevel,
          this.time,
          this.totaltime
        );
        console.log("Self Define Game Data Record");
      } else {
        record = [data[0], data[1], data[2], this.time, this.totaltime];
        console.log("Default Game Data Record: " + record);
      }
      try {
        if (!Array.isArray(this.download_data[this.Nowlevel - 1])) {
          this.download_data[this.Nowlevel - 1] = [];
        }
        this.download_data[this.Nowlevel - 1].push(record);
      } catch (error) {
        console.error("Error in pushing record: ", error);
      }
    },
    EffectPlayer(type) {
      let sound;  
      switch (type) {
        case "CorrectSound":
          this.EffectPlayer("CorrectAnimation");
          soundManager.playSound(`Correct`, false);
          break;
        case "WrongSound":
          this.WrongTimes++;
          this.EffectPlayer("IncorrectAnimation");
          soundManager.playSound(`Wrong`, false);
          break;
        case "FireWorkAnimation":
          this.EffectWindow = true;
          this.EffectSrc = new URL(`../assets/Effects/Firework.gif`, import.meta.url).href;
          sound = new Audio();
          sound.src = ImportUrl.GetSystemEffectAssetsFile("harray.mp3");
          soundManager.playSound(`FireWorkAnimation`, false);
          sound.oncanplaythrough = function () {
            sound.play();
          };
          setTimeout(() => {
            this.EffectWindow = false;
          }, 3000);
          break;
        case "HarraySound": //Wait for remove
          console.warn("HarraySound is Deprecated, Please use FireWorkAnimation instead");
          sound = new Audio();
          sound.src = ImportUrl.GetSystemAssetsFile("harray.mp3","effects");
          sound.src = ImportUrl.GetSystemEffectAssetsFile("harray.mp3");
          soundManager.playSound(`harray`, false);
          sound.oncanplaythrough = function () {
            sound.play();
          };
          break;
        case "CorrectAnimation":
          this.CorrectIncorrect.Status = "Correct";
          this.ShowReply = true;
          setTimeout(() => {
            this.ShowReply = false;
          }, 1000);
          break;
        case "IncorrectAnimation":
          this.CorrectIncorrect.Status = "Incorrect";
          this.ShowReply = true;
          setTimeout(() => {
            this.ShowReply = false;
          }, 1000);
          break;
      }
    },
    FullScreen() {
      try {
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          /* IE11 */
          elem.msRequestFullscreen();
        }
      } catch (error) {}
      // window.removeEventListener('mousemove', this.FullScreen);
    },
    ExitFullScreen() {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE11 */
          document.msExitFullscreen();
        }
      } catch (error) {
        console.warn("Exit Full Screen Error: ", error);
      }
    },
    GetAllInfo() {
      return {
        Subject: this.Subject,
        Grade: this.Grade,
        Name: this.Name,
        GameID: this.GameID,
        GameType: this.GameType,
        GameConfig: this.GameConfig,
        GameData: this.GameData,
        GameStatus: this.GameStatus,
        Nowlevel: this.Nowlevel,
        time: this.time,
        intervalId: this.intervalId,
        EffectWindow: this.EffectWindow,
        EffectSrc: this.EffectSrc,
      };
    },
    //hint app

    InitHint() {
      // 紀錄提示種類，有則設定hint_type為提示種類，沒有則設定hint_type為None
      // console.log(this.GameData.Hint)
      let hint_exist = false;
      let RuleType;
      let hint_type;
      try {
        console.log("Hint type: " + this.GameData.Hint.ShowAs);
        this.Hint["Type"] = this.GameData.Hint.ShowAs;
      } catch {
        this.Hint["Type"] = "None";
        console.warn("No hint in this game");
      }
      try {
        this.MaxWrongTimes = this.GameData.Hint.Data.MaxWrongTimes;
        if (this.MaxWrongTimes == undefined) {
          this.MaxWrongTimes = 2;
          console.warn("No MaxWrongTimes in Hint Rule, set to default 2");
        }
      } catch {
        this.MaxWrongTimes = 2;
        console.warn(
          "No Rule in Hint Rule, set to default:{Type:WrongTimes, Value:2}"
        );
      }
    },
    PauseHintVideo() {
      try {
        let video = document.getElementById("Hint-video");
        video.pause();
      } catch {}
    },
    PreviousPage() {
      soundManager.stopAllSounds();
      this.ExitFullScreen();
      this.$router.replace({ path: `/GameSelect/${this.$route.params.Grade}`})
    },
    closeSratSheet() {
      this.scratchSheetVisible = false;
      let modal = document.getElementById("Calculator");
      modal.classList.remove("show");
      modal.style.display = "none";
    },
    resetWrongTimes() {
      this.WrongTimes = 0;
    }
  },
  components: {
    hintbutton,
    scratchSheet,
    GameStartandOver,
    Header,
    LevelAndTime,
    MediaModal,
    loading,
    LinkGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/LinkGame.vue")
    ),
    CompareGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/CompareGame.vue")
    ),
    TrueFalseGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/TrueFalseGame.vue")
    ),
    SelectGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/SelectGame.vue")
    ),
    NumberInputGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/NumberInputGame.vue")
    ),
    ClassifyGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/ClassifyGame.vue")
    ),
    SortGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/SortGame.vue")
    ),
    FindTheItemGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/FindTheItemGame.vue")
    ),
    AutoNumberingGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/AutoNumberingGame.vue")
    ),
    NumberingGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/NumberingGame.vue")
    ),
    CompareGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/CompareGame.vue")
    ),
    FillinBlank: defineAsyncComponent(() =>
      import("@/views/GameTemplate/FillinBlank.vue")
    ),
    CalculatorGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/CalculatorGame.vue")
    ),
    PairingGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/PairingGame.vue")
    ),
    NumberLock: defineAsyncComponent(() =>
      import("@/views/GameTemplate/NumberLock.vue")
    ),
    RacingCar: defineAsyncComponent(() =>
      import("@/views/GameTemplate/RacingCar.vue")
    ),
    WhackaMole: defineAsyncComponent(() =>
      import("@/views/GameTemplate/WhackaMole.vue")
    ),
    Maze: defineAsyncComponent(() => import("@/views/GameTemplate/Maze.vue")),
    NumberLock: defineAsyncComponent(() =>
      import("@/views/GameTemplate/NumberLock.vue")
    ),
    SelectGameMulti: defineAsyncComponent(() =>
      import("@/views/GameTemplate/SelectGameMulti.vue")
    ),
    NumberSearchGame: defineAsyncComponent(() =>
      import("@/views/GameTemplate/NumberSearchGame.vue")
    ),
    Track: defineAsyncComponent(() => import("@/views/GameTemplate/Track.vue")),
    EffectWindow,
    SideBar: defineAsyncComponent(() =>
      import("@/components/GameSystem/SideBar.vue")
    ),
    CopyItem: defineAsyncComponent(() =>
      import("@/views/GameTemplate/CopyItem.vue")
    ),
  },
};
</script>
<style scoped lang="scss">
.img-hover-zoom {
  transition: transform 0.3s ease; /* 平滑的過渡效果 */
}

.img-hover-zoom:hover {
  transform: scale(1.07); /* 放大至原大小的 110% */
}

.img-hover-zoom {
  max-width: 100%; /* 或者是卡片寬度的百分比 */
  height: auto; /* 保持圖片的比例 */
}
.list-group {
  border: none !important; /* 移除邊框 */
}
.list-group-item {
  border: none !important; /* 移除每個 list-group-item 的邊框 */
}
/* 如果按鈕內有圖片，也要確保圖片不會超出按鈕的寬度 */
.function-btn img {
  max-width: 100%;
  height: auto; /* 保持圖片的比例 */
}

//btn, container, row, col

.Container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  width: 100vw;
  height: 90vh !important;
  .GameArea {
    margin-top: 2vh;
    width: 85%;
    padding-right: 1rem;
    padding-left: 1rem;
    #GameContainer {
      height: 100%;
      position: relative;
      #CorrecIncorrect {
        position: absolute;
        width: 98% !important;
        height: 98% !important ;
        z-index: 100;
      }
    }
  }
}

#Effects {
  position: absolute;
  top: 0;
  left: 0;
  width: autos;
  height: 100vh;
}

.Game_Component {
  width: 84vw !important;
  max-height: 79vh;
  // border: solid 1px #000;
  height: 79vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  overflow-x: auto;
  overflow-y: scroll;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  img {
    max-width: 100%;
    height: auto;
  }
  video {
    max-width: 100%;
    height: auto;
  }
}

.Pointable {
  cursor: pointer;
}


.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
//   position: absolute;
  width: 100%;
}

.slide-left-enter,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-leave-to,
.slide-right-enter {
  transform: translateX(-100%);
}

.slide-left-enter-to,
.slide-left-leave,
.slide-right-enter-to,
.slide-right-leave {
  transform: translateX(0%);
}

</style>