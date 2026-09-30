const copy = {
  en: {
    back: '← Learning path', chapter: 'CHAPTER 21 / FINAL GAME', title: 'Build your final game.',
    intro: 'Start with the artwork from the lessons, then assemble your own Godot 2D game in the cloud editor.',
    kitTitle: 'Your starter kit', kitDescription: 'The ZIP contains a Godot project, 83 published module images, seven animation coordinate files, and an asset catalog. It is about 83 MiB.',
    download: 'Download starter ZIP', editorTitle: 'Open it in Godot',
    stepOne: 'Open the Learn Godot Web Editor lesson and start your cloud workspace.', stepTwo: 'The starter project and lesson assets are installed automatically.',
    stepThree: 'Build your game, then download a project ZIP when you want a backup.', openEditor: 'Open cloud editor lesson →',
    saveNote: 'Your project stays on the server while the workspace exists. Stop and delete workspace removes it permanently, so download your project ZIP first.'
  },
  zh: {
    back: '← 学习路径', chapter: '第 21 章 / 最终游戏', title: '构建你的最终游戏。',
    intro: '使用课程中的美术素材作为起点，在云端编辑器中组装你自己的 Godot 2D 游戏。',
    kitTitle: '入门素材包', kitDescription: 'ZIP 包含 Godot 项目、83 个已发布的模块图像、7 个动画坐标文件和素材目录，大小约 83 MiB。',
    download: '下载入门 ZIP', editorTitle: '在 Godot 中打开',
    stepOne: '打开“学习 Godot 网页编辑器”课程，并启动云端工作区。', stepTwo: '服务器会自动安装入门项目和课程素材。',
    stepThree: '制作游戏，需要备份时下载项目 ZIP。', openEditor: '打开云端编辑器课程 →',
    saveNote: '工作区存在时，项目保存在服务器上。“停止并删除工作区”会永久删除项目，请先下载项目 ZIP。'
  },
  ms: {
    back: '← Laluan pembelajaran', chapter: 'BAB 21 / PERMAINAN AKHIR', title: 'Bina permainan akhir anda.',
    intro: 'Mulakan dengan karya seni daripada modul pembelajaran, kemudian bina permainan Godot 2D anda dalam editor awan.',
    kitTitle: 'Kit permulaan anda', kitDescription: 'ZIP ini mengandungi projek Godot, 83 imej modul yang diterbitkan, tujuh fail koordinat animasi dan katalog aset. Saiznya kira-kira 83 MiB.',
    download: 'Muat turun ZIP permulaan', editorTitle: 'Buka dalam Godot',
    stepOne: 'Buka pelajaran Godot Web Editor dan mulakan ruang kerja awan anda.', stepTwo: 'Projek permulaan dan aset pelajaran dipasang secara automatik.',
    stepThree: 'Bina permainan anda, kemudian muat turun ZIP projek apabila mahukan sandaran.', openEditor: 'Buka pelajaran editor awan →',
    saveNote: 'Projek kekal pada pelayan selagi ruang kerja wujud. Henti dan padam ruang kerja akan memadamkannya secara kekal; muat turun ZIP projek dahulu.'
  }
};

