<template>
  <div class="question-card" @click="enterGame">
    <div class="id-container">{{ gameInfo.id }}</div>
    <div class="image-outter">
      <img
        :src="gameInfo.imgSrc"
        class="image--container"
        :alt="`${gameInfo.id}的介紹圖片`"
      />
    </div>
    <div class="card-info">
      <div class="info--top">
        <p class="title">{{ gameInfo.name }}</p>
        <a
          @click="MakeReadText(item.Name, item.Description)"
          class="btn btn-primary mx-2"
          ><i class="bi bi-volume-up-fill"></i
        ></a>
      </div>
      <p class="description">{{ gameInfo.description }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "QuestionCard",
  props: {
    gameInfo: {
      type: Object,
      required: true,
    },
  },
  emits: ["readText", "enterGame"],
  methods: {
    readText(event) {
      //   event.stopPropagation();
      this.$emit("readText", this.gameInfo.name, this.gameInfo.description);
    },
    enterGame() {
      this.$emit("enterGame");
    },
  },
};
</script>
<style scoped lang="scss">
.id-container {
  background-color: $info-color;
  align-self: start;
  padding: 5px;
  @extend .container-basic;
}
.question-card {
  display: flex;
  flex-direction: column;
  margin: 10px;
  padding: 10px;
  gap: $gap--small;
  transition: all 0.3s;
  cursor: pointer;
}
.info--top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: $text-medium;
    text-decoration: underline;
    font-weight: 600;
    color: $hyperlink-color;
  }
}

@media screen and (max-width: 768px) {
  .image-outter {
    height: 150px;
    .image--container {
      width: 100%;
      max-height: 100px;
      object-fit: contain;
    }
  }
}
.image-outter {
  height: 200px;
  .image--container {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
  }
}
</style>
