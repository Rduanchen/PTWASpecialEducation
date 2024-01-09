<template>
    <div>
        <canvas id="cvs" class="center" width="800" height="600" style="border: 1px solid #000" v-on:click="judge_position($event)"></canvas>
    </div>
</template>

<script>
export default {
    name: 'FindTheItem',
    data(){
        return {
            ObjPosition: [],
            ObjPositionRange: [],
            answered:[0,0,0,0,0,0,0,0,0,0,0]
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
        }        //Other Game Methods
    },
    created() {

    },
    mounted(){
        var cvs=document.getElementById("cvs");
        const ctx=cvs.getContext('2d');
        var img=new Image();
        // img.src=`../../assets/GamePic/${this.imgsrc}`; //FIXME: Change to props
        img.src=this.imageUrl=new URL(`../../assets/GamePic/${this.imgsrc}`, import.meta.url).href
        img.addEventListener("load", function() {
            ctx.drawImage(this,0,0,cvs.width,cvs.height);
        }, false);

        // var posX = $('#cvs').offset().left;
        // var posY = $('#cvs').offset().top;
        var posX = 0;
        var posY = 0;
        console.log("page offset:",posX,posY);
        // console.log(this.question,this.answer)
        this.ObjPosition=this.question["ObjLocation"];
        this.ObjPositionRange=this.answer;
        // console.log(this.ObjPosition,this.ObjPositionRange);
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
            console.log(event.pageX+posX,event.pageY+posY);
            console.log(this.ObjPositionRange[0][0][0],this.ObjPositionRange[0][0][1]);
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
            answered[i]=1;
            var unanswer=0;
            for(i in answered){
                if(answered[i]==0){
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


//About Time
// let seconds = 0;
// let timerId;
// var hour,minute,second;


// //To csv 
// csv_time_array=[['發現順序','數字','計時時間','第二關']];
// id=1;



//draw csv 

// function 

// function reflash_web(){
//     window.location.reload();
// }

//add addEvent listener on canva (click)
// $("#cvs").click(function(event){
//     judge_position(event)
// })

// //audio event
// function playAudio(num) {
//     var audio = new Audio("correct.mp3");
//     audio.addEventListener("ended",function(){
//         playNumber(num)
//     })
//     audio.play();
    
// }

// function harry(){
//     var audio = new Audio("./sound/harry.mp3");       
//     audio.play();
// }
// function playNumber(num){
//     var audio = new Audio("./sound/"+num+".mp3");       
//     audio.play();
// }


//judje crusor position
// function 
// function 

// function win(){
//     console.log("you win!")
//     // $('#end_game').modal('show');
//     // stopTime();
//     // $('#end_game_time').empty();
//     // var end_time=minute.toString()+"分鐘"+second.toString()+"秒鐘";
//     // var end_game_time_text=$('<p></p>').text("  你用了 "+end_time+" 來完成");
//     // $('#end_game_time').append(end_game_time_text)

//     // var time_text=hour.toString()+':'+minute.toString()+':'+second.toString();
//     // csv_time_array.push(['總時間',time_text])
//     // harry();
// }

//Time Event 

// function updateTime() {
//     seconds++;
//     hour = Math.floor(seconds / 3600);
//     minute = Math.floor((seconds % 3600) / 60);
//     second = seconds % 60;
//     $('#timer').text(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`);
// }
// function startTime(){
//     clearInterval(timerId);
//     timerId = setInterval(updateTime, 1000);
// }
// function stopTime(){
//     clearInterval(timerId);
// }
// function resetTime(){
//     clearInterval(timerId);
//     seconds = 0;
//     $('#timer').text('00:00:00');
// }

// function record_time_data(num){
//     var time_text=hour.toString()+':'+minute.toString()+':'+second.toString();
//     csv_time_array.push([id,num,time_text]);
//     id++
// }

// function convert_to_csv(){

//     const arrayToCSV = (arr) => {
//         return arr.map(row => row.join(',')).join('\n');
//     };

//     var csvString = arrayToCSV(csv_time_array);
//     csvString=  '\ufeff'+csvString; // 添加 BOM

//     var blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'result.csv';

//     document.body.appendChild(a);
//     a.click();
// }

// $(document).ready(
// function(){
//     // $('#start_game').modal('show');
//     //  image&canva event event
//     var cvs=document.getElementById("cvs");
//     const ctx=cvs.getContext('2d');
//     var img=new Image();
//     img.src="game_2.jpg";
//     img.addEventListener("load", function() {
//         ctx.drawImage(this,0,0,cvs.width,cvs.height);
//     }, false);

//     var posX = $('#cvs').offset().left;
//     var posY = $('#cvs').offset().top;
//     console.log("page offset:",posX,posY);
// }
// )
</script>

<style scoped>

</style>