Object.assign(copy.en, {
  eyebrow: 'CAPSTONE / GODOT PROJECT',
  intro: 'Build one complete 2D level in the Godot cloud editor, using the characters, art, and systems you made across modules 1–18.',
  briefTitle: 'The one-level challenge', briefBody: 'Create a single journey: start in a safe area, cross a hazard, collect 20 coins, visit a shop, defeat two enemy types and a boss, then make a final choice and reach the credits. Use the same level for solo, local co-op, and online play.',
  briefFreedom: 'Make the story and visual theme your own. Keep the full journey playable from start to finish before adding extra polish.',
  kitDescription: 'The ZIP contains a Godot project, published lesson media, animation coordinate files, and an asset catalog. The project opens on a welcome scene that you will replace with your level.',
  savedAssetsTitle: 'Your saved game assets', savedAssetsDescription: 'Characters, bosses, and asset sheets you generated are separate from the shared ZIP. Download your saved PNG and JSON files here, then add them to your Godot project.',
  assetsLoading: 'Loading saved assets…', assetsEmpty: 'No saved Final Game assets yet. You can still build with the shared kit and add your own PNG files.', assetsError: 'Saved assets could not be loaded. Refresh this page to try again.',
  stepThree: 'Follow the sections below in build order. Run the same level after each section.',
  stepFour: 'For your own PNG and JSON files, use the Files control at the top of the cloud workspace to upload them into assets/my-game, then return to Godot’s FileSystem panel.',
  buildNavLabel: 'Final game build sections', buildTitle: 'Build the game, one section at a time', buildIntro: 'Each section names the earlier modules it brings together and ends with a playable check.', guideLanguageNote: '',
  stepsLabel: 'In Godot', codeLabel: 'Create this GDScript file', treeLabel: 'Scene tree', checkLabel: 'Playtest', copyCode: 'Copy code', copied: 'Copied', walkthroughTitle: 'Logic walkthrough', walkthroughHint: 'Follow the flow, then click a name in the code or select a variable to explain it.', inspectLabel: 'EXPLORE A FUNCTION OR VARIABLE', inspectPlaceholder: 'Choose a name', inspectPrompt: 'Select a name in the code to see what it does in this file.', functionLabel: 'Function', variableLabel: 'Variable', parameterLabel: 'Parameter', apiLabel: 'Godot API', identifierLabel: 'Identifier', contextLabel: 'In this line',
  finishTitle: 'Ready to submit?', finishOne: 'One level plays from its opening story to an ending and credits.', finishTwo: 'Your hero, world, pickups, enemies, boss, interface, and ending use the game assets you made or selected.',
  finishThree: 'Test the same level in solo and local co-op with keyboard and gamepad, then test online guest controls.', finishFour: 'Your shop, achievements, score, leaderboard, settings, and restart flow work.', finishFive: 'Download the finished project ZIP and open the copy to confirm it contains your changes.',
  referencesTitle: 'Godot reference', functionStepsLabel: 'How the code runs'
});
Object.assign(copy.zh, {
  eyebrow: '毕业项目 / GODOT 游戏',
  intro: '在 Godot 云端编辑器中，结合第 1–18 章制作的角色、美术和系统，完成一个完整的 2D 关卡。',
  briefTitle: '单关卡挑战', briefBody: '制作一次完整的冒险：从安全区域出发，跨越危险，收集 20 枚金币，访问商店，击败两种敌人和首领，做出最终选择并展示制作名单。单人、本地合作和在线模式使用同一关卡。',
  briefFreedom: '故事和视觉主题由你决定。先让完整流程可以通关，再添加细节。',
  kitDescription: 'ZIP 包含 Godot 项目、课程素材、动画坐标文件和素材目录。项目打开后会显示欢迎场景，你将用自己的关卡替换它。',
  savedAssetsTitle: '已保存的游戏素材', savedAssetsDescription: '你生成的角色、首领和素材图不在共享 ZIP 中。请在此下载 PNG 和 JSON 文件，再添加到 Godot 项目。',
  assetsLoading: '正在加载素材…', assetsEmpty: '尚无已保存的最终游戏素材。你仍可使用共享素材包及自己的 PNG 文件。', assetsError: '无法加载已保存素材。请刷新页面重试。',
  stepThree: '按下方顺序完成各部分，每完成一部分就运行同一个关卡。',
  stepFour: '要导入自己的 PNG 和 JSON 文件，请使用云端工作区顶部的“Files”控件上传到 assets/my-game，再回到 Godot 的 FileSystem 面板。',
  buildNavLabel: '最终游戏制作部分', buildTitle: '分段完成游戏', buildIntro: '每部分列出对应的早期课程，并以一次可运行的检查结束。', guideLanguageNote: '以下详细 Godot 操作和 GDScript 示例目前以英文提供。',
  stepsLabel: '在 Godot 中操作', codeLabel: '创建此 GDScript 文件', treeLabel: '场景树', checkLabel: '运行检查', copyCode: '复制代码', copied: '已复制', walkthroughTitle: '逻辑流程', walkthroughHint: '先阅读流程，再点击代码中的名称或选中变量查看说明。', inspectLabel: '查看函数或变量', inspectPlaceholder: '选择名称', inspectPrompt: '选中代码中的名称，查看它在此文件中的作用。', functionLabel: '函数', variableLabel: '变量', parameterLabel: '参数', apiLabel: 'Godot API', identifierLabel: '标识符', contextLabel: '所在代码行',
  finishTitle: '准备提交了吗？', finishOne: '同一个关卡可从开场一直玩到结局与制作名单。', finishTwo: '主角、世界、道具、敌人、首领、界面和结局使用你制作或选用的素材。',
  finishThree: '用键盘和手柄测试同一关卡的单人及本地合作模式，再测试在线访客控制。', finishFour: '商店、成就、分数、排行榜、设置和重新开始都能正常工作。', finishFive: '下载最终项目 ZIP，并打开副本确认所有改动都在其中。',
  referencesTitle: 'Godot 参考文档', functionStepsLabel: '代码执行步骤'
});
Object.assign(copy.ms, {
  eyebrow: 'PROJEK AKHIR / GODOT',
  intro: 'Bina satu tahap 2D yang lengkap dalam editor awan Godot menggunakan watak, seni dan sistem daripada modul 1–18.',
  briefTitle: 'Cabaran satu tahap', briefBody: 'Cipta satu perjalanan: bermula di kawasan selamat, lepasi bahaya, kumpul 20 syiling, lawati kedai, kalahkan dua jenis musuh dan bos, kemudian buat pilihan akhir dan paparkan kredit. Gunakan tahap yang sama untuk solo, kerjasama setempat dan permainan dalam talian.',
  briefFreedom: 'Pilih cerita dan tema visual anda sendiri. Pastikan perjalanan lengkap boleh dimainkan sebelum menambah perincian.',
  kitDescription: 'ZIP mengandungi projek Godot, media pelajaran, fail koordinat animasi dan katalog aset. Projek bermula dengan adegan alu-aluan yang akan digantikan dengan tahap anda.',
  savedAssetsTitle: 'Aset permainan tersimpan', savedAssetsDescription: 'Watak, bos dan helaian aset yang anda hasilkan berasingan daripada ZIP bersama. Muat turun fail PNG dan JSON di sini, kemudian masukkan ke projek Godot.',
  assetsLoading: 'Memuatkan aset…', assetsEmpty: 'Tiada aset Permainan Akhir tersimpan lagi. Anda masih boleh menggunakan kit bersama dan fail PNG anda sendiri.', assetsError: 'Aset tersimpan tidak dapat dimuatkan. Muat semula halaman untuk mencuba lagi.',
  stepThree: 'Ikuti bahagian di bawah mengikut turutan dan jalankan tahap yang sama selepas setiap bahagian.',
  stepFour: 'Untuk fail PNG dan JSON anda sendiri, gunakan kawalan Files di bahagian atas ruang kerja awan untuk memuat naiknya ke assets/my-game, kemudian kembali ke panel FileSystem Godot.',
  buildNavLabel: 'Bahagian pembinaan permainan akhir', buildTitle: 'Bina permainan mengikut bahagian', buildIntro: 'Setiap bahagian menunjukkan modul terdahulu yang digabungkan dan berakhir dengan semakan permainan.', guideLanguageNote: 'Arahan Godot terperinci dan contoh GDScript di bawah tersedia dalam bahasa Inggeris buat masa ini.',
  stepsLabel: 'Dalam Godot', codeLabel: 'Cipta fail GDScript ini', treeLabel: 'Pokok adegan', checkLabel: 'Uji permainan', copyCode: 'Salin kod', copied: 'Disalin', walkthroughTitle: 'Aliran logik', walkthroughHint: 'Ikuti aliran ini, kemudian klik nama dalam kod atau pilih pemboleh ubah untuk penerangan.', inspectLabel: 'TEROKA FUNGSI ATAU PEMBOLEH UBAH', inspectPlaceholder: 'Pilih nama', inspectPrompt: 'Pilih nama dalam kod untuk melihat peranannya dalam fail ini.', functionLabel: 'Fungsi', variableLabel: 'Pemboleh ubah', parameterLabel: 'Parameter', apiLabel: 'Godot API', identifierLabel: 'Pengecam', contextLabel: 'Pada baris ini',
  finishTitle: 'Sedia untuk dihantar?', finishOne: 'Satu tahap boleh dimainkan dari permulaan hingga pengakhiran dan kredit.', finishTwo: 'Wira, dunia, item, musuh, bos, antara muka dan pengakhiran menggunakan aset yang anda hasilkan atau pilih.',
  finishThree: 'Uji tahap yang sama secara solo dan kerjasama setempat dengan papan kekunci serta pad permainan, kemudian uji kawalan tetamu dalam talian.', finishFour: 'Kedai, pencapaian, markah, papan kedudukan, tetapan dan fungsi mula semula berfungsi.', finishFive: 'Muat turun ZIP projek siap dan buka salinannya untuk mengesahkan perubahan anda.',
  referencesTitle: 'Rujukan Godot', functionStepsLabel: 'Cara kod berjalan'
});

