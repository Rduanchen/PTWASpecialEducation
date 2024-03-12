<template>
<div class="container">
    <h1>{{ this.GameData.Question.text }}</h1>
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
            show: false,
            question: null,
            // answer: null
        }
    },
    created(){
        this.UpdateQuestion();
        setInterval(this.IntervalCheckUpdate, 500);
    },
    methods: {
        UpdateQuestion(){
            this.answer = this.GameData.Answer;
            this.question = this.GameData.Question.options;
            this.RandomtheList();

            this.options = [];
            for(var i in this.question){
                this.options.push(this.question[i])
            }
            console.log(this.question, this.options, this.answer)
        },
        RandomtheList(){
            this.question.sort(() => Math.random() - 0.5);
        },
        Checkrand(){
            var AnswerCheck=0
            for(var i in this.answer){
                if(this.answer[i]!=this.GameData.Question.options[i]){
                    //如果不等於的時候
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
        IntervalCheckUpdate(){
            if (this.question != this.GameData.Question.options){
                this.UpdateQuestion();
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
                this.show = false;
                this.$emit('play-effect', 'CorrectSound')
                this.$emit('add-record',[this.GameData.Answer, this.options,"正確"])
                this.$emit('next-question');        
                setTimeout(this.UpdateQuestion, 100);
                this.UpdateQuestion();
            }
            else{
                console.log("SortGame ChenckAnswer: Wrong")
                this.$emit('play-effect', 'WrongSound',)
                this.$emit('add-record',[this.answer, this.options,"錯誤"])
                this.UpdateQuestion();
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

