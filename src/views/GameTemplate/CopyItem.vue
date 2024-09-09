<template>
<div class="outter-container">
    <div class="container-title title">
        <p class="title__text">{{ this.GameData.Title }}</p>
    </div>
    <div class="game-index">
        <div class="box-tar">
            <draggable
                class="drag-container box"
                :list="tarList"
                :key="tarList.key"
                group="items"
            >
                <template #item="{ element }">
                    <component
                        :is="element.Name"
                        :Data="element.Data"
                        :ID="element.ID"
                        class="list-group-item"
                    ></component>
                </template>
            </draggable>
        </div>
        <div class="box-source">
            <div class="box question">
                <p v-for="(question, index) in this.GameData.Questions" :key="index">{{ question }}</p>
            </div>
            <div class="source box">
                <draggable
                    class="item-container "
                    :list="sourceList"
                    :group="{ name: 'items', pull: 'clone', put: true }"
                    @change="init"
                    :sort="false"
                    :key="sourceList.key"
                >
                    <template #item="{ element }">
                        <component
                            :is="element.Name"
                            :Data="element.Data"
                            :ID="element.ID"
                            class="list-group-item"
                        ></component>
                    </template>
                </draggable>
            </div>

            <button class="button-basic tool-container">檢查答案</button>

        </div>
    </div>
</div>
</template>

<script>
import draggable from 'vuedraggable';
import { getComponents } from '@/utilitys/get-components';
import { defineAsyncComponent } from 'vue';
import ImageContainer from '@/components/ImageContainer.vue';
export default {
    name: 'CopyItem',
    components: {
        draggable,
        ImageContainer
    },
    data() {
        return {
            // Your data properties go here
            id: 'Dev0105',
            GameData: {
                Title: "123456",
                Questions: [
                    "請放入五個糖果"
                ],
                Items: [{
                    Name: "ImageContainer",
                    Amount: 3,                    
                    Data: {
                        Src: "sugar.png",
                        Alt: "糖果照片",
                    }
                }]
            },
            tarList: [
                
            ],
            sourceList: [
            ]
        };
    },
    created() {
        // Code to run when the component is created goes here
        this.init();
    },
    methods: {
        // Your methods go here
        init() {
            this.sourceList = [];
            for (var i in this.GameData.Items) {
                var item = this.GameData.Items[i];
                this.sourceList.push({
                    Name: item.Name,
                    Data: item.Data,
                    ID: this.id,
                    item: i
                });
            }
        },
        checkAnswer() {
            for(var i in this.tarList){
                var item = this.tarList[i];
                console.log(item);
            }
        }
    },
    mounted() {
        // Code to run when the component is mounted goes here
    },
};
</script>

<style scoped lang="scss">
/* Your component-specific styles go here */
.outter-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 78vh;
    .title {
        background-color: $info-color;
    }
    .game-index {
        height: 100%;
        display: flex;
        gap: 1rem;
        .box-tar {
            flex: 2;
            gap: 1rem;
            height: 60vh;
        }
        .box-source {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            .question {
                flex: 2;
                border: $border--normal solid #000;
                padding: $padding--small;
                font-size: $text-small;
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
            }
            .source {
                flex: 3;
                max-height: 30vh;
                border: $border--normal solid #000;
                padding: 1rem;
                .item-container {
                    padding: $padding--small;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    gap: 1rem;
                    height: 100%;
                    width: 100%;
                }
            }
            .tool-container {
                flex: 1;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 1rem;
                padding: $padding--small;
                font-size: $text-medium;
                background-color: $submit-color;
            }
            .tool-container:hover {
                scale: 1.05;
                transition: 0.5s;
            }
        }
    }
    .drag-container {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 9vh);
        gap: 1rem;
        padding: $padding--small;
        width: 100%;
        height: 100%;
    }
}
.box {
    @extend .container-basic;
}
</style>