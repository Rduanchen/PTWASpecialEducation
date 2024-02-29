<template>
<div v-if="Status=='NotStart'">
    <button v-on:click="StartGame">Start Game</button>
</div>
<div v-else-if="Status=='Done'">
    <button v-on:click="EndGame">End Game</button>
    <button v-on:click="Restart">Restart</button>
</div>

</template>
<script>
export default {
    name: 'GameStartandOver',
    emits: ['start-game','download-record','restart'],
    data(){
        return {
         
        }
    },
    props: {
        Status: {
            type: String,
            required: true
        }
    },
    methods:{
        StartGame(){
            this.$emit('start-game');
        },
        EndGame(){
            this.$emit('download-record');
        },
        Restart(){
            this.$emit('restart');
        }
    }
}
</script>
<style scoped>

</style>