const guide = window.finalGameGuide || [];
const walkthroughs = window.finalGameWalkthrough || {};
const functionDetails = window.finalGameFunctionDetails || {};
const commonSymbols = window.finalGameCommonSymbols || {};
const moduleSlugs = {
  1: 'character-creation', 2: 'game-assets-creation', 3: 'boss-creation',
  4: 'storyline-engine', 5: 'parallax-tiling-map', 6: 'items-spawning',
  7: 'enemies-ai', 8: 'game-loop-engine', 9: 'game-controls',
  10: 'game-settings', 11: 'game-physics', 12: 'game-ending-cutscene',
  13: 'credits', 14: 'marketplace-system', 15: 'game-achievement',
  16: 'game-leaderboard', 17: 'local-coop', 18: 'multiplayer-game'
};
const navList = document.querySelector('#build-nav-list');
const sections = document.querySelector('#build-sections');
const savedAssets = document.querySelector('#saved-assets');
let currentLocale = 'en';

function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}

const gdscriptKeywords = new Set('extends class_name static func var const if elif else for in while match return pass break continue await signal enum is as and or not self super'.split(' '));
const gdscriptTypes = new Set('void bool int float String StringName Array Dictionary Vector2 Vector3 Color Node Node2D CharacterBody2D Area2D RigidBody2D Control Label Sprite2D AnimatedSprite2D InputEventJoypadButton InputEventJoypadMotion WebSocketPeer FileAccess JSON Input InputMap AudioServer Game'.split(' '));
const gdscriptLiterals = new Set(['true', 'false', 'null']);
const gdscriptTokenPattern = /#[^\n]*|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[A-Za-z_]\w*|\$[A-Za-z_]\w*(?:\/[A-Za-z_]\w*)*|\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?)\b|\b[A-Za-z_]\w*\b/g;

