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
        console.log(this.GameConfig.Theam);
        try{
            import(GetTheamsAssetsFile(this.GameConfig.Theam))
        }
        catch{
            console.log('No Theme')
        }
    },
};
</script>

<style scoped>
/* Your component-specific styles go here */
</style>

<!-- 
                      @get-info="GetAllInfo"

                  @add-record="GameDataRecord"
                  @download-data="ToCSV"
                  @config-header="ConfigHeader"
                  
                  @play-effect="EffectPlayer"
                  
                  @next-question="NextQuestion"
                  @previous-question="PreviousQuestion"
                  @change-level="changelevel"

                  @start-game="StartGame"
                  @reload-page="reloadPage"
                  @change-status="ChangeGameStatus"

                  @timer-start="startTimer"
                  @timer-pause="pauseTimer"
                  @timer-reset="resetTimer"
 -->