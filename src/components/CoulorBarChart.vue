<template>
<div class="OutterContainer" >
    <div class="Division">
        <p class="Child">{{ this.Data.Child }}</p>
        <hr>
        <p class="Mother">{{ this.Data.Total }}</p>
    </div>
    <table class="OddBorderOutline" >
        <tr v-for="(items, index1) in Drawed">
            <td v-for="(item, index2) in items" class="table" @click="handleClick($event,index1,index2)"></td>
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
        this.Data.Total = this.Data.Mother;
        this.Drawed = [];
        if (this.Data.Total % 2 != 0){
            let temp = []
            for(var i = 0; i < this.Data.Total; i++){
                temp.push(true);
            }
            console.log(temp)
            this.Drawed.push(temp);
        }
        else{
            let temp = [];
            let div = this.Data.Total / 2;
            for(var i = 0; i<2; i++){
                let temp = []
                for(var x = 0; x < div; x ++){
                    temp.push(true)
                }
                this.Drawed.push(temp)
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
        handleClick($event,index1,index2){
            this.Drawed[index1][index2] = !this.Drawed[index1][index2];
            if (this.Drawed[index1][index2]){
                $event.target.style.backgroundColor = 'white';
            }
            else{
                $event.target.style.backgroundColor = this.Data.Coulor;
            }
        }
    }
};
</script>

<style scoped>
/* Your component's styles go here */
.Division{
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: x-large;
    hr {
        margin: 0 0; /* 根據需要調整間距 */
    }
}
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
        tr{
            border: solid;
        }
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