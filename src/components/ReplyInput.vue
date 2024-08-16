<template>
<div class="Outter">
    <input :type="Data.Type" @input="Reply2Parent" v-model="ReplyDatas">
</div>
</template>
<script>
export default {
    name: 'ReplyInput',
    props: {
        Data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            ReplyDatas : ""
        }
    },
    created() {
        if (this.Data.Type == undefined) {
            this.Data.Type = "Text";
        }
    },
    methods: {
        Reply2Parent(){
            let ans = this.ReplyDatas == this.Data.Text ? true : false; 
            this.$emit('ReplyAnswer', ans);
        }
    }
};
</script>

<style scoped>
/* Your component styles here */
.Outter{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    input{
        width: 100%;
    }
}
</style>