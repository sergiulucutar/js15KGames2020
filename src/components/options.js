var optionsEl = document.querySelector('.options');

class OptionsGenerator {
  createOptions(puzzle, callback) {
    let optionHtml = '';
    puzzle.options.forEach((option, index) => {
      optionHtml += this._makeOption(option, index);
    });

    optionsEl.innerHTML = optionHtml;
    document.querySelectorAll('.option').forEach(option => {
      option.addEventListener('click', callback);
    });
  }

  _makeOption(option, index) {
    return `
    <button class="option" data-optionId=${index}>
      <svg viewBox="0 0 200 200">
        <rect
          x="80"
          y="20"
          width="40"
          height="40"
          style="fill: #ffffff;"
        />
        <rect
          x="80"
          y="60"
          width="40"
          height="80"
          style="fill: ${option.middle};"
        />
        <rect
          x="80"
          y="120"
          width="40"
          height="60"
          style="fill: ${option.feet};"
        />
      </svg>
    </button>
    `;
  }
}
