// Build small, ordered writing tasks from the tested reference scripts in guide.js.
// The page reveals one chunk at a time; the complete script stays in the reference.
(function () {
  const practice = {
    'scripts/GamepadBindings.gd': 'Change the left-stick dead zone from 0.25 to 0.30. Explain which small stick movements this should ignore. Keep the change for the controller check after Main is connected.',
    'scripts/Player.gd': 'Change speed from 220 to 180, run the Player scene, and compare how far the hero travels in two seconds. Restore your preferred speed.',
    'scripts/Game.gd': 'Change the score earned per coin from 10 to 15. Once Pickup.gd is connected, collect two coins and predict the new score.',
    'scripts/Pickup.gd': 'Duplicate one coin in the Inspector, set its kind to heart, lose one heart, and check that this pickup restores it.',
    'scripts/Hazard.gd': 'Set Player.gd hurt_wait to 1.5 seconds. Walk through a hazard and explain why health does not drop every frame.',
    'scripts/Spawner.gd': 'Change the Timer interval in the Inspector. Predict how many bonus pickups will appear in one minute, then test it.',
    'scripts/Water.gd': 'Try a different linear_damp value and compare how quickly the boulder slows after touching the water.',
    'scripts/Splash.gd': 'Change one tween duration. Run the scene and describe whether the splash now appears or disappears more slowly.',
    'scripts/Enemy.gd': 'Give the two ordinary enemies different patrol limits in the Inspector. Watch each one reverse at its own boundary.',
    'scripts/Main.gd': 'Rewrite the opening Story label for your own game. Run Main and confirm the HUD displays your sentence.',
    'scripts/Online.gd': 'Host a room and join from a second workspace. Move the guest, then explain why only the host decides coin collection and damage.'
  };
  const introduction = {
    kind: 'code', id: 'code:plan:game-stub', sectionId: 'plan', fileName: 'scripts/Game.gd', owner: '', part: 1, totalParts: 1,
    title: 'Create a tiny Game autoload',
    goal: 'Player.gd will read the shared attack bonus. Give it one value now; build the rest of Game.gd when you reach pickups.',
    think: 'Which Godot node can hold one value shared by every scene?',
    hint: 'Use a Node script. Declare attack_bonus as an integer-like value starting at zero, then register the file as an Autoload named Game.',
    code: 'extends Node\n\nvar attack_bonus := 0', coached: true
  };

  function buildFiles(section) {
    if (section.id === 'player') return [...section.files].reverse();
    return section.files || [];
  }

  function codeToAdd(file) {
    if (file.name === 'scripts/Online.gd') {
      const protocol = typeof location !== 'undefined' && location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = typeof location !== 'undefined' ? location.host : 'localhost:3000';
      return file.code.replace('__RELAY_URL__', `${protocol}//${host}/ws/final-game`);
    }
    if (file.name !== 'scripts/Game.gd') return file.code;
    // The learner already typed these lines in the Plan section.
    return file.code.replace(/^extends Node\n\n/, '').replace(/^var attack_bonus := 0\n/m, '');
  }

  function chunks(source) {
    const result = [];
    let lines = [];
    let count = 0;
    let owner = '';
    function flush() {
      const code = lines.join('\n').replace(/^\n+|\n+$/g, '');
      if (code) result.push({ code, owner });
      lines = [];
      count = 0;
    }
    for (const line of source.split('\n')) {
      const functionName = line.match(/^(?:static\s+)?func\s+([A-Za-z_]\w*)\s*\(/)?.[1];
      if (functionName && lines.some(part => part.trim())) flush();
      if (functionName) owner = functionName;
      lines.push(line);
      if (line.trim()) count++;
      if (count >= 5 && !line.trim().endsWith(':')) flush();
    }
    flush();
    return result;
  }

  function skeleton(code) {
    const lines = code.split('\n');
    const position = lines.findIndex(line => /^\s*if\s+.+:$/.test(line));
    const assignment = lines.findIndex(line => /^\s*(?:@(?:export|onready)\s+)?(?:(?:var|const)\s+)?[\w.$]+\s*(?::\s*[\w\[\]]+)?\s*(?::=|=)\s*[^=]/.test(line));
    const returned = lines.findIndex(line => /^\s*return\s+\S/.test(line));
    const call = lines.findIndex(line => /^\s*[\w.$]+\([^()]*\)$/.test(line));
    const index = [position, assignment, returned, call].find(value => value >= 0);
    if (index === undefined) return code;
    if (index === position) lines[index] = lines[index].replace(/^(\s*if\s+).+(:)$/, '$1____$2');
    else if (index === assignment) lines[index] = lines[index].replace(/(:=|=)\s*.+$/, '$1 ____');
    else if (index === returned) lines[index] = lines[index].replace(/^(\s*return\s+).+$/, '$1____');
    else lines[index] = lines[index].replace(/\([^()]*\)$/, '(____)');
    return lines.join('\n');
  }

  function makeTasks(section, notes, functionDetails) {
    const tasks = section.steps.map((body, index) => ({
      kind: 'setup', id: `setup:${section.id}:${index}`, sectionId: section.id,
      title: `Prepare the project · ${index + 1}`, body
    }));
    if (section.id === 'plan') tasks.push(introduction);
    let coinPractice = null;
    for (const file of buildFiles(section)) {
      const displayFileName = file.name.replace(/ \(placeholder.*$/, '');
      const pieces = chunks(codeToAdd(file));
      const counts = new Map();
      for (const piece of pieces) counts.set(piece.owner, (counts.get(piece.owner) || 0) + 1);
      const seen = new Map();
      pieces.forEach((piece, index) => {
        const owner = piece.owner;
        const part = (seen.get(owner) || 0) + 1;
        seen.set(owner, part);
        const matches = (functionDetails[file.name]?.[owner] || [])
          .filter(([snippet]) => piece.code.includes(snippet))
          .map(([, reason]) => reason);
        const summary = notes[file.name]?.symbols?.[owner];
        tasks.push({
          kind: 'code', id: `code:${section.id}:${file.name}:${index}`, sectionId: section.id,
          fileName: file.name, displayFileName, owner, part, totalParts: counts.get(owner), code: piece.code,
          title: owner ? `${owner}() · ${part}/${counts.get(owner)}` : `${displayFileName.split('/').at(-1)} · declarations ${part}/${counts.get(owner)}`,
          goal: summary || (file.name === 'scripts/Game.gd'
            ? 'Continue the Game autoload you started in the Plan section. Add the state needed for coins, score, inventory, and saved progress.'
            : 'Declare the values this script needs before its functions run.'),
          think: owner ? `Before writing, predict what ${owner}() should read, check, or change in this part.` : 'Which values must be stored between frames or shared with another node?',
          hint: matches[0] || summary || 'Use the same node type and names shown in the scene instructions. Watch the indentation as you type.',
          explanations: matches,
          coached: ['plan', 'player', 'pickups'].includes(section.id),
          skeleton: ['combat', 'interface'].includes(section.id) ? skeleton(piece.code) : ''
        });
      });
      if (practice[file.name]) {
        const challenge = {
        kind: 'practice', id: `practice:${section.id}:${file.name}`, sectionId: section.id,
        fileName: file.name, title: `Change ${displayFileName.split('/').at(-1)} yourself`, body: practice[file.name]
        };
        if (file.name === 'scripts/Game.gd') coinPractice = challenge;
        else tasks.push(challenge);
      }
      if (file.name === 'scripts/Pickup.gd' && coinPractice) tasks.push(coinPractice);
    }
    tasks.push({ kind: 'checkpoint', id: `checkpoint:${section.id}`, sectionId: section.id,
      title: 'Playtest this milestone', body: section.check });
    return tasks;
  }

  window.finalGameWriting = { buildFiles, makeTasks, codeToAdd, chunks };
})();
