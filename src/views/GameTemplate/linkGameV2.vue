<template>
    <div class="Container">
        <p class="h1">{{ GameData.Question.text }}</p>
        <div class="Index" ref="Index">
            <div class="Konva-container" ref="KonvaContainer">
                <v-stage :config="configStage" class="Stage" @mousedown="">
                    <v-layer>
                        <v-circle v-for="(Object, index) in DotLocation" :key="index" :config="{ x: Object.X, y: Object.Y, radius: 5, fill: 'black' }"></v-circle>
                    </v-layer>
                </v-stage>                
            </div>
            <div class="ObjectContainer" ref="ObjectContainer" v-for="(Object, index) in ComponentConfig" :style="{ position: 'absolute', top: Object.Y + 'px', left: Object.X + 'px', width: this.ComponentPositionConfig.ObjectWidth + 'px', height: this.ComponentPositionConfig.ObjectHeight + 'px' }">
                <component :is="Object.Name" :Data="Object.Data" :ID="this.id" class="Component"></component>
            </div>
        </div>
        <!-- {{ ComponentConfig }} -->
    </div>
</template>
<script>
import { Stage, Layer, Circle } from 'vue-konva';
import { defineAsyncComponent } from 'vue';
import { GamesGetAssetsFile } from '../../utilitys/get_assets.js';
export default {
    name: 'LinkGameV2',
    components: {
        'v-stage': Stage,
        'v-layer': Layer,
        'v-circle': Circle,
        ImageContainer: defineAsyncComponent(() => import('@/components/ManualImageContainer.vue')),
    },
    data() {
        return {
            // Your component data goes here
            id: "MA4008",
            GameData: 
            {   
                "Question": {
                    "text": "把一樣的數連起來",
                    // "RowData":[
                    //     ["1261.png","1324.png","1456.png","1342.png","1535.png"],
                    //     ["c-1456.png","c-1324.png","c-1261.png","c-1535.png","c-1342.png"],
                    //     ["n-1324.png","n-1261.png","n-1456.png","n-1342.png","n-1535.png"]
                    // ]
                    "RowData":[
                        [
                            { Name: 'ImageContainer', Data: { Src: '1261.png' } },
                            { Name: 'ImageContainer', Data: { Src: '1324.png' } },
                            { Name: 'ImageContainer', Data: { Src: '1456.png' } }
                            // { Name: 'ImageContainer', Data: { Src: '1342.png' } },
                            // { Name: 'ImageContainer', Data: { Src: '1535.png' } }
                        ],
                        [
                            { Name: 'ImageContainer', Data: { Src: 'c-1456.png' } },
                            { Name: 'ImageContainer', Data: { Src: 'c-1324.png' } },
                            { Name: 'ImageContainer', Data: { Src: 'c-1261.png' } }
                            // { Name: 'ImageContainer', Data: { Src: 'c-1535.png' } },
                            // { Name: 'ImageContainer', Data: { Src: 'c-1342.png' } }
                        ],
                        [
                            { Name: 'ImageContainer', Data: { Src: 'n-1324.png' } },
                            { Name: 'ImageContainer', Data: { Src: 'n-1261.png' } },
                            { Name: 'ImageContainer', Data: { Src: 'n-1456.png' } }
                            // { Name: 'ImageContainer', Data: { Src: 'n-1342.png' } },
                            // { Name: 'ImageContainer', Data: { Src: 'n-1535.png' } }
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
            ComponentConfig:[],
            ComponentPositionConfig:{},
            DotLocation: [],
            IndexInfo: null,
            MiniGap: 10,
        };
    },
    created() {
        // Code to run when the component is created goes here
    },
    mounted() {
        // Code to run when the component is mounted goes here
        this.IndexInfo = this.$refs.Index.getBoundingClientRect();
        this.Init();
    },
    methods: {
        MouseDown(e){
            
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
                    if (this.ColumnIndex != 0 && this.ColumnIndex != this.GameData.Question.RowData.length - 1){
                        this.DotLocation.push({
                            X: NowX + this.ComponentPositionConfig.ObjectWidth + this.MiniGap,
                            Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2
                        })
                        this.DotLocation.push({
                            X: NowX - this.MiniGap,
                            Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2
                        })
                    } else {
                        this.DotLocation.push({
                            X: NowX + this.ComponentPositionConfig.ObjectWidth + this.MiniGap,
                            Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2
                        })
                    }

                    NowY += this.ComponentPositionConfig.ObjectHeight + this.MiniGap;
                    this.ComponentConfig.push(Object);
                }    
                NowX += this.ComponentPositionConfig.ObjectWidth + this.ComponentPositionConfig.BlankWidth;
            }
        },
    },
}
</script>
<style scoped>
/* Your component-specific styles go here */
.Container {
    width: 100vw;
    height: 100vh;
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