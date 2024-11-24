<template>
  <!-- Your component's HTML template goes here -->
  <table class="number-board-container">
    <tr class="EachRow">
      <td v-for="unit in this.Unit" class="UnitEachBlanket">{{ unit }}</td>
    </tr>
    <tr class="EachRow">
      <td v-for="number in this.Number" class="EachBlanket">{{ number }}</td>
    </tr>
  </table>
</template>

<script>
import { set } from "@vueuse/core";
export default {
  name: "NumberBoard",
  data() {
    return {
      Number: null,
      Unit: null,
    };
  },
  props: {
    Data: {
      type: Object,
      required: true,
    },
  },
  created() {
    // 如果單位和數字的長度不一樣，則補齊。
    this.Unit = this.Data.Unit;
    this.Number = this.Data.Number;
    if (typeof this.Data.Number === "number") {
      this.Number = this.Data.Number.toString().split("");
    }
    if (this.Data.Unit.length != this.Number.length) {
      if (this.Data.Unit.length > this.Number.length) {
        let diff = this.Data.Unit.length - this.Number.length;
        for (let i = 0; i < diff; i++) {
          this.Number.unshift(" ");
        }
      } else {
        let diff = this.Number.length - this.Data.Unit.length;
        for (let i = 0; i < diff; i++) {
          this.Unit.unshift(" ");
        }
      }
    }
    // 如果數字有雙位數，則縮小字體。
    // let DoubleWord = false;
    // for (var i in this.Unit){
    //     if (this.Unit[i].toString().length > 1){
    //         DoubleWord = true;
    //         break;
    //     }
    // }
    // if (DoubleWord){
    //     let NumberBoard = document.getElementsByClassName('NumberBoard')[0];
    //     NumberBoard.style.gridTemplateRows = '2fr 1fr';
    // }
  },
};
</script>
<style scoped>
/* Your component's CSS styles go here */

.number-board-container {
  border: solid;
  border-color: blue;
  display: grid;
  grid-template-rows: 1.5fr 1fr;
}
.EachRow {
  width: 100%;
  display: flex;
  justify-content: space-around;
  height: 100%;
  td {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border: solid;
  }
}
</style>
