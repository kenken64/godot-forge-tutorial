const slug = 'credits';
const learnerId = (() => { const key = 'godot-forge-learner-id'; let value = localStorage.getItem(key); if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); } return value; })();
const contributors = [
  { name: 'Asha Vale', roles: { en: 'Creative Director', zh: '创意总监', ms: 'Pengarah Kreatif' } },
  { name: 'Rowan Pike', roles: { en: 'Gameplay Programmer', zh: '游戏玩法程序员', ms: 'Pengatur Cara Permainan' } },
  { name: 'Mira Chen', roles: { en: 'Environment Artist', zh: '环境美术', ms: 'Artis Persekitaran' } },
  { name: 'Kade Moss', roles: { en: 'Music & Sound Designer', zh: '音乐与音效设计', ms: 'Pereka Muzik dan Bunyi' } },
  { name: 'Imani Sol', roles: { en: 'Narrative Designer', zh: '叙事设计师', ms: 'Pereka Naratif' } },
  { name: 'Theo Finch', roles: { en: 'Quality Assurance', zh: '质量测试', ms: 'Jaminan Kualiti' } },
  { name: 'Jun Park', roles: { en: 'Accessibility Consultant', zh: '无障碍顾问', ms: 'Perunding Kebolehcapaian' } },
];
const stills = [
  { src: 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/credits/images/grove-bridge.webp', alt: { en: 'The explorer crosses an ancient bridge above a forest waterfall.', zh: '探险者穿过森林瀑布上方的古老石桥。', ms: 'Pengembara melintasi jambatan purba di atas air terjun hutan.' }, caption: { en: 'The old bridge, above the mist.', zh: '薄雾之上的古老石桥。', ms: 'Jambatan lama di atas kabus.' } },
  { src: 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/credits/images/canopy-leap.webp', alt: { en: 'The explorer leaps between sunlit platforms in the forest canopy.', zh: '探险者在阳光照耀的森林树冠平台间跳跃。', ms: 'Pengembara melompat antara pelantar bercahaya di kanopi hutan.' }, caption: { en: 'A leap through the canopy.', zh: '跃过森林树冠。', ms: 'Lompatan merentasi kanopi.' } },
  { src: 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/credits/images/heart-tree.webp', alt: { en: 'The explorer reaches a luminous heart-tree in a restored grove.', zh: '探险者抵达一棵让森林复苏的发光生命之树。', ms: 'Pengembara tiba di pokok cahaya yang memulihkan rimba.' }, caption: { en: 'The grove begins to bloom again.', zh: '森林重新焕发生机。', ms: 'Rimba kembali berbunga.' } },
  { src: 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/credits/images/boar-charge.webp', alt: { en: 'The explorer faces a charging wild boar on a mossy forest path.', zh: '探险者在苔藓森林小径上迎战冲来的野猪。', ms: 'Pengembara berdepan babi hutan yang menerpa di laluan berlumut.' }, caption: { en: 'A close call on the forest trail.', zh: '森林小径上的惊险一刻。', ms: 'Detik cemas di laluan rimba.' } },
  { src: 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/credits/images/guardian-encounter.webp', alt: { en: 'The explorer faces the ancient tree guardian in a ruined forest arena.', zh: '探险者在森林遗迹竞技场中面对古老树灵守卫。', ms: 'Pengembara berdepan penjaga pokok purba di gelanggang runtuhan hutan.' }, caption: { en: 'The guardian wakes at last.', zh: '古老守卫终于苏醒。', ms: 'Penjaga purba akhirnya terjaga.' } },
  { src: 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/credits/images/crystal-spring.webp', alt: { en: 'The explorer discovers glowing crystals in an underground spring cave.', zh: '探险者在地下泉水洞穴中发现发光水晶。', ms: 'Pengembara menemui kristal bercahaya di gua mata air bawah tanah.' }, caption: { en: 'A hidden spring beneath the grove.', zh: '森林之下的隐秘泉水。', ms: 'Mata air tersembunyi di bawah rimba.' } },
];
const prompts = {
  en: {
    credits: 'Build an accessible end-credits sequence for a 2D platform game. Show a vertically scrolling list of fictional contributor names on the left, with each person’s job role directly below their name. On the right, show a large rotating gallery of in-game screenshots that randomly changes scenes every few seconds without repeating the current image. Include play/pause, restart, and skip-to-end controls; respect prefers-reduced-motion; support keyboard access; provide English, Chinese, and Malay copy; and save module completion when the roll finishes or is skipped. Use the supplied generated game-scene images and never call an image model during replay.',
    images: 'Use OpenAI GPT Image 2.5 (Burst) to generate six separate widescreen 16:9 screenshots for one cohesive 2D side-scrolling fantasy platform game. Keep the same small brown-haired explorer in a green tunic, plum scarf, leather satchel, and boots in every scene. Create distinct gameplay moments: crossing a mossy bridge over a waterfall in ancient forest ruins; leaping between sunlit platforms in a forest canopy; reaching a luminous heart-tree that restores a sleeping grove; facing a grounded wild boar on a forest path; confronting an ancient tree guardian in a ruined arena; and discovering a crystal spring cave beneath the grove. Use richly illustrated hand-painted game art, layered misty pine forests, mossy stone platforms, emerald and teal tones, lime-green magic, and restrained violet accents. Each result must be a standalone game scene with no text, logos, menus, HUD, border, or watermark.'
  },
  zh: {
    credits: '为 2D 平台游戏制作一个易于访问的片尾制作人员名单。左侧显示垂直滚动的虚构贡献者姓名，每个人的职位紧跟在姓名下方。右侧显示大型游戏截图画廊，每隔几秒随机切换场景，且不连续重复当前图片。提供播放／暂停、重新开始和跳至结尾控制；尊重 prefers-reduced-motion；支持键盘操作；提供英文、中文和马来文文案；名单结束或被跳过时保存模块完成状态。使用已生成的游戏场景图片，重新播放时不要调用图像模型。',
    images: '使用 OpenAI GPT Image 2.5（Burst）为同一款 2D 横向卷轴奇幻平台游戏生成六张独立的 16:9 宽屏截图。每个场景都保持同一位棕发小探险者的造型：绿色上衣、梅紫色围巾、皮革背包和靴子。生成不同的游戏瞬间：穿过森林古迹中瀑布上方的苔藓石桥；在洒满阳光的森林树冠平台间跳跃；抵达一棵让沉睡森林复苏的发光生命之树；在森林小径上面对一只稳稳站在地面的野猪；在遗迹竞技场中挑战古老树灵守卫；以及发现森林地下的水晶泉洞穴。采用层次丰富的手绘游戏美术、薄雾松林、长满苔藓的石平台、翡翠绿与蓝绿色、青柠绿魔法和克制的紫色点缀。每张都是独立游戏场景，不含文字、标志、菜单、HUD、边框或水印。'
  },
  ms: {
    credits: 'Bina urutan penghargaan penamat yang mudah diakses untuk permainan platform 2D. Paparkan senarai nama penyumbang rekaan yang menatal secara menegak di sebelah kiri, dengan peranan kerja setiap orang tepat di bawah nama. Di sebelah kanan, tunjukkan galeri tangkap layar permainan yang besar dan bertukar secara rawak setiap beberapa saat tanpa mengulang imej semasa. Sertakan kawalan main/jeda, mula semula dan langkau ke penghujung; patuhi prefers-reduced-motion; sokong papan kekunci; sediakan teks Inggeris, Cina dan Melayu; dan simpan penyelesaian modul apabila senarai tamat atau dilangkau. Gunakan imej adegan permainan yang telah dijana dan jangan panggil model imej semasa ulangan.',
    images: 'Gunakan OpenAI GPT Image 2.5 (Burst) untuk menjana enam tangkap layar lebar 16:9 yang berasingan bagi satu permainan platform fantasi sisi tatal yang konsisten. Kekalkan watak pengembara kecil berambut perang gelap dengan tunik hijau, skarf plum, beg kulit dan but dalam setiap adegan. Cipta detik permainan berbeza: melintasi jambatan berlumut di atas air terjun dalam runtuhan hutan purba; melompat antara pelantar bercahaya di kanopi hutan; tiba di pokok cahaya yang memulihkan rimba yang lena; berdepan babi hutan yang berpijak kukuh di laluan rimba; mencabar penjaga pokok purba di gelanggang runtuhan; dan menemui gua mata air kristal di bawah rimba. Gunakan seni permainan lukisan tangan yang kaya, hutan pain berkabus berlapis, pelantar batu berlumut, warna zamrud dan teal, sihir hijau limau dan aksen ungu yang sederhana. Setiap hasil ialah adegan permainan tersendiri tanpa teks, logo, menu, HUD, bingkai atau tera air.'
  }
};
const copy = {
  en: { back: '← GODOT FORGE / LEARNING PATH', chapter: 'CHAPTER 13 / GAME CREDITS', language: 'Language', stageAria: 'Interactive game credits sequence', windowAria: 'Scrolling contributor names and roles', nextAria: 'Show another game screenshot', eyebrow: 'THE PEOPLE BEHIND THE GROVE', title: 'Game Credits', intro: 'Give every contributor a moment in the spotlight.', rolling: 'CREDITS ROLLING', paused: 'CREDITS PAUSED', finished: 'SEQUENCE COMPLETE', people: 'THE PEOPLE', rollKicker: 'A GODOT FORGE ORIGINAL', rollTitle: 'The Grove Remembers', thanks: 'A little world, made by many hands.', dedication: 'For everyone who kept exploring.', rollEnd: 'THANK YOU FOR PLAYING', play: 'PLAY ROLL', pause: 'PAUSE ROLL', restart: 'RESTART', skip: 'SKIP TO END', note: 'Motion respects your device setting. You can pause, restart, or skip the roll.', screenshots: 'MOMENTS FROM THE GAME', random: 'A random scene returns every few seconds.', next: 'NEXT SCENE ↗', promptEyebrow: 'MADE WITH A PROMPT', promptsTitle: 'See how this credits sequence is described.', promptCopy: 'The people and roles are fictional. The game screenshots were generated for this lesson.', creditsPromptTitle: 'Scrolling credits and screenshot gallery', imagePromptTitle: 'Generated game screenshots', copyButton: 'COPY', copied: 'Credits prompt copied.', copyError: 'Could not copy the prompt.', completion: 'Watch the credits roll to the end, or choose Skip to End to complete this module.', complete: 'COMPLETE MODULE', reopen: 'REOPEN MODULE', saved: 'Credits progress saved.', saveError: 'Could not save credits progress.', finishedToast: 'Credits sequence completed.', restarted: 'Credits restarted.', sceneToast: 'Showing another game scene.', names: contributors, completedStatus: 'This credits sequence is complete. Replay it or reopen the module.' },
  zh: { back: '← GODOT FORGE / 学习路径', chapter: '第 13 章 / 游戏制作人员名单', language: '语言', stageAria: '互动游戏制作人员名单', windowAria: '滚动显示的贡献者姓名与职位', nextAria: '显示另一张游戏截图', eyebrow: '森林背后的创作者', title: '游戏制作人员名单', intro: '让每一位贡献者都拥有属于自己的高光时刻。', rolling: '名单滚动中', paused: '名单已暂停', finished: '片尾播放完成', people: '幕后创作者', rollKicker: 'GODOT FORGE 原创游戏', rollTitle: '森林铭记于心', thanks: '这个小小世界，由许多双手共同创造。', dedication: '献给每一位继续探索的人。', rollEnd: '感谢游玩', play: '播放名单', pause: '暂停名单', restart: '重新开始', skip: '跳至结尾', note: '动画会尊重设备设置。你可以暂停、重新开始或跳过名单。', screenshots: '游戏中的瞬间', random: '每隔几秒随机切换一个场景。', next: '下一个场景 ↗', promptEyebrow: '提示词创作', promptsTitle: '查看如何描述这个片尾名单。', promptCopy: '姓名和职位均为虚构。游戏截图是为本课程生成的。', creditsPromptTitle: '滚动名单与截图画廊', imagePromptTitle: '生成游戏截图', copyButton: '复制', copied: '名单提示词已复制。', copyError: '无法复制提示词。', completion: '观看名单滚动至结尾，或选择“跳至结尾”来完成本模块。', complete: '完成模块', reopen: '重新打开模块', saved: '名单进度已保存。', saveError: '无法保存名单进度。', finishedToast: '制作人员名单播放完成。', restarted: '名单已重新开始。', sceneToast: '已切换至另一个游戏场景。', names: contributors, completedStatus: '片尾名单已完成。你可以重播或重新打开本模块。' },
  ms: { back: '← GODOT FORGE / LALUAN PEMBELAJARAN', chapter: 'BAB 13 / PENGHARGAAN PERMAINAN', language: 'Bahasa', stageAria: 'Urutan penghargaan permainan interaktif', windowAria: 'Nama dan peranan penyumbang yang menatal', nextAria: 'Tunjukkan tangkap layar permainan lain', eyebrow: 'ORANG DI SEBALIK RIMBA', title: 'Penghargaan Permainan', intro: 'Berikan setiap penyumbang peluang untuk dihargai.', rolling: 'PENGHARGAAN SEDANG BERGERAK', paused: 'PENGHARGAAN DIJEDA', finished: 'URUTAN SELESAI', people: 'PARA PENYUMBANG', rollKicker: 'KARYA ASLI GODOT FORGE', rollTitle: 'Rimba Mengingati', thanks: 'Dunia kecil ini dicipta oleh banyak tangan.', dedication: 'Untuk semua yang terus meneroka.', rollEnd: 'TERIMA KASIH KERANA BERMAIN', play: 'MAINKAN SENARAI', pause: 'JEDA SENARAI', restart: 'MULA SEMULA', skip: 'LANGKAU KE AKHIR', note: 'Pergerakan mematuhi tetapan peranti anda. Anda boleh jeda, mula semula atau langkau senarai.', screenshots: 'DETIK DARIPADA PERMAINAN', random: 'Adegan rawak bertukar setiap beberapa saat.', next: 'ADEGAN SETERUSNYA ↗', promptEyebrow: 'DIBINA DARIPADA PROM', promptsTitle: 'Lihat cara urutan penghargaan ini diterangkan.', promptCopy: 'Nama dan peranan ini rekaan. Tangkap layar permainan dijana untuk pelajaran ini.', creditsPromptTitle: 'Penghargaan tatal dan galeri tangkap layar', imagePromptTitle: 'Tangkap layar permainan yang dijana', copyButton: 'SALIN', copied: 'Prom penghargaan disalin.', copyError: 'Prom tidak dapat disalin.', completion: 'Tonton senarai hingga tamat atau pilih Langkau ke Akhir untuk melengkapkan modul ini.', complete: 'LENGKAPKAN MODUL', reopen: 'BUKA SEMULA MODUL', saved: 'Kemajuan penghargaan disimpan.', saveError: 'Kemajuan penghargaan tidak dapat disimpan.', finishedToast: 'Urutan penghargaan selesai.', restarted: 'Penghargaan dimulakan semula.', sceneToast: 'Adegan permainan lain dipaparkan.', names: contributors, completedStatus: 'Urutan penghargaan telah selesai. Mainkan semula atau buka semula modul ini.' },
};

let locale = localStorage.getItem('godot-forge-locale') || 'en';
if (!copy[locale]) locale = 'en';
let moduleData = null;
let rollAnimation = null;
let finished = false;
let paused = false;
let stillOrder = [];
let stillIndex = -1;
let galleryTimer = 0;
let completionPending = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function t() { return copy[locale]; }
function renderContributors() {
  const host = document.getElementById('contributor-list');
  host.replaceChildren(...contributors.map(({ name, roles }, index) => {
    const entry = document.createElement('section'); entry.className = 'credit-entry';
    const heading = document.createElement('h3'); heading.textContent = name;
    const role = document.createElement('p');
    const roleLabel = locale === 'zh' ? '职位' : locale === 'ms' ? 'Peranan' : 'Role';
    const label = document.createElement('span'); label.textContent = `${roleLabel} · `;
    role.append(label, document.createTextNode(roles[locale]));
    entry.append(heading, role);
    entry.setAttribute('aria-label', `${index + 1}. ${name}, ${roles[locale]}`);
    return entry;
  }));
}
function applyCopy() {
  const c = t();
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  document.title = `${c.title} · Godot Forge`;
  document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
  document.getElementById('languages').setAttribute('aria-label', c.language);
  document.getElementById('credits-stage').setAttribute('aria-label', c.stageAria);
  document.getElementById('credits-window').setAttribute('aria-label', c.windowAria);
  document.getElementById('next-screenshot').setAttribute('aria-label', c.nextAria);
  const values = { 'back-link': 'back', 'chapter-label': 'chapter', 'intro-eyebrow': 'eyebrow', 'page-title': 'title', 'intro-copy': 'intro', 'contributors-label': 'people', 'roll-kicker': 'rollKicker', 'roll-title': 'rollTitle', 'roll-thanks': 'thanks', 'roll-dedication': 'dedication', 'roll-end': 'rollEnd', 'accessibility-note': 'note', 'screenshots-label': 'screenshots', 'gallery-note': 'random', 'next-screenshot': 'next', 'prompt-eyebrow': 'promptEyebrow', 'prompts-title': 'promptsTitle', 'prompt-copy': 'promptCopy', 'credits-prompt-title': 'creditsPromptTitle', 'image-prompt-title': 'imagePromptTitle', 'copy-credits-prompt': 'copyButton', 'copy-image-prompt': 'copyButton', 'completion-status': 'completion' };
  for (const [id, key] of Object.entries(values)) document.getElementById(id).textContent = c[key];
  document.getElementById('credits-prompt').textContent = prompts[locale].credits;
  document.getElementById('image-prompt').textContent = prompts[locale].images;
  document.getElementById('gallery-index').textContent = `${String(stillIndex < 0 ? 1 : stillIndex + 1).padStart(2, '0')} / ${String(stills.length).padStart(2, '0')}`;
  document.getElementById('game-screenshot').alt = stills[stillIndex < 0 ? 0 : stillIndex].alt[locale];
  document.getElementById('screenshot-caption').textContent = stills[stillIndex < 0 ? 0 : stillIndex].caption[locale];
  renderContributors();
  document.getElementById('play-pause').textContent = paused || finished ? c.play : c.pause;
  document.getElementById('sequence-status').textContent = finished ? c.finished : paused ? c.paused : c.rolling;
  document.getElementById('complete-module').textContent = moduleData?.completed ? c.reopen : c.complete;
}
function shuffledStills() {
  const list = stills.map((_, index) => index);
  for (let index = list.length - 1; index > 0; index--) { const swap = Math.floor(Math.random() * (index + 1)); [list[index], list[swap]] = [list[swap], list[index]]; }
  if (list.length > 1 && list[0] === stillIndex) [list[0], list[1]] = [list[1], list[0]];
  return list;
}
function showStill(index) {
  stillIndex = index;
  const still = stills[index];
  const image = document.getElementById('game-screenshot');
  image.classList.add('fade-out');
  window.setTimeout(() => {
    image.src = still.src; image.alt = still.alt[locale];
    document.getElementById('screenshot-caption').textContent = still.caption[locale];
    document.getElementById('gallery-index').textContent = `${String(index + 1).padStart(2, '0')} / ${String(stills.length).padStart(2, '0')}`;
    image.classList.remove('fade-out');
  }, 180);
}
function nextStill(manual = false) {
  if (stillOrder.length === 0 || stillOrder.every(index => index === stillIndex)) stillOrder = shuffledStills();
  if (!stillOrder.length) stillOrder = shuffledStills();
  const next = stillOrder.shift();
  if (next === stillIndex && stillOrder.length) return nextStill(manual);
  showStill(next);
  if (manual) window.showToast?.(t().sceneToast, 'success');
}
function startGallery() {
  window.clearInterval(galleryTimer);
  galleryTimer = window.setInterval(() => { if (!paused && !document.hidden) nextStill(); }, 6200);
}
function updateControls() {
  document.getElementById('play-pause').textContent = paused || finished ? t().play : t().pause;
  document.getElementById('sequence-status').textContent = finished ? t().finished : paused ? t().paused : t().rolling;
  document.getElementById('skip-roll').disabled = finished;
  document.getElementById('completion-status').textContent = finished ? (moduleData?.completed ? t().completedStatus : t().saved) : t().completion;
  document.getElementById('complete-module').disabled = !finished && !moduleData?.completed;
  document.getElementById('complete-module').textContent = moduleData?.completed ? t().reopen : t().complete;
}
async function setCompleted(completed) {
  if (!moduleData) { completionPending = completed; updateControls(); return; }
  try {
    const response = await fetch(`/api/modules/${slug}/progress`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed }) });
    if (!response.ok) throw new Error('Progress could not be saved');
    moduleData.completed = (await response.json()).completed;
    updateControls();
    window.showToast?.(completed ? t().saved : t().restarted, 'success');
  } catch {
    document.getElementById('completion-status').textContent = t().saveError;
    window.showToast?.(t().saveError, 'error');
  }
}
function finishRoll() {
  if (finished) return;
  finished = true; paused = false;
  rollAnimation?.cancel(); rollAnimation = null;
  const roll = document.getElementById('credits-roll');
  roll.style.transform = `translateY(${-roll.offsetHeight}px)`;
  updateControls();
  window.showToast?.(t().finishedToast, 'success');
  setCompleted(true);
}
function beginRoll() {
  const roll = document.getElementById('credits-roll');
  rollAnimation?.cancel();
  finished = false; paused = false;
  roll.style.transform = '';
  if (reducedMotion) {
    roll.style.position = 'relative'; roll.style.top = 'auto'; roll.style.transform = 'none';
    paused = true;
    updateControls();
    return;
  }
  roll.style.position = 'absolute'; roll.style.top = '0';
  const viewportHeight = document.getElementById('credits-window').clientHeight;
  const distance = viewportHeight + roll.offsetHeight;
  const duration = Math.max(30000, distance / 21 * 1000);
  rollAnimation = roll.animate([{ transform: `translateY(${viewportHeight}px)` }, { transform: `translateY(${-roll.offsetHeight}px)` }], { duration, easing: 'linear', fill: 'forwards' });
  rollAnimation.onfinish = finishRoll;
  updateControls();
}
function toggleRoll() {
  if (reducedMotion) { window.showToast?.(t().note, 'info'); return; }
  if (finished) { beginRoll(); return; }
  paused = !paused;
  if (paused) rollAnimation?.pause(); else rollAnimation?.play();
  updateControls();
}
function restartRoll(showToast = true) {
  if (moduleData?.completed) setCompleted(false);
  beginRoll();
  if (showToast) window.showToast?.(t().restarted, 'success');
}
async function toggleCompletion() {
  if (moduleData?.completed) { await setCompleted(false); restartRoll(false); return; }
  if (finished) await setCompleted(true);
}

document.getElementById('languages').addEventListener('click', event => {
  const next = event.target.closest('[data-locale]')?.dataset.locale;
  if (!copy[next]) return;
  locale = next; localStorage.setItem('godot-forge-locale', locale); applyCopy();
});
document.getElementById('play-pause').addEventListener('click', toggleRoll);
document.getElementById('restart-roll').addEventListener('click', () => restartRoll());
document.getElementById('skip-roll').addEventListener('click', finishRoll);
document.getElementById('next-screenshot').addEventListener('click', () => nextStill(true));
document.getElementById('complete-module').addEventListener('click', toggleCompletion);
document.querySelectorAll('.copy-prompt').forEach(button => button.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(prompts[locale][button.dataset.prompt]); window.showToast?.(t().copied, 'success'); }
  catch { window.showToast?.(t().copyError, 'error'); }
}));
document.getElementById('credits-window').addEventListener('keydown', event => { if (event.code === 'Space') { event.preventDefault(); toggleRoll(); } });
document.addEventListener('visibilitychange', () => { if (document.hidden && !paused && !finished) { paused = true; rollAnimation?.pause(); updateControls(); } });
window.addEventListener('godot-forge-module-reset', event => {
  if (event.detail?.slug !== slug) return;
  finished = false; paused = false; moduleData = { ...moduleData, completed: false };
  beginRoll(); nextStill(); updateControls(); window.showToast?.(t().restarted, 'success');
});

applyCopy();
if (stills.length) { stillOrder = shuffledStills(); showStill(stillOrder.shift()); }
beginRoll(); startGallery();
(async () => {
  try {
    const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`);
    if (!response.ok) throw new Error('Could not load progress');
    moduleData = (await response.json()).find(module => module.slug === slug);
    if (!moduleData) throw new Error('Credits module not found');
    if (completionPending) await setCompleted(completionPending);
  } catch { document.getElementById('completion-status').textContent = t().saveError; }
  updateControls();
})();
