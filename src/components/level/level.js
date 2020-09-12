var scoreRoundEl = document.querySelector('.score-level_round');
var scoreLevelEl = document.querySelector('.score-level_text');
var scoreOverlayEl = document.querySelectorAll(
  '.score-level_indicator-overlay'
);

class Level {
  constructor(game) {
    this.game = game;
    this.puzzleGenerator = new PuzzleGenerator(game);
    this.optionsGenerator = new OptionsGenerator();
    this.renderer = new LevelRenderer(game, this);

    this.extras = [];
    this.isIntroPlaying = false;

    this.rounds = 0;
    this.nextRound();
  }

  nextRound() {
    this.rounds++;
    this.points = 100;
    this.puzzle = this.puzzleGenerator.generate(
      PartyGenerator.generateParty(this.rounds)
    );

    this.optionsGenerator.createOptions(
      this.puzzle,
      this.handleOptionSelected.bind(this)
    );
    this.animateIntro();
  }

  reset() {
    this.rounds = 0;
    this.extras = [];
    this.nextRound();
  }

  render() {
    this.renderer.render(this.puzzle);
  }

  update() {
    if (!this.isIntroPlaying) {
      if (this.points > 0) {
        this.points -= Math.log10(this.rounds + 1);

        scoreLevelEl.innerText = Math.round(this.points);
        scoreOverlayEl[0].style = `transform: translateX(${
          100 - Math.round(this.points)
        }%)`;
        scoreOverlayEl[1].style = `transform: translateX(-${
          100 - Math.round(this.points)
        }%)`;
      } else {
        this.triggerGameOver();
      }
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

  handleOptionSelected(event) {
    if (this.isIntroPlaying) {
      return;
    }

    const selectedOption = parseInt(event.target.dataset.optionid);
    if (this.puzzle.solutionPosition === selectedOption) {
      this.isIntroPlaying = true;
      event.target.classList.add('correct');

      this.puzzle.characters.find(
        character => character.isPlaceholder
      ).isPlaceholder = false;

      this.game.updateScore(Math.round(this.points));

      new Promise(resolve => {
        this.renderer.addRenderHook(this.animateVictory(resolve), 'victory');
      })
        .then(() => {
          return new Promise(resolve => {
            this.animateOutro(resolve);
          });
        })
        .then(() => this.nextRound());
    } else {
      event.target.classList.add('incorrect');
      this.triggerGameOver();
    }
  }

  animateIntro() {
    this.isIntroPlaying = true;

    Promise.all(this.addHooksForPreTeleportation())
      .then(() => Promise.all(this.addHooksForTeleportation()))
      .then(() => {
        // position options arrow to match the missing character's position
        document.documentElement.style.cssText = `--placholderArrowPosition: ${
          this.puzzle.characters.find(char => char.isPlaceholder).position[0] -
          optionsEl.getBoundingClientRect().x
        }px`;

        optionsEl.classList.remove('options-hidden');
        scoreRoundEl.classList.remove('hidden');

        this.isIntroPlaying = false;
      });
  }

  animateOutro(done) {
    this.puzzle.characters
      .filter(character => !character.isPlaceholder)
      .forEach(character => {
        this.extras.push(character);
        character.velocity =
          Math.sign(Math.random() * 2 - 1) * Utils.random(15, 20);
      });
    optionsEl.classList.add('options-hidden');
    scoreRoundEl.classList.add('hidden');
    setTimeout(() => done(), 500);
  }

  animateVictory(done) {
    let animationTimingOffset = 0;
    let inReverse = false;

    return () => {
      if (animationTimingOffset <= 0 && inReverse) {
        this.renderer.removeRenderHook('victory');
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
            char.position[1] += 20;
          }
        });

        animationTimingOffset -= 0.1;
      } else {
        this.puzzle.characters.forEach(char => {
          char.position[1] -= 20 * Math.random();
        });

        animationTimingOffset += 0.1;
      }
    };
  }

  addHooksForPreTeleportation() {
    const promises = [];
    this.puzzle.characters.forEach((character, index) => {
      promises.push(
        new Promise(resolve => {
          this.renderer.addRenderHook(
            this.renderer.drawTeleportationPlaceHolder(
              resolve,
              character,
              index
            ),
            `portal${index}`
          );
        })
      );
    });

    return promises;
  }

  addHooksForTeleportation() {
    const promises = [];
    this.puzzle.characters.forEach((character, index) => {
      character.alpha = 0;

      promises.push(
        new Promise(resolve => {
          this.renderer.addRenderHook(
            this.showCharacter.bind(this, resolve, character, index),
            `character${index}`
          );
        })
      );
    });

    return promises;
  }

  showCharacter(done, character, index) {
    if (character.alpha > 0.98) {
      this.renderer.removeRenderHook(`portal${index}`);
      this.renderer.removeRenderHook(`character${index}`);
      done();
    }

    character.alpha += (1 - character.alpha) * 0.1;
  }

  triggerGameOver() {
    this.isIntroPlaying = true;
    this.game.gameOver();
    this.animateOutro(() => {});
  }
}
