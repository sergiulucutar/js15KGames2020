var palette = [
  '#993955',
  '#ae76a6',
  '#a3c3d9',
  '#1A5E63',
  '#3B3B58',
  '#323031',
  '#FFF07C'
];

class Character {
  constructor(position) {
    this.thickness = 40;
    this.position = position;
    this.isPlaceholder = false;

    this.alpha = 1;
    this.colors = {
      middle: palette[Utils.random(0, palette.length - 1)],
      feet: palette[Utils.random(0, palette.length - 1)]
    };
  }

  draw(ctx) {
    if (this.isPlaceholder) {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#E9ECF5';
      ctx.fillRect(
        this.position[0] - (this.thickness * this.alpha) / 2,
        this.position[1],
        this.thickness * this.alpha,
        this.thickness * this.alpha * 4.5
      );
      ctx.globalAlpha = 1;
      return;
    }

    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#ffffff';

    ctx.fillRect(
      this.position[0] - (this.thickness * this.alpha) / 2,
      this.position[1],
      this.thickness * this.alpha,
      this.thickness * this.alpha
    );

    ctx.fillStyle = this.colors.middle;
    ctx.fillRect(
      this.position[0] - (this.thickness * this.alpha) / 2,
      this.position[1] + this.thickness * this.alpha,
      this.thickness * this.alpha,
      this.thickness * this.alpha * 2
    );

    ctx.fillStyle = this.colors.feet;
    ctx.fillRect(
      this.position[0] - (this.thickness * this.alpha) / 2,
      this.position[1] + this.thickness * this.alpha * 3,
      this.thickness * this.alpha,
      this.thickness * this.alpha * 1.5
    );

    ctx.globalAlpha = 1;
  }

  clone() {
    const clone = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    return clone;
  }
}
