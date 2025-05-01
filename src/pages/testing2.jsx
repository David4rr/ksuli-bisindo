// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import setupHolistic from "../utils/setupHolistic";
// import Button from "../../../learning-react2/src/Components/Elements/Button";
// import LayoutPage from "../components/layouts/layout";
// import { loadTensorFlowModel } from "../utils/tensorflowModelLoader";
// import actions from "../utils/result";
// import * as tf from "@tensorflow/tfjs";

// const Testing2 = () => {
//   const [loadCamera, setLoadCamera] = useState(false);
//   const [fps, setFps] = useState(0);
//   const [sentence, setSentence] = useState("");
//   const [probabilities, setProbabilities] = useState([]);
//   const threshold = 0.9;

//   const modelRef = useRef(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const holisticRef = useRef(null);
//   const cameraRef = useRef(null);
//   const predictionsRef = useRef([]);
//   const lastSpokenRef = useRef("");
//   const navigate = useNavigate();

//   // let model;
//   // let holisticModel;

//   const speakText = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "id-ID";
//     window.speechSynthesis.speak(utterance);
//   };

//   // const loadModel = async () => {
//   //   setLoadCamera(false);
//   //   try {
//   //     const lm = await loadTensorFlowModel();
//   //     model = lm;
//   //   } catch (error) {
//   //     console.error("Error loading model:", error);
//   //   }
//   // }

//   useEffect(() => {
//     const processResults = (keypoints) => {
//       if (!modelRef.current) return;

//       predictionsRef.current = [...predictionsRef.current, keypoints].slice(-30);

//       if (predictionsRef.current.length === 30) {
//         const inputTensor = tf.tensor([predictionsRef.current]);
//         const prediction = modelRef.current.predict(inputTensor).dataSync();
//         inputTensor.dispose();

//         setProbabilities([...prediction]);

//         const maxIndex = prediction.indexOf(Math.max(...prediction));
//         const confidence = prediction[maxIndex];

//         if (confidence > threshold) {
//           const predictedWord = actions[maxIndex];
//           if (predictedWord !== lastSpokenRef.current) {
//             lastSpokenRef.current = predictedWord;
//             setSentence((prevSentence) => {
//               // Perbarui hanya jika prediksi baru berbeda
//               if (prevSentence !== predictedWord) {
//                 speakText(predictedWord); // Ucapkan hasil prediksi baru
//                 return predictedWord;
//               }
//               return prevSentence;
//             });
//           }
//         }
//       }
//     };

//     const startCameraAndHolistic = async () => {
//       const videoElement = videoRef.current;
//       const canvasElement = canvasRef.current;

//       if (!videoElement || !canvasElement) {
//         console.warn("Video or canvas not ready yet");
//         return;
//       }

//       if (!modelRef.current) {
//         const model = await loadTensorFlowModel();
//         if (!model) {
//           console.error("Model tidak dimuat");
//           return;
//         }
//         modelRef.current = model;
//       }

//       const { holistic, camera } = await setupHolistic(
//         videoElement,
//         canvasElement,
//         setFps,
//         (keypoints) => processResults(keypoints)
//       );

//       holisticRef.current = holistic;
//       cameraRef.current = camera;
//       setLoadCamera(true);
//       console.log("Kamera dimulai");
//     };

//     if (!loadCamera) {
//       startCameraAndHolistic();
//     }

//     return () => {
//       if (cameraRef.current?.stop) {
//         cameraRef.current.stop();
//       }
//       if (holisticRef.current?.close) {
//         holisticRef.current.close();
//       }
//       console.log("Kamera dihentikan dan holistic ditutup");
//     };
//   }, [loadCamera]);

//   const handleKamus = () => navigate("/kamus");
//   const handleHome = () => navigate("/");

//   return (
//     <LayoutPage>
//       <div className="flex flex-col flex-1 py-4 px-4">
//         <h1 className="text-black text-xl font-bold mb-2">Ini Halaman Testing</h1>
//         <p className="text-sm text-black font-semibold mb-2">FPS: {fps}</p>

//         <Button className="bg-blue-600 w-full mb-2 z-50 relative" type="button" onClick={handleKamus}>
//           Kamus
//         </Button>
//         <Button className="bg-blue-600 w-full mb-4" type="button" onClick={handleHome}>
//           Home
//         </Button>

