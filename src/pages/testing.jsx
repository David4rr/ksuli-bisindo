import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Holistic, POSE_CONNECTIONS, FACEMESH_TESSELATION, HAND_CONNECTIONS, POSE_LANDMARKS_LEFT, POSE_LANDMARKS_RIGHT, FACEMESH_FACE_OVAL, FACEMESH_RIGHT_EYE, FACEMESH_RIGHT_EYEBROW, FACEMESH_LEFT_EYE, FACEMESH_LEFT_EYEBROW, FACEMESH_LIPS } from "@mediapipe/holistic";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Camera } from "@mediapipe/camera_utils";
import LayoutPage from "../components/layouts/layout";
import Button from "../../../learning-react2/src/Components/Elements/Button";

const Testing = () => {
  const [loadCamera, setLoadCamera] = useState(false);
  const [fps, setFps] = useState(0);

  const lastTime = useRef(Date.now());
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null);
  const cameraRef = useRef(null);
  const navigate = useNavigate();

  const startCameraAndHolistic = async () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (!videoElement || !canvasElement) {
      console.warn("Video or canvas not ready yet");
      return;
    }

    const canvasCtx = canvasElement.getContext("2d");

    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      effect: 'background',
    });

    holistic.onResults((results) => {

      const now = Date.now();
      const deltaTime = now - lastTime.current;
      lastTime.current = now;

      const calculatedFps = Math.round(1000 / deltaTime);
      setFps(calculatedFps);

      canvasCtx.fillStyle = "lime";
      canvasCtx.font = "24px Arial";
      canvasCtx.fillText(`FPS: ${calculatedFps}`, 10, 30);

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);

      // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
      // drawLandmarks(canvasCtx, results.faceLandmarks, { color: '#FF3030', radius: 1, visibilityMin: 0.1 });
      drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
        { color: '#C0C0C070', lineWidth: 1 });
      drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE,
        { color: 'rgb(0,217,231)' });
      drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW,
        { color: 'rgb(0,217,231)' });
      drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE,
        { color: 'rgb(255,138,0)' });
      drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW,
        { color: 'rgb(255,138,0)' });
      drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL,
        { color: '#E0E0E0', lineWidth: 5 });
      drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_LIPS,
        { color: '#E0E0E0', lineWidth: 5 });

      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: 'white'});
      drawLandmarks(
        canvasCtx,
        Object.values(POSE_LANDMARKS_LEFT)
          .map(index => results.poseLandmarks?.[index])
          .filter(lm => lm && lm.visibility > 0.65),
        {
          color: 'white',
          fillColor: 'rgb(255,138,0)',
        }
      );

      // Landmarks kanan (right)
      drawLandmarks(
        canvasCtx,
        Object.values(POSE_LANDMARKS_RIGHT)
          .map(index => results.poseLandmarks?.[index])
          .filter(lm => lm && lm.visibility > 0.65),
        {
          color: 'white',
          fillColor: 'rgb(0,217,231)',
        }
      );
      // drawLandmarks(canvasCtx, results.poseLandmarks, { color: 'white', radius: 2, });

      drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: 'white' });
      drawLandmarks(canvasCtx, results.leftHandLandmarks, { color: 'white' });

      drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: 'white' });
      drawLandmarks(canvasCtx, results.rightHandLandmarks, { color: 'white' });

      canvasCtx.restore();
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await holistic.send({ image: videoElement });
      },
      width: window.innerWidth,
      height: window.innerHeight,
    });

    camera.start();

    holisticRef.current = holistic;
    cameraRef.current = camera;
    setLoadCamera(true);
    console.log("Camera started");
  };

  useEffect(() => {
    startCameraAndHolistic();
    return () => {
      holisticRef.current?.close();
      cameraRef.current?.stop();
    };
  }, [loadCamera]);

  const handleKamus = () => {
    navigate("/kamus");
  };

  const handleTesting = () => {
    navigate("/");
  };

  return (
    <LayoutPage>
      <div className="flex flex-col flex-1 py-4">
        <h1 className="text-black">Ini Halaman Testing</h1>
        <p className="text-sm text-black bold">FPS: {fps}</p>
        <Button className="bg-blue-600 w-full mb-1" type="button" onClick={handleKamus}>
          Kamus
        </Button>

        <Button className="bg-blue-600 w-full mb-1" type="button" onClick={handleTesting}>
          home
        </Button>

        <div className="rounded-md overflow-hidden relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-20"
            height={720} width={1280}
          />
        </div>
      </div>
    </LayoutPage>
  );
};

export default Testing;
