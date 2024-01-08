<template>
<div class="container">
    <h1>{{ QuestionWord }}</h1>
    <hr>
    <draggable :list="options" group="Sentense" >
        <template #item="{ element }">
        <button type="button" class="btn btn-primary m-1 my-btn">{{ element }}</button>
        </template>
    </draggable>
    <br>
    <hr>
    <button type="button" class="btn btn-primary btn-lg btn-block" v-on:click="CheckAnswer()">Submit</button>
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
        question: {
            type: Object,
            required: true
        },
        answer: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            QuestionWord: '',
            options:[]
        }
    },
    created(){
        this.QuestionWord=this.question.text
        if(this.question.randomswitch==true){
            var rand=this.CheckAnswer()
            do{
                this.question.options.sort(() => Math.random() - 0.5);
                rand=this.CheckAnswer()
            }while(rand==true)
        }//打亂陣列
        for(var i in this.question.options){
            this.options.push(this.question.options[i])
        }
    },
    methods: {
        CheckAnswer(){
            var AnswerCheck=true
            for(var i in this.answer){
                if(this.answer[i]!=this.options[i]){
                    AnswerCheck=false
                }
            }
            if(AnswerCheck==true){
                console.log("SortGame ChenckAnswer: Right")
                this.$emit('check-answer',true);
                return true
            }
            else{
                console.log("SortGame ChenckAnswer: Wrong")
                this.$emit('check-answer',false);
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