function highlightedGDScript(source) {
  const fragment = document.createDocumentFragment();
  const pattern = new RegExp(gdscriptTokenPattern.source, 'g');
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    const token = match[0];
    const index = match.index;
    if (index > cursor) fragment.append(document.createTextNode(source.slice(cursor, index)));
    let kind = '';
    if (token[0] === '#') kind = 'comment';
    else if (token[0] === '"' || token[0] === "'") kind = 'string';
    else if (token[0] === '@') kind = 'annotation';
    else if (token[0] === '$') kind = 'node';
    else if (/^(?:0x[\da-fA-F]+|\d)/.test(token)) kind = 'number';
    else if (gdscriptLiterals.has(token)) kind = 'literal';
    else if (gdscriptKeywords.has(token)) kind = 'keyword';
    else if (gdscriptTypes.has(token)) kind = 'type';
    else if (/^[A-Z][A-Z0-9_]+$/.test(token)) kind = 'constant';
    else if (/^\s*\(/.test(source.slice(index + token.length))) kind = 'function';
    const selectable = (/^[A-Za-z_]\w*$/.test(token) && !gdscriptKeywords.has(token) && !gdscriptLiterals.has(token)) || token[0] === '$';
    if (selectable && !kind) kind = 'identifier';
    const node = kind ? element('span', `gd-token gd-${kind}`, token) : document.createTextNode(token);
    if (selectable) {
      node.classList.add('gd-symbol');
      node.dataset.symbol = token;
      node.dataset.offset = String(index);
    }
    fragment.append(node);
    cursor = index + token.length;
  }
  if (cursor < source.length) fragment.append(document.createTextNode(source.slice(cursor)));
  return fragment;
}

function declaredSymbols(source) {
  const symbols = new Map();
  let owner = '';
  source.split('\n').forEach((line, index) => {
    const method = line.match(/^\s*(?:static\s+)?func\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/);
    if (method) {
      owner = method[1];
      symbols.set(owner, { kind: 'function', line: index + 1 });
      for (const argument of method[2].split(',')) {
        const name = argument.trim().match(/^([A-Za-z_]\w*)/)?.[1];
        if (name && !symbols.has(name)) symbols.set(name, { kind: 'parameter', line: index + 1, owner });
      }
    }
    const declaration = line.match(/^\s*(?:(?:@export|@onready)\s+)?(?:var|const)\s+([A-Za-z_]\w*)/);
    if (declaration && !symbols.has(declaration[1])) {
      symbols.set(declaration[1], { kind: 'variable', line: index + 1, owner: /^\s/.test(line) ? owner : '' });
    }
  });
  return symbols;
}

