import {
  Holistic,
  POSE_CONNECTIONS,
  FACEMESH_TESSELATION,
  HAND_CONNECTIONS,
  POSE_LANDMARKS_LEFT,
  POSE_LANDMARKS_RIGHT,
  FACEMESH_FACE_OVAL,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LIPS,
} from "@mediapipe/holistic";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Camera } from "@mediapipe/camera_utils";
import extractKeypoints from "./preprocessLandmark";

function removeLandmarks(results) {
  if (results.poseLandmarks) {
    const indexesToRemove = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22];
    for (const index of indexesToRemove) {
      results.poseLandmarks[index] = null;
    }
  }
}

function connect(
  ctx,
  connectors
) {
  const canvas = ctx.canvas;
  for (const connector of connectors) {
    const from = connector[0];
    const to = connector[1];
    if (from && to) {
      if (from.visibility && to.visibility && (from.visibility < 0.1 || to.visibility < 0.1)) {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
      ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
      ctx.stroke();
    }
  }
}

const setupHolistic = async (
  videoElement,
  canvasElement,
  setFps,
  onKeypointsExtracted
  // getShowLandmarks
) => {
  const canvasCtx = canvasElement.getContext("2d");
  const lastTime = { current: Date.now() };

  const holistic = new Holistic({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
  });

  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    refineFaceLandmarks: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  holistic.onResults((results) => {

    // Periksa apakah kedua tangan terdeteksi
    const leftHandDetected = results.leftHandLandmarks && results.leftHandLandmarks.length > 0;
    const rightHandDetected = results.rightHandLandmarks && results.rightHandLandmarks.length > 0;

    try {
      if (leftHandDetected || rightHandDetected) {
        // Ekstrak keypoints dan lakukan prediksi
        const keypoints = extractKeypoints(results);
        if (typeof onKeypointsExtracted === 'function') {
          onKeypointsExtracted(keypoints);
        }
      } else {
        if (typeof onKeypointsExtracted === 'function') {
          onKeypointsExtracted(null);
        }
      }
    } catch (error) {
      console.error("Error in onKeypointsExtracted:", error);
    }

    // if (leftHandDetected || rightHandDetected) {
    //   // Ekstrak keypoints dan lakukan prediksi
    //   const keypoints = extractKeypoints(results);
    //   if (onKeypointsExtracted) {
    //     onKeypointsExtracted(keypoints); // Panggil callback untuk prediksi
    //   }
    // } else {
    //   // Jika kedua tangan tidak terdeteksi, keluarkan output "Gerakan tidak dikenali"
    //   onKeypointsExtracted(null); // Kirim null untuk menandakan tidak ada prediksi
    // }

    // if (onKeypointsExtracted) {
    //   const keypoints = extractKeypoints(results);
    //   onKeypointsExtracted(keypoints); // Panggil fungsi callback dengan keypoints
    // }

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
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // Face Mesh Landmark
    if (results.faceLandmarks) {
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, { color: 'rgb(0,217,231)' });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, { color: 'rgb(0,217,231)' });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, { color: 'rgb(255,138,0)' });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, { color: 'rgb(255,138,0)' });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0', lineWidth: 5 });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, { color: '#E0E0E0', lineWidth: 5 });
    }

    // Pose Landmark
    canvasCtx.lineWidth = 5;

    if (results.poseLandmarks) {
      if (results.rightHandLandmarks) {
        canvasCtx.strokeStyle = 'white';
        connect(canvasCtx, [
          [results.poseLandmarks[POSE_LANDMARKS_RIGHT.RIGHT_ELBOW], results.rightHandLandmarks[0]],
        ]);
      }
      if (results.leftHandLandmarks) {
        canvasCtx.strokeStyle = 'white';
        connect(canvasCtx, [
          [results.poseLandmarks[POSE_LANDMARKS_LEFT.LEFT_ELBOW], results.leftHandLandmarks[0]],
        ]);
      }
    }

    removeLandmarks(results); // <- panggil fungsi untuk menyembunyikan landmark

    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: 'white' });

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

    // Hands Landmark
    if (results.leftHandLandmarks) {
      drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: 'white' });
      drawLandmarks(canvasCtx, results.leftHandLandmarks, {
        color: 'white', fillColor: 'rgb(255,138,0)',
        lineWidth: 2,
        radius: (data) => {
          // Mengatur radius berdasarkan nilai z
          return Math.max(1, Math.min(10, 10 - data.from.z * 50));
        },
      });
    }

    if (results.rightHandLandmarks) {
      drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: 'white' });
      drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: 'white', fillColor: 'rgb(0,217,231)', lineWidth: 2, radius: (data) => {
          return Math.max(1, Math.min(10, 10 - data.from.z * 50));
        },
      });
    }

    canvasCtx.restore();
    // }

  });

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await holistic.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
  });

  await camera.start();

  return { holistic, camera };
};

export default setupHolistic;
