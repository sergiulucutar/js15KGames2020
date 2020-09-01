var scoreEl = document.querySelector('.score-level_total');

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.lvl = new Level(this);

    this.score = 0;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lvl.draw();
  }

  update() {
    this.lvl.update();
  }

  updateScore(value) {
    this.score += value;
    scoreEl.innerText = this.score;
  }
}
