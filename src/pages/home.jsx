// import React, { useEffect, useRef, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// import LayoutPage from "../components/layouts/layout";
// // import Button from "../../../learning-react2/src/Components/Elements/Button";

// const HomePage = () => {
//     const [loadCamera, setLoadCamera] = useState(false);
//     const videoRef = useRef(null);

//     useEffect(() => {
//         let stream;

//         const startWebcam = async () => {
//             try {
//                 stream = await navigator.mediaDevices.getUserMedia({
//                     video: true,
//                 });

//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                 }
//             } catch (error) {
//                 console.error("Error accessing webcam:", error);
//             }
//         };

//         startWebcam();
//         setLoadCamera(true);

//         // Cleanup function to stop the camera
//         return () => {
//             if (stream) {
//                 stream.getTracks().forEach((track) => track.stop());
//             }
//             setLoadCamera(false);
//         };
//     }, []);

//     return (
//         <LayoutPage>
//             <div className="flex flex-col flex-1 py-4">
//                 {loadCamera ? (
//                     <div className="rounded-md overflow-hidden relative">
//                         <video
//                             ref={videoRef}
//                             className="w-full max-h-[80svh] object-cover"
//                             autoPlay
//                             playsInline
//                             muted />
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center justify-center flex-1">
//                         <div className="loader"></div>
//                         <p className="mt-4 text-lg text-gray-700">Loading...</p>
//                     </div>
//                 )}
//             </div>
//         </LayoutPage>
//     );
// };

// export default HomePage;

//! ini code backup
// import React, { useRef, useState, useEffect, useCallback } from "react";
// import setupHolistic from "../utils/setupHolistic";
// import LayoutPage from "../components/layouts/layout";
// import { loadTensorFlowModel } from "../utils/tensorflowModelLoader";
// import actions from "../utils/result";
// import * as tf from "@tensorflow/tfjs";

// const threshold = 0.9;

// const HomePage = () => {
//     const [loadCamera, setLoadCamera] = useState(false);
//     const [fps, setFps] = useState(0);
//     const [sentence, setSentence] = useState("");
//     const [probabilities, setProbabilities] = useState([]);

//     const modelRef = useRef(null);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const holisticRef = useRef(null);
//     const cameraRef = useRef(null);
//     const predictionsRef = useRef([]);
//     const predictionHistoryRef = useRef([]);
//     const lastSpokenRef = useRef("");
//     const animationRef = useRef(null);
//     const lastFpsUpdateRef = useRef(0);
//     const frameCountRef = useRef(0);

//     //   const speakText = useCallback((text) => {
//     //     const utterance = new SpeechSynthesisUtterance(text);
//     //     utterance.lang = "id-ID";
//     //     window.speechSynthesis.speak(utterance);
//     //   }, []);

//     const speakText = useCallback((text) => {
//         if (!('speechSynthesis' in window)) {
//             console.warn('Text-to-speech not supported in this browser');
//             return;
//         }

//         const utterance = new SpeechSynthesisUtterance();

//         utterance.text = text;
//         utterance.lang = 'id-ID';
//         utterance.rate = 0.95;
//         utterance.pitch = 1.05;
//         utterance.volume = 1;

//         const getIndonesianVoice = () => {
//             const voices = window.speechSynthesis.getVoices();
//             return voices.find(voice => voice.lang === 'id-ID' || voice.lang.startsWith('id-'));
//         };

//         if (window.speechSynthesis.onvoiceschanged !== undefined) {
//             window.speechSynthesis.onvoiceschanged = () => {
//                 utterance.voice = getIndonesianVoice() || null;
//             };
//         } else {
//             utterance.voice = getIndonesianVoice() || null;
//         }

//         utterance.onerror = (event) => {
//             console.error('Speech synthesis error:', event.error);
//         };
//         window.speechSynthesis.cancel();
//         window.speechSynthesis.speak(utterance);
//     }, []);

//     const calculateFps = useCallback(() => {
//         const now = performance.now();
//         frameCountRef.current++;

//         if (now >= lastFpsUpdateRef.current + 1000) {
//             setFps(Math.round((frameCountRef.current * 1000) / (now - lastFpsUpdateRef.current)));
//             lastFpsUpdateRef.current = now;
//             frameCountRef.current = 0;
//         }

