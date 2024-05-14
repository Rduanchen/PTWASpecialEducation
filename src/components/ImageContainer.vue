<template>
<div class="Container" id="ImageContainer" ref="ImageContainer">
    <img ref="Image" id="Img" :src="this.imageUrl" :alt="this.Data.Alt">
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
        let ApplyImage = document.getElementById('Img');
        data = data.getBoundingClientRect();
        this.ContainerSize = {
            width: data.width,
            height: data.height
        }
        const img = new Image();
        img.onload = () => {
            let ImageDatas = {
                width: img.width,
                height: img.height
            };
            if (ImageDatas.width > ImageDatas.height) {
                ApplyImage.style.width = this.ContainerSize.width + 'px';
                ApplyImage.style.height = 'auto';
            } else {
                ApplyImage.style.width = 'auto';
                ApplyImage.style.height = this.ContainerSize.height + 'px';
            }   
        }
        img.src = this.imageUrl;
        window.addEventListener('resize', () => {
            data = data.getBoundingClientRect();
            this.ContainerSize = {
                width: data.width,
                height: data.height
            }
            if (img.width > img.height) {
                ApplyImage.style.width = this.ContainerSize.width + 'px';
                ApplyImage.style.height = 'auto';
            } else {
                ApplyImage.style.width = 'auto';
                ApplyImage.style.height = this.ContainerSize.height + 'px';
            }
        });
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