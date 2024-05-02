<template>
    <div class="container">
        <div class="index">
            <p class="h1" style="font-weight: bold;">{{ this.GameConfig.GlobalTitle }}</p>
            <br>
            <div class="Info">
                <!-- 圖片的列 -->
                <div class="">
                    <div class="card mx-auto">
                        <div class="card-body d-flex justify-content-center">
                            <img class=" GameImg" :src="imageUrl" :alt="this.GameData.img_alt">
                        </div>
                    </div>
                </div>
                <!-- 按鈕的列 -->
                <div class="selection">
                    <p class="h2">{{ this.GameData.Question_Text }}</p>
                    <div v-for="i in question" class="mb-2">
                        <!-- <button type="button" class="btn btn-primary btn-block w-75" v-on:click="CheckAnswer(i)">{{ i }}</button> -->
                        <button type="button" v-on:click="CheckAnswer(i)">{{ i }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
export default {
    name: 'SelectGame',
    data(){
        return {
            imageUrl:'',
            question: [],
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
        CheckAnswer(answer){
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
        }
        this.imageUrl=GamesGetAssetsFile(this.id,this.GameData.img)
        console.log(this.imageUrl);
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
.GameImg{
    width: auto;
    height: 50vh;
}
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .index{
        display: flex;
        flex-direction: column;
        .Info{
            display: flex;
            flex-direction: row;
            justify-content: start;
            gap: 6em;
            img{
                max-height: 50vh;
                width: auto;
            }
        }
        .selection{
            height: 100%;
            align-self: center;
            display: grid;
            gap: 1em;
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
    background-color: #33b249;
}
button:hover {
    background-color: #5adbb5;
}
button:active {
    background-color: #33b249;
}
</style>