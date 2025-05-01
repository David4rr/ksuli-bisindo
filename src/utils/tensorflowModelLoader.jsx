import * as tf from "@tensorflow/tfjs";
import { getTensorFlowModel, saveTensorFlowModel } from "./indexedDBHelper";

let model = null;

export async function loadTensorFlowModel() {
    if (model) return model;

        model = await getTensorFlowModel();

        if (!model) {
            console.log("🔄 Model TensorFlow tidak ditemukan di IndexedDB. Memuat model baru...");
            model = await tf.loadLayersModel("/model/model.json");
            await saveTensorFlowModel(model);
        } else {
            console.log("✅ Model TensorFlow berhasil diambil dari IndexedDB.");
        }

    return model;
}
