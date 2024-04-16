<template>
    <div>
        <p>Counter Test</p>
        {{ this.timer.Time }}
        <button @click="Reset">Reset</button>
        <button @click="Pause">Pause</button>
        <button @click="Start">Start</button>
    </div>
</template>

<script>
import Timer from '@/utilitys/Timer.js';
export default {
    name: 'CounterTest',
    data() {
        return {
            timer: new Timer(),
            time: null,
            intervalID: null,
            NowTime: 0,  
        };
    },
    watch: {
        // nowTime(this.ti) {

        // }
        NowTime() {
            // handler: function () {
                this.time = this.NowTime;
                console.log(this.NowTime);
            // },
            // deep: true,
        }
    },
    methods: {
        
    },
    mounted() {
        this.timer.Start();
        this.NowTime = this.timer.Time;
    },
    methods: {
        Reset(){
            this.timer.Reset();
        },
        Pause(){
            this.timer.Pause();
        },
        Start(){
            this.timer.Start();
        }
    },
};
</script>
<style scoped>
/* Your component-specific styles go here */
</style>