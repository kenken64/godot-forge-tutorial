const slug = 'game-controls';
const learnerId = (() => { const key = 'godot-forge-learner-id'; let value = localStorage.getItem(key); if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); } return value; })();
const copy = {
  en: { titleBar: 'Gamepad Controls', back: '← GODOT FORGE / LEARNING PATH', chapter: 'CHAPTER 09 / GAMEPAD CONTROLS', language: 'Language', learningGoalsAria: 'Learning goals', playtestAria: 'Playable gamepad test game', homeGuideAria: 'Home or guide, Button 17', introEyebrow: 'PLAYER INPUT / INTERACTIVE LAB', title: 'Make the controller yours.', intro: 'Connect a gamepad to see live input, then customize the buttons for your game actions in Settings.', settings: 'SETTINGS', learnOneTag: '01 / DETECT', learnOneTitle: 'Find the controller', learnOneCopy: 'The browser reports gamepad connection state and input each frame.', learnTwoTag: '02 / VISUALIZE', learnTwoTitle: 'See every press', learnTwoCopy: 'Pressed buttons and stick movement light up on the controller diagram.', learnThreeTag: '03 / REMAP', learnThreeTitle: 'Choose your controls', learnThreeCopy: 'Assign gamepad buttons or stick directions to actions and save the mapping on this device.', labEyebrow: 'LIVE GAMEPAD VISUALIZER', labTitle: 'Press a button to see it light up.', disconnected: 'NO CONTROLLER CONNECTED', connected: 'CONTROLLER CONNECTED', controller: 'CONTROLLER 01', defaultMapping: 'DEFAULT MAPPING', customMapping: 'CUSTOM MAPPING', legendPressed: 'PRESSED', legendMapped: 'MAPPED ACTION', inputEyebrow: 'INPUT FEEDBACK', inputTitle: 'Nothing pressed yet.', inputCopy: 'Connect a controller, or click any button on the diagram to try the visualizer.', actionLabel: 'MAPPED ACTION', leftStick: 'LS', rightStick: 'RS', completion: 'Test a controller input and customize at least one action mapping to complete this module.', complete: 'COMPLETE MODULE', completed: 'MODULE COMPLETE ✓', reopen: 'REOPEN MODULE', needInput: 'Test a gamepad input and customize a mapping to complete this module.', saved: 'Gamepad controls progress saved.', saveError: 'Could not save progress. Please try again.', settingsEyebrow: 'PLAYER OPTIONS / INPUT', settingsTitle: 'Customize gamepad', settingsDescription: 'Choose a button or left-stick direction for each game action, or listen for the next physical input.', settingsNote: 'Mappings save automatically on this device. Use Listen, then press a physical button or move the left stick.', resetDefaults: 'RESET DEFAULTS', done: 'DONE', closeSettings: 'Close settings', listen: 'LISTEN', waiting: 'PRESS / MOVE INPUT', resetToast: 'Default gamepad mapping restored.', mappingToast: 'Control mapping saved.', pressToast: 'Button input detected.', noController: 'No controller detected. Choose an input from the menu or connect one and press Listen.', buttonPressed: 'Button pressed', mappingNeeded: 'Map at least one action to a gamepad input.', actions: { moveLeft: 'Move left', moveRight: 'Move right', jump: 'Jump', crouchRoll: 'Crouch / roll', attack: 'Attack' }, buttons: ['A / Cross · Button 1', 'B / Circle · Button 2', 'X / Square · Button 3', 'Y / Triangle · Button 4', 'LB · Button 5', 'RB · Button 6', 'LT · Button 7', 'RT · Button 8', 'Back / Select · Button 9', 'Start · Button 10', 'Left stick press · Button 11', 'Right stick press · Button 12', 'D-pad up · Button 13', 'D-pad down · Button 14', 'D-pad left · Button 15', 'D-pad right · Button 16'], axisButtons: ['Left stick left · X axis −', 'Left stick right · X axis +'], axisNames: ['Left stick left', 'Left stick right'], inputNames: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'BACK', 'START', 'L3', 'R3', 'UP', 'DOWN', 'LEFT', 'RIGHT'] },
  zh: { titleBar: '游戏手柄控制', back: '← GODOT FORGE / 学习路径', chapter: '第 09 章 / 游戏手柄控制', language: '语言', learningGoalsAria: '学习目标', playtestAria: '可游玩的手柄测试游戏', homeGuideAria: '主页或指南键 · 按钮 17', introEyebrow: '玩家输入 / 互动实验室', title: '自定义你的手柄。', intro: '连接游戏手柄以查看实时输入，然后在设置中为游戏动作自定义按键。', settings: '设置', learnOneTag: '01 / 检测', learnOneTitle: '检测手柄', learnOneCopy: '浏览器会逐帧报告手柄连接状态和输入。', learnTwoTag: '02 / 可视化', learnTwoTitle: '查看每次按键', learnTwoCopy: '按下的按钮和摇杆移动会在手柄示意图中亮起。', learnThreeTag: '03 / 重新映射', learnThreeTitle: '选择你的控制方式', learnThreeCopy: '为动作分配手柄按键或摇杆方向，并将映射保存在此设备上。', labEyebrow: '实时手柄可视化', labTitle: '按下按钮，查看它亮起。', disconnected: '未连接手柄', connected: '手柄已连接', controller: '手柄 01', defaultMapping: '默认映射', customMapping: '自定义映射', legendPressed: '已按下', legendMapped: '已映射动作', inputEyebrow: '输入反馈', inputTitle: '尚未检测到输入。', inputCopy: '连接手柄，或点击示意图中的按钮来试用可视化效果。', actionLabel: '映射动作', leftStick: '左摇杆', rightStick: '右摇杆', completion: '测试一次手柄输入，并至少自定义一个动作映射，即可完成本模块。', complete: '完成模块', completed: '模块已完成 ✓', reopen: '重新打开模块', needInput: '请测试手柄输入并自定义映射以完成本模块。', saved: '游戏手柄控制进度已保存。', saveError: '无法保存进度，请重试。', settingsEyebrow: '玩家选项 / 输入', settingsTitle: '自定义游戏手柄', settingsDescription: '为每个游戏动作选择按钮或左摇杆方向，或监听实体手柄的下一次输入。', settingsNote: '映射会自动保存在此设备上。点击“监听”，然后按下实体按钮或移动左摇杆。', resetDefaults: '恢复默认值', done: '完成', closeSettings: '关闭设置', listen: '监听', waiting: '按键 / 移动摇杆', resetToast: '已恢复默认手柄映射。', mappingToast: '控制映射已保存。', pressToast: '已检测到按键输入。', noController: '未检测到手柄。请从菜单选择输入，或连接手柄后点击“监听”。', buttonPressed: '已按下按钮', mappingNeeded: '请至少将一个动作映射到手柄输入。', actions: { moveLeft: '向左移动', moveRight: '向右移动', jump: '跳跃', crouchRoll: '蹲下 / 翻滚', attack: '攻击' }, buttons: ['A / 叉键 · 按钮 1', 'B / 圆键 · 按钮 2', 'X / 方键 · 按钮 3', 'Y / 三角键 · 按钮 4', 'LB · 按钮 5', 'RB · 按钮 6', 'LT · 按钮 7', 'RT · 按钮 8', 'Back / 选择 · 按钮 9', 'Start · 按钮 10', '按下左摇杆 · 按钮 11', '按下右摇杆 · 按钮 12', '方向键上 · 按钮 13', '方向键下 · 按钮 14', '方向键左 · 按钮 15', '方向键右 · 按钮 16'], axisButtons: ['左摇杆向左 · X 轴 −', '左摇杆向右 · X 轴 +'], axisNames: ['左摇杆向左', '左摇杆向右'], inputNames: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'BACK', 'START', 'L3', 'R3', '上', '下', '左', '右'] },
  ms: { titleBar: 'Kawalan Pad Permainan', back: '← GODOT FORGE / LALUAN PEMBELAJARAN', chapter: 'BAB 09 / KAWALAN PAD PERMAINAN', language: 'Bahasa', learningGoalsAria: 'Matlamat pembelajaran', playtestAria: 'Permainan ujian pad permainan yang boleh dimainkan', homeGuideAria: 'Laman utama atau panduan, Butang 17', introEyebrow: 'INPUT PEMAIN / MAKMAL INTERAKTIF', title: 'Sesuaikan alat kawalan anda.', intro: 'Sambungkan pad permainan untuk melihat input langsung, kemudian sesuaikan butang untuk tindakan permainan anda dalam Tetapan.', settings: 'TETAPAN', learnOneTag: '01 / KESAN', learnOneTitle: 'Cari pad permainan', learnOneCopy: 'Pelayar melaporkan sambungan pad permainan dan input pada setiap bingkai.', learnTwoTag: '02 / VISUAL', learnTwoTitle: 'Lihat setiap tekanan', learnTwoCopy: 'Butang yang ditekan dan pergerakan kayu analog akan menyala pada rajah.', learnThreeTag: '03 / PETAKAN SEMULA', learnThreeTitle: 'Pilih kawalan anda', learnThreeCopy: 'Tetapkan butang pad atau arah kayu analog kepada tindakan dan simpan pemetaan pada peranti ini.', labEyebrow: 'VISUALISASI PAD PERMAINAN LANGSUNG', labTitle: 'Tekan butang untuk melihatnya menyala.', disconnected: 'TIADA PAD PERMAINAN', connected: 'PAD PERMAINAN DISAMBUNGKAN', controller: 'PAD PERMAINAN 01', defaultMapping: 'PEMETAAN ASAL', customMapping: 'PEMETAAN TERSUAI', legendPressed: 'DITEKAN', legendMapped: 'TINDAKAN DIPETAKAN', inputEyebrow: 'MAKLUM BALAS INPUT', inputTitle: 'Belum ada butang ditekan.', inputCopy: 'Sambungkan pad permainan atau klik butang pada rajah untuk mencuba visualisasi.', actionLabel: 'TINDAKAN DIPETAKAN', leftStick: 'KA', rightStick: 'KN', completion: 'Uji input pad permainan dan sesuaikan sekurang-kurangnya satu pemetaan tindakan untuk melengkapkan modul ini.', complete: 'LENGKAPKAN MODUL', completed: 'MODUL SELESAI ✓', reopen: 'BUKA SEMULA MODUL', needInput: 'Uji input pad permainan dan sesuaikan pemetaan untuk melengkapkan modul ini.', saved: 'Kemajuan kawalan pad permainan disimpan.', saveError: 'Kemajuan tidak dapat disimpan. Sila cuba lagi.', settingsEyebrow: 'PILIHAN PEMAIN / INPUT', settingsTitle: 'Sesuaikan pad permainan', settingsDescription: 'Pilih butang atau arah kayu kiri bagi setiap tindakan, atau dengar input fizikal seterusnya.', settingsNote: 'Pemetaan disimpan secara automatik pada peranti ini. Pilih Dengar, kemudian tekan butang atau gerakkan kayu kiri.', resetDefaults: 'TETAPAN ASAL', done: 'SIAP', closeSettings: 'Tutup tetapan', listen: 'DENGAR', waiting: 'TEKAN / GERAKKAN INPUT', resetToast: 'Pemetaan asal dipulihkan.', mappingToast: 'Pemetaan kawalan disimpan.', pressToast: 'Input butang dikesan.', noController: 'Pad permainan tidak dikesan. Pilih input daripada menu atau sambungkan pad dan tekan Dengar.', buttonPressed: 'Butang ditekan', mappingNeeded: 'Petakan sekurang-kurangnya satu tindakan kepada input pad permainan.', actions: { moveLeft: 'Gerak ke kiri', moveRight: 'Gerak ke kanan', jump: 'Lompat', crouchRoll: 'Mencangkung / berguling', attack: 'Serang' }, buttons: ['A / Silang · Butang 1', 'B / Bulat · Butang 2', 'X / Petak · Butang 3', 'Y / Segi tiga · Butang 4', 'LB · Butang 5', 'RB · Butang 6', 'LT · Butang 7', 'RT · Butang 8', 'Kembali / Pilih · Butang 9', 'Mula · Butang 10', 'Tekan kayu kiri · Butang 11', 'Tekan kayu kanan · Butang 12', 'D-pad atas · Butang 13', 'D-pad bawah · Butang 14', 'D-pad kiri · Butang 15', 'D-pad kanan · Butang 16'], axisButtons: ['Kayu kiri ke kiri · Paksi X −', 'Kayu kiri ke kanan · Paksi X +'], axisNames: ['Kayu kiri ke kiri', 'Kayu kiri ke kanan'], inputNames: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'KEMBALI', 'MULA', 'KA3', 'KN3', 'ATAS', 'BAWAH', 'KIRI', 'KANAN'] },
};
const practiceCopy={
  en:{playEyebrow:'PLAYABLE MAPPING TEST',playTitle:'Try every action in the grove.',playIntro:'Use your saved gamepad mapping, or the keyboard fallback, to move, jump, roll and attack the training dummy.',restart:'RESTART GAME',crystals:n=>`CRYSTALS · ${n} / 4`,dummy:hp=>`TRAINING DUMMY · ${hp} HP`,dummyDefeated:'TRAINING DUMMY · DEFEATED',practiceMessage:'Reach the dummy, collect crystals, and test each mapped move.',keyboard:'KEYBOARD · A/D OR ←/→ MOVE · SPACE JUMP · C/↓ ROLL · J ATTACK',promptsEyebrow:'PROMPTS FOR STUDENTS',promptsTitle:'Prompts behind the controller test.',promptsIntro:'Read the implementation prompts and the generated training-dummy art prompt below.',controlsPromptTitle:'Gamepad mapping and visualization',gamePromptTitle:'Playable controller test game',copy:'COPY PROMPT',copied:'Gamepad prompt copied.',copyError:'Could not copy the prompt.',collected:'Crystal collected!',attack:'Sword attack!',roll:'Crouch roll!',dummyHit:'Dummy hit!',dummyMiss:'Get close to the dummy to land an attack.',completed:'Training dummy defeated! The gamepad mapping is working.'},
  zh:{playEyebrow:'可游玩的按键映射测试',playTitle:'在森林训练场试用所有动作。',playIntro:'使用已保存的手柄映射或键盘备用控制，移动、跳跃、翻滚并攻击训练假人。',restart:'重新开始游戏',crystals:n=>`水晶 · ${n} / 4`,dummy:hp=>`训练假人 · ${hp} HP`,dummyDefeated:'训练假人 · 已击败',practiceMessage:'抵达假人、收集水晶，并测试每个已映射动作。',keyboard:'键盘 · A/D 或 ←/→ 移动 · 空格跳跃 · C/↓ 翻滚 · J 攻击',promptsEyebrow:'提供给学生的提示词',promptsTitle:'手柄测试背后的提示词。',promptsIntro:'在下方阅读实现提示词和已生成的训练假人美术提示词。',controlsPromptTitle:'手柄映射与输入可视化',gamePromptTitle:'可游玩的手柄测试游戏',copy:'复制提示词',copied:'手柄提示词已复制。',copyError:'无法复制提示词。',collected:'已收集水晶！',attack:'挥剑攻击！',roll:'蹲下翻滚！',dummyHit:'命中假人！',dummyMiss:'靠近假人才能命中。',completed:'训练假人已被击败！手柄映射正常。'},
  ms:{playEyebrow:'UJIAN PEMETAAN BOLEH DIMAINKAN',playTitle:'Cuba setiap aksi di rimba.',playIntro:'Gunakan pemetaan pad permainan yang disimpan atau kawalan papan kekunci untuk bergerak, melompat, berguling dan menyerang patung latihan.',restart:'MULA SEMULA PERMAINAN',crystals:n=>`KRISTAL · ${n} / 4`,dummy:hp=>`PATUNG LATIHAN · ${hp} HP`,dummyDefeated:'PATUNG LATIHAN · TEWAS',practiceMessage:'Pergi ke patung latihan, kutip kristal dan uji setiap gerakan yang dipetakan.',keyboard:'PAPAN KEKUNCI · A/D ATAU ←/→ GERAK · SPACE LOMPAT · C/↓ GULING · J SERANG',promptsEyebrow:'PROM UNTUK PELAJAR',promptsTitle:'Prom di sebalik ujian kawalan.',promptsIntro:'Baca prom pelaksanaan dan prom seni patung latihan yang dijana di bawah.',controlsPromptTitle:'Pemetaan dan visualisasi pad permainan',gamePromptTitle:'Permainan ujian kawalan boleh dimainkan',copy:'SALIN PROM',copied:'Prom pad permainan disalin.',copyError:'Prom tidak dapat disalin.',collected:'Kristal dikutip!',attack:'Serangan pedang!',roll:'Gulingan merendah!',dummyHit:'Patung latihan terkena!',dummyMiss:'Dekati patung latihan untuk mengenai sasaran.',completed:'Patung latihan telah ditewaskan! Pemetaan pad berfungsi.'},
};
const studentPrompts={
  en:{controls:'In Phaser 3, build a reusable gamepad input and remapping system using the browser Gamepad API. Support the actions move left, move right, jump, crouch/roll, and attack. Let students choose standard controller buttons for every action and analog left-stick X directions for left/right; include a Listen mode that captures the next physical button or stick direction. Save mappings in localStorage, provide reset defaults and keyboard fallback, apply dead zones to axes, handle connect/disconnect, and normalize all input into one action-state object. Draw an accessible gamepad diagram that highlights pressed buttons, mapped controls, and live analog stick positions. Make the playable Phaser test game consume the same saved action mappings.',game:'Create a small Phaser 3 side-scrolling forest practice game using the supplied explorer sprite sheet and forest background art. The player must use customizable gamepad mappings for left/right movement, jump, crouch/roll, and sword attack, with keyboard fallback. Place four collectible crystals, a grounded training dummy with three hit points, and readable HUD feedback. Show walk, jump, roll, and sword-swing reactions; only damage the dummy when the player faces it and is close enough. Reuse the exact saved control mapping from the settings UI, support restarting the practice scene, and keep the layout responsive and accessible.'},
  zh:{controls:'使用 Phaser 3 和浏览器 Gamepad API 构建可复用的手柄输入与重新映射系统。支持向左移动、向右移动、跳跃、蹲下／翻滚和攻击。允许学生为每个动作选择标准手柄按钮，并为左右移动选择左摇杆 X 轴方向；提供“监听”模式以捕获下一次实体按键或摇杆方向。将映射保存到 localStorage，提供恢复默认值和键盘备用控制，对摇杆应用死区，并处理手柄连接与断开。将所有输入统一为动作状态对象。绘制无障碍的手柄示意图，实时高亮已按按钮、已映射控制和摇杆位置。可游玩的 Phaser 测试游戏必须使用同一份已保存映射。',game:'使用提供的探险者精灵图和森林背景素材，创建一个小型 Phaser 3 横向卷轴森林练习游戏。玩家使用可自定义的手柄映射进行左右移动、跳跃、蹲下／翻滚和挥剑攻击，同时提供键盘备用控制。放置四枚可收集水晶，以及一个有 3 点生命值、稳稳站在地面的训练假人，并显示清晰的 HUD 反馈。展示行走、跳跃、翻滚和挥剑反应；只有当玩家面朝假人且距离足够近时，攻击才会造成伤害。练习场景可重新开始，布局需兼顾响应式设计和无障碍操作。设置界面与游戏场景必须共用完全相同的已保存按键映射。'},
  ms:{controls:'Bina sistem input dan pemetaan semula pad permainan yang boleh diguna semula menggunakan Phaser 3 dan Gamepad API pelayar. Sokong aksi gerak ke kiri, gerak ke kanan, lompat, mencangkung/berguling dan serang. Benarkan pelajar memilih butang pad piawai bagi setiap aksi serta arah paksi X kayu kiri untuk kiri/kanan; sediakan mod Dengar untuk menangkap tekanan butang atau arah kayu fizikal seterusnya. Simpan pemetaan dalam localStorage, sediakan tetapan asal dan kawalan papan kekunci sandaran, gunakan zon mati pada paksi dan urus sambungan/pemutusan pad. Satukan semua input dalam satu objek keadaan aksi. Lukis rajah pad yang mudah diakses untuk menyerlahkan butang ditekan, kawalan dipetakan dan kedudukan kayu analog secara langsung. Permainan ujian Phaser mesti menggunakan pemetaan tersimpan yang sama.',game:'Cipta permainan latihan hutan kecil sisi tatal menggunakan Phaser 3, helaian sprite pengembara dan seni latar hutan yang disediakan. Pemain menggunakan pemetaan pad tersuai untuk gerak kiri/kanan, lompat, mencangkung/berguling dan serangan pedang, dengan kawalan papan kekunci sebagai pilihan sandaran. Letakkan empat kristal untuk dikutip dan patung latihan yang berpijak kukuh dengan tiga mata kesihatan serta maklum balas HUD yang jelas. Paparkan reaksi berjalan, lompat, berguling dan hayunan pedang; serangan hanya mencederakan patung apabila pemain menghadapnya dan berada cukup dekat. Benarkan adegan latihan dimulakan semula, pastikan susun atur responsif dan mudah diakses. Antara muka tetapan dan permainan mesti berkongsi pemetaan butang tersimpan yang sama.'},
};

