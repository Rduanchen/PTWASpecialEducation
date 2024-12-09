<template>
  <div class="Outter" ref="Outter">
    <div class="cup" ref="cup">
      <v-stage :config="stageSize" @wheel="handleWheel">
        <v-layer ref="layer">
          <!-- Water rectangle -->
          <v-rect :config="waterRectConfig" />
          <!-- Cup image -->
          <v-image :config="cupImageConfig" />
        </v-layer>
      </v-stage>
    </div>
    <div class="change-volume">
      <button @click="addML">+</button>
      <button @click="minusML">-</button>
    </div>
  </div>
</template>

<script>
import { GetSlotComponentData } from "../utilitys/get_assets";

export default {
  name: "Water",
  data() {
    return {
      stageSize: {
        width: 0,
        height: 0,
      },
      image: null,
      CupData: [],
      containVloume: 0,
      dpr: window.devicePixelRatio || 1,
    };
  },
  props: {
    Data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    cupImageConfig() {
      return {
        image: this.image,
        x: 0,
        y: 0,
        width: this.stageSize.width,
        height: this.stageSize.height,
      };
    },
    waterRectConfig() {
      const [StartX, StartY, EndX, EndY] = this.ContDrawInfo(
        this.Data.Scale,
        this.Data.containVloume
      );
      return {
        x: StartX,
        y: StartY,
        width: EndX,
        height: EndY,
        fill: "#bde0fe",
      };
    },
  },
  methods: {
    ContDrawInfo(Scale, ML) {
      // 基礎尺寸計算，不再除以 dpr
      let StartX = 0;
      let StartY = 0;
      let EndX = 0;
      let EndY = 0;

      const width = this.stageSize.width;
      const height = this.stageSize.height;

      if (Scale == 1000) {
        StartX = (width / 15) * 2;
        EndX = (width / 15) * 11 + 2;
        StartY = (height / 12) * (10 - ML / 100 + 1);
        EndY = (height / 12) * (ML / 100) + 2;
      } else if (Scale == 250) {
        StartX = (width / 15) * 2;
        EndX = (width / 15) * 11 + 2;
        StartY = (height / 15) * (1 + (13 / 250) * (250 - ML));
        EndY = (height / 15) * (13 / 250) * ML;
      } else if (Scale == 2000) {
        StartX = (width / 15) * 2;
        EndX = (width / 15) * 11 + 2;
        StartY = (height / 12) * (10 - ML / 200 + 1);
        EndY = (height / 12) * (ML / 200) + 2;
      }

      return [StartX, StartY, EndX, EndY];
    },
    loadImage() {
      const image = new window.Image();
      image.src = GetSlotComponentData("Water", `${this.Data.Scale}.png`);
      image.onload = () => {
        this.image = image;
      };
    },
    handleWheel(e) {
      e.evt.preventDefault(); // 防止頁面滾動
      if (e.evt.deltaY > 0) {
        this.minusML();
      } else {
        this.addML();
      }
    },
    addML() {
      const increment = this.Data.Scale == 250 ? 10 : 100;
      this.Data.containVloume = Math.min(
        this.Data.containVloume + increment,
        this.Data.Scale
      );
      this.$emit("updateML", this.Data.containVloume);
    },
    minusML() {
      const decrement = this.Data.Scale == 250 ? 10 : 100;
      this.Data.containVloume = Math.max(
        this.Data.containVloume - decrement,
        0
      );
      this.$emit("updateML", this.Data.containVloume);
    },
    updateSize() {
      const Outter = this.$refs.cup;
      if (!Outter) return;
      
      const border = Math.min(Outter.clientWidth, Outter.clientHeight) - 10;
      
      // 更新stage尺寸，考慮dpr
      this.stageSize = {
        width: border,
        height: border,
        pixelRatio: this.dpr, // 使用 Konva 的 pixelRatio 屬性
      };
    },
  },
  mounted() {
    // 初始化尺寸
    this.updateSize();
    
    // 添加視窗大小變化監聽
    window.addEventListener('resize', this.updateSize);
    
    // 載入圖片
    this.loadImage();
    
    // 初始化容量
    this.Data.containVloume = this.Data.Ml;
  },
  beforeDestroy() {
    // 清理監聽器
    window.removeEventListener('resize', this.updateSize);
  },
  watch: {
    // 監聽 Data 的變化
    'Data.Scale'() {
      this.loadImage();
    },
  },
};
</script>

<style scoped lang="scss">
.Outter {
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.cup {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.change-volume {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
  button {
    width: 100%;
    height: 30%;
    font-size: $text-large;
    margin: 10px;
    background-color: $primary-color;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}
</style>