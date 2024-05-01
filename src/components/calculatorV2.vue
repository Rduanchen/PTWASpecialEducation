<template>
    <div class="container">
      <div class="row">
        <div class="col-6">
          <div class="card p-4">
            <h3>Template</h3>
            <div class="row">
            <!-- Carry -->
            <draggable :list="Carry" group="Number" item-key="name" class="d-flex justify-content-end" style="border: solid; min-height: 55px;">
                <template #item="{ element }">
                  <button type="button" class="btn btn-primary m-1 my-btn">{{ element }}</button>
                </template>
            </draggable>
    
            
              <hr style="background-color: black; border: solid; border-width: 5px;">
            <!-- Number & Carry -->
            <div v-for="(item,index) in Num_list">
              <div class="row">
                <draggable :list="Sy_list[index]" group="Symbol" item-key="name" class="d-flex justify-content-end col-2" @change="sym_control(index)">
                  <template #item="{ element }">
                    <button type="button" class="btn btn-primary m-1 my-btn">{{ element }}</button>
                  </template>
                </draggable>
                <draggable :list="Num_list[index]" group="Number" item-key="name" class="d-flex justify-content-end col-10" style="border: solid; min-height: 55px;">
                  <template #item="{ element }">
                    <button type="button" class="btn btn-primary m-1 my-btn">{{ element }}</button>
                  </template>
                </draggable>
              </div>
            </div>
    
            <!-- Answer -->
            <hr style="background-color: black; border: solid; border-width: 5px;">
            <draggable :list="Ans" group="Number" item-key="name" class="d-flex justify-content-end" style="border: solid; min-height: 55px;">
                <template #item="{ element }">
                  <button type="button" class="btn btn-primary m-1 my-btn">{{ element }}</button>
                </template>
            </draggable>
            <div class="d-flex flex-row  flex-wrap">
              <button @click="addrow" class="btn btn-primary m-1 flex-grow-1">Add Row</button>
              <button @click="removerow" class="btn btn-primary m-1 flex-grow-1">Remove Row</button>
              <button @click="clear" class="btn btn-primary m-1 flex-grow-1">Clear All</button>
              <button @click="Calculat" class="btn btn-primary m-1 flex-grow-1">Calculat</button>
            </div>
          </div>
          </div>  
        </div>
    
        <div class="col-6">
          <div class="card p-3">
            <div class="row">
              <div class="col-6">
                <h3>Number</h3>
                <draggable
                  class="dragArea list-group d-flex justify-content-start"
                  :list="Num"
                  :group="{ name: 'Number', pull: 'clone', put: false }"
                  @change="log"
                  item-key="Number"
                >
                  <template #item="{ element }">
                      <button type="button" class="btn btn-primary m-1 ">{{ element }}</button>
                  </template>
                </draggable>
              </div>
              <div class="col-6">
                <h3>Symbol</h3>
                <draggable
                  class="dragArea list-group d-flex justify-content-start"
                  :list="Symbol"
                  :group="{ name: 'Symbol', pull: 'clone', put: false }"
                  @change="log"
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
      </div>
        
    </div>  
    <br>
    <br>    
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
            Num_list: [[],[],[]],
            Sy_list: [[],[],[]],
            Ans:[],
            Carry:[]
    
          };
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
          clear: function(evt) {
            /**
             * 清除所有資料，僅留下第一行(Clear all data, only leave the first row)
             */
            this.Num_list = [[]];
            this.Sy_list = [[]];
            this.Carry = [];
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
      <style scoped></style>