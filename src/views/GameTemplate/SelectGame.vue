<template>
    <div class="container">
        <div class="index">
            <p class="h1" style="font-weight: bold;">{{ this.GameConfig.GlobalTitle }}</p>
            <br>
            <div class="Info">
                <!-- 圖片的列 -->
                <div class="Component" v-if="this.GameData.SlotComponents">
                    <component class="GameImg" :is="this.SlotComponent" :ID="this.id" :Data="this.SlotData"></component>
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
import { defineAsyncComponent } from 'vue';
export default {
    name: 'SelectGame',
    data(){
        return {
            imageUrl:'',
            question: [],
            SlotComponent: null,
            comp: null,
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
        this.comp

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
        width: 100%;
        height: 100%;
        min-height: 60vh;
        .Info{
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            height: 100%;
            /* border: solid; */
            .selection{
                height: 100%;
                width: 30%;
                align-self: center;
            }
            .Component{
                width: 70%;
                min-height: 50vh;
                .GameImg{
                    width: 100%;
                    height: 100%;
                    /* border: solid; */
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
    background-color: #33b249;
}
button:hover {
    background-color: #5adbb5;
}
button:active {
    background-color: #33b249;
}
</style>