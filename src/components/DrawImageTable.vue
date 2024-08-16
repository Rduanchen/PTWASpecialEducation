<template>
  <div class="Container">
    <p>Do not use this, this will be no longer to maintains</p>
    <div class="division">
      <p>{{ this.Data.Child }}</p>
      <hr>
      <p>{{ this.Data.Mother }}</p>
    </div>
    <div class="table-container">
      <div
        v-for="index in totalCells"
        :key="index"
        :class="['table-cell', { 'colored': coloredCells.includes(index - 1) }]"
        @click="toggleColor(index - 1)"
      >
        <img v-if="index <= Data.length" :src="Src" :alt="Data.Alt" />
      </div>
    </div>
  </div>
</template>
  
  <script>
  import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
  export default {
    name: 'DrawImageTable',
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
        coloredCells: [],
        Src: ''
      };
    },
    created() {
        this.Data.length = this.Data.Mother;
        this.Src = GamesGetAssetsFile(this.ID, this.Data.Src);
    },
    computed: {
      totalCells() {
        // 確保總格子數量是 4 的倍數
        const rows = Math.ceil(this.Data.length / 4);
        return rows * 4;
      },
    },
    methods: {
      toggleColor(index) {
        if (this.coloredCells.includes(index)) {
          this.coloredCells = this.coloredCells.filter(i => i !== index);
        } else {
          this.coloredCells.push(index);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .Container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    
    .division{
      width: 20%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      hr{
        width: 20px;
        border: solid;
      }
    }
    .table-container{
      width: 70%;
      border: solid #ccc;
      border-radius: 12px;
      padding: 1rem;
    }
  }
  .table-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  
  .table-cell {
    position: relative;
    border: 1px solid #ccc;
    /* height: 150px; */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
  }
  
  .table-cell img {
    max-width: 100%;
    max-height: 100%;
  }
  
  .table-cell.colored {
    background-color: rgba(0, 0, 255, 0.3); /* 藍色半透明 */
  }
  
  .table-cell.colored::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom right, transparent 49%, black 49%, black 51%, transparent 51%);
  }
  </style>
  