const actions = ['moveLeft', 'moveRight', 'jump', 'crouchRoll', 'attack'];
const defaultMapping = { moveLeft: 17, moveRight: 18, jump: 0, crouchRoll: 1, attack: 2 };
const buttonElements = [...document.querySelectorAll('.pad-control[data-index]')];
const learnerKey = 'godot-forge-gamepad-mapping';
let locale = localStorage.getItem('godot-forge-locale') || 'en';
if (!copy[locale]) locale = 'en';
let mappingWasSaved = Boolean(localStorage.getItem(learnerKey));
let mapping = readMapping();
let moduleData = null;
let captureAction = '';
let activeButtons = new Set();
let previousButtons = new Set();
let simulatedUntil = new Map();
let lastInputIndex = -1;
let sawInput = false;
let mappingTouched = mappingWasSaved;
let progressError = false;
let practiceGame,practiceScene,practicePlayer,practiceDummy,practiceDummyLabel,practiceDummyX=1120,practiceDummyHp=3,practiceCrystals=0,practiceFacing=1,practiceRollUntil=0,practiceAttackAt=0,practiceAttackUntil=0,practiceKeys,practiceCursors,practiceCurrentActions={},practicePreviousActions={};
const practiceWidth=960,practiceHeight=576,practiceWorldWidth=1600,practiceFloorY=510;

