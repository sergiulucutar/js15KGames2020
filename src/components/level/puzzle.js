class PuzzleGenerator {
  constructor(game) {
    this.game = game;
  }

  generate(party) {
    const characters = this._generateCharacters(party);

    let placeHolderPosition;
    let solutionPosition = Utils.random(0, 3);
    let options = [];

    do {
      placeHolderPosition = Utils.random(0, party.pattern.length - 1);
    } while (
      party.pattern.filter(
        value => party.pattern[placeHolderPosition] === value
      ).length === 1
    );

    options[solutionPosition] = characters[placeHolderPosition].colors;
    options = this._generateRandomOptions(options);
    characters[placeHolderPosition].isPlaceholder = true;

    return {
      characters,
      options,
      solutionPosition
    };
  }

  _generateCharacters(party) {
    let auxPosition, auxCharacter;

    const { pattern } = party,
      protos = [],
      characters = [];

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
        protos[pattern[i]] = auxCharacter;
      }

      characters.push(auxCharacter);
    }

    if (party.twist) {
      switch (party.twist) {
        case 0:
          characters.forEach(
            character => (character.colors.middle = characters[0].colors.middle)
          );
          break;
        case 1:
          characters.forEach(
            character => (character.colors.feet = characters[0].colors.feet)
          );
          break;
      }
    }

    return characters;
  }

  _generateRandomOptions(options) {
    for (let i = 0; i < 4; i++) {
      if (options[i]) {
        continue;
      }
      let config;
      do {
        config = {
          middle: palette[Utils.random(0, palette.length - 1)],
          feet: palette[Utils.random(0, palette.length - 1)]
        };
      } while (
        options.filter(
          el => el.middle === config.middle && el.feet === config.feet
        ).length
      );
      options[i] = config;
    }

    return options;
  }
}
