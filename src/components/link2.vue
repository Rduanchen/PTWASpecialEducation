<template>
    <div class="row">
        <canvas id="myCanvas"></canvas>
        <canvas id="myCanvas2"></canvas>
    </div>
    <div class="row">
        <!-- <button @click="clearLastPath">Clear Last Path</button> -->
    </div>
</template>
<script>
import icon from '@/assets/GamePic/Cat.png';
export default {
    name: 'link2',
    data(){
        return{
            WindowWidth: window.innerWidth,
            WindowHeight: window.innerHeight,
            border: 30,
            ItemGap: 10,
            DotRadius: 10,
            DotLocation:[],
            QuestionDataStructure:[
                ['imgsrc','imgsrc','imgsrc','imgsrc','imgsrc'],
                ['imgsrc','imgsrc','imgsrc','imgsrc','imgsrc'],
                ['imgsrc','imgsrc','imgsrc','imgsrc','imgsrc'],
                ['imgsrc','imgsrc','imgsrc','imgsrc','imgsrc']
            ],
            canvas : $('#myCanvas2')[0],
            context : {},
            paths : []
        }
    },
    methods: {
        CountItemSize(Amount){ 
            /**
             * 計算每個圖片的大小。(Compute Each Image's Size)
             * @param {number} Amount - 圖片數量 (Amount of Images)
             * @return {number} space - 回傳每個圖片的高度(Retrun Each Image's Height)
             */
            var space = (window.innerHeight-(this.border*2 + this.ItemGap *(Amount-1))) / Amount;
            console.log("Each Image's Height:"+space);
            return space;
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
        DrawReaizesImgOnCanvas(context,img_obj,Amount,bais,Dot_Direction='Right'){
            /**
             * 將圖片畫在Canvas上。(Draw Image on Canvas)
             */
            // var canvas = $('#myCanvas')[0];
            // var context = canvas.getContext('2d');
            var img = new Image();
            img.src = icon;//FIXME
            img.onload = () => {
                var Image_Height=this.CountItemSize(Amount);
                var resizedImg=this.ResizeImg(Image_Height,img,'Height');
                var height=this.border;
                for(var i=0 ; i<Amount ; i++){
                    context.drawImage(resizedImg, bais, height , resizedImg.width, resizedImg.height);
                    context.beginPath();
                    if(Dot_Direction==='Right'){
                        context.arc((bais+resizedImg.width+this.border), (height+(resizedImg.height/2)), this.DotRadius, 0, 2 * Math.PI, false);
                        this.DotLocation.push([[(bais+resizedImg.width+this.border), (height+(resizedImg.height/2))],[(bais+resizedImg.width+this.border+this.DotRadius),(height+(resizedImg.height/2)+this.DotRadius)]]);
                    }
                    else if(Dot_Direction==='Both'){
                        //Left Side
                        context.arc((bais+resizedImg.width+this.border), (height+(resizedImg.height/2)), this.DotRadius, 0, 2 * Math.PI, false);
                        this.DotLocation.push([[(bais+resizedImg.width+this.border), (height+(resizedImg.height/2))],[(bais+resizedImg.width+this.border+this.DotRadius),(height+(resizedImg.height/2)+this.DotRadius)]]);
                        //Right Side
                        context.arc((bais-this.border), (height+(resizedImg.height/2)), this.DotRadius, 0, 2 * Math.PI, false);
                    }
                    else{
                        context.arc((bais-this.border), (height+(resizedImg.height/2)), this.DotRadius, 0, 2 * Math.PI, false);
                    }
                    context.fillStyle = 'black';
                    context.fill();
                    context.closePath();
                    height=height+(resizedImg.height+this.ItemGap);
                }
            }
        },
        DrawImgOnRow(context,img_obj,question){
            /**
             * 將圖片畫在Canvas上。(Draw Image on Canvas)
             */
            var Img_Height=this.CountItemSize(question[0].length);
            var resizedImg=this.ResizeImg(Img_Height,img_obj,'Height');
            var space,RowAmount
            space=this.CountRowGap(question,resizedImg.width);
            RowAmount=question.length;
            var bais=0;
            for(var i=0; i<RowAmount ; i++){
                    var dir= question.length-1-i;
                    if(i==0){
                        console.log('Right')
                        this.DrawReaizesImgOnCanvas(context,resizedImg,question[0].length,bais,'Right');
                    }
                    else if(dir==0){
                        console.log('Left')
                        this.DrawReaizesImgOnCanvas(context,resizedImg,question[0].length,bais,'Left');
                    }
                    else{
                        console.log('Both')
                        this.DrawReaizesImgOnCanvas(context,resizedImg,question[0].length,bais,'Both');
                    }
                bais=bais+space+resizedImg.width;
            }
        },
        JudegeRange(x,y){
            for(var i in this.DotLocation){
                if(x>=this.DotLocation[i][0][0] && x<=this.DotLocation[i][1][0] && y>=this.DotLocation[i][0][1] && y<=this.DotLocation[i][1][1]){
                    return true;
                }
                else{
                    return false;
                }
            }
        },
        clearLastPath(context,) {
            // 移除数组中的最后一个路径
            paths.pop();

            // 清空画布并重新绘制所有路径
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawPaths();
        }
    },
    mounted(){
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

        var canvas = $('#myCanvas2')[0];
        this.context = canvas.getContext('2d');
        var context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var isDrawing = false;
        var paths=[];

        function getEventPos(evt) {
        var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        canvas.addEventListener('mousedown', function (e) {
            // 记录起始点
            var startPos = getEventPos(e);
            var pass= this.JudegeRange(startPos.x,startPos.y)
            if(pass){
                if(isDrawing==false){
                    isDrawing = true;
                    // 将当前路径的起始点加入数组
                    this.paths.push({ startX: startPos.x, startY: startPos.y });
                }
                else{
                    isDrawing = false;
                    var endPos = getEventPos(e);

                    // 将当前路径的结束点加入数组
                    paths[paths.length - 1].endX = endPos.x;
                    paths[paths.length - 1].endY = endPos.y;

                    // 绘制线段
                    drawPaths();
                }
            }
        });


    }
}
</script>