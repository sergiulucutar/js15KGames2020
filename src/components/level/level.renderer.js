class LevelRenderer {
  constructor(game, level) {
    this.level = level;
    this.ctx = game.ctx;

    this.isIntroPlaying = false;
    this.renderHooks = {};

    this.characteRenderer = new CharacterRenderer(game);
  }

  render(puzzle) {
    Object.values(this.renderHooks).forEach(hook => {
      hook(this.ctx);
    });

    puzzle.characters.forEach(character =>
      this.characteRenderer.render(character)
    );
    this.level.extras.forEach(extra => this.characteRenderer.render(extra));
  }

  drawTeleportationPlaceHolder(done, character) {
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

  addRenderHook(callback, name) {
    this.renderHooks[name] = callback;
  }

  removeRenderHook(name) {
    delete this.renderHooks[name];
  }
}
