<template>
<div class="container">
    <!-- Your component's HTML template goes here -->
    <img id="Show" :src="Src" alt="Hahah">
</div>
</template>

<script>
import { GetSlotComponentData } from '@/utilitys/get_assets.js';
export default {
    name: 'EffectWindow',
    data() {
        return {
            // Data:{
            //     Status: null
            // },
            Src: ''
        };
    },
    props:{
        Data:{
            type: Object,
            required: true
        },
    },
    methods: {
        // Your component's methods go here
    },
    computed: {
        // Your computed properties go here
    },
    created(){
        if(this.Data.Status=='Correct'){
            this.Src = GetSlotComponentData('CorrectIncorrect', 'check.png')
            console.log(this.Src)
        }
        else if(this.Data.Status=='Incorrect'){
            this.Src = GetSlotComponentData('CorrectIncorrect', 'cross.png')
            console.log(this.Src)
        }
    },
    mounted() {
        // Code to run when the component is mounted goes here
    },
};
</script>

<style scoped>
/* Your component's styles go here */
.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    img{
        align-self: center;
        height: 50%;
        width: auto;
    }
}
</style>
