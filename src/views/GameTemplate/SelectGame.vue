<template>
    <div class="container">
        <div class="index">
            <div class="card">
                <p class="h2" style="font-weight: bold;">{{ this.GameConfig.GlobalTitle }}</p>
            </div>
            <div class="Info">
                <!-- 圖片的列 -->
                <div class="Component" v-if="this.GameData.SlotComponents">
                    <component class="GameImg" :is="this.SlotComponent" :ID="this.id" :Data="this.SlotData"></component>
                </div>
                <!-- 按鈕的列 -->
                <div class="selection">
                    <div class="card">
                        <p class="h2">{{ this.GameData.Question_Text }}</p>
                    </div>
                    <div class="choese">
                        <button type="button" v-for="i in question" :class="{ 'Selected': this.Select[i] }" v-on:click="SelectItem(i)">{{ i }}</button>
                    </div>
                    <button type="button" class="Check" :class="{ 'OnSubmit': (this.Answer != null) }" v-on:click="CheckAnswer">送出答案</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
import { defineAsyncComponent } from 'vue';
export default {
    name: 'SelectGame',
    data(){
        return {
            imageUrl:'',
            question: [],
            SlotComponent: null,
            comp: null,
            Answer: null,
            Select:[]
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
    methods:{
        SelectItem(index){
            for(var i in this.Select){
                this.Select[i] = false;
            }
            this.Select[index] = true;
            this.Answer = index;
        },
        CheckAnswer(){
            let answer = this.Answer;
            if(answer == this.GameData.Answer){
                this.$emit('play-effect', 'CorrectSound')
                this.$emit('add-record',[this.GameData.Answer, answer,"正確"])
                this.$emit('next-question');
                console.log('check answer : True');
            }
            else{
                this.$emit('play-effect', 'WrongSound',)
                this.$emit('add-record',[this.GameData.Answer,answer,"錯誤"])
                console.log('check answer : False');
            }
        }
    },
    created() {
        for(var i in this.GameData.Question){
            this.question.push(this.GameData.Question[i]);
            this.Select.push(false);
        }
        this.imageUrl=GamesGetAssetsFile(this.id,this.GameData.img)
        if(this.GameData.SlotComponents != undefined){
            let SlotComponentData = this.GameData.SlotComponents[0]
            this.SlotData = SlotComponentData.Data;
            this.SlotComponent = SlotComponentData.Name;
        }
        console.log(this.imageUrl);
    },
    components: {
        ImageContainer : defineAsyncComponent(() => import('@/components/ImageContainer.vue')),
    }
}
</script>
<style scoped>
.card {
    border-style: solid;
}
button {
    width: 150px;
}
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .index{
        .card{
            padding: 1em;
            background-color: #bde0fe;
        }
        width: 100%;
        height: 100%;
        min-height: 60vh;
        .Info{
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: center;
            margin-top: 2em;
            width: 100%;
            height: 62vh;
            .selection{
                height: 100%;
                width: 35%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .card{
                    margin-bottom: 2em;
                    p{
                        font-weight: 600;
                    }
                }
                .choese{
                    button{
                        margin-bottom: 10px;
                        transition: 0.3s;
                        transform: scale(1);                        
                    }
                    button:hover{
                        transition: 0.3s;
                        transform: scale(1.03);
                    }
                }
            }
            .Component{
                border: solid;
                border-radius: 20px;
                width: 60%;
                height: 100%;
                min-height: 50vh;
                padding: 1em;
                .GameImg{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .ImgArea{
        width: 80%;
    }
}
button {
    height: 2em;
    font-size: 2em;
    width: 100%;
    border-radius: 12px;
    background-color: #ffb703;
}
.OnSubmit {
    animation: blink 1s linear infinite;
}
@keyframes blink {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}
.Check{
    background-color: #bde0fe;
}
.Selected{
    background-color: #ef233c;
}
</style>