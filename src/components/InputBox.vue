<template>
<div class="Outter">
    <input type="text" v-model="inputValue" placeholder="Enter text" />
</div>
</template>
<script>
export default {
    data() {
        return {
            inputValue: ''
        };
    },
    methods: {
        ReturnValue() {
            $emit('ReplyAnswer', this.inputValue);
        }
    }
};
</script>

<style scoped>
.Outter{
    width: 100%;
    height: 100%;
}
</style>