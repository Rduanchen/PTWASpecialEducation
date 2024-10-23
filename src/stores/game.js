import { defineStore } from 'pinia';

let usegameStore = defineStore('game Store', {
    state: () => ({
        reappeareCode: 'None',
        gameCode: 'None',
        transitionName: 'slide-right',
        GameStatus: 'NotStart',
        Nowlevel:1,
    }),
    actions: {
        
    },
    getters: {
        
    }
});

export default usegameStore;