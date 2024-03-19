<template>
    <div>
      <button @click="speak">Speak</button>
      <select v-model="selectedVoice">
        <option v-for="voice in voices" :value="voice" :key="voice.voiceURI">{{ voice.name }}</option>
      </select>
    </div>
    {{ voices }}
  </template>
  
  <script>
  export default {
    data() {
      return {
        voices: [],
        selectedVoice: null,
      };
    },
    async created() {
      await this.getVoices();
    },
    methods: {
      async getVoices() {
        const voices = await new Promise((resolve, reject) => {
          let voicesLoaded = false;
          speechSynthesis.addEventListener('voiceschanged', () => {
            voicesLoaded = true;
            resolve(speechSynthesis.getVoices());
          });
          setTimeout(() => {
            if (!voicesLoaded) {
              reject(new Error('Voice load timed out'));
            }
          }, 5000);
        });
        this.voices = voices;
        this.selectedVoice = voices[0];
      },
      speak() {
        if (this.selectedVoice) {
          const utterance = new SpeechSynthesisUtterance('Hello, world!');
          utterance.voice = this.selectedVoice;
          speechSynthesis.speak(utterance);
        }
      },
    },
  };
  </script>