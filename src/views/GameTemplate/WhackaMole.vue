<template>
  <div class="container">
    <h2>{{ GameData.Question }}</h2>
    <v-stage :config="configKonva">
      <v-layer>
        <mole
          v-for="i in map"
          :X="i[1]"
          :Y="i[2]"
          :moleId="i[0]"
          :option="i[3]"
          @showSign="giveOption"
          @whacked="answer"
        ></mole>
      </v-layer>
      <v-layer>
        <hole v-for="i in map" :X="i[1]" :Y="i[2]"></hole>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    hole: defineAsyncComponent(() => import("@/components/moleHole.vue")),
    mole: defineAsyncComponent(() => import("@/components/mole.vue")),
  },
  data() {
    return {
      configKonva: {
        width: 1000,
        height: 500,
      },

      map: [
        [0, 375, 150, ""],
        [1, 625, 150, ""],
        [2, 250, 350, ""],
        [3, 500, 350, ""],
        [4, 750, 350, ""],
      ],
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
  },

  mounted() {
    this.true = this.GameData.True;
    this.false = this.GameData.False;
    this.ansLeft = this.true.length;
  },

  methods: {
    giveOption(id) {
      this.map[id][3] = this.randomOption();
      //console.log(this.randomOption());
    },

    randomOption() {
      var trueOptions = this.true.length;
      var falseOptions = this.false.length;
      var optionId = Math.floor(Math.random() * (trueOptions + falseOptions));
      if (optionId < trueOptions) {
        return this.true[optionId];
      } else {
        return this.false[optionId - trueOptions];
      }
    },

    answer(option) {
      var ans = false;
      for (let i in this.GameData.True) {
        if (option == this.GameData.True[i]) {
          this.true = this.true.filter(
            (option) => option != this.GameData.True[i]
          );
          ans = true;
          break;
        }
      }
      if (ans) {
        this.$emit("play-effect", "CorrectSound");
        this.ansLeft--;
        if (this.ansLeft <= 0) this.$emit("next-question");
      } else this.$emit("play-effect", "WrongSound");
    },
  },
};
</script>
