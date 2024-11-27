<template>
  <div class="custom-container">
    <div class="custom-container__header">
      <p class="custom-container__question">
        {{ QuestionWord }}
      </p>
      <button
        type="button"
        class="custom-container__submit-btn"
        v-on:click="CheckAnswer()"
      >
        送出答案
      </button>
    </div>
    <div class="custom-container__answer-area answer-area">
      <div class="answer-area__drag">
        <p class="answer-area__title">{{ GameData.InitBox }}</p>
        <draggable
          :list="Items"
          item-key="Tag"
          :sort="false"
          group="SelectItem"
          class="answer-area__drag--list"
        >
          <template #item="{ element }">
            <div class="answer-area__drag--item">
              <component
                :is="element['Name']"
                :Data="element['Data']"
                :ID="id"
              ></component>
            </div>
          </template>
        </draggable>
      </div>
      <div class="answer-area__drop">
        <div v-for="(items, index) in Groups" class="drop-area__container">
          <p class="drop-area__title">{{ GameData.Answer[index].GroupName }}</p>
          <draggable
            :list="Groups[index]"
            item-key="Tag"
            :sort="false"
            group="SelectItem"
            class="drop-area__list"
          >
            <template #item="{ element }">
              <div class="drop-area__item">
                <component
                  :is="element['Name']"
                  :Data="element['Data']"
                  :ID="id"
                ></component>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import CardWithButton from "@/components/CardWithButton.vue";
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
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
  emits: ["play-effect", "add-record", "next-level"],
  props: {
    GameData: {
      type: Object,
      required: true,
    },
    GameConfig: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
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
    CheckAnswer() {
      // This code will walk through all the groups and check if the answer is right
      // Only when all the groups are right, the game will return true.
      var member = 0;
      for (var i in this.Groups) {
        if (this.Groups[i].length != this.GameData.Answer[i]["Items"].length) {
          console.log("ClassifyGame CheckAnswer :Wrong");
          this.$emit("play-effect", "WrongSound");
          this.$emit("add-record", [
            this.Groups[i],
            this.GameData.Answer[i]["Items"],
            "錯誤",
          ]);
          console.log("here");
          return;
        }
        for (var z in this.Groups[i]) {
          if (
            this.GameData.Answer[i]["Items"].includes(this.Groups[i][z].text)
          ) {
            member++;
          }
        }
        console.log(member);
        if (member != this.GameData.Answer[i]["Items"].length) {
          console.log("ClassifyGame CheckAnswer :Wrong");
          this.$emit("play-effect", "WrongSound");
          this.$emit("add-record", [
            this.Groups[i],
            this.GameData.Answer[i]["Items"],
            "錯誤",
          ]);
          console.log("there");
          return;
        }
        member = 0;
        this.$emit("add-record", [
          this.Groups[i],
          this.GameData.Answer[i]["Items"],
          "正確",
        ]);
        this.$emit("play-effect", "CorrectSound");
        this.$emit("next-question");
      }
    },
  },
};
</script>
<style scoped lang="scss">
.custom-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: start;
  width: 100%;
  height: 100%;
  &__header {
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
    width: 100%;
  }
  &__answer-area {
    display: flex;
    gap: 1rem;
    width: 100%;
    height: 65vh;
  }
  &--title {
    font-size: 2rem;
    margin: 0;
  }

  &__question {
    flex: 3;
    border: solid 1px #aaa;
    border-radius: 15px;
    padding: 0.5rem;
    align-self: stretch;
    font-size: 2rem;
    margin: 0;
  }
  &__submit-btn {
    flex: 1;
    height: 100%;
    border: none;
    background-color: #faf3ed;
    align-self: flex-end;
    width: 10rem;
  }
}

.answer-area {
  &__drag {
    flex: 1;
    border: solid 1px;
    border-radius: 15px;
    padding: 1rem;

    &--list {
      @extend .drag-section;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(4, 1fr);
      border: solid 3px red;
    }

    &--item {
      cursor: pointer;
    }
  }

  &__drop {
    flex: 3;
    border: solid 1px;
    border-radius: 15px;
    display: flex;
    flex-direction: row;
    padding: 1rem;
    gap: 1rem;

    .drop-area__container {
      flex: 1;

      .drop-area__list {
        @extend .drag-section;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(6, 1fr);
        border: solid 3px blue;
      }
    }
  }

  .drag-section {
    height: 90%;
    padding: 0.5rem;
    display: grid;
    border-radius: 15px;
    gap: 0.5rem;

    .drop-area__item {
      cursor: pointer;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
