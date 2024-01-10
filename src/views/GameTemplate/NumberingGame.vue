<template>
    <div>
        <div class="container">
            <img :src="imageUrl">
            <p class="h3">{{ this.question.Text }}</p>
            <p class="h5">請點擊下方的按鈕選擇答案</p>
            <div id="error_msg">{{ errorMsg }}</div>
            <div class="d-flex flex-row  flex-wrap">
                <button v-for="(items,index) in btn" class="btn btn-primary m-1 flex-grow-1" @click="judgeAnswer(items)">
                    {{ items }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Desribepng from '@/assets/GamePic/Source/description.png';
export default {
    Name: 'NumberingGame',
    data(){
        return {
            imageUrl : '',
            btn:[],
            errorMsg: '',
        }
    },
    props: {
        imgsrc:{
            type: String,
            required: true
        },
        question: {
            type: Object,
            required: true
        },
        answer: {
            type: Number,
            required: true
        }
    },
    mounted(){
        this.imageUrl=new URL(`../../assets/GamePic/${this.imgsrc}`, import.meta.url).href
        for(var i=this.question.Range[0];i<=this.question.Range[1];i++){
            this.btn.push(i);
        }
    },
    methods:{
        judgeAnswer(answer){
            if(answer == this.answer){
                this.$emit('check-answer',true);
                console.log('check answer : True');
            }
            else{
                this.$emit('check-answer',true);
                console.log('check answer : False');
            }
        }
    }
}
</script>