//         animationRef.current = requestAnimationFrame(calculateFps);
//     }, []);

//     const processResults = useCallback((keypoints) => {
//         if (!keypoints) {
//             setSentence(prev => prev === "Gerakan tidak dikenali" ? prev : "Gerakan tidak dikenali");
//             return;
//         }

//         if (!modelRef.current) return;

//         // Store last 30 frames
//         predictionsRef.current = [...predictionsRef.current, keypoints].slice(-30);

//         if (predictionsRef.current.length === 30) {
//             // Use requestAnimationFrame for prediction to avoid blocking UI
//             animationRef.current = requestAnimationFrame(() => {
//                 const inputTensor = tf.tensor([predictionsRef.current]);
//                 const prediction = modelRef.current.predict(inputTensor).dataSync();
//                 inputTensor.dispose();

//                 setProbabilities([...prediction]);

//                 const maxIndex = prediction.indexOf(Math.max(...prediction));
//                 const confidence = prediction[maxIndex];
//                 const currentPrediction = maxIndex;

//                 // Store last 10 predictions for confirmation
//                 predictionHistoryRef.current = [...predictionHistoryRef.current, currentPrediction].slice(-10);

//                 // Check if we have consistent predictions
//                 const uniquePredictions = [...new Set(predictionHistoryRef.current)];
//                 const isConsistentPrediction = uniquePredictions.length === 1;

//                 if (isConsistentPrediction && confidence > threshold) {
//                     const predictedWord = actions[currentPrediction];

//                     if (predictedWord !== lastSpokenRef.current) {
//                         lastSpokenRef.current = predictedWord;
//                         setSentence(predictedWord);
//                         speakText(predictedWord);
//                     }
//                 }
//             });
//         }
//     }, [speakText]);

//     const startCameraAndHolistic = useCallback(async () => {
//         const videoElement = videoRef.current;
//         const canvasElement = canvasRef.current;

//         if (!videoElement || !canvasElement) {
//             console.warn("Video or canvas not ready yet");
//             return;
//         }

//         if (!modelRef.current) {
//             try {
//                 modelRef.current = await loadTensorFlowModel();
//             } catch (error) {
//                 console.error("Gagal memuat model:", error);
//                 return;
//             }
//         }

//         const { holistic, camera } = await setupHolistic(
//             videoElement,
//             canvasElement,
//             setFps,
//             processResults
//         );

//         holisticRef.current = holistic;
//         cameraRef.current = camera;
//         setLoadCamera(true);
//         calculateFps();

//         console.log("Kamera dimulai");
//     }, [processResults, calculateFps]);

//     useEffect(() => {
//         // if (!loadCamera) {
//             startCameraAndHolistic();
//         // }

//         return () => {
//             // cameraRef.current?.stop?.();
//             // holisticRef.current?.close?.();
//             // cancelAnimationFrame(animationRef.current);
//             // window.speechSynthesis.cancel(); 
//             // console.log("Kamera dihentikan dan holistic ditutup");

//             if (cameraRef.current) {
//                 cameraRef.current.stop();
//                 console.log("Kamera dihentikan");
//             }

//             if (holisticRef.current) {
//                 holisticRef.current.close();
//                 console.log("Holistic ditutup");
//             }

//             if (animationRef.current) {
//                 cancelAnimationFrame(animationRef.current);
//             }

//             window.speechSynthesis.cancel();
//             console.log("Resources dibersihkan saat pindah halaman");
//         };

//     }, [startCameraAndHolistic]);

//     return (
//         <LayoutPage>
//             <div className="flex flex-col flex-1 py-4 px-4">
//                 <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300 shadow-md">
//                     <video
//                         ref={videoRef}
//                         className="w-full h-full object-cover"
//                         autoPlay
//                         playsInline
//                         muted
//                         width={1280}
//                         height={720}
//                     />
//                     <canvas
//                         ref={canvasRef}
//                         className="absolute top-0 left-0 w-full h-full z-10"
//                         width={1280}
//                         height={720}
//                     />
//                 </div>

//                 <h2 className="text-sm text-black font-semibold mb-2 mt-4">FPS: {fps}</h2>

//                 <div className="text-lg font-bold text-start text-black">
//                     Hasil Prediksi: {sentence}
//                 </div>

