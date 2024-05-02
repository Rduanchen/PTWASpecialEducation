<template>
<div class="container">
    <div class="index">
        <p class="MainQuestion">{{ this.GameData.Question_Text }}</p>
        <img src="" alt="index" class="index">
        <div class="QuestionArea">
            <div v-for="(item, index1) in GameData.Question" :key="index1" class="QuestionRow">
                <div class="Question" v-for="(question,index2) in GameData.Question[index1]">
                    <div v-if="question[0] == '$'">
                        <input type="text" class="input" @focus="focusInput(index1,index2)"  v-model="Value[index1][index2]">
                    </div>
                    <div v-else>
                        <p>{{ question }}</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div class="Slot">
        <div v-for="slot in GameData.SlotModuel">
            <component :is="slot" @virtualpadinput-Input="VNInput" @virtualpadinput-delete="VNDelete" @virtualpadinput-pop="VNPop"></component>
        </div>
    </div>
</div>
</template>
<script>
import { defineAsyncComponent } from 'vue';
export default {
    name: 'FillinBlank',
    data(){
        return {
            InputId: 0,
            GameData: {
                "Question_Text": "Sample Question",
                "Img" : "src",
                "SlotModuel":["Numpad"],
                "Question" : [
                    ["3時5分","$input$","25分"],
                    ["=", "$input$", "時", "$input$" ,"分"],
                    ["下午","$input$","時","$input$","分"]
                ],
                "Answer": ["+","5","3"]
            },
            Value: [],
            focuslocation: []
        }
    },
    methods:{
        focusInput(id1,id2){    
            this.focuslocation = [id1,id2];
        },
        VNInput(data){
            this.Value[this.focuslocation[0]][this.focuslocation[1]] += data;
        },
        VNDelete(){
            this.Value[this.focuslocation[0]][this.focuslocation[1]] = "";
        },
        VNPop(){
            this.Value[this.focuslocation[0]][this.focuslocation[1]] = this.Value[this.focuslocation[0]][this.focuslocation[1]].slice(0,-1);
            console.log(this.Value[this.focuslocation[0]][this.focuslocation[1]]);
        }
    },
    created(){
        for(var i in this.GameData.Question){
            let temp = [];
            for(var j in this.GameData.Question[i]){
                temp.push("");
            }
            this.Value.push(temp);
        }
    },
    mounted(){

    },
    components:{
        Numpad: defineAsyncComponent(()=>import('@/components/VirtualNumPadInput.vue')),
        Calculator: defineAsyncComponent(()=>import('@/components/calculator.vue'))
    }
}
</script>

<style scoped>
.QuestionRow{
    display: flex;
    /* justify-content: center; */
    align-items: center;
}
.container{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    .index{
        width: 70%;
    }
    .Slot{
        width: 30%;
    }
}
</style>