function t() { return copy[locale]; }
function pt() { return practiceCopy[locale]; }
function buttonNumber(index) { return locale==='zh'?`按钮 ${index+1}`:locale==='ms'?`Butang ${index+1}`:`Button ${index+1}`; }
function applyPracticeCopy() {
  const c=pt();
  for(const [id,key] of Object.entries({'playtest-eyebrow':'playEyebrow','playtest-title':'playTitle','playtest-intro':'playIntro','restart-playtest':'restart','prompts-eyebrow':'promptsEyebrow','prompts-title':'promptsTitle','prompts-intro':'promptsIntro','control-prompt-title':'controlsPromptTitle','game-prompt-title':'gamePromptTitle','copy-controls-prompt':'copy','copy-game-prompt':'copy','copy-dummy-prompt':'copy'}))document.getElementById(id).textContent=c[key];
  document.getElementById('keyboard-fallback').textContent=c.keyboard;
  document.getElementById('dummy-art-credit').textContent={en:'Training dummy art generated with GPT Image 2.5 Sunburst.',zh:'训练假人美术由 GPT Image 2.5 Sunburst 生成。',ms:'Seni patung latihan dijana dengan GPT Image 2.5 Sunburst.'}[locale];
  document.getElementById('dummy-prompt-title').textContent={en:'Training dummy art prompt',zh:'训练假人美术提示词',ms:'Prom seni patung latihan'}[locale];
  document.getElementById('controls-prompt').textContent=studentPrompts[locale].controls;
  document.getElementById('game-prompt').textContent=studentPrompts[locale].game;
  setPracticeMessage(c.practiceMessage);
  updatePracticeHud();
}
function readMapping() {
  try { const value = JSON.parse(localStorage.getItem(learnerKey)); return Object.fromEntries(actions.map(action => [action, Number.isInteger(value?.[action]) && value[action] >= 0 && value[action] < 19 ? value[action] : defaultMapping[action]])); }
  catch { return { ...defaultMapping }; }
}
function persistMapping(showMessage = false) {
  localStorage.setItem(learnerKey, JSON.stringify(mapping)); mappingWasSaved = true; mappingTouched = true; refreshMappingVisuals(); updateCompletionButton(); updatePracticeHud();
  if (showMessage) window.showToast?.(t().mappingToast, 'success');
}
function buttonName(index) { if (index === 16) return locale === 'zh' ? '主页' : locale === 'ms' ? 'UTAMA' : 'HOME'; return t().inputNames[index] || buttonNumber(index); }
function actionFor(index) { return actions.find(action => mapping[action] === index) || ''; }
function axisIsActive(binding, axisValue) { return binding === 17 ? axisValue < -.55 : (binding === 18 ? axisValue > .55 : false); }
function applyCopy() {
  const c = t();
  document.title = `${c.titleBar} · Godot Forge`;
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
  for (const [id, key] of Object.entries({ 'back-link': 'back', 'chapter-label': 'chapter', 'intro-eyebrow': 'introEyebrow', 'page-title': 'title', 'intro-copy': 'intro', 'settings-button-label': 'settings', 'learn-one-tag': 'learnOneTag', 'learn-one-title': 'learnOneTitle', 'learn-one-copy': 'learnOneCopy', 'learn-two-tag': 'learnTwoTag', 'learn-two-title': 'learnTwoTitle', 'learn-two-copy': 'learnTwoCopy', 'learn-three-tag': 'learnThreeTag', 'learn-three-title': 'learnThreeTitle', 'learn-three-copy': 'learnThreeCopy', 'lab-eyebrow': 'labEyebrow', 'lab-title': 'labTitle', 'controller-label': 'controller', 'legend-pressed': 'legendPressed', 'legend-mapped': 'legendMapped', 'input-eyebrow': 'inputEyebrow', 'input-copy': 'inputCopy', 'action-label': 'actionLabel', 'settings-eyebrow': 'settingsEyebrow', 'settings-title': 'settingsTitle', 'settings-description': 'settingsDescription', 'settings-note': 'settingsNote', 'reset-mapping': 'resetDefaults', 'done-settings': 'done', 'completion-status': 'completion' })) {
    const element = document.getElementById(id); if (element) element.textContent = c[key];
  }
  document.getElementById('left-axis-value').previousElementSibling.textContent = c.leftStick;
  document.getElementById('right-axis-value').previousElementSibling.textContent = c.rightStick;
  document.getElementById('close-settings').setAttribute('aria-label', c.closeSettings);
  document.getElementById('languages').setAttribute('aria-label', c.language);
  document.getElementById('learning-goals').setAttribute('aria-label', c.learningGoalsAria);
  document.getElementById('playtest-stage').setAttribute('aria-label', c.playtestAria);
  buttonElements.forEach(element => { const index = Number(element.dataset.index); element.setAttribute('aria-label', index === 16 ? c.homeGuideAria : c.buttons[index]); });
  document.getElementById('controller-title').textContent=locale==='zh'?'游戏手柄按键可视化':locale==='ms'?'Visualisasi butang pad permainan':'Gamepad button visualizer';
  document.getElementById('controller-description').textContent=locale==='zh'?'按下实体手柄按钮或点击示意图中的按钮，查看输入反馈。':locale==='ms'?'Tekan butang pad fizikal atau klik butang pada rajah untuk melihat maklum balas input.':'Press a physical controller button or click a button in the diagram to preview its input.';
  renderMappingRows(); updateConnection(null); updateInputFeedback(lastInputIndex); updateCompletionButton(); applyPracticeCopy();
}
function renderMappingRows() {
  const host = document.getElementById('mapping-list');
  host.replaceChildren();
  for (const action of actions) {
    const row = document.createElement('div'); row.className = 'mapping-row';
    const label = document.createElement('label'); label.htmlFor = `mapping-${action}`; label.textContent = t().actions[action];
    const select = document.createElement('select'); select.id = `mapping-${action}`; select.dataset.action = action; select.setAttribute('aria-label', t().actions[action]);
    const choices = [...t().buttons.map((name, index) => ({ name, index })), { name: `${buttonName(16)} · ${buttonNumber(16)}`, index: 16 }];
    if (action === 'moveLeft' || action === 'moveRight') t().axisButtons.forEach((name, axisIndex) => choices.push({ name, index: 17 + axisIndex }));
    choices.forEach(({ name, index }) => { const option = document.createElement('option'); option.value = String(index); option.textContent = name; select.append(option); });
    select.value = String(mapping[action]);
    select.addEventListener('change', () => { mapping[action] = Number(select.value); persistMapping(true); });
    const listen = document.createElement('button'); listen.type = 'button'; listen.className = 'listen-button'; listen.dataset.action = action; listen.textContent = t().listen;
    listen.addEventListener('click', () => { captureAction = action; renderMappingRows(); document.querySelector(`.listen-button[data-action="${action}"]`)?.setAttribute('data-listening', 'true'); window.showToast?.(document.getElementById('connection').dataset.state === 'connected' ? t().waiting : t().noController, document.getElementById('connection').dataset.state === 'connected' ? 'info' : 'warning'); });
    row.append(label, select, listen); host.append(row);
  }
  if (captureAction) { const button = document.querySelector(`.listen-button[data-action="${captureAction}"]`); if (button) { button.dataset.listening = 'true'; button.textContent = t().waiting; } }
  refreshMappingVisuals();
}
function refreshMappingVisuals() {
  buttonElements.forEach(element => { const index = Number(element.dataset.index); element.classList.toggle('is-mapped', Boolean(actionFor(index))); });
  document.getElementById('left-stick-axis').classList.toggle('is-mapped', mapping.moveLeft >= 17 || mapping.moveRight >= 17);
  const state = document.getElementById('mapping-state'); if (state) state.textContent = mappingWasSaved ? t().customMapping : t().defaultMapping;
}
function updateConnection(pad) {
  const element = document.getElementById('connection');
  const label = document.getElementById('connection-label');
  const connected = Boolean(pad);
  element.dataset.state = connected ? 'connected' : 'disconnected';
  label.textContent = connected ? `${t().connected} · ${pad.id.slice(0, 44)}` : t().disconnected;
}
function updateInputFeedback(index) {
  const c = t(); const name = index >= 0 ? buttonName(index) : '';
  const action = index >= 0 ? actionFor(index) : '';
  document.getElementById('input-title').textContent = index >= 0 ? `${c.buttonPressed}: ${name}` : c.inputTitle;
  document.getElementById('action-value').textContent = action ? c.actions[action] : '—';
  document.getElementById('input-readout').textContent = index >= 0 ? `${buttonNumber(index)}${action ? ` · ${c.actions[action].toUpperCase()}` : ''}` : '—';
  if (index >= 0) { sawInput = true; updateCompletionButton(); }
}
function reportPress(index) {
  lastInputIndex = index; updateInputFeedback(index); window.showToast?.(`${t().pressToast} ${buttonName(index)}`, 'success');
}
function captureAxis(index) {
  if (!captureAction) return;
  const action = captureAction; mapping[action] = index; captureAction = ''; persistMapping(); renderMappingRows();
  window.showToast?.(`${t().mappingToast} ${t().actions[action]} · ${t().axisNames[index - 17]}`, 'success');
}
function setAxis(id, x, y) {
  const element = document.querySelector(`#${id} circle`);
  if (element) element.setAttribute('transform', `translate(${Math.max(-1, Math.min(1, x)) * 19} ${Math.max(-1, Math.min(1, y)) * 19})`);
}
function mappedActionDown(action,pad){
  const binding=mapping[action];
  if(binding===17)return (pad?.axes?.[0]||0)<-.55;
  if(binding===18)return (pad?.axes?.[0]||0)>.55;
  const until=simulatedUntil.get(binding)||0;
  return Boolean(pad?.buttons?.[binding]?.pressed||pad?.buttons?.[binding]?.value>.55||until>performance.now());
}
function practicePreload(){
  this.load.image('practice-far','/parallax-tiling-map/images/parallax-far.webp');
  this.load.image('practice-mid','/parallax-tiling-map/images/parallax-midground.webp');
  this.load.image('practice-dummy','/game-controls/images/training-dummy.webp');
  this.load.spritesheet('practice-hero','/items-spawning/images/forest-sword-explorer.png',{frameWidth:256,frameHeight:256});
}
function practiceCreate(){
  practiceScene=this;this.physics.world.setBounds(0,0,practiceWorldWidth,practiceHeight);this.cameras.main.setBounds(0,0,practiceWorldWidth,practiceHeight).setBackgroundColor('#17332a');
  this.add.tileSprite(0,0,practiceWorldWidth,practiceHeight,'practice-far').setOrigin(0).setScrollFactor(.13).setDepth(-10).setTint(0xd5e6db);
  this.add.tileSprite(0,85,practiceWorldWidth,practiceHeight-85,'practice-mid').setOrigin(0).setScrollFactor(.3).setDepth(-5).setAlpha(.72);
  const groundArt=this.add.graphics();groundArt.fillStyle(0x263f2d).fillRect(0,practiceFloorY,practiceWorldWidth,practiceHeight-practiceFloorY);groundArt.fillStyle(0x78a84a).fillRect(0,practiceFloorY,practiceWorldWidth,9);groundArt.fillStyle(0x3b5c35);for(let x=0;x<practiceWorldWidth;x+=64)groundArt.fillRoundedRect(x+6,practiceFloorY+22,38,8,3);
  const floor=this.add.rectangle(practiceWorldWidth/2,practiceFloorY+48,practiceWorldWidth,96,0,0);this.physics.add.existing(floor,true);floor.setVisible(false);
  const anims=this.anims;
  for(const [key,start,end,frameRate,repeat] of [['test-idle',0,0,5,-1],['test-walk',8,15,9,-1],['test-run',16,23,13,-1],['test-attack',24,27,12,0],['test-jump',32,35,12,0]]){
    const frames=anims.generateFrameNumbers('practice-hero',{start,end});
    if(frames.length)anims.create({key,frames,frameRate,repeat});
  }
  practicePlayer=this.physics.add.sprite(90,practiceFloorY,'practice-hero',0).setScale(.34).setOrigin(.5,.94).setDepth(8).setCollideWorldBounds(true);practicePlayer.body.setSize(140,200).setOffset(58,35);this.physics.add.collider(practicePlayer,floor);
  const crystalArt=this.make.graphics({x:0,y:0,add:false});crystalArt.fillStyle(0xc4f265,1);crystalArt.fillPoints([{x:14,y:0},{x:27,y:14},{x:14,y:29},{x:1,y:14}],true);crystalArt.lineStyle(2,0xf1ffbb,1).strokePoints([{x:14,y:0},{x:27,y:14},{x:14,y:29},{x:1,y:14}],true);crystalArt.generateTexture('practice-crystal',28,30);crystalArt.destroy();
  const coinGroup=this.physics.add.group({allowGravity:false,immovable:true});for(const [index,x] of [270,475,710,915].entries()){const coin=coinGroup.create(x,index%2?practiceFloorY-98:practiceFloorY-52,'practice-crystal').setDepth(7);coin.body.setAllowGravity(false).setImmovable(true);this.tweens.add({targets:coin,y:coin.y-7,duration:540,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});}this.physics.add.overlap(practicePlayer,coinGroup,(_player,coin)=>{if(!coin.active)return;coin.destroy();practiceCrystals=Math.min(4,practiceCrystals+1);updatePracticeHud();setPracticeMessage(pt().collected);window.showToast?.(pt().collected,'success');},null,this);
  const dummyX=1120;practiceDummyX=dummyX;practiceDummy=this.add.image(dummyX,practiceFloorY,'practice-dummy').setOrigin(.5,1).setDisplaySize(112,147).setDepth(6);
  practiceDummyLabel=this.add.text(dummyX,practiceFloorY-153,pt().dummy(practiceDummyHp),{fontFamily:'ui-monospace,monospace',fontSize:'11px',fontStyle:'bold',color:'#edf5e9',backgroundColor:'#102019dd',padding:{x:7,y:4}}).setOrigin(.5).setDepth(12);
  practiceKeys=this.input.keyboard.addKeys('A,D,W,J,C,SHIFT');practiceCursors=this.input.keyboard.createCursorKeys();practiceFacing=1;practiceRollUntil=0;practiceAttackAt=0;practiceAttackUntil=0;practiceCurrentActions={};practicePreviousActions={};
  this.cameras.main.startFollow(practicePlayer,true,.1,.08);this.cameras.main.setDeadzone(260,100);updatePracticeHud();
}
function setPracticeMessage(message){const element=document.getElementById('practice-message');if(element)element.textContent=message;}
function updatePracticeHud(){const c=pt();const coins=document.getElementById('practice-coins'),dummy=document.getElementById('practice-dummy'),summary=document.getElementById('playtest-mapping-summary');if(coins)coins.textContent=c.crystals(practiceCrystals);if(dummy)dummy.textContent=practiceDummyHp>0?c.dummy(practiceDummyHp):c.dummyDefeated;if(practiceDummyLabel?.active)practiceDummyLabel.setText(practiceDummyHp>0?c.dummy(practiceDummyHp):c.dummyDefeated);if(summary){summary.textContent=actions.map(action=>`${t().actions[action]}: ${action==='moveLeft'&&mapping[action]>=17||action==='moveRight'&&mapping[action]>=17?t().axisNames[mapping[action]-17]:buttonName(mapping[action])}`).join(' · ');}}
function practiceAttack(time){if(time-practiceAttackAt<430)return;practiceAttackAt=time;practiceAttackUntil=time+340;practicePlayer.anims.play('test-attack',true);setPracticeMessage(pt().attack);const distance=practiceDummyX-practicePlayer.x;if(practiceDummyHp<=0||Math.abs(distance)>118||(distance*practiceFacing)<-10){setPracticeMessage(pt().dummyMiss);return;}practiceDummyHp--;practiceDummy.setAlpha(.4);practiceScene.time.delayedCall(100,()=>practiceDummy?.setAlpha(1));const slash=practiceScene.add.graphics().setDepth(15);slash.lineStyle(8,0xd8f68d,.95).lineBetween(practicePlayer.x+practiceFacing*20,practicePlayer.y-66,practicePlayer.x+practiceFacing*88,practicePlayer.y-100);slash.lineStyle(3,0xf5ffd5,.95).lineBetween(practicePlayer.x+practiceFacing*28,practicePlayer.y-58,practicePlayer.x+practiceFacing*83,practicePlayer.y-94);practiceScene.tweens.add({targets:slash,alpha:0,duration:180,onComplete:()=>slash.destroy()});if(practiceDummyHp<=0){practiceDummyLabel.setText(pt().dummyDefeated);setPracticeMessage(pt().completed);practiceScene.time.delayedCall(2600,()=>{if(!practiceDummy)return;practiceDummyHp=3;practiceDummy.setAlpha(1);practiceDummyLabel.setText(pt().dummy(practiceDummyHp));updatePracticeHud();});}else{practiceDummyLabel.setText(pt().dummy(practiceDummyHp));setPracticeMessage(pt().dummyHit);}updatePracticeHud();window.showToast?.(pt().dummyHit,'success');}
function startPracticeRoll(time){if(time<practiceRollUntil)return;practiceRollUntil=time+420;practicePlayer.setVelocityX(practiceFacing*390);setPracticeMessage(pt().roll);window.showToast?.(pt().roll,'success');}
function practiceUpdate(time){if(!practicePlayer)return;const pad=Array.from(navigator.getGamepads?.()||[]).find(candidate=>candidate?.connected)||null;const current={};actions.forEach(action=>current[action]=mappedActionDown(action,pad));const left=practiceCursors.left.isDown||practiceKeys.A.isDown||current.moveLeft,right=practiceCursors.right.isDown||practiceKeys.D.isDown||current.moveRight,jumpHeld=current.jump||practiceKeys.W.isDown||practiceCursors.up.isDown||practiceCursors.space.isDown,rollHeld=current.crouchRoll||practiceKeys.C.isDown||practiceKeys.SHIFT.isDown||practiceCursors.down.isDown,attackHeld=current.attack||practiceKeys.J.isDown;const jumpNow=jumpHeld&&!practicePreviousActions.jumpAny,rollNow=rollHeld&&!practicePreviousActions.rollAny,attackNow=attackHeld&&!practicePreviousActions.attackAny,grounded=practicePlayer.body.blocked.down||practicePlayer.body.touching.down;if(left)practiceFacing=-1;else if(right)practiceFacing=1;if(jumpNow&&grounded){practicePlayer.setVelocityY(-450);setPracticeMessage(pt().practiceMessage);}if(rollNow)startPracticeRoll(time);if(attackNow)practiceAttack(time);const rolling=time<practiceRollUntil;if(rolling)practicePlayer.setVelocityX(practiceFacing*390);else if(left||right)practicePlayer.setVelocityX(left?-220:220);else practicePlayer.setVelocityX(0);practicePlayer.setFlipX(practiceFacing<0);if(rolling){practicePlayer.setScale(.38,.25).setTint(0xc4f265);practicePlayer.anims.play('test-run',true);}else{practicePlayer.setScale(.34,.34).clearTint();if(time<practiceAttackUntil){if(practicePlayer.anims.currentAnim?.key!=='test-attack')practicePlayer.anims.play('test-attack',true);}else if(!grounded)practicePlayer.anims.play('test-jump',true);else if(left||right)practicePlayer.anims.play('test-walk',true);else practicePlayer.anims.play('test-idle',true);}practicePreviousActions={...current,jumpAny:jumpHeld,rollAny:rollHeld,attackAny:attackHeld};}
function initPracticeGame(){if(typeof Phaser==='undefined')return;if(practiceGame){practiceGame.destroy(true);practiceGame=null;}practicePlayer=null;practiceDummy=null;practiceDummyHp=3;practiceCrystals=0;practiceRollUntil=0;practiceAttackAt=0;practiceAttackUntil=0;setPracticeMessage(pt().practiceMessage);updatePracticeHud();practiceGame=new Phaser.Game({type:Phaser.AUTO,parent:'playtest-stage',width:practiceWidth,height:practiceHeight,backgroundColor:'#17332a',physics:{default:'arcade',arcade:{gravity:{y:1120},debug:false}},scene:{preload:practicePreload,create:practiceCreate,update:practiceUpdate},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}});}
function pollGamepads() {
  const pads = navigator.getGamepads ? Array.from(navigator.getGamepads() || []) : [];
  const pad = pads.find(candidate => candidate?.connected) || null;
  updateConnection(pad);
  const pressed = new Set();
  let analogAction = '';
  if (pad) {
    pad.buttons.forEach((button, index) => { if (button.pressed || button.value > .55) pressed.add(index); });
    const axes = pad.axes || [];
    const leftX = axes[0] || 0, leftY = axes[1] || 0, rightX = axes[2] || 0, rightY = axes[3] || 0;
    document.getElementById('left-axis-value').textContent = `X ${leftX.toFixed(2)} · Y ${leftY.toFixed(2)}`;
    document.getElementById('right-axis-value').textContent = `X ${rightX.toFixed(2)} · Y ${rightY.toFixed(2)}`;
    setAxis('left-stick-axis', leftX, leftY); setAxis('right-stick-axis', rightX, rightY);
    if (axisIsActive(mapping.moveLeft, leftX)) analogAction = 'moveLeft';
    else if (axisIsActive(mapping.moveRight, leftX)) analogAction = 'moveRight';
    if (captureAction === 'moveLeft' && leftX < -.55) captureAxis(17);
    else if (captureAction === 'moveRight' && leftX > .55) captureAxis(18);
    pad.buttons.forEach((button, index) => {
      if (!pressed.has(index) || previousButtons.has(index)) return;
      if (captureAction) { mapping[captureAction] = index; const mappedAction = captureAction; captureAction = ''; persistMapping(); renderMappingRows(); window.showToast?.(`${t().mappingToast} ${t().actions[mappedAction]} · ${buttonName(index)}`, 'success'); }
      else reportPress(index);
    });
  } else {
    document.getElementById('left-axis-value').textContent = 'X 0.00 · Y 0.00'; document.getElementById('right-axis-value').textContent = 'X 0.00 · Y 0.00';
    setAxis('left-stick-axis', 0, 0); setAxis('right-stick-axis', 0, 0);
  }
  const now = performance.now();
  for (const [index, until] of simulatedUntil) { if (until > now) pressed.add(index); else simulatedUntil.delete(index); }
  activeButtons = pressed;
  buttonElements.forEach(element => { const isPressed = pressed.has(Number(element.dataset.index)); element.classList.toggle('is-pressed', isPressed); element.setAttribute('aria-pressed', String(isPressed)); });
  const active = [...pressed].sort((a, b) => a - b);
  document.getElementById('input-readout').textContent = active.length ? active.map(index => `${buttonName(index)}${actionFor(index) ? `·${t().actions[actionFor(index)]}` : ''}`).join('  ') : (lastInputIndex >= 0 ? buttonNumber(lastInputIndex) : '—');
  if (!active.length && analogAction) {
    sawInput = true;
    document.getElementById('input-title').textContent = `${t().leftStick} · ${t().actions[analogAction]}`;
    document.getElementById('action-value').textContent = t().actions[analogAction];
    document.getElementById('input-readout').textContent = `${t().leftStick.toUpperCase()} · ${t().actions[analogAction].toUpperCase()}`;
    updateCompletionButton();
  }
  previousButtons = new Set(pressed);
  requestAnimationFrame(pollGamepads);
}
function simulatePress(index) {
  simulatedUntil.set(index, performance.now() + 650); reportPress(index);
  buttonElements.forEach(element => { const isPressed = Number(element.dataset.index) === index; element.classList.toggle('is-pressed', isPressed); element.setAttribute('aria-pressed', String(isPressed)); });
}
function updateCompletionButton() {
  const button = document.getElementById('complete-module');
  if (!button) return;
  const eligible = sawInput && mappingTouched && actions.some(action => Number.isInteger(mapping[action]));
  button.disabled = !moduleData?.completed && !eligible;
  button.textContent = moduleData?.completed ? t().reopen : t().complete;
  document.getElementById('completion-status').textContent = progressError ? t().saveError : (!moduleData?.completed && sawInput && !mappingTouched ? t().mappingNeeded : (moduleData?.completed ? t().saved : t().completion));
}
async function toggleCompletion() {
  if (!moduleData) return;
  const completed = !moduleData.completed;
  if (completed && !(sawInput && mappingTouched)) { window.showToast?.(t().needInput, 'warning'); return; }
  const button = document.getElementById('complete-module'); button.disabled = true;
  try {
    const response = await fetch(`/api/modules/${slug}/progress`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed }) });
    if (!response.ok) throw new Error('Could not save progress');
    moduleData.completed = (await response.json()).completed; progressError = false;
  } catch { progressError = true; }
  updateCompletionButton();
}
function openSettings() { document.getElementById('settings-overlay').hidden = false; practiceScene?.scene.pause(); renderMappingRows(); document.getElementById('done-settings').focus(); }
function closeSettings() { document.getElementById('settings-overlay').hidden = true; captureAction = ''; practiceScene?.scene.resume(); document.getElementById('open-settings').focus(); }

