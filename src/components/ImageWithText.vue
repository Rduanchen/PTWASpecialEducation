<template>
    <div class="image-with-text">
        <img :src="imageUrl" :alt="this.Data.Alt" class="" />
        <p class="h1">{{ text }}</p>
    </div>
</template>
<script>
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
export default {
    name: 'ImageWithText',
    props: {
        Data: {
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
            imageUrl: '',
            text: ''
        };
    },
    mounted() {
        // Your code here
        this.imageUrl = GamesGetAssetsFile(this.ID, this.Data.Src);
        this.text = this.Data.Text;
    },
}
</script>

<style scoped>
.image-with-text {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img{
        width: 100%;
        height: auto
    }
}
</style>