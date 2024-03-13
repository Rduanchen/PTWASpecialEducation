<template>
    <div>
      <input type="text" v-model="inputText" />
      <button @click="readText">Read Text</button>
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
    mounted() {
      window.speechSynthesis.addEventListener('voiceschanged', this.populateVoiceList);
    },
    beforeUnmount() {
      window.speechSynthesis.removeEventListener('voiceschanged', this.populateVoiceList);
    },
    methods: {
      populateVoiceList() {
        this.voices = window.speechSynthesis.getVoices();
      },
    },
  };
  </script>