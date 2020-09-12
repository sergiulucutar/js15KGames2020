var palette = [
  '#993955',
  '#ae76a6',
  '#a3c3d9',
  '#1A5E63',
  '#3B3B58',
  '#323031'
];

class Character {
  constructor(position) {
    this.position = position;
    this.thickness = 40;
    this.isPlaceholder = false;

    this.alpha = 1;
    this.colors = {
      middle: palette[Utils.random(0, palette.length - 1)],
      feet: palette[Utils.random(0, palette.length - 1)]
    };
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}
