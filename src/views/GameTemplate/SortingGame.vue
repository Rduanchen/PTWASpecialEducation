<template>
<div>
    <component :is="SlotComponent" :Data="question" :ID="id" v-if="SlotComponent"></component>
    <VirtualNumPad v-on:submit="GetSubmitData" ref="VirtualNumPad"></VirtualNumPad>
</div>
</template>

<script>
export default {
    data() {
        return {
     
        };
    },
    methods: {
     
    },
    mounted() {

    },
};
</script>

<style scoped lang="scss">

</style>