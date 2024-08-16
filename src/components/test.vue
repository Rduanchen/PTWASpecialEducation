<template>
<div class="Outter">
  <div class="Inner"></div>
  <div class="Inner" v-for="items in 10">
  </div>
  <div class="Inner"></div>

  <div class="Inner"></div>
  <div class="Inner" v-for="items in 10">
  </div>
  <div class="Inner"></div>
</div>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      test: 'test'
    }
  },
}
</script>

<style scoped>
/* Your component's styles go here */
.Outter{
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 0.5fr repeat(10, 1fr) 0.5fr;
    gap: 10px;
    .Inner{
      max-height: 30vh;
      background-color: red;
    }
}
</style>