<template>
<div class="container">
    <h1>{{ QuestionWord }}</h1>
    <hr>
    <draggable :list="options" group="Sentense">
        <template #item="{ element }">
        <button type="button" class="btn btn-primary m-1 my-btn">{{ element }}</button>
        </template>
    </draggable>
    <br>
    <hr>
    <button type="button" class="btn btn-primary btn-lg btn-block" @click="CheckAnswer()">Submit</button>
</div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
    name: 'SortGame',
    components: {
        draggable
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
    data() {
        return {
            QuestionWord: '',
            options:[],
            // question: null,
            // answer: null
        }
    },
    created(){
        // this.question=this.GameData.Question;
        // this.answer=this.GameData.Answer;
        // console.log(this.question)
        // console.log(this.answer)
        this.QuestionWord=this.GameData.Question.text
        this.RandomtheList();
        let randed = this.Checkrand();
        while(randed==false){
            this.RandomtheList();
            randed = this.Checkrand();
        }
        for(var i in this.GameData.Question.options){
            console.log("Do")
            this.options.push(this.GameData.Question.options[i])
        }
    },
    methods: {
        RandomtheList(){
            this.GameData.Question.options.sort(() => Math.random() - 0.5);
        },
        Checkrand(){
            var AnswerCheck=0
            for(var i in this.answer){
                if(this.answer[i]!=this.GameData.Question.options[i]){
                    AnswerCheck++
                }
            }
            console.log(AnswerCheck)
            if(AnswerCheck==0){
            //沒有打亂
                return false
            }
            else{
                return true
            }
        },
        CheckAnswer(){
            var AnswerCheck=true
            for(var i in this.answer){
                if(this.answer[i]!=this.options[i]){
                    AnswerCheck=false
                }
            }
            if(AnswerCheck==true){
                console.log("SortGame ChenckAnswer: Right")
                this.$emit('play-effect', 'CorrectSound')
                this.$emit('add-record',[this.answer, this.options,"正確"])
                this.$emit('next-question');
                return true
            }
            else{
                console.log("SortGame ChenckAnswer: Wrong")
                this.$emit('play-effect', 'WrongSound',)
                this.$emit('add-record',[this.answer, this.options,"錯誤"])
                return false
            }
        }
    }
}
</script>
<style scoped>
.card {
  min-height: 75px;
}
.my-btn {
  font-size: 2rem; /* 這裡可以調整文字大小 */
}

</style>

