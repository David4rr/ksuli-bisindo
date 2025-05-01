// export const debounce = (func, delay) => {
//     let timeoutId;
//     return function (...args) {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => func.apply(this, args), delay);
//     };
//   };

export default function debounce(func, delay) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}