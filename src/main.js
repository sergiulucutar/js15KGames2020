var startScreenEl = document.querySelector('.screen-start');
var levelEl = document.querySelector('.level');
var canvas = document.querySelector('canvas');
var game;

window.onload = () => {
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  game = new Game(canvas);
};

function startGame() {
  startScreenEl.classList.add('hidden');
  levelEl.classList.remove('hidden');
  game.loop();
}
