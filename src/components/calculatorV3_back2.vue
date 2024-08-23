<template>
    <div>
        <div class="TestBtn">
            <div v-for="item in Unit" class="Unit BtnContainer">
                <q-btn color="white" text-color="black" :label="item" ref="Unit">
                </q-btn>
            </div>
            <div v-for="item in Carry" class="Carry BtnContainer">
                <q-btn color="white" text-color="black" :label="item" ref="Carry">
                    <q-menu anchor="top left" self="bottom left">
                        <div class="Btns">
                            <button @click="InputNumber(0)">0</button>
                            <button v-for="index in 5" @click="InputNumber(index)">{{index}}</button>
                            <button v-for="index in 5" @click="InputNumber(index+5)">{{index+5}}</button>
                            <button>/</button>
                            <button><q-icon name="bi-trash"></q-icon></button>
                        </div>
                    </q-menu>
                </q-btn>
            </div>
            <div v-for="item in Operation" class="Operation BtnContainer" ref="Operation">
                <q-btn color="white" text-color="black" :label="item">
                    <q-menu anchor="top left" self="bottom left">
                        <div class="Btns">
                            <button @click="InputNumber(0)">0</button>
                            <button v-for="index in 5" @click="InputNumber(index)">{{index}}</button>
                            <button v-for="index in 5" @click="InputNumber(index+5)">{{index+5}}</button>
                            <button>/</button>
                            <button><q-icon name="bi-trash"></q-icon></button>
                        </div>
                    </q-menu>
                </q-btn>
            </div>
            <div v-for="item in Numbers" class="Numbers BtnContainer" ref="Numbers">
                <q-btn color="white" text-color="black" :label="item">
                    <q-menu anchor="top left" self="bottom left">
                        <div class="Btns">
                            <button @click="InputNumber(0)">0</button>
                            <button v-for="index in 5" @click="InputNumber(index)">{{index}}</button>
                            <button v-for="index in 5" @click="InputNumber(index+5)">{{index+5}}</button>
                            <button>/</button>
                            <button><q-icon name="bi-trash"></q-icon></button>
                        </div>
                    </q-menu>
                </q-btn>
            </div>
            <div v-for="item in Answer" class="Answer BtnContainer" ref="Answer">
                <q-btn color="white" text-color="black" label="1">
                    <q-menu anchor="top left" self="bottom left">
                        <div class="Btns">
                            <button @click="InputNumber(0)">0</button>
                            <button v-for="index in 5" @click="InputNumber(index)">{{index}}</button>
                            <button v-for="index in 5" @click="InputNumber(index+5)">{{index+5}}</button>
                            <button>/</button>
                            <button><q-icon name="bi-trash"></q-icon></button>
                        </div>
                    </q-menu>
                </q-btn>
            </div>
        </div>
    </div>
    </template> 
    <script>
    import draggable from 'vuedraggable';
    import { defineAsyncComponent } from 'vue';
    import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
    export default {
        name: "calculator",
        data() {
            return {
                Num:["0","1","2","3","4","5","6","7","8","9","10"],
                Symbol:["+","-"],
                Unit: [],
                Carry: Array(5).fill(3),
                Operation: Array(5).fill(0),
                Numbers: Array(5).fill(0),
                Answer: Array(5).fill(0),
                MaxWidth: 0,
                GameConfig:{
                    "FunctionPermission":{
                        "AddRow": false,
                        "RemoveRow": false,
                        "Clear": false,
                        "CorrectUnit": false,
                        "CorrectUseUnit": false
                    }
                },
                GameData: {
                    "UseUnit": ["個位", "十位", "百位", "千位"],
                    "Preparation": {
                        "Symbol": ["+"],
                        "Number_list": [
                            "478",
                            "214"
                        ],
                        "Answer": "692"
                    },
                    "Answer": {
                        "Symbol": ["+"],
                        "Number_list": [
                            "478",
                            "214"
                        ],
                        "Answer": "692"
                    }
                },
                Units:{
                    Number:{
                        Title:["個位","十位","百位","千位","萬位"],
                        Total:5
                    },
                    Time:{
                        Title:["秒",null,"分",null,"時",null,"日"],
                        Total:4
                    },
                    Weight:{
                        Title:["公克",null,null,"公斤",null,null,"公噸"],
                        Total:4
                    },
                    Length:{
                        Title:["毫米","公分",null,"公尺",null,null,"公里"],
                        Total:4
                    },
                    Volume:{
                        Title:["毫升",null,null,"公升",null,null,"公秉"],
                        Total:3
                    }
                }
            };
        },
        created(){
            this.Unit = this.GameData.UseUnit;
            this.MaxWidth = this.Unit.length;
            for (let i in this.GameData.Preparation){
                for (let x in this.GameData.Preparation[i]){
                    if (this.GameData.Preparation[i][x].length > this.MaxWidth){
                        this.MaxWidth = this.GameData.Preparation[i][x].length;
                    }
                }
            }
        },
        methods: {
            // Your component's methods go here
            InputNumber(index){
                console.log("inputNumber");
            }
        }
    };  
    </script>
    <style scoped lang="scss">
    .TestBtn{
        margin: 3rem;
        border: solid 1px;
        display: grid;
        grid-template-columns: repeat(5, 50px);
        grid-template-rows: repeat(5, 60px);
        .Unit{
            grid-row: 1/1;
            background-color: #aaa;
        }
        .Carry{
            grid-row: 2/2;
            background-color: red;
        }
        .Operation{
            grid-row: 3/3;
            background-color: blue;
        }
        .Numbers{
            grid-row: 4/4;
            background-color: green;
        }
        .Answer{
            grid-row: 5/5;
            background-color: yellow;
        }
        .BtnContainer{
            border: solid;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            button{
                width: 50px;
                height: 50px;
            }
            :deep(.q-btn) {
                width: 40px;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
    .Btns{
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 1rem;
        padding: 1rem;
        button {
            border: none;
            border-radius: 15px;
            height: 40px;
            width: 40px;
        }
    }
    </style>