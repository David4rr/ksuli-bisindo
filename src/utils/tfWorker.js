// import * as tf from '@tensorflow/tfjs';

// let model = null;

// self.addEventListener('message', async (event) => {
//   const {keypoints, type} = event.data;

//   if (type === 'init'){
//     model = await tf.loadLayersModel('/model/model.json');
//     self.postMessage({ type: 'ready'});
//   }

//   if (type === 'predict' && model){
//     const inputTensor = tf.tensor([keypoints]);
//     const prediction = model.predict(inputTensor).dataSync();
//     inputTensor.dispose();

//     // buffer transferable object
//     const buffer = new Float32Array(prediction).buffer;
//     self.postMessage(
//       {type: 'result', prediction: buffer, keypoints: keypoints.buffer},
//       [buffer, keypoints.buffer]
//     );
//   }
//  });

// //! mendekati berhasil
// import * as tf from "@tensorflow/tfjs";

// let model = null;

// console.log("[Worker] Worker started"); // Log init

// self.addEventListener("message", async (event) => {
//   console.log("[Worker] Received message:", event.data.type); // Log pesan masuk

//   try {
//     if (event.data.type === "init") {
//       console.log("[Worker] Loading model...");
//       try {
//         model = await tf.loadLayersModel("/model/model.json");
//         console.log("[Worker] Model loaded successfully");
//         self.postMessage({ type: "ready" });
//       } catch (error) {
//         console.error("[Worker] Failed to load model:", error);
//         self.postMessage({ type: "error", error: error.message });
//       }
//     }

//     if (event.data.type === "predict" && model) {
//       console.log(
//         "[Worker] Received keypoints:",
//         event.data.keypoints.byteLength
//       );

//       const keypoints = new Float32Array(event.data.keypoints);
//       console.log("[Worker] Keypoints length:", keypoints.length); // Harus 30*1662=49860

//       if (keypoints.length !== 30 * 1662) {
//         throw new Error(
//           `[Worker] Invalid input length. Expected 49860, got ${keypoints.length}`
//         );
//       }

//       const inputTensor = tf.tensor(keypoints, [1, 30, 1662]);
//       console.log("[Worker] Tensor shape:", inputTensor.shape);

//       const prediction = model.predict(inputTensor).dataSync();
//       inputTensor.dispose();

//       console.log("[Worker] Prediction result:", prediction.length);

//       const buffer = new Float32Array(prediction).buffer;
//       self.postMessage(
//         {
//           type: "result",
//           prediction: buffer,
//           keypoints: event.data.keypoints,
//         },
//         [buffer, event.data.keypoints]
//       );
//       console.log("[Worker] Sent prediction buffer:", buffer);
//     }
//   } catch (error) {
//     console.error("[Worker] Error:", error);
//     self.postMessage({
//       type: "error",
//       error: error.message,
//     });
//   }
// });

// import * as tf from "@tensorflow/tfjs";

// let model = null;

// console.log("[Worker] Worker started"); // Log init

// self.addEventListener("message", async (event) => {
//   console.log("[Worker] Received message:", event.data.type); // Log pesan masuk

//   try {
//     if (event.data.type === "init") {
//       console.log("[Worker] Loading model...");
//       try {
//         model = await tf.loadLayersModel("/model/model.json");
//         console.log("[Worker] Model loaded successfully");
//         self.postMessage({ type: "ready" });
//       } catch (error) {
//         console.error("[Worker] Failed to load model:", error);
//         self.postMessage({ type: "error", error: error.message });
//       }
//     }

//     if (event.data.type === "predict" && model) {
//       console.log("[Worker] Received keypoints buffer:", event.data.keypoints.byteLength);

//       // Convert buffer to Float32Array
//       const keypoints = new Float32Array(event.data.keypoints);
//       console.log("[Worker] Keypoints length:", keypoints.length); // Harus 30 * 1662 = 49860

//       // Validate input length
//       if (keypoints.length !== 30 * 1662) {
//         throw new Error(`[Worker] Invalid input length. Expected 49860, got ${keypoints.length}`);
//       }

//       // Reshape keypoints to [1, 30, 1662]
//       const inputTensor = tf.tensor(keypoints, [1, 30, 1662]);
//       console.log("[Worker] Tensor shape:", inputTensor.shape);

//       try {
//         // Perform prediction
//         const prediction = model.predict(inputTensor).dataSync();
//         inputTensor.dispose();

//         console.log("[Worker] Prediction result:", prediction); // Log hasil prediksi
//         console.log("[Worker] Prediction result length:", prediction.length);

//         // Send prediction back to main thread
//         const buffer = new Float32Array(prediction).buffer;
//         self.postMessage(
//           {
//             type: "result",
//             prediction: buffer,
//           },
//           [buffer]
//         );
//         console.log("[Worker] Sent prediction buffer:", buffer);
//       } catch (predictionError) {
//         console.error("[Worker] Prediction failed:", predictionError);
//         self.postMessage({
//           type: "error",
//           error: predictionError.message,
//         });
//       }
//     }
//   } catch (error) {
//     console.error("[Worker] Error:", error);
//     self.postMessage({
//       type: "error",
//       error: error.message,
//     });
//   }
// });

