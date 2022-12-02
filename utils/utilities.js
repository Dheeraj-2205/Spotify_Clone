function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function debounce(callBack, delay) {
  let debounceTimer;
  return function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(callBack, delay);
  }
};

export { millisToMinutesAndSeconds, debounce };