function sourceLine(source, offset) {
  const position = Math.max(0, offset);
  const start = source.lastIndexOf('\n', position - 1) + 1;
  const end = source.indexOf('\n', position);
  return source.slice(start, end < 0 ? source.length : end).trim();
}

function selectedCodeName(codeElement) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !codeElement.contains(selection.anchorNode) || !codeElement.contains(selection.focusNode)) return '';
  const name = selection.toString().trim();
  return /^[A-Za-z_]\w*$/.test(name) ? name : '';
}

function createCodeStudy(code, notes, words, fileName) {
  const study = element('div', 'code-study');
  const pre = element('pre', 'gdscript');
  pre.tabIndex = 0;
  const codeElement = element('code');
  codeElement.append(highlightedGDScript(code));
  codeElement.querySelectorAll('.gd-symbol').forEach(token => {
    const description = notes.symbols?.[token.dataset.symbol] || commonSymbols[token.dataset.symbol];
    if (description) token.title = description;
  });
  pre.append(codeElement);

  const panel = element('aside', 'logic-panel');
  panel.append(element('h4', '', words.walkthroughTitle), element('p', 'logic-hint', words.walkthroughHint));
  const flow = element('ol', 'logic-flow');
  (notes.flow || []).forEach(step => flow.append(element('li', '', step)));
  panel.append(flow);
  const selectorLabel = element('label', 'symbol-picker-label', words.inspectLabel);
  const selector = element('select', 'symbol-picker');
  selector.append(element('option', '', words.inspectPlaceholder));
  selector.firstElementChild.value = '';
  selectorLabel.append(selector);
  const details = element('div', 'symbol-detail');
  details.setAttribute('aria-live', 'polite');
  details.append(element('p', 'symbol-prompt', words.inspectPrompt));
  panel.append(selectorLabel, details);

  const declarations = declaredSymbols(code);
  for (const name of Object.keys(notes.symbols || {})) {
    const option = element('option', '', `${name} · ${words[`${declarations.get(name)?.kind || 'identifier'}Label`] || words.identifierLabel}`);
    option.value = name;
    selector.append(option);
  }

  function explain(name, offset = code.indexOf(name)) {
    const info = declarations.get(name);
    const kind = info?.kind || (commonSymbols[name] ? 'api' : 'identifier');
    let explanation = notes.symbols?.[name] || commonSymbols[name];
    if (!explanation && info?.kind === 'parameter') explanation = `This value is passed into ${info.owner}() by its caller or signal.`;
    if (!explanation && info?.kind === 'variable') explanation = `This variable is declared ${info.owner ? `inside ${info.owner}()` : 'for this script'} and stores a value used by the surrounding logic.`;
    if (!explanation && info?.kind === 'function') explanation = 'This function runs when another part of the game calls it or when its connected signal fires.';
    if (!explanation) explanation = 'This name is used in the line below. Read the surrounding function to see where its value comes from and what it changes.';
    details.replaceChildren();
    details.append(element('span', 'symbol-kind', words[`${kind}Label`] || words.identifierLabel), element('h5', '', name), element('p', '', explanation));
    const steps = kind === 'function' ? functionDetails[fileName]?.[name] : null;
    if (steps?.length) {
      details.append(element('h6', 'function-steps-label', words.functionStepsLabel));
      const list = element('ol', 'function-steps');
      steps.forEach(([snippet, reason]) => {
        const item = element('li');
        item.append(element('code', '', snippet), element('p', '', reason));
        list.append(item);
      });
      details.append(list);
    }
    const line = sourceLine(code, offset);
    if (line) {
      const context = element('div', 'symbol-context');
      context.append(element('span', '', words.contextLabel), element('code', '', line));
      details.append(context);
    }
    codeElement.querySelectorAll('.gd-symbol').forEach(token => token.classList.toggle('is-selected', token.dataset.symbol === name));
    selector.value = Object.hasOwn(notes.symbols || {}, name) ? name : '';
    panel.scrollTop += details.getBoundingClientRect().top - panel.getBoundingClientRect().top - 12;
  }

  codeElement.addEventListener('click', event => {
    const selection = selectedCodeName(codeElement);
    if (selection) { explain(selection); return; }
    const token = event.target.closest?.('.gd-symbol');
    if (token) explain(token.dataset.symbol, Number(token.dataset.offset));
  });
  pre.addEventListener('mouseup', () => {
    const name = selectedCodeName(codeElement);
    if (name) explain(name);
  });
  pre.addEventListener('keyup', () => {
    const name = selectedCodeName(codeElement);
    if (name) explain(name);
  });
  selector.addEventListener('change', () => {
    if (!selector.value) return;
    explain(selector.value);
    const token = codeElement.querySelector('.gd-symbol.is-selected');
    if (token) pre.scrollTop += token.getBoundingClientRect().top - pre.getBoundingClientRect().top - pre.clientHeight / 2;
  });

  study.append(pre, panel);
  return study;
}

