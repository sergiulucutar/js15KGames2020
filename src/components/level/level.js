var options = document.querySelector('.options');

var scoreRoundEl = document.querySelector('.score-level_round');
var scoreLevelEl = document.querySelector('.score-level_text');
var scoreOverlayEl = document.querySelectorAll(
  '.score-level_indicator-overlay'
);

class Level {
  constructor(game) {
    this.game = game;

    this.puzzle = new Puzzle(game);

    // animation
    this.isIntroPlaying = false;
    this.renderHooks = {};
    this.extras = [];

    this.init();
  }

  init() {
    this.points = 100;
    this.puzzle.generate();
    this.animateIntro();
    this.displayOptions();
  }

  draw() {
    Object.values(this.renderHooks).forEach(hook => {
      hook(this.game.ctx);
    });

    this.puzzle.characters.forEach(character => {
      character.draw(this.game.ctx);
    });

    this.extras.forEach(extra => {
      extra.draw(this.game.ctx);
    });
  }

  update() {
    if (!this.isIntroPlaying && this.points > 0) {
      this.points -= 1;
      scoreLevelEl.innerText = this.points;
      scoreOverlayEl[0].style = `transform: translateX(${100 - this.points}%)`;
      scoreOverlayEl[1].style = `transform: translateX(-${100 - this.points}%)`;
    }

    this.extras.forEach((extra, index) => {
      if (extra.velocity) {
        extra.position[0] += extra.velocity;
        extra.position[1] =
          extra.position[1] + Math.sin((extra.position[0] / 100) * Math.PI) * 5;

        if (
          extra.position[0] < 0 ||
          extra.position[0] > this.game.canvas.width
        ) {
          this.extras.splice(index, 1);
        }
      }
    });
  }

  displayOptions() {
    let optionHtml = '';
    this.puzzle.options.forEach((option, index) => {
      optionHtml += this.makeOption(option, index); //`<div class="option" data-optionId=${index}>${option[0]}<br />${option[1]}</div>`;
    });

    options.innerHTML = optionHtml;
    document.querySelectorAll('.option').forEach(option => {
      option.addEventListener('click', this.handleOptionSelected.bind(this));
    });
  }

  makeOption(option, index) {
    return `
    <button class="option" data-optionId=${index}>
      <svg viewBox="0 0 200 200">
        <rect
          x="80"
          y="20"
          width="40"
          height="40"
          style="fill: #ffffff;"
        />
        <rect
          x="80"
          y="60"
          width="40"
          height="80"
          style="fill: ${option.middle};"
        />
        <rect
          x="80"
          y="120"
          width="40"
          height="60"
          style="fill: ${option.feet};"
        />
      </svg>
    </button>
    `;
  }

  handleOptionSelected(event) {
    const selectedOption = parseInt(event.target.dataset.optionid);
    if (this.puzzle.isCorrectOption(selectedOption)) {
      this.isIntroPlaying = true;

      this.puzzle.characters.find(
        character => character.isPlaceholder
      ).isPlaceholder = false;

      this.game.updateScore(this.points);

      new Promise(resolve => {
        this.addRenderHook(this.animateVictory(resolve), 'victory');
      })
        .then(() => {
          return new Promise(resolve => {
            this.animateOutro(resolve);
          });
        })
        .then(() => this.init());
    } else {
      console.log('Mai incearca');
    }
  }

  animateIntro() {
    this.isIntroPlaying = true;

    // this.addRenderHook(this.portalRenderer(), 'portal');

    Promise.all(this.drawPlaceHolders())
      .then(() => {
        const promises = [];
        this.puzzle.characters.forEach((character, index) => {
          character.alpha = 0;

          promises.push(
            new Promise(resolve => {
              this.addRenderHook(
                this.showCharacter.bind(this, resolve, character, index),
                `character${index}`
              );
            })
          );
        });

        return Promise.all(promises);
      })
      .then(() => {
        // set options arrow
        document.documentElement.style.cssText = `--placholderArrowPosition: ${
          this.puzzle.characters.find(char => char.isPlaceholder).position[0] -
          options.getBoundingClientRect().x
        }px`;
        options.classList.remove('options-hidden');
        scoreRoundEl.classList.remove('hidden');

        this.isIntroPlaying = false;
      });
  }

  animateOutro(done) {
    this.puzzle.characters.forEach(character => {
      this.extras.push(character);
      character.velocity =
        Math.sign(Math.random() * 2 - 1) * Utils.random(15, 20);
    });
    options.classList.add('options-hidden');
    scoreRoundEl.classList.add('hidden');
    setTimeout(() => done(), 500);
  }

  // Go make more general --> renderer class
  addRenderHook(callback, name) {
    this.renderHooks[name] = callback;
  }

  removeRenderHook(name) {
    delete this.renderHooks[name];
  }

  //try animate joy
  animateVictory(done) {
    let animationTimingOffset = 0;
    let inReverse = false;

    return ctx => {
      if (animationTimingOffset <= 0 && inReverse) {
        this.removeRenderHook('victory');
        done();
      }
      if (animationTimingOffset >= 1) {
        inReverse = true;
      }

      if (inReverse) {
        this.puzzle.characters.forEach(char => {
          if (char.position[1] >= this.game.canvas.height * 0.35) {
            char.position[1] = this.game.canvas.height * 0.35;
          } else {
            char.position[1] += 10;
          }
        });

        animationTimingOffset -= 0.1;
      } else {
        this.puzzle.characters.forEach(char => {
          char.position[1] -= 10 * Math.random();
        });

        animationTimingOffset += 0.1;
      }
    };
  }

  showCharacter(done, character, index) {
    if (character.alpha > 0.98) {
      this.removeRenderHook(`portal${index}`);
      this.removeRenderHook(`character${index}`);
      done();
    }

    character.alpha += (1 - character.alpha) * 0.1;
  }

  drawPlaceHolders() {
    const promises = [];
    this.puzzle.characters.forEach((character, index) => {
      promises.push(
        new Promise(resolve => {
          this.addRenderHook(
            this.drawPlaceHolder(resolve, character, index),
            `portal${index}`
          );
        })
      );
    });

    return promises;
  }

  drawPlaceHolder(done, character) {
    let time = 0;
    character.alpha = 0;

    return ctx => {
      if (time >= 0.6) {
        done();
      } else {
      }
      time += (1 - time) * 0.15;

      ctx.fillStyle = '#E9ECF5';
      ctx.fillRect(
        character.position[0] - (character.thickness / 2) * time,
        character.position[1],
        character.thickness * time,
        character.thickness * 4.5 * time
      );
    };
  }

  // drawPortal(done, position, index) {
  //   let thinkness = 5;
  //   let length = 5;

  //   let value = 0;
  //   let easing = 0;

  //   return ctx => {
  //     if (value >= 1) {
  //       this.removeRenderHook(`portal${index}`);
  //       value = 1;
  //       return;
  //     }

  //     value += 0.055;
  //     easing = 1 - Math.cos((value * Math.PI) / 2);
  //     thinkness = easing * 40;

  //     ctx.fillStyle = '#ffffff';
  //     ctx.fillRect(
  //       position[0] - thinkness / 2,
  //       position[1] - 100 + thinkness * 2,
  //       thinkness,
  //       easing * 200
  //     );
  //   };
  // }
}
