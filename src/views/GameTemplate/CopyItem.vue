<template>
<div class="outter-container">
    <div class="container-title title">
        <p class="title__text">123456</p>
    </div>
    <div class="box-tar box">
        <draggable
            class="drag-container"
            :list="sourceList"
            group="items"
        >
            <template #item="{ element }">
                <div class="list-group-item">
                    {{ element.name }}
                </div>
            </template>
        </draggable>
    </div>
    <div class="box-source">
        <div class="source">
            <draggable
                class="item-container box"
                :list="tarList"
                :group="{ name: 'items', pull: 'clone', put: false}"
                :sort="false"
            >
                <template #item="{ element }">
                    <div class="list-group-item">
                        {{ element.name }}
                    </div>
                </template>
            </draggable>
        </div>
        <div class="box">
            <p>{{ 1 }}</p>
        </div>
        <div class="tool-container box">
            <button class="button-basic">檢查答案</button>
            <button class="button-basic">下一關</button>
        </div>
    </div>
</div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
    name: 'CopyItem',
    components: {
        draggable,
    },
    data() {
        return {
            // Your data properties go here
            tarList: [
                { name: "John", id: 1 },
                { name: "Joao", id: 2 },
                { name: "Jean", id: 3 },
                { name: "Gerard", id: 4 }
            ],
            sourceList: [
                { name: "Juan", id: 5 },
                { name: "Edgard", id: 6 },
                { name: "Johnson", id: 7 },
            ]
        };
    },
    methods: {
        // Your methods go here
    },
    mounted() {
        // Code to run when the component is mounted goes here
    },
};
</script>

<style scoped lang="scss">
/* Your component-specific styles go here */
.outter-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 7fr;
    gap: 1rem;
    width: 100%;
    height: 79vh !important;
    border: solid 1px #000;
    .title {
        grid-column: 1 / 3;
        grid-row: 1 / 2;
    }
    .box-tar {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
    }
    .box-source {
        grid-column: 2 / 3;
        grid-row: 2 / 3;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 7fr 2fr;
        column-gap: 1rem;
        grid-gap: 1rem;
        height: 100%;
        .source {
            height: 50%;
        }
        .tool-container {
            padding: $gap--medium;
        }
    }
    .box {
        @extend .container-basic;
    }
}

.drag-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 1rem;
    width: 100%;
    margin: $gap--large;
    .list-group-item {
        padding: 1rem;
        border: 1px solid #000;
        border-radius: 5px;
    }
}

.item-container {
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #000;
    border-radius: 5px;
}
</style>