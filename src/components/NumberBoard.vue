<template>
<!-- Your component's HTML template goes here -->
<table class="NumberBoard">
    <tr class="EachRow">
        <td v-for="unit in this.Unit" class="UnitEachBlanket">{{ unit }}</td>
    </tr>
    <tr class="EachRow">
        <td v-for="number in this.Number" class="EachBlanket">{{ number }}</td>
    </tr>
</table>
</template>

<script>
import { set } from '@vueuse/core';
export default {
    name: 'NumberBoard',
    data() {
        return {
            Data: {
                "Unit": ["時間", "分", "秒"],
                "Number": 1234
            },
            Number: null,
            Unit: null
        };
    },
    props:{
        Data: {
            type: Object,
            required: true
        }
    },
    created() {
        // 如果單位和數字的長度不一樣，則補齊。
        this.Unit = this.Data.Unit;
        this.Number = this.Data.Number;
        if (typeof (this.Data.Number) === 'number') {
            this.Number = this.Data.Number.toString().split('');
        }
        if (this.Data.Unit.length != this.Number.length) {
            if (this.Data.Unit.length > this.Number.length){
                let diff = this.Data.Unit.length - this.Number.length;
                for (let i = 0; i < diff; i++){
                    this.Number.unshift(" ");
                }
            } else {
                let diff = this.Number.length - this.Data.Unit.length;
                for (let i = 0; i < diff; i++){
                    this.Unit.unshift(" ");
                }
            }
        }
        // 如果數字有雙位數，則縮小字體。
        let DoubleWord = false;
        for (var i in this.Unit){
            if (this.Unit[i].toString().length > 1){
                DoubleWord = true;
                break;
            }
        }
        if (DoubleWord){
            let cl = document.getElementsByClassName("UnitEachBlanket");
            for (let i = 0; i < cl.length; i++){
                cl[i].style.fontSize = "6em";
            }
        }
    }
};
</script>
<style scoped>
/* Your component's CSS styles go here */
.NumberBoard{
    border: solid;
    border-color: blue;
    display: grid;
    grid-template-rows: 1fr 1fr;
}
.EachRow{
    width: 100%;
    display: flex;
    justify-content: space-around;
    height: 70px;
}
.EachBlanket{
    border: solid;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    width: 70px;
    text-align: center;
}
.UnitEachBlanket{
    border: solid;
    width: 100%;
    height: 100%;
    /* Font Size */
    width: 70px;
    display: flex;
    font-size: 1.5em;
    justify-content: center;
    align-items: center;
    text-align: center;
}
</style>