<template>
    {{ this.Carryline }}
    {{ this.Carry }}
<div>
<div class="Container container">
    <div class="card QuestionArea" v-if="this.GameData.QuestionArea">
        <p class="Title">{{ this.GameData.QuestionArea.Title }}</p>
        <hr v-if="this.GameData.QuestionArea.Title">
        <p class="Description">
            {{ this.GameData.QuestionArea.Description }}
        </p>
        <div class="Items">
            <img v-if="this.GameData.QuestionArea.Image" :src="this.ImgUrl">
            <div class="comp" v-if="this.GameData.QuestionArea.SlotComponent" v-for="(item, index) in this.GameData.QuestionArea.SlotComponent" :key="index">
                <component :is="item.Name" :Data="item.Data"></component>
            </div>
        </div>
    </div>
</div>
<div class="Container container">
    <div class="card CaluculatorBody">
        <p>{{ this.GameData.Question }}</p>
        <div class="unit">
            <div class="units" v-for="item in Title">
                <button type="button" class="btn btn-primary" v-if="item != null">{{ item }}</button>
                <div class="space" v-if="item == null"></div>
            </div>
        </div>
        <div class="Carry">
            <div class="Carrys" v-for="(items,index) in Carry">
                <draggable :list="Carry[index]" group="Number" item-key="name" class="CarryContainer" @change="GetIndex(index)" @add="CarryCheckInput" :sort="false">
                    <template #item="{ element }">
                        <button type="button" class="btn btn-primary m-1 my-btn" :class="{ ButtonLine: this.Carryline[index][0] }" @click="CarryTurnToLine(index)">{{ element }}</button>
                    </template>
                </draggable>
            </div>
        </div>
        <hr>
        <div class="NumberArea">
            <div class="NumberRow" v-for="(items,index) in Num_list">
                <draggable :list="Sy_list[index]" :sort="false" group="Symbol" item-key="name" @change="sym_control(index)" class="SymbolContainer" v-if="index != 0">
                    <template #item="{ element }">
                        <button type="button" class="btn btn-primary m-1 my-btn">{{ element }}</button>
                    </template>
                </draggable>
                <div class="space" v-if="items == null"></div>
                <div class="NumbersContainer">
                    <div class="Number" v-for="(item ,index2) in items">
                        <draggable :list="item" :sort="false" group="Number" item-key="name" class="NumberConainer"  @change="GetIndex(index)" @add="NumberCheckInput">
                            <template #item="{ element }">
                                <button type="button" class="btn btn-primary m-1 my-btn" :class="{ ButtonLine: this.ButtonLine[index][index2][0] }" @click="TurnToLine(index,index2)">{{ element }}</button>
                            </template>
                        </draggable>
                    </div>
                    
                </div>
            </div>
        </div>
        <hr>
        <div class="Answer">
            <div class="AnswerContainer" v-for="(item,index) in Ans">
                <draggable :list="item" :sort="false" group="Number" item-key="name" class="NumberConainer" @change="GetIndex(index)" @add="AnsCheckInput">
                    <template #item="{ element }">
                        <button type="button" class="btn btn-primary m-1 my-btn" >{{ element }}</button>
                    </template>
                </draggable>
            </div>
        </div>
        <div class="buttons">
            <button @click="AddRow" class="btn btn-primary m-1" v-if="this.GameConfig.FunctionPermission.AddRow">新增一行</button>
            <button @click="removerow" class="btn btn-primary m-1" v-if="this.GameConfig.FunctionPermission.RemoveRow">移除最後一行</button>
            <button @click="clear" class="btn btn-primary m-1">清除所有數字</button>
            <button @click="CheckAnswer" class="btn btn-primary m-1">確認答案</button>
        </div>
    </div>
    <div class="card Selection">
        <div class="row">
            <div class="NumberPart">
                <h2>數字</h2>
                <hr>
                    <draggable
                    class="NumberContainer"
                    :list="Num"
                    :group="{ name: 'Number', pull: 'clone', put: false }"
                    :sort="false"
                    @change="log"
                    item-key="Number"
                    >
                        <template #item="{ element }">
                            <button type="button" class="btn btn-primary m-1 ">{{ element }}</button>
                        </template>
                    </draggable>

            </div>
            <div class="SymbolPart">
            <h2>符號</h2>
            <hr>
            <draggable
                class="SymbolContainer"
                :list="Symbol"
                :group="{ name: 'Symbol', pull: 'clone', put: false }"
                @change="log"
                :sort="false"
                item-key="index"
            >
                <template #item="{ element }">
                    <button type="button" class="btn btn-primary m-1">{{ element }}</button>
                </template>
            </draggable>
            </div>
            <div class="setting" v-if="this.GameConfig.FunctionPermission.CorrectUseUnit != false && this.GameConfig.FunctionPermission.CorrectUnit != false">
                    <h2>設定</h2>
                    <hr>
                    <div v-if="this.GameConfig.FunctionPermission.CorrectUseUnit">
                        單位:
                        <div class="unit" >
                            <button type="button" class="btn btn-primary m-1" @click="UseUnit('Number')">一般</button>
                            <button type="button" class="btn btn-primary m-1" @click="UseUnit('Volume')">容積</button>
                            <button type="button" class="btn btn-primary m-1" @click="UseUnit('Time')">時間</button>
                            <button type="button" class="btn btn-primary m-1" @click="UseUnit('Weight')">重量</button>
                            <button type="button" class="btn btn-primary m-1" @click="UseUnit('Length')">長度</button>
                        </div>
                    </div>
                    <div v-if="this.GameConfig.FunctionPermission.CorrectUnit">
                        位數:
                        <div class="UnitNumber d-flex">
                            <button type="button" class="btn btn-danger m-1 w-50" @click="SetUnit(-1)">-</button>
                            <button type="button" class="btn btn-primary m-1 w-50" @click="SetUnit(1)">+</button>
                        </div>                    
                    </div>
            </div>
        </div>
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
    components: {
        draggable,
        clock: defineAsyncComponent(() => import('@/components/clock.vue')),
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
            Num:["0","1","2","3","4","5","6","7","8","9"],
            Symbol:["+","-","x","÷"],
            Num_list: [],
            ButtonLine:[],
            Index:null,
            Index2: null,
            Sy_list: [],
            Ans:[],
            Carry:[],
            Carryline:[],
            Title:[],
            NowUnit:2,
            ImgUrl:"",
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
        this.ImgUrl = GamesGetAssetsFile(this.id, this.GameData.QuestionArea.Image);
        this.FakeData.Unit = this.GameData.Unit;
        for(var i = 0; i<this.FakeData.Unit; i++){
            this.Title.push(this.FakeData.Units[this.GameData.UseUnit].Title[i]);
        }
        for(var i = 0; i<=this.FakeData.Unit; i++){
            this.Carry.push([]);
            this.Carryline.push([false]);
            this.Ans.push([]);
        }
        for(var x = 0; x<this.NowUnit ; x++){
            let temp = [];
            let tep = [];
            this.Sy_list.push([]);
            for(var i = 0; i<this.FakeData.Unit; i++){
                temp.push([]);                
                tep.push([false]);
            }
            this.Num_list.push(temp);
            this.ButtonLine.push(tep);
        }
        for(var i in this.GameData.PreFix){
            for(var x = this.GameData.PreFix[i].length-1; x>=0; x--){
                let temp = this.GameData.Unit - this.GameData.PreFix[i].length 
                this.Num_list[i][x+temp] = [this.GameData.PreFix[i][x]];
            }
        }
        console.log(this.Ans);
    },
    methods: {
        SetUnit: function(num){
            if(!( this.FakeData.Unit==8 && num == 1 ) && !(this.FakeData.Unit==2 && num==-1)){
                this.FakeData.Unit = this.FakeData.Unit + num;
                console.log(this.FakeData.Unit);
                this.Title = [];
                this.Num_list = [];
                this.ButtonLine = [];
                this.Sy_list = [];
                this.Carry = [];
                this.Carryline = [];
                this.Ans = [];

                for(var i = 0; i<this.FakeData.Unit; i++){
                    this.Title.push(this.FakeData.Units[this.FakeData.UseUnit].Title[i]);
                }
                for(var i = 0; i<=this.FakeData.Unit; i++){
                    this.Carry.push([]);
                    this.Carryline.push([false]);
                    this.Ans.push([]);
                }
                for(var x = 0; x<this.NowUnit ; x++){
                    let temp = [];
                    let tep = [];
                    this.Sy_list.push([]);
                    for(var i = 0; i<this.FakeData.Unit; i++){
                        temp.push([]);
                        tep.push([false]);
                    }
                    this.Num_list.push(temp);
                    this.ButtonLine.push(tep);
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
        log: function(evt) {
            console.log(evt);
            this.Num=["0","1","2","3","4","5","6","7","8","9"];
        },
        removerow: function(evt) {
            /**
            * 移除最後一行(Remove last row)
            */
            if(this.Num_list.length>1){
                this.Num_list.pop();
                this.Sy_list.pop();
                this.ButtonLine.pop();
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
                this.Carry.push([]);
                this.Ans.push([]);
            }
            for(var x = 0; x<2 ; x++){
                let temp = [];
                for(var i = 0; i<this.FakeData.Unit; i++){
                    temp.push([]);
                }
                this.Num_list.push(temp);
            }
        },
        sym_control: function() {
        /**
            * 控制符號的數量，每一行只能有一個符號(Control the number of symbol, each row can only have one symbol)
            */
            this.Sy_list[0]=[];
            for(var i in this.Sy_list){
                if(this.Sy_list[i].length>1){
                this.Sy_list[i].pop()
                }
            }

        },
        TurnToLine: function(index,index2){
            if(index == 0){
                if(this.ButtonLine[index][index2][0] == false){
                    this.ButtonLine[index][index2][0] = true;
                }
                else{
                    this.ButtonLine[index][index2][0] = false;
                }
            }
        },
        CarryTurnToLine: function(index){
            if(this.Carryline[index][0] == false){
                this.Carryline[index][0] = true;
            }
            else{
                this.Carryline[index][0] = false;
            }
        },
        CheckAnswer: function(){
            let check = true;
            if(this.GameData.Verification.Symbol){
                for(var i = 1; i<this.Num_list.length; i++){
                    if( this.Sy_list[i] == this.GameData.Answer.Symbol[i-1]){
                        check = true;
                    }
                    else{
                        check = false;
                        break;
                    }
                }
            }
            let NumberAppeared = false;
            if( this.GameData.Verification.Number){
                for(var i = 0; i<this.Num_list.length; i++){
                    let temp = "";
                    for(var x = 0; x<this.Num_list[i].length; x++){
                        if(this.Num_list[i][x] == "" && NumberAppeared == true) continue;

                        temp = temp + this.Num_list[i][x];
                        NumberAppeared = true;
                    }
                    console.log(temp);
                    console.log(this.GameData.Answer.Number_list[i]);
                    console.log("Resultwww: "+check);
                    if (this.GameData.Answer.Number_list[i] != undefined && this.temp != ""){
                        if(temp == this.GameData.Answer.Number_list[i]){
                            check = true;
                        }
                        else{
                            check = false;
                            break;
                        }
                    }
                    else{
                        check = false;
                        console.warn("Calculation Game: Answer No Found, Please Check the Answer List is Correct")
                    }
                }
            }
            NumberAppeared = false;
            if (this.GameData.Verification.Answer){
                let temp = "";
                for(var i in this.Ans){
                    if (this.Ans[i] != "" && NumberAppeared == false){
                        temp = temp + this.Ans[i];
                        NumberAppeared = true;
                    }
                }
                if(temp === this.GameData.Answer.Answer){
                    check = true;
                }
                else{
                    check = false;
                }
            }
            console.log("Result: "+check);
        }
    }
};
</script>
<style scoped lang="scss">
.QuestionArea{
    width: 100%;
    padding: 1rem;
    .Title{
        font-size: 2em;
    }
    .Description{
        font-size: 1.5em;
    }
    .comp{
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 1vh 1vw;
    }
    .Items{
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 1vh 1vw;
        overflow-x: auto;
    }
}
.NumberRow{
    display: flex;
    flex-direction: row;
    justify-content: end;
    // border: solid;
    /* padding: 1vh; */
    border-color: blue;
    .SymbolContainer{
        display: flex;
        justify-content: center;
        height: 60px;
        width: 50px;
        margin: 1vh 0.5vw;
        border-radius: 10px;
        background-color: yellow
    }
}
.unit{
    margin-bottom: 2vh;
    display: flex;
    flex-direction: row-reverse;
    justify-content: end;
    button{
        width: 50px;
        margin: 1vh 6px;
    }

}
.ButtonLine{
    background: linear-gradient( 60deg, transparent 49.5%, black 45.5%, black 51.5%, transparent 50%);
    background-color: #0d6efd;
}
.space{
    width: 50px;
    margin: 1vh 6px;
}
.Number{
    display: flex;
    flex-direction: row;
    justify-content: end;
    margin: 1vh 6px;
}
.NumberArea{
    display: flex;
    flex-direction: column;
    justify-content: end;
    .NumbersContainer{
        display: flex;
        flex-direction: row;
        justify-content: end;
    }
}
.CaluculatorBody{
    // width: 20%;
    p{
        font-size: 2em;
    }

}
.Selection{
    // width: 80%;
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
.Carry{
    display: flex;
    flex-direction: row;
    justify-content: end;
    
    .CarryContainer{
        display: flex;
        justify-content: center;
        width: 50px;
        height: 60px;
        margin: 0 6px;
        border-radius: 10px;
        background-color: #caf0f8;
    }
    margin-bottom: 1vh;
}
.Answer{
    display: flex;
    flex-direction: row;
    justify-content: end;
    .AnswerContainer{
        margin: 0 6px;
        .NumberConainer{
            display: flex;
            justify-content: end;
            height: 60px;
            width: 50px;
        }
        .NumberConainer{
            background-color: #90e0ef;
        }
    }
    margin: 1vh 0;
}
.NumberConainer{
    height: 60px;
    width: 50px;
    display: flex;
    justify-content: center;
    border-radius: 10px;
    background-color: #f0f0f0;
}
.Container{
    // max-height: 75vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1vh 1vw;
    margin-top: 2vh;
    font-family: 'YuanQuan';
    font-size: large;
    width: 100%;
    .CaluculatorBody{
        max-height: 100vh;
        overflow-y: auto;
        width: 70%;
        padding: 1rem;
    }
    .Selection{
        width: 30%;
        padding: 1rem;
    }
}
.buttons{
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1vh 1vw;
    margin-top: 2vh;
}
.card{
    border-radius: 20px;
}
button{
    border-radius: 20 px !important;
    text-align: center;
    font-size: large;
}

</style>