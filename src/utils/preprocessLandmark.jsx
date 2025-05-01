// export const extractKeypoints = (results) => {
//     const pose = results.poseLandmarks
//       ? results.poseLandmarks.flatMap((res) => [res.x, res.y, res.z, res.visibility])
//       : new Array(33 * 4).fill(0);
  
//     const face = results.faceLandmarks
//       ? results.faceLandmarks.flatMap((res) => [res.x, res.y, res.z])
//       : new Array(468 * 3).fill(0);
  
//     const lh = results.leftHandLandmarks
//       ? results.leftHandLandmarks.flatMap((res) => [res.x, res.y, res.z])
//       : new Array(21 * 3).fill(0);
  
//     const rh = results.rightHandLandmarks
//       ? results.rightHandLandmarks.flatMap((res) => [res.x, res.y, res.z])
//       : new Array(21 * 3).fill(0);
  
//     const keypoints = [...pose, ...face, ...lh, ...rh];
//     return keypoints; // total 1662 dimensi
//   }

// export default extractKeypoints;

const extractKeypoints = (results) => {
  const pose = results.poseLandmarks ? results.poseLandmarks.flatMap(l => [l.x, l.y, l.z, l.visibility]) : new Array(33 * 4).fill(0);
  const face = results.faceLandmarks ? results.faceLandmarks.flatMap(l => [l.x, l.y, l.z]) : new Array(468 * 3).fill(0);
  const lh = results.leftHandLandmarks ? results.leftHandLandmarks.flatMap(l => [l.x, l.y, l.z]) : new Array(21 * 3).fill(0);
  const rh = results.rightHandLandmarks ? results.rightHandLandmarks.flatMap(l => [l.x, l.y, l.z]) : new Array(21 * 3).fill(0);

  return [...pose, ...face, ...lh, ...rh]; // Total: 132 + 1404 + 63 + 63 = 1662
}

export default extractKeypoints;