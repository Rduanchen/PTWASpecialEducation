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
            // Height First
            let newHeight = this.ContainerSize.height;
            let newWidth = newHeight * (img.width / img.height);
            if (newWidth > this.ContainerSize.width) {
                newWidth = this.ContainerSize.width;
                newHeight = newWidth * (img.height / img.width);
            }
            ApplyImage.style.width = newWidth + 'px';
            ApplyImage.style.height = newHeight + 'px';
        }
        img.src = this.imageUrl;
        window.addEventListener('resize', () => {
            data = data.getBoundingClientRect();
            this.ContainerSize = {
                width: data.width,
                height: data.height
            }
            // Height First
            let newHeight = this.ContainerSize.height;
            let newWidth = newHeight * (img.width / img.height);
            if (newWidth > this.ContainerSize.width) {
                newWidth = this.ContainerSize.width;
                newHeight = newWidth * (img.height / img.width);
            }
            ApplyImage.style.width = newWidth + 'px';
            ApplyImage.style.height = newHeight + 'px';
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