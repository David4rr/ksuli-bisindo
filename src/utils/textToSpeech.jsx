export const speakText = (text) => {
    if (!('speechSynthesis' in window)){
        console.warn('Speech Synthesis not supported in this browser.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.text = text;
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const getIndonesianVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(voice => voice.lang === 'id-ID' || voice.lang.startsWith('id-'));
    };

    if (window.speechSynthesis.onvoiceschanged){
        window.speechSynthesis.onvoiceschanged = () => {
            utterance.voice = getIndonesianVoice() || null;
        }
    } else {
        utterance.voice = getIndonesianVoice() || null;
    }

    utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

export default speakText;