function renderGuide() {
  navList.replaceChildren();
  sections.replaceChildren();
  const words = copy[currentLocale];
  guide.forEach(section => {
    const item = element('li');
    const link = element('a', '', section.title);
    link.href = `#${section.id}`;
    item.append(link);
    navList.append(item);
    const card = element('section', 'build-section');
    card.id = section.id;
    const modules = element('p', 'module-links');
    section.modules.split(' · ').forEach((part, index) => {
      if (index) modules.append(document.createTextNode(' · '));
      const number = Number(part.match(/^(\d+)\s/)?.[1]);
      if (moduleSlugs[number]) {
        const link = element('a', '', part);
        link.href = `/${moduleSlugs[number]}/`;
        modules.append(link);
      } else {
        modules.append(document.createTextNode(part));
      }
    });
    card.append(modules);
    card.append(element('h2', '', section.title));
    card.append(element('p', 'section-summary', section.summary));
    card.append(element('h3', '', words.stepsLabel));
    const steps = element('ol', 'build-steps');
    section.steps.forEach(step => steps.append(element('li', '', step)));
    card.append(steps);
    if (section.tree) {
      card.append(element('h3', '', words.treeLabel));
      const pre = element('pre', 'scene-tree');
      pre.append(element('code', '', section.tree));
      card.append(pre);
    }
    (section.files || []).forEach(file => {
      const header = element('div', 'code-header');
      header.append(element('h3', '', `${words.codeLabel}: ${file.name}`));
      const button = element('button', 'copy-code', words.copyCode);
      button.type = 'button';
      const code = file.code.replace('__RELAY_URL__', `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws/final-game`);
      button.addEventListener('click', async () => {
        await navigator.clipboard.writeText(code);
        button.textContent = words.copied;
        setTimeout(() => { button.textContent = copy[currentLocale].copyCode; }, 1800);
      });
      header.append(button);
      card.append(header);
      card.append(createCodeStudy(code, walkthroughs[file.name] || {}, words, file.name));
    });
    const check = element('p', 'playtest');
    check.append(element('strong', '', `${words.checkLabel}: `), document.createTextNode(section.check));
    card.append(check);
    sections.append(card);
  });
}

function applyLocale(locale) {
  currentLocale = locale;
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  document.querySelectorAll('[data-copy]').forEach(element => { element.textContent = copy[locale][element.dataset.copy] || ''; });
  document.querySelectorAll('[data-aria-label]').forEach(element => { element.setAttribute('aria-label', copy[locale][element.dataset.ariaLabel]); });
  document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
  document.title = `${copy[locale].title} · Godot Forge`;
  document.querySelector('#guide-language-note').hidden = locale === 'en';
  renderGuide();
}

async function loadSavedAssets() {
  savedAssets.textContent = copy[currentLocale].assetsLoading;
  try {
    const response = await fetch('/api/assets?module=final-game');
    if (!response.ok) throw new Error('Could not load assets');
    const assets = await response.json();
    if (!assets.length) {
      savedAssets.textContent = copy[currentLocale].assetsEmpty;
      return;
    }
    const list = element('ul', 'saved-asset-list');
    assets.forEach(asset => {
      const item = element('li');
      const link = element('a', '', asset.originalName);
      link.href = asset.assetUrl;
      link.download = asset.originalName;
      item.append(link);
      list.append(item);
    });
    savedAssets.replaceChildren(list);
  } catch {
    savedAssets.textContent = copy[currentLocale].assetsError;
  }
}

const savedLocale = localStorage.getItem('godot-forge-locale');
applyLocale(copy[savedLocale] ? savedLocale : 'en');
loadSavedAssets();
document.querySelector('#languages').addEventListener('click', event => {
  const locale = event.target.closest('[data-locale]')?.dataset.locale;
  if (!copy[locale]) return;
  localStorage.setItem('godot-forge-locale', locale);
  applyLocale(locale);
  if (!savedAssets.querySelector('ul')) loadSavedAssets();
});
