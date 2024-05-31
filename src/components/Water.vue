<template>
    hello
    <div class="Outter">
        <canvas id="cup"></canvas>
    </div>
</template>

<script>
import { GetSlotComponentData } from '../utilitys/get_assets';
export default {
    name: 'Water',
    data() {
        return {
            CupData:[],
            Data: {
                "Scale": 1000,
                "Ml": 1000,
            },
        };
    },
    methods: {
        // Your component methods go here
    },
    mounted() {
        //getBoundingClientRect
        let Outter = document.getElementsByClassName('Outter')[0].getBoundingClientRect();
        let canvas = document.getElementById('cup');
        let ctx = canvas.getContext('2d');
        ctx.width = Outter.width-10;
        ctx.height = Outter.height-10;

        //Draw Water Rect
        ctx.beginPath();
        ctx.rect(0, 0, ctx.width, ctx.height);
        ctx.fillStyle = 'blue';
        ctx.fill();

        let img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, ctx.width, ctx.height);
        };
        img.src = GetSlotComponentData("Water", "test.png");
        console.log(img.src);

        


        // //Draw OutLine
        // ctx.beginPath();
        // ctx.moveTo(0, 0);
        // ctx.lineTo(0, Outter.height);
        // ctx.lineTo(Outter.width, Outter.height);
        // ctx.lineTo(Outter.width, 0);
        // ctx.strokeStyle = 'black'; // Fix: Use strokeStyle instead of strokeColor
        // ctx.stroke();

        // 250ml 
        // 500ml
        // 1000ml
    }
    // Other component options go here
};
</script>

<style scoped>
/* Your component styles go here */
.Outter{
    align-self: center;
    width: 10vw;
    height: 20vh;
}
</style>