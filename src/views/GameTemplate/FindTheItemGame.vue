<template>
<div class="container">
    <p class="h1">{{ this.GameData.Text }}</p>
    <div class="Game">
        <canvas id="cvs" class="center" width="600" height="400" style="border: 1px solid #000" v-on:click="judge_position($event)"></canvas>
        <div class="ObjList">
            <p class="h4">尚未被找到:</p>
            <div class="Objects">
                <button v-for="(button,index) in this.GameData.Objs" class="Object" :class="{ activebutton: answered[index] } ">
                    {{ button.Name }}
                </button>
            </div>
        </div>
    </div>
    <!-- <button v-on:click="drawAllObj">繪製所有的位置</button> -->
</div>
</template>
<script>
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
export default {
    name: 'FindTheItem',
    data(){
        return {
            ObjPosition: [],
            ObjPositionRange: [],
            answered:[],
            btn:{},
            inputNumber: ''
        }
    },
    props: {
        GameData: {
          type: Object,
          required: true
        },
        GameConfig:{
            type: Object,
            required: true
        },
        id:{
            type: String,
            required: true
        }
        //Other Game Methods
    },
    created() {

    },
    mounted(){
        var cvs=document.getElementById("cvs");
        const ctx=cvs.getContext('2d');
        var img=new Image();
        img.addEventListener("load", function() {
            ctx.drawImage(this,0,0,cvs.width,cvs.height);
        }, false);
        img.src=GamesGetAssetsFile(this.id, this.GameData.img);
        for(var i in this.GameData.Objs){
            this.answered.push(false);
        }
        for(var i in this.GameData.Objs){
            this.ObjPosition.push([this.GameData.Objs[i].Location[0],this.GameData.Objs[i].Location[1]]);
            this.ObjPositionRange.push(
                [
                    [this.GameData.Objs[i].LeftTop[0],this.GameData.Objs[i].LeftTop[1]],
                    [this.GameData.Objs[i].RightBottom[0],this.GameData.Objs[i].RightBottom[1]]
                ]
            );

        }
    },
    methods:{
        // drawAllObj(){
        //     for(var i in this.ObjPositionRange){
        //         var canvas = document.getElementById("cvs");
        //         var ctx = canvas.getContext("2d");
        //         var posX = 0;
        //         var posY = 0;
        //         console.log(posX,posY)
        //         let width = this.ObjPositionRange[i][1][0]- this.ObjPositionRange[i][0][0];
        //         let height = this.ObjPositionRange[i][1][1]- this.ObjPositionRange[i][0][1];
        //         ctx.strokeRect(this.ObjPositionRange[i][0][0]+posX,this.ObjPositionRange[i][0][1]+posY,width,height);
        //     }
        // }, // this code is for DEBUG
        DrawCircle(x1,y1,x2,y2){
            var canvas = document.getElementById("cvs");
            var ctx = canvas.getContext("2d");
            let width = x2-x1;
            let height = y2-y1;
            let centerX = x1+width/2;
            let centerY = y1+height/2;
            let bais = 10;
            let radius = Math.max(width,height)/2 + bais;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        },
        judge_position(event){            
            // DEBUG
            // console.log("detect the mouse position...");
            // console.log(event.pageX,event.pageY);
            var posX = document.getElementById("cvs").getBoundingClientRect().left;
            var posY = document.getElementById("cvs").getBoundingClientRect().top;
            // console.log(posX,posY);
            for(var i in this.ObjPositionRange){
                if((event.pageX >= (this.ObjPositionRange[i][0][0]+posX))&&(event.pageX<=(this.ObjPositionRange[i][1][0]+posX))){
                    // console.log("x is right")//DEBUG
                    if((event.pageY>=(this.ObjPositionRange[i][0][1]+posY))&&(event.pageY<=(this.ObjPositionRange[i][1][1]+posY))){
                        // console.log("y is right")//DEBUG
                        this.RightAns(i);
                    }  
                }
            }  
        },
        RightAns(num){
            this.$emit('play-effect', 'CorrectSound')
            this.$emit('add-record',[this.GameData.Objs[num].Name,"被找到","正確"])
            this.DrawCircle(this.ObjPositionRange[num][0][0],this.ObjPositionRange[num][0][1],this.ObjPositionRange[num][1][0],this.ObjPositionRange[num][1][1]);
            $("#bt-"+num).css("background-color","red")
            this.detect_win(num);
        },
        detect_win(i){
            this.answered[i]=true;
            var unanswer=0;
            for(i in this.answered){
                if(this.answered[i]==false){
                    unanswer+=1
                }
            }
            if(unanswer==0){
                this.win();
            }
        },
        win(){
            console.log("FindTheItemGame CheckAnswer :Wrong")
            this.$emit('play-effect', 'HarraySound')
            this.$emit('add-record',["全對","","正確"])
            this.$emit('next-question',true);
        }
    }
}
</script>

<style scoped>
.h1{
    margin-left: 1rem;
    margin-bottom: 1rem;
}
.Game{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .ObjList{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1em;
        justify-content: center;
        align-items: center;
        p{
            align-self: start;
        }
        .Objects{
            display: flex;
            justify-content: center;
            .Object{
                background-color: #ffb703;
                border-radius: 12px;
                border: none;
            }

        }
        @media screen and (min-width: 992px) {
            .Objects {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 1rem;
            }
            .Object {
                width: 27%;
                height: 3rem;
            }
        }
        @media screen and (max-width: 992px) {
            .Objects {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 1rem;
            }
            .Object {
                width: 100%;
                height: 3rem;
            }
            
        }
    }
}
.activebutton {
    background-color: #606c38 !important;
    color: white;
}
</style>
