<template>
    <div class="Container">
        <p class="h1">{{ GameData.Question.text }}</p>
        
        {{ IndexMappingTable }}
        
        <div class="Index" ref="Index">
            <div class="Konva-container" ref="KonvaContainer">
                <v-stage :config="configStage" class="Stage" @mousemove="MouseMove" @mouseup="MouseUpAtDot" >
                    <v-layer>
                        <v-circle @mousedown="(event) => { MouseDown(event,index) }"  v-for="(Object, index) in DotLocation" :key="index" :config="{ x: Object.X, y: Object.Y, radius: 5, fill: 'black' }"></v-circle>
                    </v-layer>
                    <v-layer ref="LineLayer">
                        <v-line v-for="Line in Lines" :config="Line"></v-line>
                    </v-layer>
                    <v-layer ref="OnDrawLineLayer">
                        <v-line :config="OnDrawingLine"></v-line>
                    </v-layer>
                </v-stage>
            </div>
            <div class="ObjectContainer" ref="ObjectContainer" v-for="(Object, index) in ComponentConfig" :style="{ position: 'absolute', top: Object.Y + 'px', left: Object.X + 'px', width: this.ComponentPositionConfig.ObjectWidth + 'px', height: this.ComponentPositionConfig.ObjectHeight + 'px' }">
                <component :is="Object.Name" :Data="Object.Data" :ID="this.id" class="Component"></component>
            </div>
        </div>
    </div>
</template>

<script>
import { Stage, Layer, Circle, Line } from 'vue-konva';
import { defineAsyncComponent } from 'vue';

