class Timeline {
  to(callback, time) {
    return new Promise(resolve => {
      callback();
      setTimeout(resolve, time);
    });
  }
}
