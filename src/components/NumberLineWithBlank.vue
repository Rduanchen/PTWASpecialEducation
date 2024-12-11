<template>
  <div class="gameContainer" ref="container">
    <v-stage :config="configKonva">
      <v-layer>
        <v-line v-for="line in configNumberLine" :config="line"></v-line>
        <!-- <v-circle v-for="circle in configCircle" :config="circle"></v-circle> -->
        <v-text v-for="number in configNumber" :config="number"></v-text>
        <v-rect
          v-for="(rect, id) in configRect"
          :config="{
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            fill: rect.fill,
            cornerRadius: rect.conerRadius,
            stroke: this.rectClickedList[id] ? 'blue' : 'black',
            strokeWidth: this.rectClickedList[id] ? 3 : 1,
          }"
          @click="rectClicked(id)"
          @touchstart="rectClicked(id)"
        ></v-rect>
      </v-layer>
    </v-stage>
    <div
      class="virtualNumpad-modal"
      v-if="virtualNumpadSwitch"
      @click="this.virtualNumpadSwitch = false"
      @touchstart="this.virtualNumpadSwitch = false"
    >
      <div class="modal__body" @click.stop @touchstart.stop>
        <p>請輸入數字</p>
        <VirtualNumpad @submit="updateRactNumber"></VirtualNumpad>
        <button
          @click="this.virtualNumpadSwitch = false"
          @touchstart="this.virtualNumpadSwitch = false"
          class="button__close-modal"
        >
          關閉視窗
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    VirtualNumpad: defineAsyncComponent(() =>
      import("@/components/VirtualNumPad.vue")
    ),
  },
  props: {
    Data: {
      type: Object,
      required: true,
    },
    ID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      configKonva: {},
      configBG: {
        x: 0,
        y: 0,
        fill: "gray",
        stroke: "gray",
        visible: false,
      },
      configCircle: [],

      configNumberLine: [],
      configNumber: [],
      numberX: [],

      virtualNumpadSwitch: false,

      configRect: [],
      isClickRectID: undefined,
      rectClickedList: [],
      rectPadding: 5,

      blankContent: [],

      startNum: 0,
      endNum: 300,

      isImage: true,
    };
  },

  // props: ["config"], //{spacing, max, min, image, init_pos}

  beforeMount() {},
  mounted() {
    this.initializeScene();
    this.initializeNumberLine();
    window.addEventListener("resize", () => {
      this.initializeScene();
      this.initializeNumberLine();
    });
  },
  methods: {
    initializeScene() {
      this.gameWidth = this.$refs.container.clientWidth;
      this.configKonva.width = this.gameWidth;
      this.configKonva.height = this.gameWidth / 4;
      this.configBG.width = this.gameWidth;
      this.configBG.height = this.gameWidth / 4;
    },
    initializeNumberLine() {
      this.drawBaseLine();
      this.drawNumberLine();
      this.drawNumbers();
    },
    drawBaseLine() {
      this.numberLineY = this.gameWidth * 0.15;
      let points = [
        [
          this.gameWidth * 0.05,
          this.numberLineY,
          this.gameWidth * 0.95,
          this.numberLineY,
        ],
        [
          this.gameWidth * 0.94,
          this.numberLineY - this.gameWidth * 0.01,
          this.gameWidth * 0.95,
          this.numberLineY,
        ],
        [
          this.gameWidth * 0.94,
          this.numberLineY + this.gameWidth * 0.01,
          this.gameWidth * 0.95,
          this.numberLineY,
        ],
      ];
      for (let p in points) {
        let line = {};
        line.stroke = "black";
        line.points = points[p];
        this.configNumberLine.push(line);
      }
    },
    drawNumberLine() {
      this.intervalLength =
        (this.gameWidth * 0.9) /
        ((this.Data.max - this.Data.min) / this.Data.spacing + 1);
      let tempX = this.gameWidth * 0.05 + this.intervalLength * 0.5;
      for (let i = this.Data.min; i <= this.Data.max; i += this.Data.spacing) {
        let line = {};
        line.stroke = "black";
        line.points = [
          tempX,
          this.numberLineY - this.gameWidth * 0.01,
          tempX,
          this.numberLineY + this.gameWidth * 0.01,
        ];
        this.configNumberLine.push(line);
        this.numberX.push(tempX);
        tempX += this.intervalLength;
      }
    },
    drawNumbers() {
      this.numberY = this.gameWidth * 0.175;
      let rectID = 0;
      let numberID = 0;
      for (
        let i = this.Data.min, j = 0;
        i <= this.Data.max;
        i += this.Data.spacing, ++j
      ) {
        let number = {};
        let offset;

        if (i == 0) offset = this.gameWidth * 0.0085;
        else
          offset =
            Math.ceil(Math.log(i + 1) / Math.log(10)) * this.gameWidth * 0.0085;

        if (this.Data.blank_pos.find((element) => element == i)) {
          this.rectClickedList.push(false);
          let rect = {};
          rect.x = this.numberX[j] - offset - this.rectPadding; //Magic Number Inside
          rect.y = this.numberY - this.rectPadding; //Magic Number Inside
          rect.width =
            this.gameWidth *
              0.02 *
              (Math.floor(Math.log10(Math.abs(this.Data.max))) + 1) + // Calculate the number of digits
            this.rectPadding; //Magic Number Inside
          rect.height = this.gameWidth * 0.03 + this.rectPadding; //Magic Number Inside
          rect.fill = "rgba(255, 255, 255, 0)";
          rect.conerRadius = 15;
          rect.textID = numberID;

          this.configRect.push(rect);
          number.text = "";
          this.blankContent.push("");

          rectID++;
        } else {
          number.text = i;
        }
        number.fontSize = this.gameWidth * 0.03;
        number.x = this.numberX[j] - offset;
        number.y = this.numberY;
        this.configNumber.push(number);
        numberID++;
      }
    },
    rectClicked(id) {
      this.isClickRectID = id;
      this.rectDeselcted();
      this.rectClickedList[id] = true;
      this.virtualNumpadSwitch = true;
    },
    rectDeselcted() {
      for (let i in this.rectClickedList) {
        this.rectClickedList[i] = false;
      }
    },
    updateRactNumber(num) {
      if (this.isClickRectID == undefined) return;
      this.configNumber[this.configRect[this.isClickRectID].textID].text = num;
      this.blankContent[this.isClickRectID] = num;
      this.virtualNumpadSwitch = false;
      this.checkAnswer();
    },
    checkAnswer() {
      let isCorrect = true;
      for (let i in this.blankContent) {
        if (this.blankContent[i] == "") return false;
        if (this.blankContent[i] != this.Data.blank_pos[i]) return false;
      }
      isCorrect == true
        ? this.$emit("replyAnswer", true)
        : this.$emit("replyAnswer", false);
    },
  },
};
</script>
<style scoped lang="scss">
.gameContainer {
  width: 100%;
  height: 100%;
}
.virtualNumpad-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: $gap--small;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  .modal__body {
    display: flex;
    flex-direction: column;
    gap: $gap--small;
    width: 50%;
    background-color: white;
    padding: $gap--small;
    border-radius: $border-radius;
    .button__close-modal {
      @extend .button--animation;
      width: 100%;
      background-color: $error-color;
      min-height: 40px;
    }
  }
}
</style>
