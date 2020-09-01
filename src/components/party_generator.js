class PartyGenerator {
  static generateParty() {
    return patterns[Utils.random(0, patterns.length - 1)];
  }
}

var patterns = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 0, 1, 1],
  [0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0],
  [0, 1, 2, 1, 0],
  [0, 0, 2, 1, 1],
  [0, 1, 2, 0, 1],
  [0, 1, 1, 1, 0]
];
