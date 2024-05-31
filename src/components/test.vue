<template>
<div class="container">
    <div>
        <canvas width="500" height="500" style="border: solid;" class="Canvas"></canvas>
    </div>
    <div class="Data">
        <p>Fake DOM</p>
        <p>Fake DOM</p>
        <p>Fake DOM</p>
    </div>
</div>
</template>

<script>
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
export default {
    name: 'Test',
    data() {
        return {
            // Your data properties go here
        };
    },
    methods: {
        // Your methods go here
    },
    computed: {
        // Your computed properties go here
    },
    mounted() {
        // Code to run when the component is mounted goes here
        htmlToImage.toPng(document.getElementsByClassName('Data')[0])
        .then(function (dataUrl) {
            var img = new Image();
            console.log(dataUrl)
            let canvas = document.getElementsByClassName('Canvas')[0];
            let ctx = canvas.getContext('2d');
            img.onload = function(){
                ctx.drawImage(img, 0, 0);
            }
            img.src = dataUrl;
        })
    },
};
</script>

<style scoped>
/* Your component-specific styles go here */
</style>