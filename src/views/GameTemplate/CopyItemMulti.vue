<template>
    <div class="game">
        <div class="game__target-section">
            <h1 class="game__title">{{ GameData.Title }}</h1>
            <draggable
                class="game__drop-area"
                :list="answerList"
                :group="dragGroup"
                item-key="dragItemId"
                @mousedown="startTrashMode"
                @touchstart="startTrashMode"
                @touchend="stopTrashMode"
                @mouseup="stopTrashMode"
            >
                <template #item="{ element }">
                    <component :is="element.name" :Data="element.Data" />
                </template>
            </draggable>
        </div>

        <div class="game__action-section">
            <div class="game__quation">
                <component :is="slotComponent" :Data="slotData" :ID="id" />
            </div>

            <draggable
                :list="dragList"
                :group="dragGroupForClone"
                class="game__drag-area"
                :class="{ 'game__drag-area--trash-mode': isTrashMode }"
                item-key="dragItemId"
            >
                <template #item="{ element }">
                    <div> <!-- 這裡的div刪了就沒辦法將錢拖曳到drop-area -->
                        <component :is="element.name" :Data="element.Data" />
                    </div>
                </template>
            </draggable>

            <draggable
                :group="dragGroupForDelete"
                class="game__delete-area"
                :class="{ 'game__delete-area--trash-mode': isTrashMode }"
                item-key="dragItemId"
            >
                <template #item="{ element }">
                    <!-- Empty content for delete area -->
                </template>
            </draggable>

            <button class="game__submit-button" @click="handleSubmit">送出答案</button>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import { getComponents } from "@/utilitys/get-components.js";

export default {
    components: {
        draggable,
        TextOnly: getComponents("TextOnly"),
        ImageContainer: getComponents("ImageContainer"),
        MoneyDisplay: getComponents("MoneyDisplay"),
    },
    emits: ['add-record', 'play-effect', 'nextQuestion', 'CorrectSound', 'WrongSound'],
    data() {
        return {
            dragList: [],
            answerList: [],
            isTrashMode: false,
            slotComponent: "",
            slotData: null,
            dragGroup: { name: 'money', pull: true, put: true },
            dragGroupForClone: { name: 'money', pull: 'clone', put: false },
            dragGroupForDelete: { name: 'money', pull: false, put: true }
        };
    },
    props: {
        GameData: {
            type: Object,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    methods: {
        init() {
            this.dragList = this.GameData.Items.map((item, index) => ({
                name: item.Name,
                Data: item.Data,
                dragItemId: `item-${index}`
            }));
        },
        handleSubmit(){
            const correctAnswer = this.GameData.upperComponent.Amount;
            const userAnswer = this.sumMoney();
            let isAnswerRight = this.checkAnswer(correctAnswer,userAnswer);
            if (isAnswerRight) {
                this.$emit("next-question", true);
            } else {
                this.$emit('play-effect', 'WrongSound');   
            }
            this.addRecord(correctAnswer,userAnswer,isAnswerRight);
        },
        checkAnswer(correctAnswer,userAnswer) {
            return userAnswer === correctAnswer;
        },
        sumMoney() {
            return this.answerList.reduce((total, item) => total + item.Data.denomination, 0);
        },
        startTrashMode() {
            this.isTrashMode = true;
        },
        stopTrashMode() {
            this.isTrashMode = false;
        },
        addRecord(correctAnswer, userAnswer, isAnswerRight) {
            const result = isAnswerRight ? "正確" : "錯誤";
            this.$emit("add-record", [correctAnswer, userAnswer, result]);
        }
    },
    created() {
        this.init();
        this.slotComponent = this.GameData.upperComponent.Name;
        this.slotData = this.GameData.upperComponent.Data;
    }
};
</script>

<style scoped lang="scss">
@import "@/scss/_variables.scss";
@import "@/scss/main.scss";

.game {
    display: flex;
    justify-content: space-between;
    gap: $gap--small;
}

.game > div {
    display: flex;
    flex-direction: column;
    gap: $gap--tiny;
}

.game__target-section {
    width: 70%;
}

.game__action-section {
    width: 28%;
}

.game__target-section > *, .game__action-section > * {
    border: $border--normal solid #000;
    border-radius: $border-radius;
}

.game__title {
    padding: 0.5rem;
    margin: 0;
    font-size: $text-large;
}

.game__drop-area {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(6, 9vh);
    gap: 0.5rem;
    padding: $padding--small;
}

.game__drag-area {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 9vh);
    gap: 0.5rem;
    padding: $padding--small;
}

.game__quation {
    height: 25%;
}

.game__drag-area--trash-mode {
    display: none;
}

.game__delete-area {
    display: none;
}

.game__delete-area--trash-mode {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 10vh);
    gap: 0.5rem;
    padding: $padding--small;
    background-color: red;
    background-image: url('@/assets/Games/Dev0301/delete.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 30%;
}

.game__submit-button{
    height: 2.7rem;
}
</style>
