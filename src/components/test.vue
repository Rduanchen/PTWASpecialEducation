<template>
<div class="container">
    <canvas width="500" height="500" style="border: solid;" class="Canvas"></canvas>
    
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
        let CaptureDOM  = document.getElementsByClassName('Data')
        CaptureDOM[0].style.display = 'block';
        htmlToImage.toPng(document.getElementsByClassName('Data')[0])
        .then(function (dataUrl) {
            var img = new Image();
            let canvas = document.getElementsByClassName('Canvas')[0];
            let ctx = canvas.getContext('2d');
            img.onload = function(){
                ctx.drawImage(img, 0, 0);
            }
            console.log(dataUrl);
            img.src = dataUrl;
            CaptureDOM[0].style.display = 'none';
        })
    },
};
</script>

<style scoped>
/* Your component-specific styles go here */
.Data{
    position: relative;
    top: 0;
    left: 0;
}
</style>