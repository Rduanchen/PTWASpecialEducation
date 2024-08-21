<template>
<div class="Container">
    <div class="CalculatorBody">
        <div class="unit btn-group">
            <div class="units" v-for="item in Title">
                <button type="button" class="btn btn-primary" v-if="item != null">{{ item }}</button>
                <div class="space" v-if="item == null"></div>
            </div>
        </div>
        <div class="Carry btn-group">
            <div class="Carrys" v-for="(items,cnt) in Carry">
                <q-btn color="white" text-color="black" :label="items" ref="Carry" >
                    <q-menu anchor="top left" self="bottom left" class="q-menu">
                        <div class="Btns">
                            <button @click="CarryInput(cnt,0)">0</button>
                            <button v-for="index in 5" @click="CarryInput(cnt,index)">{{index}}</button>
                            <button v-for="index in 5" @click="CarryInput(cnt,index+5)">{{index+5}}</button>
                            <button>/</button>
                            <button><q-icon name="bi-trash"></q-icon></button>
                        </div>
                    </q-menu>
                </q-btn>
            </div>
        </div>
        <hr>
        <div class="NumberArea">
            <div class="NumberRow btn-group" v-for="(items,Row) in Num_list">
                <q-btn color="white" text-color="black" :label="Sy_list[Row]">
                    <q-menu anchor="top left" self="bottom left" class="q-menu">
                        <div class="Btns">
                            <button @click="SymbolInput(Row,'+')">+</button>
                            <button @click="SymbolInput(Row,'-')">-</button>
                        </div>
                    </q-menu>
                </q-btn>
                <div class="space"></div>
                <div class="NumbersContainer btn-group">
                    <q-btn color="white" text-color="black" :label="item" v-for="(item,Col) in items" :class="{ 'ButtonLine': this.ButtonLine[Row][Col] == false }">
                        <q-menu anchor="top left" self="bottom left" class="q-menu">
                            <div class="Btns">
                                <button @click="NumInput(Row,Col,0)">0</button>
                                <button v-for="index in 5" @click="NumInput(Row,Col,index)">{{index}}</button>
                                <button v-for="index in 5" @click="NumInput(Row,Col,index+5)">{{index+5}}</button>
                                <button>/</button>
                                <button><q-icon name="bi-trash"></q-icon></button>
                            </div>
                        </q-menu>
                    </q-btn>
                </div>
            </div>
        </div>
        <hr>
        <div class="Answer btn-group">
            <div class="AnswerContainer" v-for="(item,Col) in Ans">
                <q-btn color="white" text-color="black" :label="item">
                <q-menu anchor="top left" self="bottom left" class="q-menu">
                    <div class="Btns">
                        <button @click="AnsInput(Col,0)">0</button>
                        <button v-for="index in 5" @click="AnsInput(Col,index)">{{index}}</button>
                        <button v-for="index in 5" @click="AnsInput(Col,index+5)">{{index+5}}</button>
                        <button>/</button>
                        <button><q-icon name="bi-trash"></q-icon></button>
                    </div>
                </q-menu>
            </q-btn>
            </div>
        </div>
        <div class="buttons">
            <button @click="AddRow">新增一行</button>
            <button @click="removerow">移除最後一行</button>
            <button @click="clear">清除所有數字</button>
        </div>
    </div>
</div>
</template>
        
