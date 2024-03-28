<template>
    <div id="app">
  <div class="cv__wrap" :class="{'is-collapse': isPanelCollapse}">
    <canvas
      id="canvas"
      width="0"
      height="0"
      ref="canvas"
      @mousedown="onMouseDown"
      @mouseup="onMouseup"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
      @mouseenter="onMouseEnter"
    ></canvas>
    <div class="cursur__pointer" :style="dynamicCursor"></div>
    <div class="top__panel__wrap">
      <a class="action" :href="base64" download="myCanvas.png">
        <i class="fas fa-save"></i>
        <p class="text">SAVE</p>
        <img :src="base64" alt hidden>
      </a>
      <div class="action" @click="onClearAll">
        <i class="far fa-trash-alt"></i>
        <p class="text">CLEAR ALL</p>
      </div>
      <label class="action" for="file">
        <i class="fas fa-cloud-upload-alt"></i>
        <p class="text">UPLOAD IMAGE</p>
        <input type="file" id="file" hidden accept="image/jpeg, image/png" @change="onUploadImage">
      </label>
      <div class="action" :class="{'is-disable': currentImgsIdx < 0}" @click.stop="onShiftStep(-1)">
        <i class="fas fa-chevron-left"></i>
        <p class="text">UNDO</p>
      </div>
      <div
        class="action"
        :class="{'is-disable': currentImgsIdx === historyImgs.length - 1}"
        @click.stop="onShiftStep(1)"
      >
        <i class="fas fa-chevron-right"></i>
        <p class="text">REDO</p>
      </div>
      <div class="action" @mouseenter="isShowFilter = true" @mouseleave="isShowFilter = false">
        <i class="fas fa-barcode"></i>
        <div class="text">FILTER</div>
        <ul class="filterList" v-if="isShowFilter">
          <li @click="utilImageFilter('grayscale')">Black&White</li>
          <li @click="utilImageFilter('brightness')">Brighter</li>
        </ul>
      </div>
      <div class="top__panel__bar" @click="isPanelCollapse = !isPanelCollapse">
        <i class="fas fa-chevron-up"></i>
      </div>
    </div>
    <div class="bot__panel__wrap">
      <div class="action">
        <i class="fas fa-pen"></i>
      </div>
      <div class="action">
        <i class="fas fa-eraser" @click="strokeColor = '#e5e5e5'"></i>
      </div>
      <div class="action">
        <div class="label">SIZE:</div>
        <input type="text" v-model="strokeWidth">px
      </div>
      <div class="action">
        <div class="label">COLOR:</div>
        <div class="color__options">
          <span class="option" @click="strokeColor = '#FFFFFF'"></span>
          <span class="option" @click="strokeColor = '#000000'"></span>
          <span class="option" @click="strokeColor = '#9BFFCD'"></span>
          <span class="option" @click="strokeColor = '#00CC99'"></span>
          <span class="option" @click="strokeColor = '#01936F'"></span>
          <input type="color" class="option" @change="onPickColor">
        </div>
      </div>
      <div class="bot__panel__bar" @click="isPanelCollapse = !isPanelCollapse">
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default ({
  data() {
    return {
      // 畫布物件
      canvas: null,
      ctx: null,
      // 繪畫資料
      isMouseDown: false,
      oldX: 0,
      oldY: 0,
      // 筆刷樣式
      strokeWidth: 16,
      strokeColor: "#000000",
      // 步驟紀錄
      currentImgsIdx: -1,
      historyImgs: [],
      base64: "",
      // 其他
      isPanelCollapse: false,
      dynamicCursor: {
        top: "0px",
        left: "0px",
        backgroundColor: "#000000",
        width: "16px",
        height: "16px"
      },
      isShowFilter: false
    };
  },
  watch: {
    strokeWidth() {
      this.ctx.lineWidth = this.strokeWidth;
      this.dynamicCursor.width = this.strokeWidth + "px";
      this.dynamicCursor.height = this.strokeWidth + "px";
    },
    strokeColor() {
      this.ctx.strokeStyle = this.strokeColor;
      this.dynamicCursor.backgroundColor = this.strokeColor;
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.utilsCanvasInit();
    window.addEventListener("resize", this.utilsDebounce(this.onWindowResize));
  },
  methods: {
    onMouseDown(e) {
      [this.oldX, this.oldY] = [e.clientX, e.clientY];
      this.isMouseDown = true;
    },
    onMouseup() {
      this.isMouseDown = false;
      this.currentImgsIdx = this.historyImgs.length;

      const base64 = this.canvas.toDataURL();
      this.base64 = base64;
      this.historyImgs.push(base64);
    },
    onMouseMove(e) {
      this.dynamicCursor.top = `${e.clientY -
        this.dynamicCursor.height.slice(0, -2) / 2}px`;
      this.dynamicCursor.left = `${e.clientX -
        this.dynamicCursor.width.slice(0, -2) / 2}px`;

      if (this.isMouseDown) {
        this.onDraw(e.clientX, e.clientY);
      }
    },
    onMouseLeave() {
      this.dynamicCursor.backgroundColor = "transparent"; // 隱藏滑鼠提示
      this.isMouseDown = false;
    },
    onMouseEnter() {
      this.dynamicCursor.backgroundColor = this.strokeColor;
      this.dynamicCursor.width = this.strokeWidth + "px";
      this.dynamicCursor.height = this.strokeWidth + "px";
    },
    onDraw(x, y) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.oldX, this.oldY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      [this.oldX, this.oldY] = [x, y];
    },
    onClearAll() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.historyImgs = [];
      this.currentImgsIdx = -1;
    },
    onWindowResize() {
      this.utilsCanvasInit();

      let img = new Image();
      img.src = this.base64;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
      };
    },
    onShiftStep(step) {
      if (
        (step > 0 && this.currentImgsIdx >= this.historyImgs.length - 1) ||
        (step < 0 && this.currentImgsIdx < 0)
      )
        return;

      if (this.currentImgsIdx === 0) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentImgsIdx += step;
        return;
      }

      this.currentImgsIdx += step;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.utilsDrawImage(this.historyImgs[this.currentImgsIdx]);
    },
    utilsCanvasInit() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.ctx = canvas.getContext("2d");
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.lineCap = "round";
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.lineWidth = this.strokeWidth;
    },
    utilsDebounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this,
          args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    utilsDrawImage(src, x = 0, y = 0) {
      let img = new Image();
      img.src = src;
      img.onload = () => {
        x = window.innerWidth / 2 - img.width / 2;
        y = window.innerHeight / 2 - img.height / 2;
        this.ctx.drawImage(img, x, y);
        this.base64 = this.canvas.toDataURL();
      };
    },
    utilImageFilter(filterName) {
      let result;
      switch (filterName) {
        case "grayscale":
          result = this.filterImage(this.grayscale, this.canvas);
          break;
        case "brightness":
          result = this.filterImage(this.brightness, this.canvas);
          break;
      }
      this.ctx.putImageData(result, 0, 0);

      const base64 = this.canvas.toDataURL();
      this.base64 = base64;
      this.historyImgs.push(base64);
    },
    grayscale(pixels) {
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            // CIE luminance for the RGB
            // The human eye is bad at seeing red and blue, so we de-emphasize them.
            var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            d[i] = d[i + 1] = d[i + 2] = v;
        }
        return pixels;
    },
    brightness(pixels) {
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
            d[i] += 25;
            d[i + 1] += 25;
            d[i + 2] += 25;
        }
        return pixels;
    },
    filterImage(filter) {
      var args = [
        this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      ];
      for (var i = 2; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return filter.apply(null, args);
    },
    onPickColor(e) {
      this.strokeColor = e.target.value;
    },
    onUploadImage(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.utilsDrawImage(reader.result);
      };
    }
  }
})
</script>
<style>
#app {
  font-family: "Segoe UI", "Avenir", Helvetica, Arial, sans-serif, 微軟正黑體;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #e5e5e5;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.cv__wrap {
  width: 100%;
  height: 100%;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  text-align: right;
  &.is-collapse {
    .top__panel__wrap {
      transform: translateY(-80px);
    }
    .bot__panel__wrap {
      transform: translate(-50%, 120px);
    }
  }
  #canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
  .cursur__pointer {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .top__panel__wrap {
    height: 80px;
    background-color: #ffffff;
    text-align: center;
    position: relative;
    transition: all 0.5s;
    min-width: 510px;
    .action {
      margin-right: 36px;
      display: inline-flex;
      height: 100%;
      cursor: pointer;
      transition: all 0.3s;
      color: black;
      text-decoration: none;
      i {
        font-size: 36px;
        line-height: 80px;
      }
      .text {
        font-size: 20px;
        margin-left: 10px;
        line-height: 80px;
      }
      &.is-disable {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
          transform: none;
        }
      }
      &:hover {
        transform: translateY(-5px);
      }
      .filterList {
        position: absolute;
        list-style: none;
        top: 70px;
        background-color: lightgray;
        padding: 20px 16px;
        text-align: left;
        color: #333;
        transition: all 0.5s;
        border-radius: 10px;
        line-height: 2;
        word-wrap: nowrap;
        &:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          top: -19px;
          left: calc(50% - 10px);
          border-bottom: 10px solid lightgray;
          border-right: 10px solid transparent;
          border-left: 10px solid transparent;
          border-top: 10px solid transparent;
        }
        li {
          transition: all 0.3s;
          &:hover {
            transform: translateY(-3px);
          }
        }
      }
    }
    .top__panel__bar {
      position: absolute;
      top: calc(100% - 28px);
      left: calc(50% - 28px);
      background-color: inherit;
      color: black;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      cursor: pointer;
      i {
        position: absolute;
        top: 60%;
        left: 50%;
        left: calc(50% - 5px);
        font-size: 10px;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
  .bot__panel__wrap {
    position: absolute;
    height: 80px;
    width: fit-content;
    background-color: #fff;
    border-radius: 40px;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    transition: all 0.5s;
    padding: 0 30px;
    min-width: 803px;
    .action {
      line-height: 80px;
      font-size: 20px;
      & + .action {
        margin-left: 30px;
      }
      .label {
        display: inline-block;
      }
      i.fas {
        font-size: 36px;
      }
      &:nth-child(3) {
        .label {
          margin-right: 16px;
          & + input[type="text"] {
            background-color: #e8e8e8;
            width: 74px;
            height: 48px;
            border-radius: 40px;
            border: none;
            margin-right: 8px;
            outline: none;
            text-align: center;
            font-size: 24px;
          }
        }
      }
      &:nth-child(4) {
        display: flex;
        .label {
          margin-right: 16px;
        }
        .color__options {
          display: flex;
          align-items: center;
          .option {
            display: inline-block;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            & + .option {
              margin-left: 8px;
            }
            &:first-child {
              border: 1px solid black;
              background-color: #fff;
            }
            &:nth-child(2) {
              background-color: #000;
            }
            &:nth-child(3) {
              background-color: #9bffcd;
            }
            &:nth-child(4) {
              background-color: #00cc99;
            }
            &:nth-child(5) {
              background-color: #01936f;
            }
          }
          input[type="color"] {
            background: none;
            border: none;
            border-radius: 50%;
          }
        }
      }
    }
    .bot__panel__bar {
      position: absolute;
      top: -28px;
      left: calc(50% - 28px);
      background-color: white;
      color: black;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      z-index: -1;
      cursor: pointer;
      i {
        position: absolute;
        top: 20%;
        left: calc(50% - 5px);
        font-size: 10px;
      }
    }
  }
}
</style>