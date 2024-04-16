<template>
    <div>
        <p class="h1" id="Hello">fffffffff</p>
        this is a private moduel sample
        <button @click="sound">Play Sound</button>
        {{ GameData }}
        {{ GameConfig }}
        {{ id }}
    </div>
</template>

<script>
import { GetTheamsAssetsFile } from '@/utilitys/get_assets.js';
export default {
    name: 'MA3020',
    emits:{
        'play-effect':null
    },
    data() {
        return {
            // Your data properties go here
        };
    },
    props: {
        GameData: {
            type: Object,
            required: true,
        },
        GameConfig: {
            type: Object,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },
    methods: {
        sound() {
            this.$emit('play-effect', 'CorrectSound');
        },
    },
    mounted() {
        try{
            if(this.GameConfig.Theam){
                import(GetTheamsAssetsFile(this.GameConfig.Theam))
            }
        }
        catch{
            console.log('Using Default Theam')
        }
    },
};
</script>

<style scoped>
#Hello {
    color: pink;
}

</style>
