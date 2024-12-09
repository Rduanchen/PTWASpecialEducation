<template>
  <div class="container">
    <!-- v-if -->
    <div class="ImageCard" v-if="this.GameData.SlotComponents != undefined">
      <component
        class="component"
        :ID="this.ID"
        :Data="this.SlotData"
        :is="this.SlotComponent"
      ></component>
    </div>
    <div class="AnswerArea">
      <p>{{ this.GameData.Question }}</p>
      <VirtualNumPad
        v-on:submit="GetSubmitData"
        ref="VirtualNumPad"
      ></VirtualNumPad>
    </div>
  </div>
</template>
<script>
import VirtualNumPad from "@/components/VirtualNumPad.vue";
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import { defineAsyncComponent } from "vue";
export default {
  name: "NumberInputGame",
  data() {
    return {
      imageUrl: "",
      SlotComponentSwitch: false,
      SlotComponent: "",
      SlotData: {},
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
  methods: {
    GetSubmitData(data) {
      console.log("Number Input Game Get:" + data);
      this.CheckAnswer(data);
    },
    CheckAnswer(data) {
      var response = false;
      if (data == this.GameData.Answer) {
        response = true;
      } else {
        response = false;
      }
      console.log(response);
      if (response) {
        this.$emit("play-effect", "CorrectSound");
        this.$emit("add-record", [this.answer, data, "正確"]);
        this.$refs.VirtualNumPad.delete_num();
        this.$emit("next-question");
      } else {
        this.$emit("play-effect", "WrongSound");
        this.$emit("add-record", [this.answer, data, "錯誤"]);
        this.$refs.VirtualNumPad.delete_num();
      }
    },
  },
  created() {
    if (this.GameData.SlotComponents != undefined) {
      this.SlotComponentSwitch = true;
      this.SlotComponent = this.GameData.SlotComponents[0].Name;
      this.SlotData = this.GameData.SlotComponents[0].Data;
    }
  },
  components: {
    VirtualNumPad,
    ImageContainer: defineAsyncComponent(() =>
      import("@/components/ImageContainer.vue")
    ),
    FreeDrag: defineAsyncComponent(() => import("@/components/FreeDrag.vue")),
    NumberLine: defineAsyncComponent(() =>
      import("@/components/NumberLine.vue")
    ),
  },
};
</script>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: stretch;
  .ImageCard {
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3rem;
    .component {
      max-height: 50vh;
      min-height: 40vh;
    }
  }
  .AnswerArea {
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p {
      font-size: 1.5em;
    }
  }
}
</style>
