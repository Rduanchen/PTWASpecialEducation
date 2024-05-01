<template>
  <div class="Container">
      <div class="card CaluculatorBody">
          <div class="unit">
              <div class="units" v-for="item in Title">
                  <button type="button" class="btn btn-primary" v-if="item != null">{{ item }}</button>
                  <div class="space" v-if="item == null"></div>
              </div>
          </div>
          
          <div class="Carry">
              <div class="Carrys" v-for="(items,index) in Carry">
                  <draggable :list="Carry[index]" group="Number" item-key="name" class="CarryContainer" @change="GetIndex(index)" @add="CarryCheckInput">
                      <template #item="{ element }">
                          <button type="button" class="btn btn-primary m-1 my-btn">{{ element }}</button>
                      </template>
                  </draggable>
              </div>
          </div>
          <hr>
          <div class="NumberArea">
              <div class="NumberRow" v-for="(items,index) in Num_list">
                  <draggable :list="Sy_list[index]" group="Symbol" item-key="name" @change="sym_control(index)" class="SymbolContainer">
                      <template #item="{ element }">
                          <button type="button" class="btn btn-primary m-1 my-btn">{{ element }}</button>
                      </template>
                  </draggable>
                  <div class="space" v-if="item == null"></div>
                  <div class="NumbersContainer">
                      <div class="Number" v-for="item in items">
                          <draggable :list="item" group="Number" item-key="name" class="NumberConainer"  @change="GetIndex(index)" @add="NumberCheckInput">
                              <template #item="{ element }">
                              <button type="button" class="btn btn-primary m-1 my-btn">{{ element }}</button>
                              </template>
                          </draggable>
                      </div>
                  </div>
              </div>
          </div>
          <hr>
          <div class="Answer">
              <div class="AnswerContainer" v-for="(item,index) in Ans">
                  <draggable :list="item" group="Number" item-key="name" class="NumberConainer" @change="GetIndex(index)" @add="AnsCheckInput">
                      <template #item="{ element }">
                          <button type="button" class="btn btn-primary m-1 my-btn" >{{ element }}</button>
                      </template>
                  </draggable>
              </div>
          </div>
          <div class="buttons">
              <button @click="AddRow" class="btn btn-primary m-1">新增一行</button>
              <button @click="removerow" class="btn btn-primary m-1">移除最後一行</button>
              <button @click="clear" class="btn btn-primary m-1">清除所有數字</button>
          </div>
      </div>
      <div class="card Selection">
          <div class="row">
              <div class="NumberPart">
                  <h1>數字</h1>
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
              <h1>符號</h1>
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
              // Num_list: [[],[],[]],
              Sy_list: [[],[],[]],
              Ans:[],
              Carry:[],
              Title:[],
              FakeData:{
                  Unit : 9,
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
          console.log(this.Ans);
      },
      methods: {
          log: function(evt) {
              console.log(evt);
              this.Num=["0","1","2","3","4","5","6","7","8","9"];
          },
          addrow: function(evt) {
              /**
               * 增加新的一行(Add new row)
               */
              this.Num_list.push([]);
              this.Sy_list.push([]);
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
              for(var i = 0; i<this.FakeData.Unit; i++){
                  temp.push([]);
              }
              this.Num_list.push(temp);
  
              if(this.Num_list.length*((10**this.FakeData.Unit)-1) > (10**(this.Ans.length))){
                  this.Ans.push([]);
                  this.Carry.push([]);
              }
              // if(this.Num_list.length*9 < 100){
              //     console.log(true);
              // }
              // else{
              //     this.Carry.push([]);
              //     this.Ans.push([]);
              // }
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
          Calculat: function(){
          /**
           * 計算答案(Calculate the answer)
           */
          this.Ans=[]; //Clear the answer
          var num=[]; //Store the number(Temporally)
          var sy=[]; //Store the symbol(Temporally)
  
          //Push the Number to Array
          for(var i in this.Num_list){
              num.push(this.Num_list[i].join(''));
          }
  
          //Push the Symbol to Array
          for(var i in this.Sy_list){
              sy.push(this.Sy_list[i].join(''));
          }
  
          //Calculate the answer
          var ans=num[0];
          for(var i=0;i<=sy.length;i++){
              if(sy[i+1]=="+"){
              ans=parseInt(ans)+parseInt(num[i+1]);
              }
              else if(sy[i+1]=="-"){
              ans=parseInt(ans)-parseInt(num[i+1]);
              }
              else if(sy[i+1]=="x"){
              ans=parseInt(ans)*parseInt(num[i+1]);
              }
              else if(sy[i+1]=="÷"){
              ans=parseInt(ans)/parseInt(num[i+1]);
              }
          }
          ans=ans.toString()
          //Push the answer to Array, And vue will display it.
          for(var i in ans){
              this.Ans.push(ans[i]);
          }
          }
      }
      };
  </script>
  <style scoped lang="scss">
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
  .Selection{
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
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 1vh 1vw;
      margin-top: 2vh;
      font-family: 'YuanQuan';
      font-size: large;
      width: 100%;
      .CaluculatorBody{
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