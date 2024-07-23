<template>
<div class="word">
    <p>{{ this.Data.Text }}</p>
</div>
</template>
<script>
export default {
    name: 'TextOnly',
    props: {
        Data : {
            type: Object,
            required: true
        },
        ID: {
            type: String,
            required: true
        }
    },
    data() {
        return {

        };
    },
    mounted() {
        
    }
}
</script>
<style scoped>
/* Your component's CSS styles go here */
div{
    width: 100%;
    height: 100%;
    /* border: solid 1px black; */
    display: table;
    p{
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        font-size: 2rem;
    }
}
</style>