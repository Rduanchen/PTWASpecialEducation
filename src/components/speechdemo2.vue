<template>

  <button @click="speak">Speak</button>
  <div >
    <p v-for="item in this.voices">{{item.name}}</p>
  </div>
</template>

<script>
export default {
    name: 'SpeechDemo',
    data() {
      return {
        inputText: '哈囉你好嗎?',
        voices: [],
        selectedVoice: null,
      };
    },
    created() {
      let synth = window.speechSynthesis;
      let voicetype = "Google 國語（臺灣）";
      // let voicetype="Microsoft HsiaoChen Online (Natural) - Chinese (Taiwan)";
      console.log(navigator.userAgent);
      
      synth.onvoiceschanged = () => {
        this.voices = synth.getVoices();
        this.selectedVoice = this.voices[0];
        console.log(this.voices);
        // let voicetype = "Google 國語（臺灣）";
        for (let i = 0; i < this.voices.length; i++) {
          if (this.voices[i].name === voicetype) {
            this.selectedVoice = this.voices[i];
            break;
          }
        }
      };
    },
    methods: {
      speak() {
        let synth = window.speechSynthesis;
        let utterThis = new SpeechSynthesisUtterance(this.inputText);
        utterThis.voice = this.selectedVoice;
        utterThis.lang = "zh";
        utterThis.rate = 1;
        utterThis.pitch = 1;
        synth.speak(utterThis);
      },
    },
  }
</script>