//                 <div className="mt-4">
//                     {sentence !== "Gerakan tidak dikenali" &&
//                         Array.isArray(probabilities) &&
//                         probabilities.map((prob, index) => {
//                             if (prob < 0.1) return null;
//                             const label = actions[index] || `Label ${index}`;
//                             return (
//                                 <div key={index} className="mb-2">
//                                     <div className="flex items-center justify-between">
//                                         <span className="text-lg font-medium text-black">{label}</span>
//                                         <div className="w-1/2 bg-blue-100 rounded-full h-6 relative overflow-hidden">
//                                             <div
//                                                 className="bg-primary h-6 rounded-full text-white text-sm font-semibold flex items-center justify-center transition-all duration-300"
//                                                 style={{ width: `${prob * 100}%` }}
//                                             >
//                                                 {(prob * 100).toFixed(2)}%
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                 </div>
//             </div>
//         </LayoutPage>
//     );
// };

// export default HomePage;

import React, { useRef, useState, useEffect, useCallback } from "react";
import setupHolistic from "../utils/setupHolistic";
import LayoutPage from "../components/layouts/layout";
import { loadTensorFlowModel } from "../utils/tensorflowModelLoader";
import actions from "../utils/result";
import * as tf from "@tensorflow/tfjs";

const threshold = 0.9;

const HomePage = () => {
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
        if (!('speechSynthesis' in window)) {
            console.warn('Text-to-speech not supported in this browser');
            return;
        }

        const utterance = new SpeechSynthesisUtterance();

        utterance.text = text;
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 1;

        const getIndonesianVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            return voices.find(voice => voice.lang === 'id-ID' || voice.lang.startsWith('id-'));
        };

        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => {
                utterance.voice = getIndonesianVoice() || null;
            };
        } else {
            utterance.voice = getIndonesianVoice() || null;
        }

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
        };
        window.speechSynthesis.cancel();
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

        predictionsRef.current = [...predictionsRef.current, keypoints].slice(-30);

        if (predictionsRef.current.length === 30) {
            animationRef.current = requestAnimationFrame(() => {
                const inputTensor = tf.tensor([predictionsRef.current]);
                const prediction = modelRef.current.predict(inputTensor).dataSync();
                inputTensor.dispose();

                setProbabilities([...prediction]);

                const maxIndex = prediction.indexOf(Math.max(...prediction));
                const confidence = prediction[maxIndex];
                const currentPrediction = maxIndex;

                predictionHistoryRef.current = [...predictionHistoryRef.current, currentPrediction].slice(-10);

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

        setLoadCamera(false); // Show loading when starting camera setup

        try {
            const { holistic, camera } = await setupHolistic(
                videoElement,
                canvasElement,
                setFps,
                processResults
            );

            holisticRef.current = holistic;
            cameraRef.current = camera;
            setLoadCamera(true); // Hide loading when setup is complete
            calculateFps();

            console.log("Kamera dimulai");
        } catch (error) {
            console.error("Gagal memulai kamera:", error);
            setLoadCamera(false);
        }
    }, [processResults, calculateFps]);

    useEffect(() => {
        startCameraAndHolistic();

        return () => {
            if (cameraRef.current) {
                cameraRef.current.stop();
                console.log("Kamera dihentikan");
            }

            if (holisticRef.current) {
                holisticRef.current.close();
                console.log("Holistic ditutup");
            }

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            window.speechSynthesis.cancel();
            console.log("Resources dibersihkan saat pindah halaman");
        };
    }, [startCameraAndHolistic]);

    return (
        <LayoutPage>
            <div className="flex flex-col flex-1 py-4 px-4">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300 shadow-md">
                    {!loadCamera && (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-black font-medium">Memuat kamera...</p>
                            </div>
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        className={`w-full h-full object-cover ${!loadCamera ? 'hidden' : ''}`}
                        autoPlay
                        playsInline
                        muted
                    />
                    <canvas
                        ref={canvasRef}
                        className={`absolute top-0 left-0 w-full h-full z-10 ${!loadCamera ? 'hidden' : ''}`}
                        width={1280}
                        height={720}
                    />
                </div>

                {loadCamera ? (
                    <>
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
                    </>
                ) : (
                    <div className="mt-4 text-center text-gray-600">
                        Menyiapkan sistem deteksi...
                    </div>
                )}
            </div>
        </LayoutPage>
    );
};

export default HomePage;