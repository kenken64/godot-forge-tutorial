window.createWaitingGame = function ({ board, resultElement, newButton, text }) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let cells = Array(9).fill(''), running = false, paused = false, computerTurn = false, timer;
  const buttons = cells.map((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.addEventListener('click', () => {
      if (!running || paused || computerTurn || outcome() || cells[index]) return;
      cells[index] = 'X';
      if (!outcome()) { computerTurn = true; scheduleComputer(); }
      render();
    });
    board.append(button);
    return button;
  });
  function outcome() {
    for (const [a,b,c] of lines) if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) return cells[a] === 'X' ? 'gameWon' : 'gameLost';
    return cells.every(Boolean) ? 'gameDraw' : '';
  }
  function chooseMove() {
    const empty = cells.flatMap((value, i) => value ? [] : [i]);
    for (const mark of ['O', 'X']) for (const index of empty) {
      cells[index] = mark; const wins = outcome(); cells[index] = '';
      if (wins === (mark === 'O' ? 'gameLost' : 'gameWon')) return index;
    }
    return empty.includes(4) ? 4 : empty[Math.floor(Math.random() * empty.length)];
  }
  function scheduleComputer() {
    clearTimeout(timer);
    if (!running || paused || !computerTurn) return;
    timer = setTimeout(() => {
      cells[chooseMove()] = 'O'; computerTurn = false; render();
    }, 350);
  }
  function render() {
    buttons.forEach((button, index) => {
      button.textContent = cells[index];
      button.setAttribute('aria-label', `${index + 1}: ${cells[index] || '—'}`);
      button.disabled = !running || paused || computerTurn || Boolean(outcome()) || Boolean(cells[index]);
    });
    resultElement.textContent = text(paused ? 'gamePaused' : outcome() || (computerTurn ? 'gameWaiting' : 'gameTurn'));
    newButton.disabled = !running || paused;
  }
  newButton.addEventListener('click', () => { clearTimeout(timer); cells = Array(9).fill(''); computerTurn = false; render(); });
  render();
  return {
    render,
    start() { running = true; scheduleComputer(); render(); },
    stop() { running = false; clearTimeout(timer); render(); },
    setPaused(value) { paused = value; clearTimeout(timer); scheduleComputer(); render(); },
  };
};