<script>
import draggable from 'vuedraggable';
export default {
    name: "calculator",
    display: "calculator",
    components: {
        draggable
    },
    data() {
        return {
            Num:["0","1","2","3","4","5","6","7","8","9"],
            Symbol:["+","-","x","÷"],
            Num_list: [],
            Index:null,
            Index2: null,
            Sy_list: [],
            Ans:[],
            Carry:[],
            Title:[],
            ButtonLine: [],
            CarryLine: [],
            NowUnit:2,
            FakeData:{
                Unit : 3,
                UseUnit: "Volume",
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
                        Title:["毫米",null,"公分",null,"公尺",null,"公里"],
                        Total:4
                },
                    Volume:{
                        Title:["毫升",null,null,"公升",null,null,"公秉"],
                        Total:3
                    }
                }
            }
        };
    },
    mounted(){
        for(var i = 0; i<this.FakeData.Unit; i++){
            this.Title.push(this.FakeData.Units[this.FakeData.UseUnit].Title[i]);
        }
        for(var i = 0; i<=this.FakeData.Unit; i++){
            this.Carry.push("");
            this.CarryLine.push(false);
            this.Ans.push("");
        }
        for(var x = 0; x<this.NowUnit ; x++){
            let temp = [];
            this.Sy_list.push("");
            let tempNumber = [];
            for(var i = 0; i<this.FakeData.Unit; i++){
                temp.push("");
                tempNumber.push(false);
            }
            this.Num_list.push(temp);
            this.ButtonLine.push(tempNumber);
        }
        console.log(this.Ans);
    },
    methods: {
        CarryInput(index,num){
            this.Carry[index] = num;
        },
        NumInput(Row,Col,num){
            this.Num_list[Row][Col] = num;
        },
        AnsInput(index,num){
            this.Ans[index] = num;
        },
        SymbolInput(index,num){
            this.Sy_list[index] = num;
        },
        SetUnit: function(num){
            if(!( this.FakeData.Unit==8 && num == 1 ) && !(this.FakeData.Unit==2 && num==-1)){
                this.FakeData.Unit = this.FakeData.Unit + num;
                console.log(this.FakeData.Unit);
                this.Title = [];
                this.Num_list = [];
                this.Sy_list = [];
                this.Carry = [];
                this.Ans = [];
                this.ButtonLine = [];
                this.CarryLine = [];

                for(var i = 0; i<this.FakeData.Unit; i++){
                    this.Title.push(this.FakeData.Units[this.FakeData.UseUnit].Title[i]);
                }
                for(var i = 0; i<=this.FakeData.Unit; i++){
                    this.Carry.push([]);
                    this.Ans.push([]);
                }
                for(var x = 0; x<this.NowUnit ; x++){
                    let temp = [];
                    this.Sy_list.push([]);
                    for(var i = 0; i<this.FakeData.Unit; i++){
                        temp.push([]);
                    }
                    this.Num_list.push(temp);
                }
            }
        },
        UseUnit: function(unit){
            this.FakeData.UseUnit = unit;
            this.Title = [];
            for(var i = 0; i<this.FakeData.Unit; i++){
                this.Title.push(this.FakeData.Units[this.FakeData.UseUnit].Title[i]);
            }
        },
        removerow: function(evt) {
            /**
             * 移除最後一行(Remove last row)
             */
            if(this.Num_list.length>1){
                this.Num_list.pop();
                this.Sy_list.pop();
            }
        },
        GetIndex: function(index){
            this.Index = index;
        },
        NumberCheckInput: function(){
            console.log(this.Index);
            for(var i in this.Num_list[this.Index]){
                if(this.Num_list[this.Index][i].length>1){
                    let temp = this.Num_list[this.Index][i][1];
                    this.Num_list[this.Index][i] = [temp];
                }
            }
        },
        CarryCheckInput: function(newVal){
            this.Carry[this.Index] = [`${newVal.oldIndex}`];    
        },
        AnsCheckInput: function(newVal){
            this.Ans[this.Index] = [`${newVal.oldIndex}`];    
        },
        AddRow:function(){
            let temp = [];
            this.NowUnit ++;
            this.Sy_list.push([]);
            for(var i = 0; i<this.FakeData.Unit; i++){
                temp.push([]);
            }
            this.Num_list.push(temp);
            if(this.Num_list.length*((10**this.FakeData.Unit)-1) > (10**(this.Ans.length))){
                this.Ans.push([]);
                this.Carry.push([]);
            }
        },
        clear: function(evt) {
            this.Num_list = [];
            this.Sy_list = [];
            this.Carry = [];
            this.Ans = [];
            this.Title = [];
            for(var i = 0; i<this.FakeData.Unit; i++){
                this.Title.push(this.FakeData.Units[this.FakeData.UseUnit].Title[i]);
            }
            for(var i = 0; i<=this.FakeData.Unit; i++){
                this.Carry.push("");
                this.Ans.push("");
            }
            for(var x = 0; x<2 ; x++){
                let temp = [];
                for(var i = 0; i<this.FakeData.Unit; i++){
                    temp.push("");
                }
                this.Num_list.push(temp);
            }
        }
    }
};
</script>
<style lang="scss" scope>
.Container{
    display: flex;
    flex-direction: row;
    justify-content: center;
    .CalculatorBody{
        width: 50%;
    }
    .Selection{
        width: 50%;
    }
}
.CalculatorBody {
    display: flex;
    flex-direction: column;
    .btn-group {
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        gap: 12px;
        margin: 5px 0;
        button{
            width: 40px;
            height: 50px;
        }
        .test-btn {
          position: relative;
          background-color: transparent; /* 確保背景透明以顯示漸變 */
          z-index: 1;
          overflow: hidden;
          /* 使用偽元素來繪製斜線 */
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(60deg, transparent 49.5%, black 49.5%, black 50.5%, transparent 50.5%);
            z-index: -1; /* 確保背景層位於文字層之下 */
          }
        }
    }
    .btn-primary{
        width: 40px;
    }
    :deep(.q-btn) {
        width: 40px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.space{
    width: 40px;
}

.buttons{
    display: flex;
    flex-direction: row;    
    justify-content: flex-end;
    gap: 1rem;
    button{
        height: 4rem;
        background: linear-gradient( 60deg, transparent 49.5%, black 45.5%, black 51.5%, transparent 50%);
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

.Selection{
    position: sticky;
    top:0;
    max-height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .NumberContainer{
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;

    }
    .SymbolContainer{
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
    }
    button{
        height: 60px;
        width: 50px;
    }
}
</style>