<template>
  <div class="outter-container container">
    <div class="left-column">
      <div class="game-area--top game-area">
        <component
          :is="GameData.topComponent.Name"
          :Data="GameData.topComponent.Data"
          :ID="this.ID"
          @ReplyAnswer="Reply"
        ></component>
      </div>
      <div class="game-area--down game-area">
        <component
          :is="GameData.downComponent.Name"
          :Data="GameData.downComponent.Data"
          :ID="this.ID"
          @ReplyAnswer="Reply"
        ></component>
      </div>
    </div>
    <div class="right-column">
      <div class="number-pad" v-if="ShowPad">
        <VirtualNumPad
          @virtualpadinput-Input="Input"
          @virtualpadinput-delete="Delete"
          @virtualpadinput-pop="Pop"
        ></VirtualNumPad>
      </div>

      <button @click="CheckAnswer" class="button--submit">送出答案</button>
    </div>
    {{ NowSelect }}
  </div>
</template>

<script>
import VirtualNumPad from "@/components/VirtualNumPadInput.vue";
import { defineAsyncComponent, Text, toHandlerKey } from "vue";
import { GetSlotComponentData } from "@/utilitys/get_assets.js";
export default {
  name: "NumberLock",
  components: {
    VirtualNumPad,
    TextOnly: defineAsyncComponent(() => import("@/components/TextOnly.vue")),
    Input: defineAsyncComponent(() => import("@/components/ReplyInput.vue")),
    Fractions: defineAsyncComponent(() => import("@/components/Fractions.vue")),
    Markdown: defineAsyncComponent(() => import("@/components/Markdown.vue")),
    NumberLineArrow: defineAsyncComponent(() =>
      import("@/components/NumberLineV2.vue")
    ),
    NumberLine: defineAsyncComponent(() =>
      import("@/components/NumberLine.vue")
    ),
  },
  // props: {
  //     GameData: {
  //         type: Object,
  //         required: true
  //     },
  //     GameConfig: {
  //         type: Object,
  //         required: true
  //     },
  //     id: {
  //         type: String,
  //         required: true
  //     }
  // },
  data() {
    return {
      NowSelect: null,
      ShowPad: false,
      ID: "0",
      ComponentsAnswers: false,
      GameData: {
        topComponent: {
          Name: "TextOnly",
          Data: {
            Text: "Hello",
          },
        },
        NumberPadAutoDisappear: false,
        downComponent: {
          Name: "Markdown",
          Data: {
            Render: `
                            > 123432
                            # Header 1
                            ## Header 2
                            ### Header 3
                            **Bold Text**
                            - List 1
                            $i$ $i$ Input Box
                            $i$ Input Box
                            $t$ tab
                            $s$ space
                            $n$ new line
                        `,
            Answers: ["1", "2", "3"],
          },
        },
      },
    };
  },
  created() {
    let NewArr = [];
    let cnt = 0;
    for (var i in this.GameData.Data) {
      NewArr.push(this.GameData.Data[i]);
      // Initial the ComponentAnswer
      if (this.GameData.Data[i].Blank == true) {
        this.ComponentsAnswers[cnt] = false;
      }
      cnt++;
      if (i != this.GameData.Data.length - 1) {
        NewArr.push({
          Arrow: true,
        });
        cnt++;
      }
    }
    this.FinalData = NewArr;
  },
  computed: {
    Arrow() {
      return GetSlotComponentData("NumberLineV2", "ArrowRight.svg"); //FIXME
    },
  },
  methods: {
    Reply(result) {
      console.log(result);
      this.ComponentsAnswers = result;
    },
    GetComponentAnswer(Reply, index) {
      console.log("Recive:", Reply);
      this.ComponentsAnswers = Reply;
    },
    NowClick() {
      if (document.activeElement.tagName == "INPUT") {
        this.SlidAnimation("in");
        this.ShowPad = true;
        this.NowSelect = document.activeElement;
      } else if (document.activeElement.tagName == "BUTTON") {
        this.NowSelect.focus();
        this.ShowPad = true;
      } else {
        if (this.GameData.NumberPadAutoDisappear != false) {
          this.ShowPad = false;
          this.SlidAnimation("out");
        }
      }
    },
    Delete() {
      const activeElement = this.NowSelect;
      if (activeElement) {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const value = activeElement.value;
        activeElement.value = "";
        activeElement.selectionStart = activeElement.selectionEnd = start - 1;
        const event = new Event("input", { bubbles: true });
        activeElement.dispatchEvent(event);
      }
    },
    Pop() {
      const activeElement = this.NowSelect;
      if (activeElement) {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const value = activeElement.value;
        activeElement.value = value.slice(0, end - 1);
        activeElement.selectionStart = activeElement.selectionEnd = start + 1;
        const event = new Event("input", { bubbles: true });
        activeElement.dispatchEvent(event);
      }
    },
    Input(ch) {
      console.log(ch);
      const activeElement = this.NowSelect;
      if (activeElement) {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const value = activeElement.value;
        activeElement.value = activeElement.value + ch;
        activeElement.selectionStart = activeElement.selectionEnd = start + 1;
        const event = new Event("input", { bubbles: true });
        activeElement.dispatchEvent(event);
      }
    },
    SlidAnimation(action) {
      if (this.GameData.NumberPadAutoDisappear != false) {
        let OutterContainer =
          document.getElementsByClassName("OutterContainer")[0];
        let GameWindows = document.getElementsByClassName("GameWindows")[0];
        if (action == "in") {
          OutterContainer.style.gridTemplateColumns = "4fr 1f";
          GameWindows.style.gridColumn = "1/2";
        } else {
          OutterContainer.style.gridTemplateColumns = "1fr";
          GameWindows.style.gridColumn = "1/2";
        }
      }
    },
    CheckAnswer() {
      let ans = this.ComponentsAnswers;
      if (ans == true) {
        this.$emit("play-effect", "CorrectSound");
        this.$emit("add-record", ["", "", `正確`]);
        this.$emit("next-question");
      } else {
        this.$emit("play-effect", "WrongSound");
        this.$emit("add-record", ["", "", `錯誤`]);
      }
    },
  },
  mounted() {
    if (this.GameData.NumberPadAutoDisappear == false) {
      this.SlidAnimation("in");
      this.ShowPad = true;
    }
    document.addEventListener("click", this.NowClick);
  },
};
</script>

<style scoped lang="scss">
/* Your component-specific styles go here */
.outter-container {
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
}
.left-column {
  display: flex;
  flex-direction: column;
  gap: $gap--small;
  .game-area {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $border-radius;
    background-color: #f0f0f0;
  }
}
.right-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: $gap--small;
  background-color: $primary-color;
  border-radius: $border-radius;
  padding: $gap--small;
  .number-pad {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .button--submit {
    width: 100%;
    height: 50px;
    border-radius: $border-radius;
    border: none;
  }
  .button--submit:hover {
    transition: 0.3s;
    transform: scale(1.05);
  }
}
</style>
