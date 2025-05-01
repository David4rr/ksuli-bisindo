import { FilesetResolver, HolisticLandmarker } from "@mediapipe/tasks-vision";
import { getHolisticModel, saveHolisticModel, deleteHolisticModel } from "./indexedDBHelper";

let holisticLandmarker = null;

export async function loadHolisticLandmarker() {

    await deleteHolisticModel(); // hapus model yang ada di indexedDB
    // memuat model holistic landmarker
    if (holisticLandmarker) return holisticLandmarker;

    // cek model sudah tersedia di indexedDB
    let modelBlob = await getHolisticModel();

    // mengunduh model jika tidak ada di indexedDB
    if (!modelBlob) {
        console.log("🔄 Model Holistic Landmarker tidak ditemukan di cache, mengunduh...");
        const response = await fetch(
            "https://storage.googleapis.com/mediapipe-models/holistic_landmarker/holistic_landmarker/1/holistic_landmarker.task"
        );
        modelBlob = await response.blob();
        await saveHolisticModel(modelBlob);
    } else {
        console.log("✅ Model Holistic Landmarker ditemukan di cache, menggunakan model lokal.");
    }

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    const modelURL = URL.createObjectURL(modelBlob);
    try {
        holisticLandmarker = await HolisticLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: modelURL },
            runningMode: "VIDEO",
        });
    } catch (error) {
        console.error("❌ Gagal membuat HolisticLandmarker:", error);
    }
}

export default holisticLandmarker;
