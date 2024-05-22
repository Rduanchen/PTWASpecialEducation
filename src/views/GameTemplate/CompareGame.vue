<template>
<div>
<div class="Head">
    <p class="h1 Title" v-if="this.GameData.QuestionText && this.GameData.QuestionText!= ''">{{ this.GameData.QuestionText }}</p>
    <p class="h2 SubTitle" v-if="this.GameData.Description && this.GameData.Description != ''">{{ this.GameData.Description }}</p>
</div>
<hr>
{{ this.Answers}}
{{ this.Symbol }}
<div class="OutterContainer">
    <div class="QuestionArea">
        <div v-for="(item, index) in GameData.Datas" :key="index" class="QuestionContainer">
            <section class="QuestionRow" :class="{ 'QuestionRow-Wrong': this.Answered[index]==false, 'QuestionRow-Right': this.Answered[index]==true }">
                <div class="card CompareCard">
                    <div>
                        <component :is="item[0].Name" :Data="item[0].Data" :ID="this.id"></component>
                    </div>
                </div>
                <draggable :list="Answers[index]" group="Symbols" :sort="false" item-key="name" class="CompareSymbol" @change="Add(index)" @add="CheckDrop">
                    <template #item="{ element }">
                        <cardwithbutton :imageURL="element.img" :Text="element.Text" :altText="element.alt" class="clickable"></cardwithbutton>
                    </template>
                </draggable>
                <div class="card">
                    <div>
                        <component :is="item[0].Name" :Data="item[0].Data" :ID="this.id"></component>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <section class="OptionBar">
        <p class="OptionBarTitle">{{ this.GameData.OptionBarTitle }}</p>
        <draggable :list="this.Symbol" :sort="false" item-key="name" :group="{ name: 'Symbols', pull: 'clone', put: false }" class="Options">
            <template #item="{ element }">
                <cardwithbutton :imageURL="element.img" :Text="element.Text" :altText="element.alt" class="OptionBarItems clickable"></cardwithbutton>
            </template>
        </draggable>
        <button @click="CheckAllAnswer" class="SucessButton" v-if="this.GameConfig.CheckAnswerMode=='Button'">檢查答案</button>
    </section>
</div>
</div>
</template>
<script>
import cardwithbutton from '@/components/cardwithbutton.vue'
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
import draggable from 'vuedraggable';
import { defineAsyncComponent } from 'vue';
import TextOnly from '../../components/TextOnly.vue';
export default {
    name: 'CompareGame',
    components: {
        draggable,
        cardwithbutton: defineAsyncComponent(() => import('@/components/cardwithbutton.vue')),
        ImageContainer: defineAsyncComponent(() => import('@/components/ImageContainer.vue')),
        ImageWithText: defineAsyncComponent(() => import('@/components/ImageWithText.vue')),
        TextOnly: defineAsyncComponent(() => import('@/components/TextOnly.vue'))
    },
    emits: ['play-effect','add-record','next-level'],
    props: {
        GameData: {
            type: Object,
            required: true
        },
        GameConfig: {
            type: Object,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            a: "",
            SelectedGroup: 0,
            TotalQuestion: null,
            Answered: [],
            Answers: [],
            Ans1:[],
            Ans2:[],
            ImageDatas:[],
            Symbol: [],
            BSESymbol: [
                {
                    tag: "Big",
                    Text: ">"
                },
                {
                    tag: "Small",
                    Text: "<"
                },
                {
                    tag: "Equal",
                    Text: "="
                }
            ]
        };
    },
    methods: {
        Add(index){
            console.log("check drop");
            this.SelectedGroup = index;
            console.log(this.SelectedGroup);
        },
        CheckDrop(newVal){
            console.log(newVal.newIndex)
            let tmp = this.Answers[this.SelectedGroup][newVal.newIndex]
            this.Answers[this.SelectedGroup] = [tmp]
            this.RealTimeCheckAnswer()
            
        },
        RealTimeCheckAnswer(){
            if(this.GameConfig.CheckAnswerMode == "OnFill"){
                if(this.GameData.Answer[this.SelectedGroup] == this.Answers[this.SelectedGroup][0].tag){
                    this.$emit('play-effect', 'CorrectSound',)
                    this.Answered[this.SelectedGroup] = true;
                }
                else{
                    this.Answered[this.SelectedGroup] = false;
                    this.$emit('play-effect', 'WrongSound',)
                }
                if(this.CheckAnsweredAll()){
                    // this.$emit('play-effect', 'Harray',)
                    console.log("All Answered")
                    // this.$emit('next-question');
                }

                }
        },
        CheckAnsweredAll(){
            for(var i in this.Answered){
                if(this.Answered[i] == false || this.Answered[i] == null){
                    return false;
                }
            }
            return true;
        },
        CheckAllAnswer(){
            for (var i in this.GameData.Answer) {
                if (this.GameData.Answer[i] == this.Answers[i][0].tag) {
                    this.Answered[i] = true;
                }
                else {
                    this.Answered[i] = false;
                }
            }
        },
        ClearAllData(){
            for (var i in this.Answered) {
                this.Answers[i][0] = null;
                this.Answers[i][1] = null;
                this.Answered[i] = null;
                this.Answers[i] = [];
            }
        }
    },
    created() {
        this.TotalQuestion = this.GameData.Datas.length;
        for (var i in this.GameData.Datas) {
            this.Answered.push(null);
            this.Answers.push([]);
            let TempImg = [];
            this.ImageDatas.push(TempImg);
        }
        this.Symbol = this.BSESymbol;
    }
};
</script>

<style scoped>
.Head{
    width: 100%;
    padding-left: 2rem;
}



.OutterContainer{
    margin-top: 2rem;
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.QuestionContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.QuestionRow{
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 12px;
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    .CompareSymbol{
        min-width: 20vh;
        min-height: 10vh;
        display: flex;
        align-self:center;
        align-items: center;
        justify-content: center;
        border: solid;
        border-radius: 20px;
        border-color: #555;
        padding: 1rem;
    }
    .card{
        width: 15rem;
        align-self: stretch;
        align-items: center;
        justify-self: center;
    }
    .card-text{
        font-size: 1.5vw;
    }
    .CardWithoutImage{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 15vh;
        .card-text{
            font-size: 3vw;
        }
    }
}
.QuestionRow-Wrong{
    background-color: #cc0627c6;
}
.QuestionRow-Right{
    background-color: #3a86ff;
}

.OptionBarItems{
    /* border: solid; */
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
.QuestionArea{
    /* border: solid; */
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.CompareCard{
    display: flex;
    align-items: stretch;
}
.clickable{
    cursor:pointer;
}
.OptionBar{
    max-height: 79vh;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    position: sticky;
    top:0;
    .OptionBarTitle{
        font-size: 1.4rem;
    }
    .Options{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 2rem;
    }
    .SucessButton{
        padding: 1rem;
        width: 50%;
        background-color: #3a86ff;
        border: none;
        border-radius: 12px;
        font-size: x-large;
    }
}
</style>