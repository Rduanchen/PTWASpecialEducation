<template>
<div class="container">
    <div class="ImageCard">
        <img class="card-img-top GameImg" id="Img" v-if="SlotComponentSwitch==false" :src="imageUrl" :alt="GameData.img_alt">
        <component v-if="SlotComponentSwitch==true" :is="this.SlotComponent"></component>
    </div>
    <div class="AnswerArea">    
        <p>{{ this.GameData.Question }}</p>
        <VirtualNumPad v-on:submit="GetSubmitData" ref="VirtualNumPad"></VirtualNumPad>
    </div>
</div>
</template>

<script>
import VirtualNumPad from '@/components/VirtualNumPad.vue';
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
import { defineAsyncComponent } from 'vue';
export default {
    name: 'NumberInputGame',
    data() {
        return {
            imageUrl : '',
            SlotComponentSwitch: false,
            SlotComponent: "",
        };
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
    },
    methods: {
        GetSubmitData(data){
            console.log('Number Input Game Get:'+data);
            this.CheckAnswer(data);
        },
        CheckAnswer(data){
            var response=false;
            if(data == this.GameData.Answer){
                response=true;
            }
            else{
                response=false;
            }
            console.log(response);
            if(response){
                this.$emit('play-effect', 'CorrectSound',)
                this.$emit('add-record',[this.answer, data,"正確"])
                this.$refs.VirtualNumPad.delete_num();
                this.$emit('next-question');
            }
            else{
                this.$emit('play-effect', 'WrongSound',)
                this.$emit('add-record',[this.answer, data,"錯誤"])
                this.$refs.VirtualNumPad.delete_num();
            }
        }
    },
    mounted(){
        const img = document.getElementById('Img');
        try{
            // Image ration
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            if (aspectRatio > 1) {
                // Landscape
                img.style.width = '100%';
                img.style.height = 'auto';

            } else {
                // Portrait
                img.style.width = 'auto';
                img.style.height = '100%';
                const ImageCard = document.querySelector('.ImageCard');
                ImageCard.style.width = '50%';
                const AnswerArea = document.querySelector('.AnswerArea');
                AnswerArea.style.width = '30%';
            }
        } catch (error) {
            console.warn('NumberInputGame: Image No Found');
        }
    },
    created() {
        this.imageUrl=GamesGetAssetsFile(this.id,this.GameData.img)
        try{
            if(this.GameConfig.SlotComponentSwitch == true){
                this.SlotComponentSwitch = true;
                if (this.GameData.ComponentName){
                    this.SlotComponent = this.GameData.ComponentName;
                }
                else{
                    this.SlotComponentSwitch = false;
                }
            }
            else{
                this.SlotComponentSwitch = false;
            }
        } catch (error) {
            console.warn('NumberInputGame: SlotComponent No Found');
        }
    },
    components: {
        VirtualNumPad,
        // Verifyed Component Here
        Slot1: defineAsyncComponent(() => import("@/components/dragableslotdemo.vue")), //FIXME : This is only a demo
        Slot2: defineAsyncComponent(() => import("@/components/dragableslotdemo2.vue")) //FIXME : This is only a demo
    }
};


</script>
<style scoped>
.container{
    display: flex;
    flex-direction: row;
    justify-content: center;
    .ImgCard{
        align-self: center;
    }
    .ImageCard{
        width: 60%;
        margin: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .AnswerArea{
        width: 40%;
        margin: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        p{
            font-size: 1.5em;
        }
    }
}
</style>
