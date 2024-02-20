<template>
    <div class="canvas-container">
        <canvas id="responsive-bg" class="position-absolute"></canvas>
        <canvas ref="line_keeper" id="line_keeper" class="position-absolute"></canvas>
    </div>
    <!-- <button @click="clearLastPath" id="myButton">清除上一个轨迹</button> -->
    
    
    </template>
    <script>
    import icon from '@/assets/GamePic/Cat.png';
    export default {
        data(){
            return{
                // RWD Setting
                Min_border: 10,
                Min_RowGap :30,
                Min_ImgWidth: 300,

                // Game Setting
                TouchSensitive: 1, //This should be bigger than 0 , and the smaller more sensitive
                DotRadius: 10, //max


                //Line Drawer
                isDrawing: false,
                paths: [],


                //Line Checker
                ontouch_group:0,
                DotLocation:[],
                OnclickLocation:[], // [RowID,Index]

                //Check Answer


                //Fake Data
                QuestionDataStructure:[
                    ['assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png'],
                    ['assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png'],
                    ['assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png']
                ],
                ans:[
                    [[0,0],[1,0]],
                    [[0,1],[1,2]],
                    [[0,2],[1,1]]
                ]
            }
        },
        mounted() {
            var canvas1 = $('#responsive-bg')[0];
            var context1 = canvas1.getContext('2d');
            // Set Canvas size to full screen
            canvas1.width = window.innerWidth;
            canvas1.height = window.innerHeight;

            console.log(this.Count_width(this.QuestionDataStructure));
        },
        methods: {
            Count_width(question){
                //利用比例計算出每個圖片的大小
                //如果太多列導致圖片太小則以圖片最小值為主
                var RowAmount=question.length;
                var column = (window.innerWidth-this.Min_border*2)/(RowAmount*2+(RowAmount-1)*3) // 扣掉邊界後，根據比例計算出圖片、間隔的大小(2:3)

                return {
                    Img_width : column*2,
                    Gap_width : column*3
                }
            },
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
    