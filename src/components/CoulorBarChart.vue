<template>
  <div class="OutterContainer">
    <p v-if="this.Data.Text != undefined">
      {{ this.Data.Text }}{{ this.Data.Unit }}
    </p>
    <div class="Number" v-else>
      <div class="Division">
        <p class="Child">{{ this.Data.Child }}</p>
        <hr class="fraction-line" />
        <p class="Mother">{{ this.Data.Mother }}</p>
      </div>
      <p>{{ Data.Unit }}</p>
    </div>
    <table class="OddBorderOutline">
      <tr v-for="(items, index1) in Drawed">
        <td
          v-for="(item, index2) in items"
          class="table"
          @click="handleClick($event, index1, index2)"
        ></td>
      </tr>
    </table>
    <!-- <button @click="GetAnswer1">GetAnswer</button> -->
    <!-- {{ this.Drawed }} -->
  </div>
</template>
<script>
import TextOnly from "./TextOnly.vue";
export default {
  name: "CoulorBarChart",
  data() {
    return {
      Drawed: [],
      container: null,
    };
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
  methods: {
    // Your component's methods go here
  },
  created() {
    this.Data.Total = this.Data.Mother;
    this.Drawed = [];
    if (this.Data.Total % 2 != 0) {
      //奇數
      let temp = [];
      for (var i = 0; i < this.Data.Total; i++) {
        temp.push(true);
      }
      console.log(temp);
      this.Drawed.push(temp);
    } else {
      //偶數
      let temp = [];
      let div = this.Data.Total / 2;
      for (var i = 0; i < 2; i++) {
        let temp = [];
        for (var x = 0; x < div; x++) {
          temp.push(true);
        }
        this.Drawed.push(temp);
      }
    }
  },
  mounted() {
    // Code to run when the component is mounted goes here
    let tableData = document.getElementsByClassName("table");
    let container = document.getElementsByClassName("OutterContainer");
    container = container[0].getBoundingClientRect();
    let width = container.width / this.Data.Total - 10;
    for (var i = 0; i < tableData.length; i++) {
      tableData[i].style.width = width + "px";
    }
    if (this.Data.Coulor == undefined) {
      this.Data.Coulor = "#bde0fe";
    }
  },
  methods: {
    handleClick($event, index1, index2) {
      this.Drawed[index1][index2] = !this.Drawed[index1][index2];
      if (this.Drawed[index1][index2]) {
        $event.target.style.backgroundColor = "white";
      } else {
        $event.target.style.backgroundColor = this.Data.Coulor;
      }
      this.GetAnswer();
    },
    GetAnswer() {
      let TempAnswer = 0;
      for (var i = 0; i < this.Drawed.length; i++) {
        for (var x = 0; x < this.Drawed[i].length; x++) {
          if (this.Drawed[i][x] == false) {
            TempAnswer += 1;
          }
        }
      }
      if (TempAnswer == this.Data.Child) {
        this.$emit("replyAnswer", true);
      } else {
        this.$emit("replyAnswer", false);
      }
    },
    GetAnswer1() {
      let TempAnswer = 0;
      for (var i = 0; i < this.Drawed.length; i++) {
        for (var x = 0; x < this.Drawed[i].length; x++) {
          if (this.Drawed[i][x] == false) {
            TempAnswer += 1;
          }
        }
      }
      if (TempAnswer == this.Data.Child) {
        alert("Correct" + TempAnswer + this.Data.Child);
      } else {
        alert("Incorrect" + TempAnswer + this.Data.Child);
      }
    },
  },
};
</script>
<style scoped lang="scss">
/* Your component's styles go here */
p {
  font-size: 2rem;
}
.OutterContainer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .Number {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    .Division {
      display: inline-block;
      text-align: center;
      font-size: 2rem;
      line-height: 2; /* 設置行高 */
      vertical-align: middle; /* 垂直對齊 */
      .Child {
        margin: 0;
      }
      .Mother {
        margin: 0;
      }
      .fraction-line {
        margin: 0;
        border: none;
        border-top: 2px solid black;
        width: 2em;
      }
    }
  }
  .OddBorderOutline {
    border: solid;
    border-width: 2px;
    border-left: solid;
    border-right: solid;
    tr {
      border: solid;
    }
  }
  .table {
    border-style: dashed !important;
    height: 3rem;
    border-left: solid;
    background-color: #fff;
  }
}
</style>