export default {
    name: 'LinkGameV2',
    components: {
        'v-stage': Stage,
        'v-layer': Layer,
        'v-circle': Circle,
        'v-line': Line,
        ImageContainer: defineAsyncComponent(() => import('@/components/ManualImageContainer.vue')),
    },
    data() {
        return {
            id: "MA4008",
            GameData: {   
                "Question": {
                    "text": "把一樣的數連起來",
                    "RowData": [
                        [
                            { Name: 'ImageContainer', Data: { Src: '1261.png' } },
                            { Name: 'ImageContainer', Data: { Src: '1324.png' } },
                            { Name: 'ImageContainer', Data: { Src: '1456.png' } },
                            { Name : 'ImageContainer', Data: { Src: '1342.png' } },
                            { Name : 'ImageContainer', Data: { Src: '1535.png' } }
                        ],
                        [
                            { Name: 'ImageContainer', Data: { Src: 'c-1456.png' } },
                            { Name: 'ImageContainer', Data: { Src: 'c-1324.png' } },
                            { Name: 'ImageContainer', Data: { Src: 'c-1261.png' } },
                            { Name : 'ImageContainer', Data: { Src: 'c-1535.png' } },
                            { Name : 'ImageContainer', Data: { Src: 'c-1342.png' } }
                        ],
                        [
                            { Name: 'ImageContainer', Data: { Src: 'n-1324.png' } },
                            { Name: 'ImageContainer', Data: { Src: 'n-1261.png' } },
                            { Name: 'ImageContainer', Data: { Src: 'n-1456.png' } },
                            { Name : 'ImageContainer', Data: { Src: 'n-1342.png' } },
                            { Name : 'ImageContainer', Data: { Src: 'n-1535.png' } }
                        ]
                    ]
                },
                "Answer": [
                    [[0,0],[1,2]],
                    [[0,1],[1,1]],
                    [[0,2],[1,0]],
                    [[0,3],[1,4]],
                    [[0,4],[1,3]],
                    [[2,0],[3,2]],
                    [[2,1],[3,0]],
                    [[2,2],[3,1]],
                    [[2,3],[3,4]],
                    [[2,4],[3,3]]
                ]
            },
            configStage: {
                width: 610,
                height: 100,
            },
            ComponentConfig: [],
            ComponentPositionConfig: {},
            DotLocation: [],
            LineWidth: 2,
            IndexInfo: null,
            MiniGap: 10,
            Lines: [],
            OnDrawingLine: { points: [], stroke: 'black', strokeWidth: 2, lineCap: 'round', lineJoin: 'round' },
            OnDrawing: false,
            IndexMappingTable: [],
            MouseDownDotIndex: null
        };
    },
    mounted() {
        this.IndexInfo = this.$refs.Index.getBoundingClientRect();
        this.Init();
    },
    created() {

    },
    methods: {
        MouseDown(e,index) {
            const MousePos = e.target.getStage().getPointerPosition();
            this.OnDrawing = true;
            this.MouseDownDotIndex = index;
            this.OnDrawingLine = {
                points: [MousePos.x, MousePos.y, MousePos.x, MousePos.y],
                stroke: 'black',
                strokeWidth: this.LineWidth,
                lineCap: 'round',
                lineJoin: 'round'
            };
        },
        MouseMove(e) {
            if (this.OnDrawing) {
                const MousePos = e.target.getStage().getPointerPosition();
                this.OnDrawingLine.points.splice(2, 2, MousePos.x, MousePos.y);
                this.$refs.OnDrawLineLayer.getNode().draw();
            }
        },
        MouseUpAtDot(e) {
            //FIXME Error is here
            console.log('MouseUpAtDot');
            if (this.OnDrawing) {
                const MousePos = e.target.getStage().getPointerPosition();
                this.OnDrawingLine.points.splice(2, 2, MousePos.x, MousePos.y);
                let DotIndex = this.CheckMouseAtTheDot(MousePos.x, MousePos.y);
                if (DotIndex != false){
                    let LinkAble = this.CheckLinkAble(this.MouseDownDotIndex,DotIndex);
                    // UP OK
                    if (LinkAble){
                        let AnswerCorrect = this.CheckAnswerisCorrect(this.MouseDownDotIndex,DotIndex);
                        if (AnswerCorrect){
                            this.OnDrawingLine.points.splice(2, 2, this.DotLocation[DotIndex].X, this.DotLocation[DotIndex].Y);
                            this.Lines.push({ ...this.OnDrawingLine }); // Spread operator to create a new object
                            this.OnDrawing = false;
                            this.OnDrawingLine = { points: [], stroke: 'black', strokeWidth: 2, lineCap: 'round', lineJoin: 'round' }; // Reset OnDrawingLine
                            this.$refs.LineLayer.getNode().draw();
                            this.$refs.OnDrawLineLayer.getNode().draw();
                            return;
                        }
                    }
                }
                this.OnDrawing = false;
                this.OnDrawingLine = { points: [], stroke: 'black', strokeWidth: 2, lineCap: 'round', lineJoin: 'round' }; // Reset OnDrawingLine
                this.$refs.OnDrawLineLayer.getNode().draw();
            }
        },
        CheckMouseAtTheDot(mouseX,mouseY){
            for (var DotIndex in this.DotLocation){
                let Dot = this.DotLocation[DotIndex];
                let differenceRadius = 7;
                if (mouseX > Dot.X - differenceRadius && mouseX < Dot.X + differenceRadius && mouseY > Dot.Y - differenceRadius && mouseY < Dot.Y + differenceRadius){
                    return parseInt(DotIndex);
                }
            }
            return false;
        },
        MappingDotIndexToAnswerIndex(DotIndex){
            // This Program give each dot a index, from top to down, left to right, start from 0 to n
            // The Teacher's Answer is a 2D array, each element is a pair of index, the first element is the index of the first dot, the second element is the index of the second dot
            // This function will convert the dot index to the answer index
            
            return this.IndexMappingTable[DotIndex];
        },
        CheckLinkAble(StartIndex,EndIndex){
            // Line Can't be drawed on the same column
            console.log(StartIndex,EndIndex);
            let StartColumn = this.MappingDotIndexToAnswerIndex(StartIndex)[0];
            let EndColumn = this.MappingDotIndexToAnswerIndex(EndIndex)[0];
            if (StartColumn == EndColumn){
                console.log('Same Column');
                return false;
            }
            else{
                console.log('Different Column');
                return true;
            }
        },
        CheckAnswerisCorrect(StartIndex,EndIndex){
            let Answer = this.GameData.Answer;
            let Start = this.MappingDotIndexToAnswerIndex(StartIndex);
            let End = this.MappingDotIndexToAnswerIndex(EndIndex);
            console.log(Start,End);
            for (var AnswerIndex in Answer){
                if (Answer[AnswerIndex][0][0] == Start[0] && Answer[AnswerIndex][0][1] == Start[1] && Answer[AnswerIndex][1][0] == End[0] && Answer[AnswerIndex][1][1] == End[1]){
                    // console.log('Correct');
                    this.$emit('play-effect', 'CorrectSound');
                    this.$emit('add-record',[this.GameData.Answer, [Start,End],"正確"]);
                    return true;
                }
                //Reverse Check
                else if(Answer[AnswerIndex][0][0] == End[0] && Answer[AnswerIndex][0][1] == End[1] && Answer[AnswerIndex][1][0] == Start[0] && Answer[AnswerIndex][1][1] == Start[1]){
                    this.$emit('play-effect', 'CorrectSound');
                    this.$emit('add-record',[this.GameData.Answer, [Start,End],"正確"]);                    
                    return true;
                }
            }
            console.log('Wrong');
            this.$emit('play-effect', 'WrongSound');
            this.$emit('add-record',[this.GameData.Answer, [Start,End],"錯誤"]);
            return false;
        },
        CheckAll(){
            if (this.Lines.length == this.GameData.Answer.length){
                
                
            }
        },
        Init(){
            // Sync Canvas Position
            let KonvaContainer = this.$refs.KonvaContainer;
            let KonvaBorder = KonvaContainer.getBoundingClientRect();
            this.configStage.width = KonvaBorder.width;
            this.configStage.height = KonvaBorder.height;
            
            // Setting Colum Gap Width and Object Width
            let Column = this.GameData.Question.RowData.length;
            // Object Width Occupied 2/5 and Blank Width Occupied 3/5
            this.ComponentPositionConfig.ObjectWidth = (KonvaBorder.width / ((Column * 2) + ((Column-1) * 3))) * 2;
            this.ComponentPositionConfig.BlankWidth = (KonvaBorder.width / ((Column * 2) + ((Column-1) * 3))) * 3;
            
            //Config each Object Position
            let NowX = 0;
            let DotColIndex = 0;
            this.DotLocation = [];
            this.IndexMappingTable = [];
            for (var ColumnIndex in this.GameData.Question.RowData){
                let ColumnObjectAmount = this.GameData.Question.RowData[ColumnIndex].length;
                // Whe we calculate each object's heght, we add MiniGap at the top and bottom of the column
                this.ComponentPositionConfig.ObjectHeight = ( KonvaBorder.height - (this.MiniGap * (ColumnObjectAmount + 1)) ) / ColumnObjectAmount;
                let NowY = this.MiniGap;
                for (var ObjectInfo in this.GameData.Question.RowData[ColumnIndex]){
                    let Object = {}
                    //General Settings
                    Object.X = NowX;
                    Object.Y = NowY;
                    Object.Name = this.GameData.Question.RowData[ColumnIndex][ObjectInfo].Name;
                    Object.Data = this.GameData.Question.RowData[ColumnIndex][ObjectInfo].Data;
                    
                    //Dot Settings, if not first or last column, add 2 dots at each side
                    if (ColumnIndex != 0 && ColumnIndex != this.GameData.Question.RowData.length - 1){
                        this.IndexMappingTable.push([parseInt(DotColIndex + 1),parseInt(ObjectInfo)]);
                        this.DotLocation.push({
                            X: NowX + this.ComponentPositionConfig.ObjectWidth + this.MiniGap,
                            Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2
                        })
                        this.IndexMappingTable.push([parseInt(DotColIndex ),parseInt(ObjectInfo)]);
                        this.DotLocation.push({
                            X: NowX - this.MiniGap,
                            Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2
                        })
                    } else if (ColumnIndex == 0){
                        this.IndexMappingTable.push([parseInt(DotColIndex),parseInt(ObjectInfo)]);
                        this.DotLocation.push({
                            X: NowX + this.ComponentPositionConfig.ObjectWidth + this.MiniGap,
                            Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2
                        })
                    }
                    else if (ColumnIndex == this.GameData.Question.RowData.length - 1){
                        this.IndexMappingTable.push([parseInt(DotColIndex),parseInt(ObjectInfo)]);
                        this.DotLocation.push({
                            X: NowX - this.MiniGap,
                            Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2
                        })
                    }
                    NowY += this.ComponentPositionConfig.ObjectHeight + this.MiniGap;
                    this.ComponentConfig.push(Object);
                }    
                NowX += this.ComponentPositionConfig.ObjectWidth + this.ComponentPositionConfig.BlankWidth;
                console.log
                if (ColumnIndex != 0 && ColumnIndex != this.GameData.Question.RowData.length - 1){
                    console.log('Add 2');
                    DotColIndex += 2;
                } else {
                    console.log('Add 1');
                    DotColIndex += 1;
                }
            }
        },
    },
}
</script>
<style scoped>
/* Your component-specific styles go here */
.Container {
    width: 100%;
    max-height: 50vh;
    display: inline-block;
}
.Index {
    position: relative; /* 設置相對定位作為子元素的參考 */
    width: 100%;
    height: 90%;
    border: solid 3px black;
}

.Konva-container, .ObjectContainer {
    position: absolute; /* 設置絕對定位 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.ObjectContainer {
    display: flex;
    justify-content: center;
    align-items: center;
}
.Component {
    width: 100%;
    height: 100%;
}
</style>