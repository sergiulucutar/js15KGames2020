class History {
  constructor() {
    this.localStorageKey = 'scores';
    this.init();
  }

  init() {
    if (!localStorage.key(this.localStorageKey)) {
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify([{ name: '(Greg)', score: 1000 }])
      );
    }
  }

  get() {
    return JSON.parse(localStorage.getItem(this.localStorageKey));
  }

  set(score) {
    const currentScores = this.get() || [];
    score = {
      score
    };

    if (currentScores.length === 4) {
      currentScores[3] = score;
    } else {
      currentScores.push(score);
    }

    currentScores.sort((a, b) => b.score - a.score);
    localStorage.setItem(this.localStorageKey, JSON.stringify(currentScores));
  }

  addGregToAll() {
    const history = this.get();
    history.forEach(entry => (entry['name'] = '(Greg)'));
    localStorage.setItem(this.localStorageKey, JSON.stringify(history));
  }
}
