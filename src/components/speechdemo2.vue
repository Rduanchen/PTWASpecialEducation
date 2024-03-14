<template>
    <div>
      <input type="text" v-model="inputText" />
      <button @click="readText">Read Text</button>
    </div>
    <div v-for="item in this.voice">
      <p>{{item.name}}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SpeechDemo',
    data() {
      return {
        inputText: '',
        voices: [],
        selectedVoice: null,
      };
    },
    methods: {
      readText() {
        const synth = window.speechSynthesis;
        const utterThis = new SpeechSynthesisUtterance(this.inputText);
        const chosenVoiceName = "Microsoft HsiaoYu Online (Natural) - Chinese (Taiwanese Mandarin)";
        this.selectedVoice = this.voices.find(voice => voice.name === chosenVoiceName);
        if (this.selectedVoice) {
          utterThis.voice = this.selectedVoice;
          utterThis.lang = 'zh-TW';
          synth.speak(utterThis);
        } else {
          console.warn('Selected voice not found');
        }
      },
    },
    created() {
      // setInterval(() => {
      //   this.voices = window.speechSynthesis.getVoices();
      // }, 1000);
      async function getVoices() {
        return new Promise((resolve) => {
          const synth = window.speechSynthesis;
          const id = setInterval(() => {
            const voices = synth.getVoices();
            if (voices.length) {
              clearInterval(id);
              resolve(voices);
            }
          }, 100);
        });
      }
      window.speechSynthesis.addEventListener('voiceschanged', this.populateVoiceList);
    },
    beforeUnmount() {
      window.speechSynthesis.removeEventListener('voiceschanged', this.populateVoiceList);
    },
    
  };
  </script>