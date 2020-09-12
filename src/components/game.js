var scoreEl = document.querySelector('.score-level_total');
var levelEl = document.querySelector('.level');
var endEl = document.querySelector('.end');

class Game {
  get score() {
    return this._score;
  }

  set score(value) {
    this._score = value;
    scoreEl.innerText = this.score;
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.lvl = new Level(this);
    this.history = new History();

    this._score = 0;
    this.isMenuShown = false;

    endEl
      .querySelector('button:first-of-type')
      .addEventListener('click', this.resetLevel.bind(this));
  }

  loop() {
    this.update();
    this.draw();

    requestAnimationFrame(() => this.loop.call(this));
  }

  draw() {
    if (!this.isMenuShown) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.lvl.render();
    }
  }

  update() {
    if (!this.isMenuShown) {
      this.lvl.update();
    }
  }

  updateScore(value) {
    this.score += value;
    scoreEl.classList.add('pop');
    scoreLevelEl.classList.add('pop');
    setTimeout(() => scoreLevelEl.classList.remove('pop'), 1000);
    setTimeout(() => {
      scoreEl.classList.remove('pop');
    }, 210);
  }

  gameOver() {
    this.history.set(this.score);

    endEl.querySelector('h2').innerText = this.score;
    endEl.querySelector('.history').innerHTML = this.getHistoryMarkup();

    levelEl.classList.add('hidden');
    endEl.getElementsByClassName.visibility = 'visible';
    endEl.classList.remove('hidden');
  }

  resetLevel() {
    this.score = 0;

    this.lvl = new Level(this);
    levelEl.classList.remove('hidden');
    endEl.classList.add('hidden');
    setTimeout(() => (endEl.getElementsByClassName.visibility = 'hidden'), 300);

    this.isMenuShown = false;
  }

  getHistoryMarkup() {
    let html = '';
    this.history.get().forEach(element => {
      html += `<div><span>${element.score} ${
        element.name ? element.name : ''
      }</span></div>`;
    });
    return html;
  }
}
