import * as tf from '@tensorflow/tfjs';
import actions from './result';
import { loadTensorFlowModel } from './tensorflowModelLoader';

let model = tf.LayersModel;
let sequence = [];
let lastSpoken = "";
let predictions = []; 

export const intializeModel = async () => {
    try {
        model = await loadTensorFlowModel();

        // Periksa apakah model adalah instance dari tf.LayersModel
        if (!(model instanceof tf.LayersModel)) {
            throw new Error("Model yang dimuat bukan instance dari tf.LayersModel.");
        }

        console.log("✅ Model berhasil diinisialisasi:", model);
    } catch (error) {
        console.error("❌ Gagal menginisialisasi model:", error);
    }
};

export const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Set bahasa ke Bahasa Indonesia
    window.speechSynthesis.speak(utterance);
};

// Prediksi berdasarkan keypoints
export const runPrediction = async (results, keypoints, setDetectedWord) => {
    // Tambahkan keypoints ke dalam sequence
    sequence.push(keypoints);
    sequence = sequence.slice(-30); // Batasi panjang sequence hanya 30 frame

    if (sequence.length === 30) {
        const input = tf.tensor([sequence]); // Buat tensor dari sequence
        console.log("Input shape:", input.shape);

        try {
            const prediction = await model.predict(input).data(); // Ambil array prediksi
            console.log("Prediction result:", prediction);

            const maxIndex = prediction.indexOf(Math.max(...prediction)); // Indeks dengan confidence tertinggi
            const predictedWord = actions[maxIndex]; // Ambil kata sesuai indeks
            const confidence = prediction[maxIndex] || 0; // Nilai confidence

            console.log(`Predicted Word: ${predictedWord}, Confidence: ${confidence}`);

            // Simpan prediksi ke dalam array untuk stabilisasi
            predictions.push(predictedWord);
            predictions = predictions.slice(-10); // Simpan hanya 10 prediksi terakhir

            // Stabilkan prediksi: hanya tampilkan jika prediksi stabil
            if (
                predictions.filter((word) => word === predictedWord).length > 7 &&
                confidence > 0.9 &&
                predictedWord !== lastSpoken
            ) {
                setDetectedWord(predictedWord); // Update kata yang terdeteksi
                lastSpoken = predictedWord; // Update kata terakhir yang terdeteksi
                speakText(predictedWord); // Putar suara
            }
        } catch (error) {
            console.error("❌ Gagal melakukan prediksi:", error);
        } finally {
            input.dispose(); // Bersihkan tensor untuk mencegah kebocoran memori
        }
    }
};