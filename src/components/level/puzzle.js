class Puzzle {
  constructor(game) {
    this.game = game;
  }

  isCorrectOption(option) {
    return this.solutionPosition === -1 || this.solutionPosition === option;
  }

  generate() {
    this.characters = [];

    const pattern = PartyGenerator.generateParty();
    const placeHolderPosition = Utils.random(0, pattern.length - 1);
    this._generateCharacters(pattern);

    this.options = [];

    this.solutionPosition = Utils.random(0, 3);

    // If the solution is the one character that is istinct then the others, than consier any charater a good solution
    if (
      pattern.filter(value => pattern[placeHolderPosition] === value).length ===
      1
    ) {
      this.solutionPosition = -1;
    } else {
      this.options[this.solutionPosition] = this.characters[
        placeHolderPosition
      ].colors;
    }
    this._generateRandomOptions();

    this.characters[placeHolderPosition].isPlaceholder = true;
  }

  _generateCharacters(pattern) {
    let auxPosition,
      auxCharacter,
      protos = [];

    for (let i = 0; i < pattern.length; i++) {
      auxPosition = [
        this.game.canvas.width / 2 - pattern.length * 0.4 * 100 + 100 * i,
        this.game.canvas.height * 0.35
      ];

      if (protos[pattern[i]]) {
        auxCharacter = protos[pattern[i]].clone();
        auxCharacter.position = auxPosition;
      } else {
        auxCharacter = new Character(auxPosition);
        protos.push(auxCharacter);
      }

      this.characters.push(auxCharacter);
    }
  }

  _generateRandomOptions() {
    for (let i = 0; i < 4; i++) {
      if (i === this.solutionPosition) {
        continue;
      }
      let config;
      do {
        config = {
          middle: palette[Utils.random(0, palette.length - 1)],
          feet: palette[Utils.random(0, palette.length - 1)]
        };
      } while (
        this.options.filter(
          el => el.middle === config.middle && el.feet === config.feet
        ).length
      );
      this.options[i] = config;
    }
  }
}
