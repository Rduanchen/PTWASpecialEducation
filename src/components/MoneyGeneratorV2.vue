<template>
<div>
    <v-stage ref="stage" :config="stageSize">
        <v-layer>
            <v-image :config="imageConfig" />
        </v-layer>
    </v-stage>
</div>
</template>

<script>
//import vue-Konva
import { Stage, Layer, Image } from 'vue-konva';
export default {
    name: 'MoneyGeneratorV2',
    data() {
        return {
            stageSize: {
                width: 1000,
                height: 1000,
            },
        };
    }
    
}
</script>
<style scoped>
/* Your component's CSS styles go here */
</style>