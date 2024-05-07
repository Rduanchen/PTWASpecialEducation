<template>
<div>
    <div class="card" v-if="this.imageURL != undefined && this.imageURL != ''">
            <img :src="imageURL" class="card-img-top" :alt="altText">
        <div class="card-body" v-if="this.Text != undefined && this.imageURL != '' ">
            <p class="card-text text-center h3">{{ Text }}</p>
        </div>
    </div>
    <div class="card" v-else>
        <p class="h3 text-center">{{ Text }}</p>
    </div>
</div>
</template>
<script>
export default {
    name: 'CardWithButton',
    data() {
        return {
            
        };
    },
    props: {
        Text: {
            type: String,
        },
        altText: {
            type: String,
            
        },
        imageURL: {
            type: String,
        }
    },
    mounted() {
    },
};
</script>

<style scoped>
.card {
    width: 8rem;
}
</style>