// import * as tf from "@tensorflow/tfjs";

// let model = null;

// onmessage = async (event) => {
//   const { type, payload } = event.data;

//   console.log("[Worker] Received message:", type);

//   if (type === "loadModel") {
//     console.log("[Worker] Loading model from:", payload.modelUrl);
//     try {
//       model = await tf.loadLayersModel(payload.modelUrl);
//       console.log("[Worker] Model loaded successfully");
//       postMessage({ type: "modelLoaded" });
//     } catch (error) {
//       console.error("[Worker] Failed to load model:", error.message);
//       postMessage({
//         type: "error",
//         error: `Failed to load model: ${error.message}`,
//       });
//     }
//   } else if (type === "predict" && model) {
//     console.log("[Worker] Received prediction request");
//     try {
//       const inputTensor = tf.tensor(payload.keypoints, [1, 30, 1662]);
//       console.log("[Worker] Tensor shape:", inputTensor.shape);

//       const prediction = model.predict(inputTensor).dataSync();
//       inputTensor.dispose();

//       console.log(
//         "[Worker] Prediction completed. Sending result back to main thread"
//       );
//       postMessage({ type: "prediction", prediction });
//     } catch (error) {
//       console.error("[Worker] Prediction error:", error.message);
//       postMessage({
//         type: "error",
//         error: `Prediction error: ${error.message}`,
//       });
//     }
//   } else {
//     console.warn("[Worker] Unknown message type:", type);
//   }
// };
/**
 * TensorFlow.js Worker for BISINDO Sign Language Recognition
 * This worker handles all TensorFlow.js operations to keep the main thread responsive
 */

// Import TensorFlow.js (must be explicitly imported in web worker context)
// import * as tf from "@tensorflow/tfjs";
// // Actions/classes for prediction
// let actions = [];

// // Model reference
// let model = null;

// // Settings
// const threshold = 0.9;
// const requiredFrames = 30;
// const historySize = 10;

// // State
// let predictionsBuffer = [];
// let predictionHistory = [];
// let lastPredicted = "";

// // Log levels
// const LOG_LEVELS = {
//   DEBUG: 0,
//   INFO: 1,
//   WARN: 2,
//   ERROR: 3
// };

// // Current log level (can be changed via messages)
// let currentLogLevel = LOG_LEVELS.INFO;

// /**
//  * Log messages with severity levels
//  */
// function log(level, ...args) {
//   if (level >= currentLogLevel) {
//     const prefix = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level);
//     console[level === LOG_LEVELS.ERROR ? 'error' : level === LOG_LEVELS.WARN ? 'warn' : level === LOG_LEVELS.INFO ? 'info' : 'debug'](`[TF Worker ${prefix}]`, ...args);

//     // Also send logs back to main thread for centralized logging
//     if (level >= LOG_LEVELS.INFO) {
//       self.postMessage({
//         type: 'log',
//         level: prefix,
//         message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')
//       });
//     }
//   }
// }

// /**
//  * Initialize the worker with actions and model path
//  */
// async function initializeWorker(modelPath, actionsList) {
//   try {
//     log(LOG_LEVELS.INFO, "Initializing TensorFlow.js worker");
//     actions = actionsList;

//     log(LOG_LEVELS.INFO, "Loading model from:", modelPath);
//     model = await tf.loadLayersModel(modelPath);

//     log(LOG_LEVELS.INFO, "Model loaded successfully");
//     log(LOG_LEVELS.DEBUG, "Model summary:", model.summary());

//     // Warm up the model with a dummy tensor
//     const dummyTensor = tf.zeros([1, requiredFrames, 1662]);
//     const warmupResult = model.predict(dummyTensor);
//     warmupResult.dataSync(); // Force execution of the op
//     warmupResult.dispose();
//     dummyTensor.dispose();

//     log(LOG_LEVELS.INFO, "Model warmed up successfully");

//     // Notify main thread that initialization is complete
//     self.postMessage({
//       type: 'initialized',
//       success: true
//     });
//   } catch (error) {
//     log(LOG_LEVELS.ERROR, "Failed to initialize worker:", error);
//     self.postMessage({
//       type: 'initialized',
//       success: false,
//       error: error.message
//     });
//   }
// }

// /**
//  * Process keypoints and make predictions
//  */
// async function processKeypoints(keypoints) {
//   try {
//     if (!model) {
//       log(LOG_LEVELS.ERROR, "Model not loaded yet");
//       return;
//     }

//     if (!keypoints) {
//       self.postMessage({
//         type: 'noHandsDetected'
//       });
//       return;
//     }

//     // Add keypoints to buffer
//     predictionsBuffer.push(keypoints);

//     // Keep only the required number of frames
//     if (predictionsBuffer.length > requiredFrames) {
//       predictionsBuffer.shift();
//     }

//     log(LOG_LEVELS.DEBUG, `Buffer size: ${predictionsBuffer.length}/${requiredFrames}`);