//         <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300 shadow-md">
//           <video
//             ref={videoRef}
//             className="w-full h-full object-cover"
//             autoPlay
//             playsInline
//             muted
//             width={1280}
//             height={720}
//           />
//           <canvas
//             ref={canvasRef}
//             className="absolute top-0 left-0 w-full h-full z-10"
//             width={1280}
//             height={720}
//           />
//         </div>

//         <div className="text-lg font-bold text-start mt-4 text-black">
//           Hasil Prediksi: {sentence}
//         </div>

//         <div className="mt-4">
//           {Array.isArray(probabilities) && Array.isArray(actions) &&
//             probabilities.map((prob, index) => {
//               if (typeof prob !== "number" || prob < 0.1) return null;
//               const label = actions[index] || `Label ${index}`;
//               return (
//                 <div key={index} className="mb-2">
//                   <div className="flex items-center justify-between">
//                     <span className="text-lg font-medium text-black">{label}</span>
//                     <div className="w-1/2 bg-blue-100 rounded-full h-6 relative overflow-hidden">
//                       <div
//                         className="bg-blue-600 h-6 rounded-full text-white text-sm font-semibold flex items-center justify-center transition-all duration-300"
//                         style={{ width: `${prob * 100}%` }}
//                       >
//                         {(prob * 100).toFixed(2)}%
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//         </div>

//       </div>
//     </LayoutPage>
//   );
// };

// export default Testing2;

// import React, { useRef, useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import setupHolistic from "../utils/setupHolistic";
// import Button from "../../../learning-react2/src/Components/Elements/Button";
// import LayoutPage from "../components/layouts/layout";
// import { loadTensorFlowModel } from "../utils/tensorflowModelLoader";
// import actions from "../utils/result";
// import * as tf from "@tensorflow/tfjs";

// const threshold = 0.9;

// const Testing2 = () => {
//   const [loadCamera, setLoadCamera] = useState(false);
//   const [fps, setFps] = useState(0);
//   const [sentence, setSentence] = useState("");
//   const [probabilities, setProbabilities] = useState([]);

//   const modelRef = useRef(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const holisticRef = useRef(null);
//   const cameraRef = useRef(null);
//   const predictionsRef = useRef([]);
//   const lastSpokenRef = useRef("");
//   const navigate = useNavigate();

//   const speakText = useCallback((text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "id-ID";
//     window.speechSynthesis.speak(utterance);
//   }, []);

//   const processResults = useCallback((keypoints) => {
//     if (!modelRef.current) return;

//     predictionsRef.current = [...predictionsRef.current, keypoints].slice(-30);

//     if (predictionsRef.current.length === 30) {
//       const inputTensor = tf.tensor([predictionsRef.current]);
//       const prediction = modelRef.current.predict(inputTensor).dataSync();
//       inputTensor.dispose();

//       setProbabilities([...prediction]);

//       const maxIndex = prediction.indexOf(Math.max(...prediction));
//       const confidence = prediction[maxIndex];

//       if (confidence > threshold) {
//         const predictedWord = actions[maxIndex];
//         if (predictedWord !== lastSpokenRef.current) {
//           lastSpokenRef.current = predictedWord;
//           setSentence((prev) => {
//             if (prev !== predictedWord) {
//               speakText(predictedWord);
//               return predictedWord;
//             }
//             return prev;
//           });
//         }
//       }
//     }
//   }, [speakText]);

//   const startCameraAndHolistic = useCallback(async () => {
//     const videoElement = videoRef.current;
//     const canvasElement = canvasRef.current;

//     if (!videoElement || !canvasElement) {
//       console.warn("Video or canvas not ready yet");
//       return;
//     }

//     if (!modelRef.current) {
//       try {
//         modelRef.current = await loadTensorFlowModel();
//       } catch (error) {
//         console.error("Gagal memuat model:", error);
//         return;
//       }
//     }

//     const { holistic, camera } = await setupHolistic(
//       videoElement,
//       canvasElement,
//       setFps,
//       processResults
//     );

//     holisticRef.current = holistic;
//     cameraRef.current = camera;
//     setLoadCamera(true);
//     console.log("Kamera dimulai");
//   }, [processResults]);

//   useEffect(() => {
//     if (!loadCamera) {
//       startCameraAndHolistic();
//     }

//     return () => {
//       cameraRef.current?.stop?.();
//       holisticRef.current?.close?.();
//       console.log("Kamera dihentikan dan holistic ditutup");
//     };
//   }, [loadCamera, startCameraAndHolistic]);

