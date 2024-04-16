<template>
<div>
<p class="h1 Title">這是題目</p>
{{ this.Answers}}
<div class="OutterContainer">
    <section class="OptionBar">
        <p class="OptionBarTitle h3">符號區域</p>
        <draggable :list="this.FakeSymbol" :sort="false" item-key="name" :group="{ name: 'Symbols', pull: 'clone', put: false }" class="">
            <template #item="{ element }">
                <cardwithbutton :imageURL="element.img" :Text="element.tag" :altText="element.alt" class="OptionBarItems"></cardwithbutton>
            </template>
        </draggable>
        <button @click="CheckAllAnswer">檢查答案</button>
    </section>
    <div class="QuestionArea">
        <div v-for="(item, index) in GameData.Datas" :key="index" class="QuestionContainer">
            <section class="QuestionRow">
                <div class="card CompareCard" style="width: 18rem;">
                    <img src="..." class="card-img-top" :alt="item[0].alt">
                    <div class="card-body">
                        <p class="card-text">{{ item[0].text }}</p>
                    </div>
                </div>
                <draggable :list="Answers[index]" group="Symbols" :sort="false" item-key="name" class="CompareSymbol" @change="Add(index)" @add="CheckDrop">
                    <template #item="{ element }">
                        <cardwithbutton :imageURL="element.img" :Text="element.tag" :altText="element.alt"></cardwithbutton>
                    </template>
                </draggable>
                <div class="card" style="width: 18rem;">
                    <img src="..." class="card-img-top" :alt="item[1].alt">
                    <div class="card-body">
                        <p class="card-text">{{ item[1].text }}</p>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
</div>
</template>

<script>
import cardwithbutton from '@/components/cardwithbutton.vue'
import draggable from 'vuedraggable';
export default {
    name: 'CompareGame',
    components: {
        draggable,
        cardwithbutton
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
    computed:{
        // CheckAnswerMethod(){
        //     console.log(this.GameConfig.CheckAnswerMode);
        //     switch(this.GameConfig.CheckAnswerMode){
        //         case "OnFill":
        //             return "OnFill";
        //         case "ClickButton":
        //             return "ClickButton";
        //         default:
        //             return "OnFill";
        //     }
        // }
    },
    data() {
        return {
            a: "",
            SelectedGroup: 0,
            Answers: [],
            Ans1:[],
            Ans2:[],
            FakeSymbol: [
                {
                    tag: "Big",
                    img: "Big.jpg",
                    alt: "Big"
                },
                {
                    tag: "Small",
                    img: "Small.jpg",
                    alt: "Small"
                },
                {
                    tag:"Equal",
                    img:"Equal.jpg",
                    alt:"Equal"
                }
            ]
        };
    },
    methods: {
        Add(index){
            console.log("check drop");
            this.SelectedGroup = index;
            console.log(this.SelectedGroup);
            // this.Ans1 = [this.Ans1[newVal.added.newIndex]]
        },
        CheckDrop(newVal){
            console.log(newVal.newIndex)
            let tmp = this.Answers[this.SelectedGroup][newVal.newIndex]
            this.Answers[this.SelectedGroup] = [tmp]
            this.RealTimeCheckAnswer()
            
        },
        RealTimeCheckAnswer(){
            if(this.GameData.Answer[this.SelectedGroup] == this.Answers[this.SelectedGroup][0].tag){
                console.log('ClassifyGame CheckAnswer :Right')
            }
            else{
                console.log('ClassifyGame CheckAnswer :Wrong')
            }

        },
        CheckAllAnswer(){
            for (var i in this.GameData.Answer) {
                if (this.GameData.Answer[i] == this.Answers[i][0].tag) {
                }
                else {
                    console.log('ClassifyGame CheckAnswer :Wrong')
                }
            }
        }
    },
    mounted() {
        for (var i in this.GameData.Datas) {
            this.Answers.push([])
        }
    },
};
</script>

<style scoped>
.Title{
    margin-left: 2rem;
}
.CompareSymbol{
    min-width: 10%;
    display: flex;
    align-self: stretch;
    border: solid;
    border-radius: 20px;
    border-color: #555;
    padding: 1rem;
}
.OutterContainer{
    margin-top: 2rem;
    min-height: 50vh;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.QuestionContainer{
    display: flex;
    flex-direction: column;
}
.QuestionRow{
    margin: 2rem 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    
}
.OptionBar{
    max-height: 79vh;
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    position: sticky;
    top:0;
    
}
.OptionBarItems{
    /* border: solid; */
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
.QuestionArea{
    border: solid;
    width: 100%;
    
}
.CompareCard{
    display: flex;
    align-items: stretch;
}
</style>