<template>
    <div class="number-line">
      <div class="line"></div>
      <div v-for="n in range" :key="n" class="tick" :style="{ left: `${(n - min) * unitWidth}px` }">
        <div class="label">{{ n }}</div>
        <div class="mark"></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NumberLine',
    props: {
      min: {
        type: Number,
        default: -10
      },
      max: {
        type: Number,
        default: 10
      },
      unitWidth: {
        type: Number,
        default: 20
      }
    },
    computed: {
      range() {
        let rangeArray = [];
        for (let i = this.min; i <= this.max; i++) {
          rangeArray.push(i);
        }
        return rangeArray;
      }
    }
  };
  </script>
  
  <style scoped>
  .number-line {
    position: relative;
    height: 40px;
    margin: 20px;
  }
  
  .line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: black;
  }
  
  .tick {
    position: absolute;
    bottom: 0;
    text-align: center;
  }
  
  .mark {
    width: 1px;
    height: 10px;
    background-color: black;
    margin: 0 auto;
  }
  
  .label {
    margin-bottom: 5px;
  }
  </style>
  