import * as tf from "@tensorflow/tfjs";

const DB_NAME = "ModelCacheDB";
const STORE_NAME = "models";
const TENSORFLOW_MODEL_KEY = "tensorflow_model";
const HOLISTIC_MODEL_KEY = "holistic_landmarker_model";

// 🟢 Membuka IndexedDB
export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 🟢 Menghapus Model Holistic Landmarker dari IndexedDB
// export async function deleteHolisticModel() {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open(DB_NAME, 1);
//         request.onsuccess = (event) => {
//             const db = event.target.result;
//             const transaction = db.transaction(STORE_NAME, "readwrite");
//             const objectStore = transaction.objectStore(STORE_NAME);
//             const deleteRequest = objectStore.delete(HOLISTIC_MODEL_KEY);

//             deleteRequest.onsuccess = () => {
//                 console.log("🗑️ Model Holistic Landmarker berhasil dihapus dari IndexedDB.");
//                 resolve();
//             };

//             deleteRequest.onerror = (e) => {
//                 console.error("❌ Gagal menghapus model dari IndexedDB:", e);
//                 reject(e);
//             };
//         };
//     });
// }

// 🟢 Simpan Model TensorFlow.js ke IndexedDB
export async function saveTensorFlowModel(model) {
    try {
        await model.save(`indexeddb://${TENSORFLOW_MODEL_KEY}`);
        console.log("✅ Model TensorFlow berhasil disimpan ke IndexedDB.");
    } catch (error) {
        console.error("❌ Gagal menyimpan model TensorFlow ke IndexedDB:", error);
    }
}

// 🟢 Ambil Model TensorFlow.js dari IndexedDB
export async function getTensorFlowModel() {
    try {
        const model = await tf.loadLayersModel(`indexeddb://${TENSORFLOW_MODEL_KEY}`);
        console.log("✅ Model TensorFlow berhasil diambil dari IndexedDB.");
        return model;
    } catch (error) {
        console.warn("⚠️ Model TensorFlow tidak ditemukan di cache:", error);
        return null;
    }
}

// 🟢 Simpan Model Hand Landmarker ke IndexedDB
// export async function saveHolisticModel(blob) {
//     try {
//         const db = await openDB();
//         const transaction = db.transaction(STORE_NAME, "readwrite");
//         const store = transaction.objectStore(STORE_NAME);
//         store.put(blob, HOLISTIC_MODEL_KEY);
//         console.log("✅ Model Hand Landmarker berhasil disimpan ke IndexedDB.");
//     } catch (error) {
//         console.error("❌ Gagal menyimpan model Hand Landmarker ke IndexedDB:", error);
//     }
// }

// 🟢 Ambil Model Holistic Landmarker dari IndexedDB
// export async function getHolisticModel() {
//     try {
//         const db = await openDB();
//         return new Promise((resolve, reject) => {
//             const transaction = db.transaction(STORE_NAME, "readonly");
//             const store = transaction.objectStore(STORE_NAME);
//             const request = store.get(HOLISTIC_MODEL_KEY);

//             request.onsuccess = () => {
//                 console.log("✅ Model Holistic Landmarker berhasil diambil dari IndexedDB.");
//                 resolve(request.result);
//             };
//             request.onerror = () => {
//                 console.warn("⚠️ Model Holistic Landmarker tidak ditemukan di cache:", request.error);
//                 reject(request.error);
//             };
//         });
//     } catch (error) {
//         console.error("❌ Gagal mengambil model Holistic Landmarker dari IndexedDB:", error);
//         return null;
//     }
// }