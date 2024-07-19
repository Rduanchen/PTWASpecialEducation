<template>
<div class="OutterContainer">
    <div class="description">
        <p>{{ Data.QuestionWord }}</p>
    </div>
    <div class="GameWindows">
        <!-- <table>
            <tr class="Test">
                <td v-for="(i,index) in FinalData" :key="i" class="inner">
                    <img v-if="i.Arrow == true" :src="Arrow" alt="Arrow" />
                    <component v-else-if="i.Blank == true" :is="i.Name" :Data="i.Data" @ReplyAnswer="(re) => { GetComponentAnswer(re,index) }"></component>
                    <component v-else :is="Data.Name" :Data="i" :ID="this.ID"></component>
                </td>
            </tr>
        </table> -->
        <!-- <Markdown :Data="{Render : this.Data.Render, Answers: this.Data.Ans}" @ReplyAnswer="Reply"></Markdown> -->
        <component :is="Data.SlotComponentName" :Data="Data.Data" :ID="this.ID" @ReplyAnswer="Reply"></component>
    </div>
    <div class="NumberPad" v-if="ShowPad">
        <VirtualNumPad @virtualpadinput-Input="Input" @virtualpadinput-delete="Delete" @virtualpadinput-pop="Pop"></VirtualNumPad>
    </div>
    <div class="Submit">
        <button @click="CheckAnswer">送出答案</button>
    </div>
</div>
</template>

