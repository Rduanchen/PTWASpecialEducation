<template>
    <div>
        <canvas id="cvs" class="center" width="800" height="600" style="border: 1px solid #000" v-on:click="judge_position($event)"></canvas>
    </div>
  </template>
  
  <script>
  import gamepic from '@/assets/GamePic/FindItemGameSample1.jpg'
  export default {
    name: 'FindTheItem',
    data(){
        return {
            ObjPosition: [
                      [42,56],
                      [625,115],
                      [336,68],//
                      [764,539],//
                      [590,320],//
                      [690,84],//5
                      [229,170],//
                      [88,204],//
                      [62,484],//
                      [699,361],
                      [37,386]
                  ],
            ObjPositionRange: [
                  [[22,30],[65,74]],//0
                  [[604,96],[646,130]],//1
                  [[315,48],[357,82]],//2
                  [[743,504],[57,128]],//3
                  [[491,564],[785,570]],//4
                  [[681,68],[705,102]],//5
                  [[65,170],[106,220]],//6
                  [[486,531],[387,492]],//7
                  [[48,471],[75,500]],//8
                  [[687,340],[711,377]],//9
                  [[12,375],[56,406]]//10
              ],
            answered:[]
        }
    },
    props: {
        imgsrc:{
            type: String,
            required: true
        },
        question: {
            type: Object,
            required: true
        },
        answer: {
            type: Array,
            required: true
        },
        offset:{
            type: Array,
            required: true
        }        //Other Game Methods
    },
    created() {
        // console.log(this.offset)
        // console.log("Component page offset:",this.offset[0],this.offset[1]);
        for(var i in this.question["ObjNum"]){
            this.answered.push(0);
        }
    },
    mounted(){
        var cvs=document.getElementById("cvs");
        const ctx=cvs.getContext('2d');
        var img=new Image();
        img.src=gamepic;
        // img.src=this.imageUrl=new URL('../../assets/GamePic/FindItemGameSample1.jpg', import.meta.url).href
        img.addEventListener("load", function() {
            ctx.drawImage(this,0,0,cvs.width,cvs.height);
        }, false);
  
        var posX = $('#cvs').offset().left;
        var posY = $('#cvs').offset().top;
        console.log("page offset:",posX,posY);
        // this.ObjPosition=this.question["ObjLocation"];
        // this.ObjPositionRange=this.answer;
        alert(this.ObjPositionRange)
    },
    methods:{
        outCircle(x,y){
            console.log("draw circle on number")
            var canvas = document.getElementById("cvs");
            var ctx = canvas.getContext("2d");
            // 設定圓形參數
            var radius = 50;//半徑
            var lineWidth = 2;
            var strokeColor = "red";
            // 繪製圓形
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2*Math.PI);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
        },
        judge_position(event){
            
            console.log("detect the mouse position...");
            console.log(event);
            console.log(event.pageX,event.pageY);
            var posX = $('#cvs').offset().left;
            var posY = $('#cvs').offset().top;
            // console.log(event.pageX+posX,event.pageY+posY);
            // console.log(this.ObjPositionRange[0][0][0],this.ObjPositionRange[0][0][1]);
            for(var i=0;i<11;i++){
                if((event.pageX>=(this.ObjPositionRange[i][0][0]+posX))&&(event.pageX<=(this.ObjPositionRange[i][0][1]+posX))){
                    console.log("x is right")
                    if((event.pageY>=(this.ObjPositionRange[i][1][0]+posY))&&(event.pageY<=(this.ObjPositionRange[i][1][1]+posY))){
                        console.log("y is right")
                        this.RightAns(i);
                    }  
                }
                //judge does the mouse click on the right position.
            }   
        },
        RightAns(num){
            console.log(num," was clicked!")
            var x=this.ObjPosition[num][0];
            var y=this.ObjPosition[num][1];
            //draw circle
            // record_time_data(num);
            // playAudio(num);//Play Right Answer Sound
            this.outCircle(this.ObjPosition[num][0],this.ObjPosition[num][1]);
            $("#bt-"+num).css("background-color","gray")
            this.detect_win(num);
        },
        detect_win(i){
            this.answered[i]=1;
            var unanswer=0;
            for(i in this.answered){
                if(this.answered[i]==0){
                    unanswer+=1
                }
            }
            if(unanswer==0){
                this.win();
            }
        },
        win(){
            console.log("you win!")
        }
        
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  