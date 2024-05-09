<template>
<div class="Container" id="ImageContainer" ref="ImageContainer">
    <!-- <img ref="Image" id="Img" :src="this.imageUrl" :alt="this.Data.Alt"> -->
</div> 
</template>

<script>
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';

export default {
    name: 'ImageContainer',
    data() {
        return {
            imageUrl: '',
            ContainerSize: {
                width: 0,
                height: 0
            }
        };
    },
    props: {
        id: {
            type: String,
            required: true
        },
        Data: {
            type: Object,
            required: true
        }
    },
    methods: {
        // Your methods go here
    },
    mounted() {
        this.imageUrl = GamesGetAssetsFile(this.id, this.Data.Src);
        let data = document.getElementById('ImageContainer');
        data = data.getBoundingClientRect();
        this.ContainerSize = {
            width: data.width,
            height: data.height
        }
        console.log(this.ContainerSize);
        const img = new Image();
        img.onload = () => {
            let ImageDatas = {
                width: img.width,
                height: img.height
            };

            console.log(ImageDatas);
            if (ImageDatas.width > ImageDatas.height) {
                console.log('width');
                img.style.width = this.ContainerSize.width + 'pt';
                img.style.height = 'auto';
            } else {
                console.log('height');
                img.style.width = 'auto';
                img.style.height = this.ContainerSize.height + 'pt';
            }   
        }
        img.src = this.imageUrl;
    },
};
</script>

<style scoped>
.Container{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}
</style>