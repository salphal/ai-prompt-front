export default class Countdown {
  value: number;
  timer: any;
  callback: (...args: Array<any>) => void;
  duration: number;
  step: number;

  constructor(
    initialValue = 0,
    callback: (count: number) => void,
    duration = 300,
    step = 1
  ) {
    this.value = initialValue;
    this.timer = null;
    this.callback = callback;
    this.duration = duration;
    this.step = step;
  }

  start() {
    this.timer = setInterval(() => {
      if (this.value > 0) {
        this.step ? (this.value -= this.step) : this.value--;

        this.callback(this.value);
      } else {
        this.stop();
      }
    }, this.duration);
  }

  stop() {
    clearInterval(this.timer);
  }
}