<script>
import VirtualNumPad from '@/components/VirtualNumPadInput.vue';
import { defineAsyncComponent, toHandlerKey } from 'vue';
import { GetSlotComponentData } from '@/utilitys/get_assets.js';
export default {
    name: 'NumberLineGame',
    components:{
        VirtualNumPad,
        TextOnly: defineAsyncComponent(() => import('@/components/TextOnly.vue')),
        Input: defineAsyncComponent(() => import('@/components/ReplyInput.vue')),
        Fractions: defineAsyncComponent(() => import('@/components/Fractions.vue')),
        Markdown: defineAsyncComponent(() => import('@/components/Markdown.vue')),
    },
    data() {
        return {
            NowSelect: null,
            ShowPad : false,
            ID: "0",
            ComponentsAnswers: {},
            Data: {
                QuestionWord: "請問以下數字中哪個是分數?",
                Name: "TextOnly",
                BlankName: "Input",
                NumberPadAutoDisappear: false,
                SlotComponentName: "Markdown",
                Data:{
                    Render: `
                        123432
                        # Header 1
                        ## Header 2
                        ### Header 3
                        **Bold Text**
                        - List 1
                        $i$ $i$ Input Box
                        $i$ Input Box
                        $t$ tab
                        $s$ space
                        $n$ new line
                    `,
                    Answers: [
                        '1',
                        '2',
                        '3'
                    ]    
                }
            }
        };
    },
    created() {
        let NewArr = []
        let cnt = 0;
        for(var i in this.Data.Items){
            NewArr.push(this.Data.Items[i]);
            // Initial the ComponentAnswer
            if (this.Data.Items[i].Blank == true){
                this.ComponentsAnswers[cnt] = false;
            }
            cnt ++;
            if (i != this.Data.Items.length - 1){
                NewArr.push({
                    Arrow : true
                })
                cnt ++;
            }
        }
        // console.log(NewArr)
        this.FinalData = NewArr;
    },
    computed: {
        Arrow() {
            return GetSlotComponentData('NumberLineV2', 'ArrowRight.svg') //FIXME
        }
    },
    methods: {
        Reply(result) {
            console.log(result);
            this.ComponentsAnswers = result;
        },
        GetComponentAnswer(Reply,index){
            // alert('Recive:'+Reply);
            console.log('Recive:',Reply);
            this.ComponentsAnswers = Reply;
        },
        NowClick(){
            if (document.activeElement.tagName == 'INPUT'){
                this.SlidAnimation('in');
                this.ShowPad = true;
                this.NowSelect = document.activeElement;
            }
            else if(document.activeElement.tagName == 'BUTTON'){
                this.NowSelect.focus();
                this.ShowPad = true;
            }
            else{
                if (this.Data.NumberPadAutoDisappear != false){
                    this.ShowPad = false;
                    this.SlidAnimation('out');
                }
            }
        },
        Delete(){
            const activeElement = this.NowSelect;
            if (activeElement) {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;
                const value = activeElement.value;
                activeElement.value = "";
                activeElement.selectionStart = activeElement.selectionEnd = start - 1;
                const event = new Event('input', { bubbles: true });
                activeElement.dispatchEvent(event);
            }
        },
        Pop(){
            const activeElement = this.NowSelect;
            if (activeElement) {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;
                const value = activeElement.value;
                activeElement.value = value.slice(0, end - 1) ;
                activeElement.selectionStart = activeElement.selectionEnd = start + 1;
                const event = new Event('input', { bubbles: true });
                activeElement.dispatchEvent(event);
            }
        },
        Input(ch){
            console.log(ch);
            const activeElement = this.NowSelect;
            if (activeElement) {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;
                const value = activeElement.value;
                activeElement.value = activeElement.value + ch;
                activeElement.selectionStart = activeElement.selectionEnd = start + 1;
                const event = new Event('input', { bubbles: true });
                activeElement.dispatchEvent(event);
            }
        },
        SlidAnimation(action){
            if (this.Data.NumberPadAutoDisappear != false){
                let OutterContainer = document.getElementsByClassName('OutterContainer')[0]
                let GameWindows = document.getElementsByClassName('GameWindows')[0]
                if (action == 'in'){
                    OutterContainer.style.gridTemplateColumns = '4fr 1f'
                    GameWindows.style.gridColumn = '1/2'
                }
                else{   
                    OutterContainer.style.gridTemplateColumns = '1fr'
                    GameWindows.style.gridColumn = '1/2'
                }   
            }
        },
        CheckAnswer(){
            let ans = true;
            let cnt = 0;
            let all = 0
            for(var i in this.ComponentsAnswers){
                if (this.ComponentsAnswers[i] != true){
                    ans = false;
                    cnt += 1;
                }
                all += 1
            }
            if (ans == true){
                this.$emit  = ('play-effect', 'CorrectSound');
                this.$emit = ('add-record', [`總共${all}題, ${cnt}題錯誤`,`正確`]);
                this.$emit  = ('next-question');
            }
            else{
                this.$emit  = ('play-effect', 'WrongSound');
                this.$emit = ('add-record', [`總共${all}題, ${cnt}題錯誤`,`錯誤`]);
            }
        }
    },
    mounted() {
        if (this.Data.NumberPadAutoDisappear == false){
            this.SlidAnimation('in');
            this.ShowPad = true;
        }
        document.addEventListener('click', this.NowClick);
    },
};
</script>

<style scoped>
/* Your component-specific styles go here */
.OutterContainer{
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr 5fr 1fr;
    grid-template-columns: 1fr;
    gap: 1rem;
    .description{
        grid-row: 1/2;
        grid-column: 1/3;
        border: solid 1px black;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: start;
    }
    .GameWindows{
        grid-row: 2/3;
        grid-column: 1/2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: solid 1px black;
        border-radius: 15px;
    }
    .NumberPad{
        grid-row: 2/3;
        grid-column: 2/3;
        display: flex;
        justify-content: center;
        align-items: center;
        border: solid 1px black;
        border-radius: 15px;
    }
    .Submit{
        grid-row: 3/4;
        grid-column: 1/3;
        display: flex;
        justify-content: end;
        button{
            width: 10rem;
            height: 3rem;
            margin: 1rem;
            border-radius: 15px;
            background-color: white;
        }
    }   
    table{
        width: 95%;
        height: 20%;
        .Test{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax( 40px, 1fr));
        }
        .inner{
            display: flex;
            justify-content: center;
            img{
                width: 50%;
                height: auto;
            }
        }
    }
}
</style>