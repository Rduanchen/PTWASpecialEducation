<template>
    <div>
      <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg" @mousedown="startDrawing" @mousemove="drawLine" @mouseup="stopDrawing">
        <circle cx="50" cy="50" r="10" stroke="black" stroke-width="3" fill="red" />
        <circle cx="450" cy="450" r="10" stroke="black" stroke-width="3" fill="red" />
        <line v-for="line in lines" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" stroke="black" stroke-width="2" />
        <line v-if="isDrawing" :x1="currentLine.x1" :y1="currentLine.y1" :x2="currentLine.x2" :y2="currentLine.y2" stroke="black" stroke-width="2" />
      </svg>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SVGtest',
    data() {
      return {
        lines: [],
        isDrawing: false,
        currentLine: { x1: 0, y1: 0, x2: 0, y2: 0 }
      };
    },
    methods: {
      startDrawing(event) {
        const { offsetX, offsetY } = event;
        if (!this.isDrawing) {
          // Start a new line
          this.isDrawing = true;
          this.currentLine = { x1: offsetX, y1: offsetY, x2: offsetX, y2: offsetY };
        } else {
          // Finish the current line
          this.currentLine.x2 = offsetX;
          this.currentLine.y2 = offsetY;
          this.lines.push(this.currentLine);
          this.isDrawing = false;
        }
      },
      drawLine(event) {
        if (this.isDrawing) {
          const { offsetX, offsetY } = event;
          this.currentLine.x2 = offsetX;
          this.currentLine.y2 = offsetY;
        }
      },
      stopDrawing(event) {
        if (this.isDrawing) {
          // Update the final position of the line when the mouse is released
          const { offsetX, offsetY } = event;
          this.currentLine.x2 = offsetX;
          this.currentLine.y2 = offsetY;
          this.lines.push(this.currentLine);
          this.isDrawing = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Your component-specific styles go here */
  </style>
  