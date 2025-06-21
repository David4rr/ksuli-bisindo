import React, { useRef, useState, useEffect, useCallback } from "react";
import setupHolistic from "../utils/setupHolistic";
import LayoutPage from "../components/layouts/layout";
import { loadTensorFlowModel } from "../utils/tensorflowModelLoader";
import actions from "../utils/result";
import * as tf from "@tensorflow/tfjs";
import speakText from "../utils/textToSpeech";
import CameraErrorOverlay from "../components/layouts/errorMesages";

const threshold = 0.9;

const HomePage = () => {
    const [loadCamera, setLoadCamera] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [showAlert, setShowAlert] = useState(true);
    const [fps, setFps] = useState(0);
    const [sentence, setSentence] = useState("");
    const [probabilities, setProbabilities] = useState([]);
    const [distance, setDistance] = useState(null);

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
    const distanceHistoryRef = useRef([]);
    const handsFrameRef = useRef(0);

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

    const calculateDistance = useCallback((faceWidthPx) => {
        const SAMPLE = [122.6, 121.5, 123.0, 124.5];
        const KNOWN_FACE_WIDTH = 14.3; // cm
        const KNOWN_DISTANCE = 160; // cm //tadi 120cm
        const MEDIAN_SAMPLE = getMedian(SAMPLE);
        const FOCAL_LENGTH = (MEDIAN_SAMPLE * KNOWN_DISTANCE) / KNOWN_FACE_WIDTH;

        if (faceWidthPx === 0) return 0;
        return (KNOWN_FACE_WIDTH * FOCAL_LENGTH) / faceWidthPx;
    }, []);

    const getMedian = (arr) => {
        const sortedArr = arr.slice().sort((a, b) => a - b);
        const mid = Math.floor(sortedArr.length / 2);
        return sortedArr.length % 2 !== 0 ? sortedArr[mid] : (sortedArr[mid - 1] + sortedArr[mid]) / 2;
    };

    const getFaceWidth = (faceLandmarks, frameWidth) => {
        if (!faceLandmarks || !faceLandmarks[234] || !faceLandmarks[454]) return 0;

        const leftFace = faceLandmarks[234].x * frameWidth;
        const rightFace = faceLandmarks[454].x * frameWidth;

        return Math.abs(rightFace - leftFace);
    };

    const processResults = useCallback(async (keypoints, results) => {
        if (!modelRef.current) return;

        // Distance measurement
        if (results.faceLandmarks) {
            const faceWidthPx = getFaceWidth(results.faceLandmarks, canvasRef.current.width);
            const currentDistance = calculateDistance(faceWidthPx);

            // Smooth distance values
            distanceHistoryRef.current = [...distanceHistoryRef.current, currentDistance].slice(-5);
            const smoothDistance = distanceHistoryRef.current.reduce((a, b) => a + b, 0) / distanceHistoryRef.current.length;

            setDistance(Math.round(smoothDistance));
        }

        if (keypoints === null) {
            handsFrameRef.current += 1;

            // Tunggu 5 frame baru set "tidak dikenali"
            if (handsFrameRef.current >= 15) {
                setSentence(prev => prev === "Gerakan tidak dikenali" ? prev : "Gerakan tidak dikenali");
                predictionHistoryRef.current = []; // Reset history
            }
            return;
        }

        // 3. Reset counter jika tangan terdeteksi
        handsFrameRef.current = 0;

        predictionsRef.current = [...predictionsRef.current, keypoints].slice(-30);

        if (predictionsRef.current.length === 30) {
            await tf.nextFrame();
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
    }, [calculateDistance]);

    const startCameraAndHolistic = useCallback(async () => {
        setCameraError(null);
        setLoadCamera(false);

        if (!navigator.mediaDevices?.getUserMedia) {
            setCameraError("unsupported")
            return;
        }

        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;

        if (!videoElement || !canvasElement) {
            console.warn("Video or canvas not ready yet");
            setCameraError("generic");
            return;
        }

        try {

            if (!modelRef.current) {
                modelRef.current = await loadTensorFlowModel();
            }

            await navigator.mediaDevices.getUserMedia({ video: true })

            const { holistic, camera } = await setupHolistic(
                videoElement,
                canvasElement,
                setFps,
                (keypoints, results) => processResults(keypoints, results)
            );

            holisticRef.current = holistic;
            cameraRef.current = camera;
            setLoadCamera(true);
            calculateFps();
            console.log("Kamera dimulai");

        } catch (error) {
            console.error("Gagal memulai kamera:", error);

            if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
                setCameraError("permission");
            } else if (error.message?.includes("holistic")) {
                setCameraError("holistic");
            } else if (error.message?.includes("model")) {
                setCameraError("model");
            } else {
                setCameraError("generic");
            }
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

            console.log("Resources dibersihkan saat pindah halaman");
        };
    }, [startCameraAndHolistic]);

    // Function to render distance badge
    const renderDistanceBadge = () => {
        if (distance === null) return null;

        let badgeClass = "";
        let badgeText = "";

        if (distance < 80) {
            badgeClass = "badge-error";
            badgeText = "Jarak terlalu dekat";
        } else if (distance >= 80 && distance <= 100) {
            badgeClass = "badge-success";
            badgeText = "Jarak optimal";
        } else {
            badgeClass = "badge-warning";
            badgeText = "Jarak terlalu jauh";
        }

        return (
            <div className={`badge text-sm font-semibold ${badgeClass}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {badgeText} ({distance} cm)
            </div>
        );
    };

    return (
        <LayoutPage>
            <div className="flex flex-col flex-1 py-4">
                {showAlert && (
                    <div role="alert" className="alert alert-vertical sm:alert-horizontal bg-neutral border-transparent my-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-warning h-6 w-6 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-gray-600 text-xl">Pastikan pencahayaan mencukupi, jarak ideal 1 meter dari kamera dengan posisi setengah badan. Tunggu hingga muncul indikator landmark, lalu angkat salah satu tangan untuk memulai deteksi.</span>
                        <div>
                            <button className="btn btn-outline border-secondary text-secondary hover:bg-secondary hover:text-white" onClick={() => setShowAlert(false)}>Tutup</button>
                        </div>
                    </div>
                )}
                <div className="relative aspect-auto md:min-h-[40svh] sm:min-h-[40svh] lg:min-h-[50svh] rounded-md overflow-hidden border border-gray-300 shadow-md">
                    {!loadCamera && (
                        <CameraErrorOverlay errorType={cameraError} onRetry={startCameraAndHolistic} loading={!cameraError} />
                    )}
                    <canvas
                        ref={canvasRef}
                        className={`absolute top-0 left-0 w-full h-full z-20 ${!loadCamera ? 'hidden' : ''}`}
                        width={1280}
                        height={720}
                    />
                    <video
                        ref={videoRef}
                        className={`w-full max-h-[80svh] object-cover ${!loadCamera ? 'hidden' : ''}`}
                        autoPlay
                        playsInline
                        muted
                    />
                </div>

                {loadCamera ? (
                    <>
                        <div className="flex w-auto mb-2 mt-4 gap-2">
                            <div className="badge badge-soft text-sm font-semibold ">FPS: {fps}</div>
                            {renderDistanceBadge()}
                        </div>
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