//   return (
//     <LayoutPage>
//       <div className="flex flex-col flex-1 py-4 px-4">
//         <h1 className="text-black text-xl font-bold mb-2">Ini Halaman Testing</h1>
//         <p className="text-sm text-black font-semibold mb-2">FPS: {fps}</p>

//         <Button className="bg-blue-600 w-full mb-2 z-50 relative" onClick={() => navigate("/kamus")}>
//           Kamus
//         </Button>
//         <Button className="bg-blue-600 w-full mb-4" onClick={() => navigate("/")}>
//           Home
//         </Button>

//         <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300 shadow-md">
//           <video
//             ref={videoRef}
//             className="w-full h-full object-cover"
//             autoPlay
//             playsInline
//             muted
//             width={1280}
//             height={720}
//           />
//           <canvas
//             ref={canvasRef}
//             className="absolute top-0 left-0 w-full h-full z-10"
//             width={1280}
//             height={720}
//           />
//         </div>

//         <div className="text-lg font-bold text-start mt-4 text-black">
//           Hasil Prediksi: {sentence}
//         </div>

//         <div className="mt-4">
//           {probabilities.map((prob, index) => {
//             if (prob < 0.1) return null;
//             const label = actions[index] || `Label ${index}`;
//             return (
//               <div key={index} className="mb-2">
//                 <div className="flex items-center justify-between">
//                   <span className="text-lg font-medium text-black">{label}</span>
//                   <div className="w-1/2 bg-blue-100 rounded-full h-6 relative overflow-hidden">
//                     <div
//                       className="bg-blue-600 h-6 rounded-full text-white text-sm font-semibold flex items-center justify-center transition-all duration-300"
//                       style={{ width: `${prob * 100}%` }}
//                     >
//                       {(prob * 100).toFixed(2)}%
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </LayoutPage>
//   );
// };

// export default Testing2;

//! code ini paling mendekati sempurna
// import React, { useRef, useState, useEffect, useCallback } from "react";
// import setupHolistic from "../utils/setupHolistic";
// import LayoutPage from "../components/layouts/layout";
// import { loadTensorFlowModel } from "../utils/tensorflowModelLoader";
// import actions from "../utils/result";
// import * as tf from "@tensorflow/tfjs";
// // import debounce from "../utils/debounce";

// const threshold = 0.9;

// const Testing2 = () => {
//   const [loadCamera, setLoadCamera] = useState(false);
//   const [fps, setFps] = useState(0);
//   const [sentence, setSentence] = useState("");
//   const [probabilities, setProbabilities] = useState([]);

//   const modelRef = useRef(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const holisticRef = useRef(null);
//   const cameraRef = useRef(null);
//   const predictionsRef = useRef([]);
//   const predictionHistoryRef = useRef([]);
//   const lastSpokenRef = useRef("");
//   const speakText = useCallback((text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "id-ID";
//     window.speechSynthesis.speak(utterance);
//   }, []);

//   // const processResults = useCallback((keypoints) => {
//   //   if (!keypoints) {
//   //     setSentence((prev) => (prev === "Gerakan tidak dikenali" ? prev : "Gerakan tidak dikenali"));
//   //     return;
//   //   }

//   //   if (!modelRef.current) return;

//   //   predictionsRef.current = [...predictionsRef.current, keypoints].slice(-30);

//   //   if (predictionsRef.current.length === 30) {
//   //     const inputTensor = tf.tensor([predictionsRef.current]);
//   //     const prediction = modelRef.current.predict(inputTensor).dataSync();
//   //     inputTensor.dispose();

//   //     setProbabilities([...prediction]);

//   //     const maxIndex = prediction.indexOf(Math.max(...prediction));
//   //     const confidence = prediction[maxIndex];

//   //     if (confidence > threshold) {
//   //       const predictedWord = actions[maxIndex];
//   //       if (predictedWord !== lastSpokenRef.current) {
//   //         lastSpokenRef.current = predictedWord;
//   //         setSentence((prev) => {
//   //           if (prev !== predictedWord) {
//   //             speakText(predictedWord);
//   //             return predictedWord;
//   //           }
//   //           return prev;
//   //         });
//   //       }
//   //     }
//   //   }
//   // }, [speakText]);

//   const processResults = useCallback((keypoints) => {
//     if (!keypoints) {
//       setSentence(prev => prev === "Gerakan tidak dikenali" ? prev : "Gerakan tidak dikenali");
//       return;
//     }

//     if (!modelRef.current) return;

//     // Store last 30 frames
//     predictionsRef.current = [...predictionsRef.current, keypoints].slice(-30);
//     const sequence = predictionsRef.current;

