<template>
<div class="OutterContainer">
  <div class="container" ref="container">
    <canvas ref="canvas" @click="handleClick"></canvas>
  </div>
</div>
</template>
<style scoped>
.OutterContainer{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.container {
  display: flex;
  flex-direction: row;
  gap : 1rem;
  width: 100%;
  height: 100%;
  position: relative;
  justify-content: space-between;
  align-items: center;
}

.Division {
  width: 20%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
canvas {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>

<script>
export default {
  props: {
    Data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      colors: Array(this.Data.Mother).fill(null), // 儲存每個部分的顏色
      childScore: this.Data.Child, // 假設的數學分數
      motherScore: this.Data.Mother, // 假設的數學分數
      division: this.Data.Mother, // 將分數分成幾個部分
      centerX: 0,
      centerY: 0,
      radius: 0,
    };
  },
  mounted() {
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas);
    this.drawPieChart();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCanvas);
  },
  methods: {
    resizeCanvas() {
      const container = this.$refs.container;
      const canvas = this.$refs.canvas;
      let size = Math.min(container.clientWidth, container.clientHeight);
      size = size * 0.8; // 留白
      canvas.width = size ;
      canvas.height = size;
      this.centerX = size / 2;
      this.centerY = size / 2;
      this.radius = (size / 2) - 2;
      this.drawPieChart();
    },
    drawPieChart() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空畫布
      ctx.fillStyle = 'white'; // 設置白色底
      ctx.lineWidth = 3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const angleStep = (2 * Math.PI) / this.division;
      for (let i = 0; i < this.division; i++) {
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.arc(this.centerX, this.centerY, this.radius, i * angleStep, (i + 1) * angleStep);
        ctx.closePath();
        ctx.fillStyle = this.colors[i] ? this.colors[i] : 'white'; // 使用已選顏色或預設顏色
        ctx.fill();
        ctx.stroke();
      }
    },
    getSegmentIndex(x, y) {
      const dx = x - this.centerX;
      const dy = y - this.centerY;
      const angle = Math.atan2(dy, dx);
      const adjustedAngle = angle >= 0 ? angle : 2 * Math.PI + angle;
      return Math.floor(adjustedAngle / ((2 * Math.PI) / this.division));
    },
    handleClick(event) {
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const index = this.getSegmentIndex(x, y);
      this.colors[index] = this.colors[index] ? null : `hsl(${Math.random() * 360}, 100%, 50%)`; // 隨機顏色或取消顏色
      this.drawPieChart();
    },
  },
};
</script>
