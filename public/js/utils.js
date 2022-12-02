export const throttle = (fn, period = 500) => {
  let timer = null;
  return (ev) => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      fn(ev);
    }, 500);
  };
}
