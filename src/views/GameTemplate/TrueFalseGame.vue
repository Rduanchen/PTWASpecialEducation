<template>
    <div class="container">
        <div class="Content">
            <div class="QuestionView">
                <component :is="this.SlotComponent" :Data="this.SlotData" :ID="this.id"></component>
            </div>
            <div class="SelectArea">
                <div class="card row mx-auto mb-3">
                    <p class="h3">{{ this.GameConfig.GlobalTitle }}</p>
                    <div class="card-body">
                        {{ GameData.Question }}
                    </div>
                </div>
                <div class="d-flex justify-content-center mx-auto d-grid gap-4">
                    <button type="button" class="btn btn-primary" v-on:click="CheckAnswer(true)"><i class="bi bi-circle"></i>正確</button>
                    <button type="button" class="btn btn-primary" v-on:click="CheckAnswer(false)"><i class="bi bi-x-lg"></i>錯誤</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
import { defineAsyncComponent } from 'vue';
export default {
    name: 'TrueFalseGame',
    data(){
        return {
            imageUrl:"",
            SlotComponent: "",
            SlotData: null
        }
    },
    emits: ['play-effect','add-record','next-question'],
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
    },
    methods:{
        CheckAnswer(answer){
            // typeof(answer);
            if(answer == this.GameData.Answer){
                this.$emit('play-effect', 'CorrectSound',)
                this.$emit('add-record',[this.GameData.Answer,answer,"正確"])
                this.$emit('next-question');
                console.log('check answer : True');
            }
            else{
                this.$emit('play-effect', 'WrongSound',)
                this.$emit('add-record',[this.GameData.Answer,answer,"錯誤"])
                console.log('check answer : False');
            }
        },

    },
    created() {
        this.imageUrl=GamesGetAssetsFile(this.id,this.GameData.img)
        this.SlotComponent = this.GameData.SlotComponents[0].Name;
        this.SlotData = this.GameData.SlotComponents[0].Data;
    },
    components: {
        ImageContainer: defineAsyncComponent(() => import('@/components/ImageContainer.vue'))
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
.Content{
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    height: 70vh;
    .QuestionView{
        width: 60%;
        height: 70%;
        img{
            height: 10px;
        }
    }
    .SelectArea{
        width: 40%;
    }
}
</style>