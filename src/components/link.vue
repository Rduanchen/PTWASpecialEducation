<template>
    <div>
        <canvas ref="myCanvas" style="border: solid; border-width: 10px;"></canvas>
    </div>
</template>

<script>
import icon from '@/assets/GamePic/Cat.png';
export default {
    data(){
        return{
            WindowWidth: window.innerWidth,
            WindowHeight: window.innerHeight,
            border: 10,
            ItemGap: 10
        }
    },
    mounted() {
        const canvas = this.$refs.myCanvas;
        const context = canvas.getContext('2d');

        // Set Canvas size to full screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Listen for window resize event and update Canvas size
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // context.fillStyle = '#00F';
            // context.fillRect(50, 50, 100, 100);
        });

        var img = new Image();
        img.src = icon;
        img.onload = () => {
            img=this.ResizeImg(200,img,'Height')
            context.drawImage(img, 0, 0, img.width, img.height);
        };
        this.CountItemSize(5,img)
    },
    methods: {
        CountItemSize(Amount){ 
            var space = (window.innerHeight-(this.border*2 + this.ItemGap *(Amount-1))) / Amount;
            console.log(space);
        },
        ResizeImg(Target,img,SwitchItem){
            var ratio = img.height / img.width;
            const resizedImg = new Image();

            if (SwitchItem === 'Height') { // 提供目標高度
                resizedImg.height = Target;
                resizedImg.width = Target / ratio;
            } else { // 提供目標寬度
                resizedImg.width = Target;
                resizedImg.height = Target * ratio;
            }

            // 設定新的圖片來源
            resizedImg.src = img.src;

            return resizedImg;
        },
        DrawImgOnCanva(){

        }
    }
}
</script>

<style scoped>
/* Your component styles go here */
body, html {
    margin: 0;
    padding: 0;
    overflow: hidden;
}

canvas {
    display: block;
    border: 2px solid #000;
}
</style>
