<template>
    <div class="Container" ref="containerRef">
        <img :src="imageUrl" :alt="Data.Alt">
    </div>
</template>
<script>
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
export default {
    name: 'ImageContainer',
    props: {
        ID: {
            type: String,
            required: true
        },
        Data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            containerSize: { width: 0, height: 0 },
            imageUrl: '',
        };
    },
    methods: {
        updateContainerSize() {
            if (this.$refs.containerRef) {
                const { width, height } = this.$refs.containerRef.getBoundingClientRect();
                this.containerSize = { width, height };
            }
        },
        initImage() {
            const img = new Image();
            img.onload = () => {
                const { width: containerWidth, height: containerHeight } = this.containerSize;
                const { width: imgWidth, height: imgHeight } = img;
                const { width: newWidth, height: newHeight } = this.getScaledDimensions(
                    containerWidth, containerHeight, imgWidth, imgHeight
                );

                // Apply new dimensions to the image
                if (this.$refs.containerRef) {
                    const imgElement = this.$refs.containerRef.querySelector('img');
                    if (imgElement) {
                        imgElement.style.width = `${newWidth}px`;
                        imgElement.style.height = `${newHeight}px`;
                    }
                }
            };
            img.src = this.imageUrl;
        },
        getScaledDimensions(containerWidth, containerHeight, imageWidth, imageHeight) {
            const scale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
            return {
                width: Math.min(imageWidth * scale, containerWidth),
                height: Math.min(imageHeight * scale, containerHeight)
            };
        }
    },
    mounted() {
        this.updateContainerSize();
        window.addEventListener('resize', this.updateContainerSize);
        // Use nextTick to ensure the container size is updated before initializing the image
        this.$nextTick(() => {
            this.imageUrl = GamesGetAssetsFile(this.ID, this.Data.Src);
            this.initImage();
        });
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateContainerSize);
    }
};
</script>

<style scoped>
.Container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>