export function ReadText(text) {
    let voices = [];
    let selectedVoice = null;
    let synth = window.speechSynthesis;
    let voicetype = "Google 國語（臺灣）";
    synth.onvoiceschanged = () => {
        voices = synth.getVoices();
        selectedVoice = voices[0];
        console.log(voices);
        // let voicetype = "Google 國語（臺灣）";
        for (let i = 0; i < voices.length; i++) {
          if (voices[i].name === voicetype) {
            selectedVoice = voices[i];
            break;
          }
        }
        let utterThis = new SpeechSynthesisUtterance(this.inputText);
        utterThis.voice = selectedVoice;
        utterThis.lang = "zh";
        utterThis.rate = 1;
        utterThis.pitch = 1;
        synth.speak(utterThis);
    };
    
}