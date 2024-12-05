<template>
  <div class="game-start container" v-if="Status == 'NotStart'">
    <div class="upper-container">
      <h1>{{ GameName }}</h1>
      <div v-if="TextCheck" class="card">
        <p v-if="IntroType == 'Html'" v-html="ShowContent"></p>
        <p v-else-if="IntroType == 'PlainText'">{{ ShowContent }}</p>
        <p v-else>無介紹文字</p>
      </div>
    </div>
    <div class="buttons">
      <button
        class="action-button"
        v-on:click="
          StartGame();
          MakeReadText('', '', (stop = true));
        "
      >
        <img src="@/assets/images/game_images/start-game.png" />
        開始遊戲
      </button>
      <button
        class="action-button"
        v-on:click="MakeReadText(GameName, ShowContent)"
      >
        <img src="@/assets/images/game_images/read-aloud.png" />
        朗讀
      </button>
      <button class="action-button" @click="openTeachingMediaModal">
        <img src="@/assets/images/game_images/tutorial-video.png" />
        教學影片
      </button>
    </div>
  </div>
</template>

<script>
import * as Read from "@/utilitys/readtext.js";

export default {
  name: "GameStart",
  emits: ["start-game", "download-record", "restart", "open-teaching-modal"],
  data() {
    return {
      NameofThisComponent: "GameStartandOver Component said:",
      TextCheck: false,
      IntroType: "text",
      ShowContent: "",
      selectedVoice: null,
      voices: [],
    };
  },
  props: {
    GameName: {
      type: String,
    },
    intro: {
      type: Object,
    },
    Status: {
      type: String,
      required: true,
    },
  },
  mounted() {
    Read.InitReadProccess();
    try {
      this.ShowContent = this.intro.Content;
      this.TextCheck = true;
      if (this.intro.Type == "Html" || this.intro.Type == "PlainText") {
        this.IntroType = this.intro.Type;
      }
    } catch (e) {
      console.warn(this.NameofThisComponent + "No intro text found");
      // console.log(e);
    }
  },
  methods: {
    MakeReadText(Title, Description, stop = false) {
      let text = `標題:${Title}。說明:${Description}。`;
      Read.ReadText(text, stop);
    },
    StartGame() {
      this.$emit("start-game");
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  height: 75vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  .upper-container {
    width: 70%;
    h1 {
      font-size: $text-large;
      margin-bottom: 1rem;
    }
    .card {
      padding: $padding--medium;
      border-radius: 5px;
      background-color: $info-color;
      border: none;
      p {
        font-size: $text-medium;
        margin: auto 0 auto;
      }
    }
  }
  .buttons {
    width: 70%;
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr 1fr;
    .action-button {
      @extend .button--animation;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      gap: 15px;
      background-color: $success-color;
      font-size: $text-small;
      cursor: pointer;
      img {
        height: 80%;
        max-width: 40px;
        max-height: 40px;
      }
    }
  }
}
</style>
