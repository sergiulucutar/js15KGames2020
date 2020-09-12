class CharacterRenderer {
  constructor(game) {
    this.ctx = game.ctx;
  }

  render(character) {
    if (character.isPlaceholder) {
      this.ctx.globalAlpha = character.alpha;
      this.ctx.fillStyle = '#E9ECF5';
      this.ctx.fillRect(
        character.position[0] - (character.thickness * character.alpha) / 2,
        character.position[1],
        character.thickness * character.alpha,
        character.thickness * character.alpha * 4.5
      );
      this.ctx.globalAlpha = 1;
      return;
    }

    this.ctx.globalAlpha = character.alpha;
    this.ctx.fillStyle = '#ffffff';

    this.ctx.fillRect(
      character.position[0] - (character.thickness * character.alpha) / 2,
      character.position[1],
      character.thickness * character.alpha,
      character.thickness * character.alpha
    );

    this.ctx.fillStyle = character.colors.middle;
    this.ctx.fillRect(
      character.position[0] - (character.thickness * character.alpha) / 2,
      character.position[1] + character.thickness * character.alpha,
      character.thickness * character.alpha,
      character.thickness * character.alpha * 2
    );

    this.ctx.fillStyle = character.colors.feet;
    this.ctx.fillRect(
      character.position[0] - (character.thickness * character.alpha) / 2,
      character.position[1] + character.thickness * character.alpha * 3,
      character.thickness * character.alpha,
      character.thickness * character.alpha * 1.5
    );

    this.ctx.globalAlpha = 1;
  }
}