//     if (sequence.length === 30) {
//       // Make prediction
//       const inputTensor = tf.tensor([sequence]);
//       const prediction = modelRef.current.predict(inputTensor).dataSync();
//       inputTensor.dispose();

//       setProbabilities([...prediction]);

//       const maxIndex = prediction.indexOf(Math.max(...prediction));
//       const confidence = prediction[maxIndex];
//       const currentPrediction = maxIndex;

//       // Store last 10 predictions for confirmation
//       predictionHistoryRef.current = [...predictionHistoryRef.current, currentPrediction].slice(-10);

//       // Check if we have consistent predictions
//       const isConsistentPrediction = predictionHistoryRef.current.every(
//         val => val === currentPrediction
//       );

//       if (isConsistentPrediction && confidence > threshold) {
//         const predictedWord = actions[currentPrediction];

//         if (predictedWord !== lastSpokenRef.current) {
//           lastSpokenRef.current = predictedWord;
//           setSentence(predictedWord);
//           speakText(predictedWord);
//         }
//       }
//     }
//   }, [speakText]);

//   const startCameraAndHolistic = useCallback(async () => {
//     const videoElement = videoRef.current;
//     const canvasElement = canvasRef.current;

//     if (!videoElement || !canvasElement) {
//       console.warn("Video or canvas not ready yet");
//       return;
//     }

//     if (!modelRef.current) {
//       try {
//         modelRef.current = await loadTensorFlowModel();
//       } catch (error) {
//         console.error("Gagal memuat model:", error);
//         return;
//       }
//     }

//     const { holistic, camera } = await setupHolistic(
//       videoElement,
//       canvasElement,
//       setFps,
//       processResults
//     );

//     holisticRef.current = holistic;
//     cameraRef.current = camera;
//     setLoadCamera(true);

//     console.log("Kamera dimulai");
//   }, [processResults]);

//   useEffect(() => {
//     if (!loadCamera) {
//       startCameraAndHolistic();
//     }

//     return () => {
//       cameraRef.current?.stop?.();
//       holisticRef.current?.close?.();
//       console.log("Kamera dihentikan dan holistic ditutup");
//     };
//   }, [loadCamera, startCameraAndHolistic]);

//   return (
//     <LayoutPage>
//       <div className="flex flex-col flex-1 py-4 px-4">
//         <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300 shadow-md">
//           <video
//             ref={videoRef}
//             className="w-full h-full object-cover"
//             autoPlay
//             playsInline
//             muted
//             width={1280}
//             height={720}
//           />
//           <canvas
//             ref={canvasRef}
//             className="absolute top-0 left-0 w-full h-full z-10"
//             width={1280}
//             height={720}
//           />
//         </div>

//         <h2 className="text-sm text-black font-semibold mb-2 mt-4">FPS: {fps}</h2>

//         <div className="text-lg font-bold text-start text-black">
//           Hasil Prediksi: {sentence}
//         </div>

//         <div className="mt-4">
//           {sentence !== "Gerakan tidak dikenali" && // Hanya tampilkan progress bar jika gerakan dikenali
//             Array.isArray(probabilities) &&
//             probabilities.map((prob, index) => {
//               if (prob < 0.1) return null; // Abaikan probabilitas rendah
//               const label = actions[index] || `Label ${index}`;
//               return (
//                 <div key={index} className="mb-2">
//                   <div className="flex items-center justify-between">
//                     <span className="text-lg font-medium text-black">{label}</span>
//                     <div className="w-1/2 bg-blue-100 rounded-full h-6 relative overflow-hidden">
//                       <div
//                         className="bg-primary h-6 rounded-full text-white text-sm font-semibold flex items-center justify-center transition-all duration-300"
//                         style={{ width: `${prob * 100}%` }}
//                       >
//                         {(prob * 100).toFixed(2)}%
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//         </div>
//       </div>
//     </LayoutPage>
//   );
// };

// export default Testing2;

import React, { useRef, useState, useEffect, useCallback } from "react";
import setupHolistic from "../utils/setupHolistic";
import LayoutPage from "../components/layouts/layout";
import { loadTensorFlowModel } from "../utils/tensorflowModelLoader";
import actions from "../utils/result";
import * as tf from "@tensorflow/tfjs";

const threshold = 0.9;

