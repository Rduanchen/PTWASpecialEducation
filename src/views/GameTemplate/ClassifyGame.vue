<template>
  <div class="container">
    <div class="Header">
      <p class="h2">
        {{ QuestionWord }}
      </p>
    </div>
    <div class="QuestionArea">
      <div class="Selection">
        <p class="h2">
          {{ GameData.InitBox }}
        </p>
        <draggable
          :list="Items"
          item-key="Tag"
          :sort="false"
          :group="{ name: 'SelectItem' }"
          class="Draggroup"
        >
          <template #item="{ element }">
            <div class="DragItem">
              <component
                :is="element['Name']"
                :Data="element['Data']"
                :ID="ID"
              />
            </div>
          </template>
        </draggable>
      </div>
      <div ref="putGroup" class="PutGroup">
        <div v-for="(items, index) in Groups" :key="index" class="Group">
          <p class="h2">
            {{ GameData.Answer[index].GroupName }}
          </p>
          <draggable
            :list="Groups[index]"
            item-key="Tag"
            :sort="false"
            :group="{ name: 'SelectItem', put: true }"
            class="ItemContainer"
          >
            <template #item="{ element }">
              <div class="DragItem">
                <component
                  :is="element['Name']"
                  :Data="element['Data']"
                  :ID="ID"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <button type="button" class="Submit" @click="checkAnswer()">
      送出答案
    </button>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import CardWithButton from "@/components/CardWithButton.vue";
import { defineAsyncComponent } from "vue";
import { getComponents } from "@/utilitys/get_components";
export default {
  name: "ClassifyGame",
  components: {
    draggable,
    CardWithButton,
    TextOnly: getComponents("TextOnly"),
    ImageContainer: getComponents("ImageContainer"),
    Clock: getComponents("Clock"),
    Water: getComponents("Water"),
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
  emits: ["play-effect", "add-record", "next-question"],
  data() {
    return {
      QuestionWord: "",
      GroupID: 0,
      Groups: [],
      Items: [],
    };
  },
  created() {
    // this.icon= icon1;
    this.QuestionWord = this.GameData.Text;
    for (var i in this.GameData.Answer) {
      this.Groups.push([]);
    }
    this.Items = this.GameData.Question;
  },
  methods: {
    checkAnswer() {
      // This code will walk through all the groups and check if the answer is right
      // Only when all the groups are right, the game will return true.
      let isCorrect = true;

      for (var i in this.Group) {
        if (this.Groups[i].length != this.GameData.Answer[i]["Items"].length) {
          console.log("ClassifyGame CheckAnswer :Wrong");
          this.$emit("play-effect", "WrongSound");
          this.$emit("add-record", [
            this.Groups[i],
            this.GameData.Answer[i]["Items"],
            "未完成作答",
          ]);
          console.log("here");
          return;
        }
        for (var z in this.Groups[i]) {
          if (
            this.GameData.Answer[i]["Items"].includes(this.Groups[i][z].Tag)
          ) {
            isCorrect = true;
          } else {
            isCorrect = false;
            break;
          }
        }
      }
      if (isCorrect) {
        this.$emit("play-effect", "CorrectSound");
        this.$emit("add-record", ["", "", "正確"]);
        this.$emit("next-question");
      } else {
        this.$emit("play-effect", "WrongSound");
        this.$emit("add-record", ["", "", "答案有誤"]);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.DragItem {
  cursor: pointer;
  display: flex;
  justify-content: center;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  .Header {
    border: solid 1px #aaa;
    border-radius: 15px;
    padding: $gap--small;
    align-self: stretch;
    margin-bottom: 1rem;
  }
  .Submit {
    @extend .button--animation;
    border: solid 1px #aaa;
    border-radius: 15px;
    background-color: $submit-color;
    align-self: flex-end;
    height: 3rem;
    width: 10rem;
    margin-top: 0.5rem;
  }
  .QuestionArea {
    display: grid;
    grid-template-columns: 2fr 7fr;
    gap: 1rem;
    width: 100%;
    height: 60vh;
    .Selection {
      border: solid 1px;
      border-radius: 15px;
      padding: 1rem;
      .Draggroup {
        height: 90%;
        padding: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        border: solid 3px red;
        border-radius: 15px;
        gap: 1rem;
      }
    }
    .PutGroup {
      border: solid 1px;
      border-radius: 15px;
      display: grid;
      padding: 1rem;
      grid-template-columns: 1fr 1fr;
      .Group {
        margin: 0 1rem;
        padding: 0 1rem;
        .ItemContainer {
          border: solid 3px green;
          border-radius: 15px;
          height: 90%;
          display: grid;
          grid-template-rows: 1fr 1fr 1fr;
          grid-template-columns: 1fr 1fr;
          max-height: 60vh;
          padding: $gap--small;
        }
      }
    }
  }
}
</style>
