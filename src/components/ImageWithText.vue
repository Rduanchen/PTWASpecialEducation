<template>
    <div class="image-with-text">
        <!-- Your HTML code here -->
        <img :src="imageUrl" alt="Image" />
        <p>{{ text }}</p>
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
        this.imageUrl = GamesGetAssetsFile(this.Data.Image);
        this.text = this.Data.Text;
    },
}
</script>

<style scoped>
/* .image-with-text {
} */
</style>