const Testing2 = () => {
  const [loadCamera, setLoadCamera] = useState(false);
  const [fps, setFps] = useState(0);
  const [sentence, setSentence] = useState("");
  const [probabilities, setProbabilities] = useState([]);

  const modelRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null);
  const cameraRef = useRef(null);
  const predictionsRef = useRef([]);
  const predictionHistoryRef = useRef([]);
  const lastSpokenRef = useRef("");
  const animationRef = useRef(null);
  const lastFpsUpdateRef = useRef(0);
  const frameCountRef = useRef(0);

  const speakText = useCallback((text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    window.speechSynthesis.speak(utterance);
  }, []);

  const calculateFps = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;

    if (now >= lastFpsUpdateRef.current + 1000) {
      setFps(Math.round((frameCountRef.current * 1000) / (now - lastFpsUpdateRef.current)));
      lastFpsUpdateRef.current = now;
      frameCountRef.current = 0;
    }

    animationRef.current = requestAnimationFrame(calculateFps);
  }, []);

  const processResults = useCallback((keypoints) => {
    if (!keypoints) {
      setSentence(prev => prev === "Gerakan tidak dikenali" ? prev : "Gerakan tidak dikenali");
      return;
    }

    if (!modelRef.current) return;

    // Store last 30 frames
    predictionsRef.current = [...predictionsRef.current, keypoints].slice(-30);

    if (predictionsRef.current.length === 30) {
      // Use requestAnimationFrame for prediction to avoid blocking UI
      animationRef.current = requestAnimationFrame(() => {
        const inputTensor = tf.tensor([predictionsRef.current]);
        const prediction = modelRef.current.predict(inputTensor).dataSync();
        inputTensor.dispose();

        setProbabilities([...prediction]);

        const maxIndex = prediction.indexOf(Math.max(...prediction));
        const confidence = prediction[maxIndex];
        const currentPrediction = maxIndex;

        // Store last 10 predictions for confirmation
        predictionHistoryRef.current = [...predictionHistoryRef.current, currentPrediction].slice(-10);

        // Check if we have consistent predictions
        const uniquePredictions = [...new Set(predictionHistoryRef.current)];
        const isConsistentPrediction = uniquePredictions.length === 1;

        if (isConsistentPrediction && confidence > threshold) {
          const predictedWord = actions[currentPrediction];

          if (predictedWord !== lastSpokenRef.current) {
            lastSpokenRef.current = predictedWord;
            setSentence(predictedWord);
            speakText(predictedWord);
          }
        }
      });
    }
  }, [speakText]);

  const startCameraAndHolistic = useCallback(async () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (!videoElement || !canvasElement) {
      console.warn("Video or canvas not ready yet");
      return;
    }

    if (!modelRef.current) {
      try {
        modelRef.current = await loadTensorFlowModel();
      } catch (error) {
        console.error("Gagal memuat model:", error);
        return;
      }
    }

    const { holistic, camera } = await setupHolistic(
      videoElement,
      canvasElement,
      setFps,
      processResults // Removed setFps from here since we're calculating it differently
    );

    holisticRef.current = holistic;
    cameraRef.current = camera;
    setLoadCamera(true);

    // Start FPS calculation
    calculateFps();

    console.log("Kamera dimulai");
  }, [processResults, calculateFps]);

  useEffect(() => {
    if (!loadCamera) {
      startCameraAndHolistic();
    }

    return () => {
      cameraRef.current?.stop?.();
      holisticRef.current?.close?.();
      cancelAnimationFrame(animationRef.current);
      console.log("Kamera dihentikan dan holistic ditutup");
    };
  }, [loadCamera, startCameraAndHolistic]);

  return (
    <LayoutPage>
      <div className="flex flex-col flex-1 py-4 px-4">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300 shadow-md">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            width={1280}
            height={720}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-10"
            width={1280}
            height={720}
          />
        </div>

        <h2 className="text-sm text-black font-semibold mb-2 mt-4">FPS: {fps}</h2>

        <div className="text-lg font-bold text-start text-black">
          Hasil Prediksi: {sentence}
        </div>

        <div className="mt-4">
          {sentence !== "Gerakan tidak dikenali" &&
            Array.isArray(probabilities) &&
            probabilities.map((prob, index) => {
              if (prob < 0.1) return null;
              const label = actions[index] || `Label ${index}`;
              return (
                <div key={index} className="mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-black">{label}</span>
                    <div className="w-1/2 bg-blue-100 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-primary h-6 rounded-full text-white text-sm font-semibold flex items-center justify-center transition-all duration-300"
                        style={{ width: `${prob * 100}%` }}
                      >
                        {(prob * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </LayoutPage>
  );
};

export default Testing2;