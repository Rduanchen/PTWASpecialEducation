<template>
<div class="OutterContainer" >
    <table class="OddBorderOutline" v-if="this.Total % 2 != 0">
        <tr>
            <td v-for="(item, index) in Drawed" class="table" @click="handleClick($event, index)"></td>
        </tr>
    </table>    
    <table class="EvenBorderOutline" v-else>
        <tr>
            <td v-for="(item,index) in this.Drawed" class="table" @click="handleClick($event, index)">123</td>
        </tr>
        <tr>
            <td v-for="(item,index) in this.Drawed2" class="table" @click="handleClick2($event, index)">123</td>
        </tr>
    </table>

    <table style="border: solid;">
        <tr>
            <td style="border: solid;">123</td>
            <td style="border: solid;">122</td>
        </tr>
        <tr>
            <td style="border: solid;">222</td>
            <td style="border: solid;">333</td>
        </tr>
    </table>
</div>
</template>
<script>
export default {
name: 'CoulorBarChart',
    data() {
        return {
            Drawed : [],
            Drawed2 : [],
            container: null
        };
    },
    props: {
        Data: {
            type: Object,
            required: true
        },
        ID: {
            type: String,
            required: true
        }
    },
    methods: {
        // Your component's methods go here
    },
    created(){
        if (this.Data.Total % 2 != 0){
            for(var i = 0; i < this.Data.Total; i++){
                this.Drawed.push(true);
            }
        }
        else{
            for(var i = 0; i < this.Data.Total/2; i++){
                this.Drawed.push(true);
                this.Drawed2.push(true);
            }
        }
    },
    mounted() {
        // Code to run when the component is mounted goes here
        let tableData = document.getElementsByClassName('table');
        let container = document.getElementsByClassName('OutterContainer');
        container = container[0].getBoundingClientRect()
        let width = container.width / this.Data.Total - 10;
        for(var i = 0; i < tableData.length; i++){
            tableData[i].style.width = (width) + 'px';
        }
        if (this.Data.Coulor == undefined){
            this.Data.Coulor = '#bde0fe';
        }
    },
    methods: {
        handleClick($event, index){
            this.Drawed[index] = !this.Drawed[index];
            if (this.Drawed[index]){
                $event.target.style.backgroundColor = 'white';
            }
            else{
                $event.target.style.backgroundColor = this.Data.Coulor;
            }
        },
        handleClick2($event, index){
            this.Drawed2[index] = !this.Drawed2[index];
            if (this.Drawed2[index]){
                $event.target.style.backgroundColor = 'white';
            }
            else{
                $event.target.style.backgroundColor = this.Data.Coulor;
            }
        },
        AddCoulor(e, index){
            
        }
    }
};
</script>

<style scoped>
/* Your component's styles go here */
.OutterContainer{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .OddBorderOutline{
        border:solid;
        border-width: 2px;
        border-left: solid;
        border-right: solid;
    }
    .EvenBorderOutline{
        border: solid;
    }
    .table{
        border-style:dashed !important;
        height: 3rem;
        border-left: solid;
    }
}
</style>