//     // Only predict when we have enough frames
//     if (predictionsBuffer.length === requiredFrames) {
//       log(LOG_LEVELS.DEBUG, "Running prediction");

//       // Use tf.tidy to automatically clean up tensors
//       const results = tf.tidy(() => {
//         // Create input tensor [1, frames, features]
//         const inputTensor = tf.tensor([predictionsBuffer]);

//         // Run prediction
//         const prediction = model.predict(inputTensor);

//         // Get results as array
//         return Array.from(prediction.dataSync());
//       });

//       // Find the class with highest confidence
//       const maxIndex = results.indexOf(Math.max(...results));
//       const confidence = results[maxIndex];

//       // Update prediction history
//       predictionHistory.push(maxIndex);
//       if (predictionHistory.length > historySize) {
//         predictionHistory.shift();
//       }

//       // Check for consistent predictions
//       const uniquePredictions = [...new Set(predictionHistory)];
//       const isConsistentPrediction =
//         predictionHistory.length === historySize &&
//         uniquePredictions.length === 1;

//       log(LOG_LEVELS.DEBUG, `Prediction: ${maxIndex}, Confidence: ${confidence.toFixed(4)}, Consistent: ${isConsistentPrediction}`);

//       // Send prediction results to main thread
//       if (isConsistentPrediction && confidence > threshold) {
//         const predictedWord = actions[maxIndex];

//         if (predictedWord !== lastPredicted) {
//           lastPredicted = predictedWord;

//           log(LOG_LEVELS.INFO, `Predicted word: "${predictedWord}" with confidence ${(confidence * 100).toFixed(2)}%`);

//           self.postMessage({
//             type: 'prediction',
//             word: predictedWord,
//             probabilities: results,
//             confidence: confidence
//           });
//         }
//       }

//       // Always send probability data for visualization
//       self.postMessage({
//         type: 'probabilities',
//         data: results
//       });
//     }
//   } catch (error) {
//     log(LOG_LEVELS.ERROR, "Error processing keypoints:", error);

//     self.postMessage({
//       type: 'error',
//       message: `Error processing keypoints: ${error.message}`
//     });
//   }
// }

// /**
//  * Reset the prediction state
//  */
// function resetState() {
//   predictionsBuffer = [];
//   predictionHistory = [];
//   lastPredicted = "";

//   log(LOG_LEVELS.INFO, "Prediction state reset");

//   self.postMessage({
//     type: 'stateReset'
//   });
// }

// /**
//  * Set logging level
//  */
// function setLogLevel(level) {
//   const newLevel = LOG_LEVELS[level];
//   if (newLevel !== undefined) {
//     currentLogLevel = newLevel;
//     log(LOG_LEVELS.INFO, `Log level set to ${level}`);
//   } else {
//     log(LOG_LEVELS.WARN, `Invalid log level: ${level}`);
//   }
// }

// /**
//  * Handle messages from main thread
//  */
// self.onmessage = async function(event) {
//   const { type, data } = event.data;

//   switch (type) {
//     case 'initialize':
//       await initializeWorker(data.modelPath, data.actions);
//       break;

//     case 'process':
//       await processKeypoints(data.keypoints);
//       break;

//     case 'reset':
//       resetState();
//       break;

//     case 'setLogLevel':
//       setLogLevel(data.level);
//       break;

//     default:
//       log(LOG_LEVELS.WARN, `Unknown message type: ${type}`);
//   }
// };

// Import TensorFlow.js in the worker

// src/workers/predict.worker.js
import * as tf from "@tensorflow/tfjs";

let model = null;

// Fungsi untuk memuat model
const loadModel = async () => {
  try {
    const response = await fetch("/model/model.json");
    model = await tf.loadLayersModel(response.url);
    postMessage({ type: "modelLoaded", status: "success" });
    console.log("Model loaded in worker");
  } catch (error) {
    postMessage({
      type: "modelError",
      error: "Failed to load model",
      details: error.message,
    });
    console.error("Worker: Model load error:", error);
  }
};

// Fungsi untuk melakukan prediksi
const predict = (data) => {
  if (!model) {
    postMessage({
      type: "predictionError",
      error: "Model not loaded",
    });
    return;
  }

  try {
    const inputTensor = tf.tensor([data]);
    const prediction = model.predict(inputTensor).dataSync();
    inputTensor.dispose();

    postMessage({
      type: "predictionResult",
      prediction: Array.from(prediction),
    });
  } catch (error) {
    postMessage({
      type: "predictionError",
      error: "Prediction failed",
      details: error.message,
    });
    console.error("Worker: Prediction error:", error);
  }
};

// Handler untuk pesan dari main thread
self.onmessage = async (event) => {
  const { type, data } = event.data;

  switch (type) {
    case "init":
      console.log("Worker: Initializing...");
      await loadModel();
      break;

    case "predict":
      console.log("Worker: Received prediction request");
      predict(data);
      break;

    default:
      postMessage({
        type: "error",
        error: "Unknown command",
      });
  }
};

// Log saat worker siap
console.log("Worker: Ready");
