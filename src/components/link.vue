<template>
<div class="canvas-container">
    <canvas id="myCanvas" class="position-absolute"></canvas>
    <canvas ref="myCanvas2" id="canvas2" class="position-absolute"></canvas>
</div>
<button @click="clearLastPath" id="myButton">清除上一个轨迹</button>


</template>

<script>
import icon from '@/assets/GamePic/Cat.png';
export default {
    data(){
        return{
            WindowWidth: window.innerWidth,
            WindowHeight: window.innerHeight,
            border: 30,
            ItemGap: 10,
            DotRadius: 10, //max
            DotLocation:[],
            QuestionDataStructure:[
                ['imgsrc','imgsrc','imgsrc','imgsrc','imgsrc'],
                ['imgsrc','imgsrc','imgsrc','imgsrc','imgsrc'],
                ['imgsrc','imgsrc','imgsrc','imgsrc','imgsrc']
            ],
            isDrawing: false,
            paths: [],
            TouchSensitive: 0,
            Min_Gap:30,
            HeightWidth:{}
        }
    },
    mounted() {
        var canvas1 = $('#myCanvas')[0];
        var context1 = canvas1.getContext('2d');
        // Set Canvas size to full screen
        canvas1.width = window.innerWidth;
        canvas1.height = window.innerHeight;
        this.CountRowGap(this.QuestionDataStructure,270)
        this.DrawReaizesImgOnCanvas(context1,icon,3);
        var img = new Image();
        img.src = icon;
        this.DrawImgOnRow(context1,img,this.QuestionDataStructure);
        // Listen for window resize event and update Canvas size
        window.addEventListener('resize', () => {
            canvas1.width = window.innerWidth;
            canvas1.height = window.innerHeight;
            this.DrawImgOnRow(context1,img,this.QuestionDataStructure);
        });
        this.canvas = this.$refs.myCanvas2;
        this.context = this.canvas.getContext('2d');
        this.canvas.width= window.innerWidth;
        this.canvas.height= window.innerHeight;
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.canvas.addEventListener('touchmove', this.handleTouchMove);
        this.canvas.addEventListener('touchend', this.handleTouchEnd);

    },
    methods: {
        CountItemSize(Amount){ 
            /**
             * 計算每個圖片的大小。(Compute Each Image's Size)
             * @param {number} Amount - 圖片數量 (Amount of Images)
             * @return {number} space - 回傳每個圖片的高度(Retrun Each Image's Height)
             */
            var height = (window.innerHeight-(this.border*2 + this.ItemGap *(Amount-1))) / Amount;
            var width = (window.innerWidth-(this.border*2)) / Amount;
            if(width<this.Min_Gap)
                width=(window.innerWidth-(this.border*2 + this.Min_Gap *(Amount-1))) / Amount;
            // return height;
            return {'height':height,'width':width};

        },

        CountRowGap(question,ImgWidth){
            var Amount=question.length;
            console.log("Amount:"+Amount);
            var space = (window.innerWidth-(this.border*2 + ImgWidth*Amount)) / (Amount-1);
            console.log("Each Row's Width:"+space);
            return space;
        },

        ResizeImg(Target,img,SwitchItem='Height'){
            /**
             * 依照比例修正圖片大小。(Resize Image by Ratio)
             * @param {number} Target - 目標長度 (Target Length)
             * @param {object} img - 圖片物件 (Image Object)
             * @param {string} SwitchItem - 傳入'Height'或'Width'，決定以哪個為基準。(Pass 'Height' or 'Width' to decide which one is the base)
             * @return {object} resizedImg - 回傳新的圖片物件 (Return New Image Object)
             */
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

            console.log("Resized Image's Height:"+resizedImg.height);
            return resizedImg;
        },
        DrawReaizesImgOnCanvas(context,Amount,bais,Dot_Direction='Right'){
            /**
             * 將圖片畫在Canvas上。(Draw Image on Canvas)
             */
            // var canvas = $('#myCanvas')[0];
            // var context = canvas.getContext('2d');
            var img = new Image();
            img.src = icon;//FIXME
            img.onload = () => {
                // var Image_Height=this.CountItemSize(Amount);
                var Img_data=this.CountItemSize(Amount);
                var Image_Height=Img_data.height;   
                var resizedImg=this.ResizeImg(Image_Height,img,'Height');   
                // this.DotRadius=Image_Height/10;
                if(Img_data.width<this.Min_Gap){
                    console.log('Touched Min Gap');
                    resizedImg=this.ResizeImg(Img_data.width,img,'Width');   
                    this.DotRadius=1;
                    this.border=5;
                }
                this.DotRadius=this.DotRadius>10?10:this.DotRadius;
                this.border=Image_Height/3;
                this.TouchSensitive*=1.1;

                var height=this.border;
                for(var i=0 ; i<Amount ; i++){
                    context.drawImage(resizedImg, bais, height , resizedImg.width, resizedImg.height);
                    context.beginPath();
                    if(Dot_Direction==='Right'){
                        context.arc((bais+resizedImg.width+this.border), (height+(resizedImg.height/2)), this.DotRadius, 0, 2 * Math.PI, false);
                        this.DotLocation.push([[(bais+resizedImg.width+this.border-(this.DotRadius/2)-this.TouchSensitive),(height+(resizedImg.height/2)-(this.DotRadius/2)-this.TouchSensitive)],[(bais+resizedImg.width+this.border+(this.DotRadius/2)+this.TouchSensitive),(height+(resizedImg.height/2)+(this.DotRadius/2)+this.TouchSensitive)]])
                    }
                    else if(Dot_Direction==='Both'){
                        //Right Side
                        context.arc((bais+resizedImg.width+this.border), (height+(resizedImg.height/2)), this.DotRadius, 0, 2 * Math.PI, false);
                        this.DotLocation.push([[(bais+resizedImg.width+this.border-(this.DotRadius/2)-this.TouchSensitive),(height+(resizedImg.height/2)-(this.DotRadius/2)-this.TouchSensitive)],[(bais+resizedImg.width+this.border+(this.DotRadius/2)+this.TouchSensitive),(height+(resizedImg.height/2)+(this.DotRadius/2)+this.TouchSensitive)]])
                        //Left Side
                        context.arc((bais-this.border), (height+(resizedImg.height/2)), this.DotRadius, 0, 2 * Math.PI, false);
                        this.DotLocation.push([[((bais-this.border)-(this.DotRadius/2)-this.TouchSensitive),(height+(resizedImg.height/2)-(this.DotRadius/2)-this.TouchSensitive)],[(bais-this.border+(this.DotRadius/2)+this.TouchSensitive),(height+(resizedImg.height/2)+(this.DotRadius/2)+this.TouchSensitive)]]);
                    }
                    else{
                        context.arc((bais-this.border), (height+(resizedImg.height/2)), this.DotRadius, 0, 2 * Math.PI, false);
                        this.DotLocation.push([[((bais-this.border)-(this.DotRadius/2)-this.TouchSensitive),(height+(resizedImg.height/2)-(this.DotRadius/2)-this.TouchSensitive)],[(bais-this.border+(this.DotRadius/2)+this.TouchSensitive),(height+(resizedImg.height/2)+(this.DotRadius/2)+this.TouchSensitive)]]);
                    }
                    context.fillStyle = 'black';
                    context.fill();
                    context.closePath();
                    height=height+(resizedImg.height+this.ItemGap);
                }
            }
            console.log(this.DotLocation);
        },
        DrawImgOnRow(context,img_obj,question){
            /**
             * 以行為單位，將圖片畫在Canvas上。(Draw Image on Canvas by Row)
             */
            // var Img_Height=this.CountItemSize(question[0].length);
            var Img_data=this.CountItemSize(question[0].length);
            var Img_Height=Img_data.height;
            var resizedImg=this.ResizeImg(Img_Height,img_obj,'Height');
            var space,RowAmount
            space=this.CountRowGap(question,resizedImg.width);
            RowAmount=question.length;
            var bais=0;
            for(var i=0; i<RowAmount ; i++){
                    var dir= question.length-1-i;
                    if(i==0){
                        console.log('Right')
                        this.DrawReaizesImgOnCanvas(context,question[0].length,bais,'Right');
                    }
                    else if(dir==0){
                        console.log('Left')
                        this.DrawReaizesImgOnCanvas(context,question[0].length,bais,'Left');
                    }
                    else{
                        console.log('Both')
                        this.DrawReaizesImgOnCanvas(context,question[0].length,bais,'Both');
                    }
                bais=bais+space+resizedImg.width;
            }
        },
        getEventPos(evt) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        },
        handleMouseDown(e) {
            if(this.JudgeRange(e.clientX,e.clientY)){
                if (!this.isDrawing) {
                this.isDrawing = true;
                const startPos = this.getEventPos(e);
                this.paths.push({ startX: startPos.x, startY: startPos.y });
            } else {
                // this.isDrawing = false;
                // const endPos = this.getEventPos(e);
                // this.paths[this.paths.length - 1].endX = endPos.x;
                // this.paths[this.paths.length - 1].endY = endPos.y;
                // this.drawPaths();
            }
            }
        },
        handleMouseMove(e) {
            if (this.isDrawing) {
                const currentPos = this.getEventPos(e);
                this.paths[this.paths.length - 1].currentX = currentPos.x;
                this.paths[this.paths.length - 1].currentY = currentPos.y;
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.drawPaths();
            }
        },
        handleMouseUp(e) {
            if(this.JudgeRange(e.clientX,e.clientY)){
                if (this.isDrawing) {
                    this.isDrawing = false;
                    const endPos = this.getEventPos(e);
                    this.paths[this.paths.length - 1].endX = endPos.x;
                    this.paths[this.paths.length - 1].endY = endPos.y;
                    this.drawPaths();
                }
            }
        },
        handleTouchStart(e) {
            if(this.JudgeRange(e.touches[0].clientX,e.touches[0].clientY)){
                e.preventDefault();
                this.isDrawing = true;
                const startPos = this.getEventPos(e.touches[0]);
                this.paths.push({ startX: startPos.x, startY: startPos.y });
            }
        },
        handleTouchMove(e) {
            if (this.isDrawing) {
                e.preventDefault();
                const currentPos = this.getEventPos(e.touches[0]);
                this.paths[this.paths.length - 1].currentX = currentPos.x;
                this.paths[this.paths.length - 1].currentY = currentPos.y;
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.drawPaths();
            }
        },
        handleTouchEnd(e) {
            if(this.JudgeRange(e.changedTouches[0].clientX,e.changedTouches[0].clientY)){
                if (this.isDrawing) {
                    e.preventDefault();
                    this.isDrawing = false;
                    const endPos = this.getEventPos(e.changedTouches[0]);
                    this.paths[this.paths.length - 1].endX = endPos.x;
                    this.paths[this.paths.length - 1].endY = endPos.y;
                    this.drawPaths();
                }
            }
            else{
                this.isDrawing = false;
                this.clearLastPath();
            }
        },
        drawPaths() {
            this.paths.forEach(path => {
                this.context.beginPath();
                this.context.moveTo(path.startX, path.startY);
                this.context.lineTo(path.currentX, path.currentY);
                this.context.stroke();
                this.context.closePath();
            });
        },
        clearLastPath() {
            this.paths.pop();
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPaths();
        },
        JudgeRange(x,y){
            for(var i=0;i<this.DotLocation.length;i++){
                if(x>=this.DotLocation[i][0][0] && x<=this.DotLocation[i][1][0] && y>=this.DotLocation[i][0][1] && y<=this.DotLocation[i][1][1]){
                    console.log('True');
                    return true;
                }
                else{
                    console.log('False'+x+' '+y);
                }
            }
            return false;
        }
    }
}
</script>

<style scoped>
/* Your component styles go here */
.canvas-container {
    display: flex; /* 使用 Flexbox 布局 */
    flex-direction: column; /* 子元素垂直排列 */
    align-items: center; /* 子元素水平居中 */
    position: relative; /* 相對定位，作為子元素的定位參考 */
}

canvas {
    border: 1px solid #000;
    position: absolute; /* 絕對定位來疊加 */
    top: 0;
    left: 0;
}

#myButton {
    margin-top: 20px; /* 按鈕與 canvas 區塊之間的距離 */
    /* 其他按鈕樣式 */
}




</style>
