export default function speakText(text) {

    const audioMap = {
        "Halo": "halo.mp3",
        "Selamat datang": "selamat-datang.mp3",
        "Mau": "mau.mp3",
        "Pesan": "pesan.mp3",
        "Bayar": "bayar.mp3",
        "Kembalian": "kembalian.mp3",
        "Lagi": "lagi.mp3",
        "Terima kasih": "terima-kasih.mp3",
        "Apa": "apa.mp3", 
        "Berapa": "berapa.mp3",
    }

    const audioFile = audioMap[text];
    if (!audioFile) {
        console.error(`File suara untuk "${text}" tidak ditemukan.`)
        return
    }

    const audio = new Audio(`/assets/suara/${audioFile}`);
    audio.play().catch(error => {
        console.error("Gagal memutar suara:", error)
    })

}