document.getElementById('languages').addEventListener('click', event => {
  const next = event.target.closest('[data-locale]')?.dataset.locale;
  if (!copy[next]) return;
  locale = next; localStorage.setItem('godot-forge-locale', locale); applyCopy();
});
document.getElementById('open-settings').addEventListener('click', openSettings);
document.getElementById('close-settings').addEventListener('click', closeSettings);
document.getElementById('done-settings').addEventListener('click', closeSettings);
document.getElementById('settings-overlay').addEventListener('click', event => { if (event.target.id === 'settings-overlay') closeSettings(); });
document.getElementById('reset-mapping').addEventListener('click', () => { mapping = { ...defaultMapping }; persistMapping(); renderMappingRows(); window.showToast?.(t().resetToast, 'success'); });
document.getElementById('complete-module').addEventListener('click', toggleCompletion);
document.getElementById('restart-playtest').addEventListener('click', () => { initPracticeGame(); window.showToast?.(pt().restart, 'success'); });
document.querySelectorAll('.copy-prompt').forEach(button => button.addEventListener('click', async () => { try { const prompt=button.dataset.prompt==='dummy'?document.getElementById('dummy-prompt').textContent:studentPrompts[locale][button.dataset.prompt];await navigator.clipboard.writeText(prompt);window.showToast?.(pt().copied, 'success'); } catch { window.showToast?.(pt().copyError, 'error'); } }));
buttonElements.forEach(element => {
  element.addEventListener('click', () => simulatePress(Number(element.dataset.index)));
  element.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); simulatePress(Number(element.dataset.index)); } });
});
document.addEventListener('keydown', event => {
  if (event.code === 'Escape') { event.preventDefault(); document.getElementById('settings-overlay').hidden ? openSettings() : closeSettings(); }
});
window.addEventListener('gamepadconnected', () => window.showToast?.(t().connected, 'success'));
window.addEventListener('gamepaddisconnected', () => window.showToast?.(t().disconnected, 'info'));
window.addEventListener('godot-forge-module-reset', event => { if (event.detail?.slug !== slug) return; mapping = { ...defaultMapping }; mappingWasSaved = false; mappingTouched = false; sawInput = false; moduleData = { ...moduleData, completed: false }; localStorage.removeItem(learnerKey); renderMappingRows(); updateCompletionButton(); initPracticeGame(); window.showToast?.(t().resetDefaults, 'success'); });
applyCopy();
initPracticeGame();
pollGamepads();
(async () => {
  try { const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`); if (!response.ok) throw new Error('Could not load module'); moduleData = (await response.json()).find(module => module.slug === slug); if (!moduleData) throw new Error('Module not found'); }
  catch { window.showToast?.(t().saveError, 'error'); }
  updateCompletionButton();
})();
