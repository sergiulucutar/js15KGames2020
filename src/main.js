var canvas = document.querySelector('canvas');
var game;

function loop() {
  game.update();
  game.draw();

  requestAnimationFrame(loop);
}

window.onload = () => {
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  game = new Game(canvas);
  loop();
};
