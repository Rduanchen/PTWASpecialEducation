<template>
    <div class="canvas-container">
        <canvas id="responsive-bg" class="position-absolute"></canvas>
        <!-- <canvas ref="line_keeper" id="line_keeper" class="position-absolute"></canvas> -->
    </div>
</template>

<script>
import icon from '@/assets/GamePic/Cat.png';
export default {
    name: 'Link',
    data(){
        return{
            // RWD Setting
            Min_border: 10,
            Min_RowGap :30,
            Min_ImgWidth: 300,
            RWD_Img_Width: null,
            RWD_Gap_Width: null,

            // Game Setting
            TouchSensitive: 1, //This should be bigger than 0 , and the smaller more sensitive
            DotRadius: 7, //max


            //Line Drawer
            isDrawing: false,
            paths: [],


            //Line Checker
            ontouch_group:0,
            DotLocation:[],
            OnclickLocation:[], // [RowID,Index]
            DotLocation:[],

            //Check Answer

            //Fake Data
            QuestionDataStructure:[
                ['assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png'],
                ['assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png'],
                ['assets/GamePic/Cat.png','assets/GamePic/Cat.png']
            ],
            ans:[
                [[0,0],[1,0]],
                [[0,1],[1,2]],
                [[0,2],[1,1]]
            ]
        }
    },
    mounted() {
        const canvas1 = $('#responsive-bg')[0];
        const context1 = canvas1.getContext('2d');
        
        
        // Set Canvas size to full screen
        
        canvas1.width = window.innerWidth;
        canvas1.height = window.innerHeight;
        context1.clearRect(0, 0, canvas1.width, canvas1.height);
        
        let RWD_Info = this.CountRWDWidth(this.QuestionDataStructure);
        console.log(RWD_Info);
        this.RWD_Img_Width = RWD_Info.Img_width;
        this.RWD_Gap_Width = RWD_Info.Gap_width;
        this.DrawImgOnCanvas(this.QuestionDataStructure,context1);
            
        window.addEventListener('resize', () => {

            context1.clearRect(0, 0, canvas1.width, canvas1.height);
            canvas1.width = window.innerWidth;
            canvas1.height = window.innerHeight;
            let RWD_Info = this.CountRWDWidth(this.QuestionDataStructure);
            console.log(RWD_Info);
            this.RWD_Img_Width = RWD_Info.Img_width;
            this.RWD_Gap_Width = RWD_Info.Gap_width;
            this.DrawImgOnCanvas(this.QuestionDataStructure,context1);
        });
    },
    methods: {
        CountRWDWidth(question){
            //利用比例計算出每個圖片的大小
            //如果太多列導致圖片太小則以圖片最小值為主
            let RowAmount=question.length;
            let column = parseInt((window.innerWidth-this.Min_border*2)/(RowAmount*2+(RowAmount-1)*3)) // 扣掉邊界後，根據比例計算出圖片、間隔的大小(2:3)
            return {
                Img_width : column*2,
                Gap_width : column*3
            }
        },
        CountMaxImgSize(ImageRowAmount){
            //參數為每一欄圖片的數量 
            //計算出每個圖片的最大大小
            let Height= (window.innerHeight-this.Min_border*2)/ImageRowAmount;
            let Width = this.RWD_Img_Width;
            return{
                Max_Height: Height,
                Max_Width: Width
            }
        },
        ResizeRWDImg(ImgMaxSizeInfo,Img){
            let Img_Final_Height;
            let Img_Final_Width;
            let ratio =Img.height/Img.width;
            Img_Final_Height = ImgMaxSizeInfo.Max_Height;
            Img_Final_Width = ImgMaxSizeInfo.Max_Height/ratio;
            if (Img_Final_Width > ImgMaxSizeInfo.Max_Width) {
                Img_Final_Width = ImgMaxSizeInfo.Max_Width;
                Img_Final_Height = ImgMaxSizeInfo.Max_Width*ratio;
            }
            return {
                New_Height: Img_Final_Height,
                New_Width: Img_Final_Width
            }   
        },
        CountRWDYGap(question){
            //回傳每一欄沒有用到的圖片的間隔
            let full_space = 0;
            let Max_Img_Size = this.CountMaxImgSize(question.length);
            console.log(Max_Img_Size.Max_Height);
            for(var i in question){
                let img = new Image();
                // img.src = question[i];
                img.src = icon //FIXME: 這裡要改成vue動態匯入
                let Img_Size = this.ResizeRWDImg(Max_Img_Size,img);
                console.log(Img_Size.New_Height);
                full_space += Img_Size.New_Height;
            }
            return (window.innerHeight-this.Min_border*2-full_space)/(question.length+1)
            // return 0
        },
        DrawImgOnCanvas(question,context1,){
            let Column_Amount=question.length;
            for (let col = 0; col < question.length; col++) { //Column
                //紀錄錨點資訊
                let Row_ID = 1
                let Column_ID = 1
                let Group = 1
                const Max_Img_Size = this.CountMaxImgSize(this.QuestionDataStructure[col].length);
                let RWD_Colum_Gap=this.CountRWDYGap(question[col])
                
                console.log(RWD_Colum_Gap);

                for (let row = 0; row < question[col].length; row++) { //Row
                    let Img = new Image();
                    // let Image_Url=new URL(`../../${question[col][row]}`, import.meta.url).href
                    let Image_Url = icon //FIXME: 這裡要改成vue動態匯入
                    Img.src = Image_Url;

                    let Img_Size = this.ResizeRWDImg(Max_Img_Size,Img);
                    // Img.height = Img_Size.New_Height;
                    // Img.width = Img_Size.New_Width;

                    let x = this.Min_border + Max_Img_Size.Max_Width*col + this.RWD_Gap_Width*col
                    let y = this.Min_border + RWD_Colum_Gap + Max_Img_Size.Max_Height*row
                    // let bordr=100

                    Img.onload = () => {
                        console.log(this.Min_border);
                        context1.drawImage(Img, x, y, Img_Size.New_Width, Img_Size.New_Height);
                        context1.beginPath();
                        if (col == 0) {
                            // add on right
                            context1.arc((x+Img_Size.New_Width+this.Min_border), (y+(Img_Size.New_Height/2)), this.DotRadius, 0, Math.PI * 2, true);
                            // this.DotLocation.push([[Row_ID,Column_ID,Group],[x+Img_Width+this.Min_border, y+Img_Height/2]]);
                            context1.fillStyle = 'black';
                            context1.fill();
                            
                            // this.DotLocation.push([x+Img_Width+this.Min_border-this.TouchSensitive, y+Img_Height/2-this.TouchSensitive);
                        }
                        else if (col == Column_Amount-1) {
                            // add on left
                            
                            context1.arc(x-this.Min_border,(y+(Img_Size.New_Height/2)), this.DotRadius, 0, Math.PI * 2, true);
                            // this.DotLocation.push([[Row_ID,Column_ID,Group],[x-this.Min_border, y+Img_Height/2]]);
                            context1.fillStyle = 'black';
                            context1.fill();
                            
                            // this.DotLocation.push([x+Img_Width+this.Min_border-this.TouchSensitive, y+Img_Height/2-this.TouchSensitive);
                        }
                        else{
                            // add on both side
                            context1.arc(x-this.Min_border,(y+(Img_Size.New_Height/2)), this.DotRadius, 0, Math.PI * 2, true);
                            
                            Group++;

                            context1.arc((x+Img_Size.New_Width+this.Min_border), (y+(Img_Size.New_Height/2)), this.DotRadius, 0, Math.PI * 2, true);
                            // this.DotLocation.push([[Row_ID,Column_ID,Group],[x+Img_Width+this.Min_border, y+Img_Height/2]]);

                            
                            // this.DotLocation.push([[Row_ID,Column_ID,Group],[x-this.Min_border, y+Img_Height/2]]);
                            
                            context1.fillStyle = 'black';
                            context1.fill();
                            
                            // this.DotLocation.push([x+Img_Width+this.Min_border-this.TouchSensitive, y+Img_Height/2-this.TouchSensitive);
                        }
                        context1.closePath();
                    }
                }
            }
                
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
        position: absolute; /* 絕對定位來疊加 */
        top: 0;
        left: 0;
    }
    #myButton {
        margin-top: 20px; /* 按鈕與 canvas 區塊之間的距離 */
        /* 其他按鈕樣式 */
    }
</style>
    