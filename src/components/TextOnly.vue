<template>
<div class="card Word">
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
.Word{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p{
        font-size: 2rem
    }
}
</style>