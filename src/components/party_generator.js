class PartyGenerator {
  static generateParty(round) {
    let party;

    switch (round) {
      case 1:
        party = { pattern: patterns[0] };
        break;
      case 2:
        party = { pattern: patterns[2] };
        break;
      case 3:
        party = { pattern: patterns[4] };
        break;
      default:
        party = PartyGenerator.ranomParty();
    }

    return party;
  }

  static ranomParty() {
    const party = {
      pattern: patterns[Utils.random(0, patterns.length - 1)]
    };

    if (Math.random() > 0.7) {
      party['twist'] = Utils.random(0, 2);
    }

    return party;
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
  [0, 1, 1, 1, 0]
];
