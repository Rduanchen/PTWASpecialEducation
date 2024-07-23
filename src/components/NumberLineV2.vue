<template>
<div class="OutterContainer">
    <table>
        <tr class="Test">
            <td v-for="(i,index) in FinalData" :key="i" class="inner">
                <img v-if="i.Arrow == true" :src="Arrow" alt="Arrow" />
                <component v-else-if="i.Blank == true" :is="i.Name" :Data="i.Data" @ReplyAnswer="(re) => { GetComponentAnswer(re,index) }"></component>
                <component v-else :is="Data.Name" :Data="i" :ID="this.ID"></component>
            </td>
        </tr>
    </table>
    <!-- {{ FinalData }}
    {{ ReplyData }} -->
</div>
</template>
<script>
import { defineAsyncComponent } from 'vue';
import { GetSlotComponentData } from '@/utilitys/get_assets.js';
import Fractions from './fractions.vue';
export default {
    name: 'NumberLineV2',
    components: {
        TextOnly: defineAsyncComponent(() => import('@/components/TextOnly.vue')),
        Input: defineAsyncComponent(() => import('@/components/ReplyInput.vue')),
        Fractions: defineAsyncComponent(() => import('@/components/Fractions.vue'))
    },
    computed: {
        Arrow() {
            return GetSlotComponentData('NumberLineV2', 'ArrowRight.svg')
        }
    },
    props: {
        Data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            ReplyData: {},
            ID: "0",
            // Data: {
                
            // },
            FinalData: []
        };
    },
    created() {
        let NewArr = []
        for(var i in this.Data.Items){
            NewArr.push(this.Data.Items[i]);
            if (i != this.Data.Items.length - 1){
                NewArr.push({
                    Arrow : true
                })
            }
        }
        // Count the number of blanks
        for (let i in NewArr){
            if (NewArr[i].Blank == true){
                this.ReplyData[i] = false;
            }
        }
        ;;ㄤonsole.log(NewArr)
        this.FinalData = NewArr;
    },
    methods: {
        GetComponentAnswer(Reply, index){
            console.log(Reply);
            this.ReplyData[index] = Reply;
            this.CheckAnswer();
        },
        CheckAnswer(){
            let Check = true;
            for (let i in this.ReplyData){
                if (this.ReplyData[i] == false){
                    Check = false;
                }
            }
            if (Check){
                this.$emit('ReplyAnswer', true);
                console.log("Correct");
            }
            else{
                this.$emit('ReplyAnswer', false);
                console.log("Wrong");
            }
        }
    }
}
</script>
<style scoped>
/* Your component's CSS styles go here */
.OutterContainer{
    width: 100%;
    height: 100%;
    table{
        width: 100%;
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