const slug = 'game-ending-cutscene';
const learnerId = (() => { const key = 'godot-forge-learner-id'; let value = localStorage.getItem(key); if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); } return value; })();
const prompts = {
  en: {
    comic: 'Use OpenAI GPT Image 2.5 Burst. Create one wide 16:9 four-panel 16-bit pixel-art comic strip for an original fantasy platform game. Keep the same young explorer in a green tunic and plum scarf and the same ancient bark-and-stone tree guardian in all panels. Show: (1) face-off in the root shrine, (2) the hero dodges a root wave, (3) a decisive sword strike to the glowing heart-core, (4) the defeated guardian harmlessly dissolves into leaves and light, leaving the heartseed. Dramatic, readable action; no blood, gore, text, lettering, speech bubbles, logos, or UI.',
    scene: 'Use OpenAI GPT Image 2.5 Burst. Create a wide 16:9 authentic 16-bit pixel-art game background for the final dialogue before a branching ending. In an underground forest shrine, a young explorer in a green tunic and plum scarf faces the ancient tree guardian after the battle. A glowing heartseed hovers over a carved root console between them. Use dark navy stone-and-root architecture, cyan crystal windows, emerald growth and a lime seed glow. Keep characters in the lower third and leave uncluttered dark space above for dialogue UI. No words, text, logos, speech bubbles, borders, or interface.',
    awaken: 'Use OpenAI GPT Image 2.5 Burst. Create a wide 16:9 16-bit pixel-art RESTORE ending scene in the same root shrine, with the same explorer and tree guardian. The hero places the heartseed into the root console; life-light races through the roots, leaves and flowers bloom, and the sleeping grove awakens. Hopeful and earned. Navy and cyan shadows, emerald foliage, luminous lime heartseed. Keep a clear central scene and no text, lettering, UI, logos, borders, or watermark.',
    dormant: 'Use OpenAI GPT Image 2.5 Burst. Create a wide 16:9 16-bit pixel-art KEEP THE SEED DORMANT ending scene in the same root shrine, with the same explorer and ancient guardian. The explorer seals the glowing heartseed inside a small crystal lantern; the grove stays quiet and safe, while the guardian rests peacefully and dawn-blue light appears beyond the arch. Reflective, not tragic. Navy and cyan palette, subtle lime glow. No text, letters, speech, UI, logos, border, or watermark.',
    portraits: 'Use OpenAI GPT Image 2.5 Burst. Create a horizontal two-frame sprite strip with exactly two equal square 16-bit pixel-art dialogue portraits and no gap: left, the determined young explorer with brown hair, green tunic collar and plum scarf, facing right; right, the kind ancient bark-and-stone guardian spirit with moss and gentle golden eyes, facing left. Head-and-shoulders, readable expressive faces, dark navy/cyan shrine backdrop, crisp pixel clusters. No labels, words, border, UI, or watermark.'
  },
  zh: {
    comic: '使用 OpenAI GPT Image 2.5 Burst。为原创奇幻平台游戏创作一张 16:9 横向四格 16 位像素风漫画。所有分格中的年轻探险者都穿绿色上衣、系梅紫围巾；古老树灵守卫始终由树皮和石头构成，造型保持一致。依次表现：(1) 根系神殿中的决战对峙；(2) 主角躲避根须冲击；(3) 主角用决定性剑击命中发光核心；(4) 守卫无害地化为树叶与光芒，留下生命种子。动作清晰、富有戏剧性；不含血液、血腥、文字、字母、对话气泡、标志或界面。',
    scene: '使用 OpenAI GPT Image 2.5 Burst。为分支结局前的最后对话创作一张 16:9 横向、真实 16 位像素风游戏背景。在地下森林神殿中，战斗结束后，穿绿色上衣和梅紫围巾的年轻探险者面对古老树灵守卫；发光的生命种子悬浮在两者之间的根雕控制台上方。使用深海军蓝石木结构、青色水晶窗、翡翠绿植物和青柠色种子光芒。角色放在画面下方三分之一，顶部留出整洁的暗色对话区域。不含文字、标志、对话气泡、边框或界面。',
    awaken: '使用 OpenAI GPT Image 2.5 Burst。创作一张 16:9 横向的 16 位像素风“唤醒森林”结局场景，背景与根系神殿一致，探险者和树灵守卫保持原有造型。主角将生命种子放入根系控制台；生命之光沿根部蔓延，树叶与花朵绽放，沉睡的森林逐渐苏醒。氛围充满希望，情感真实。使用海军蓝与青色阴影、翡翠绿植物和明亮的青柠色核心。不含文字、字母、界面、标志、边框或水印。',
    dormant: '使用 OpenAI GPT Image 2.5 Burst。创作一张 16:9 横向的 16 位像素风“让种子继续沉睡”结局场景，背景与根系神殿一致，探险者和古老守卫保持原有造型。探险者将发光种子封存在小型水晶灯中；森林保持安静与安全，守卫平静休眠，拱门外透入黎明蓝光。氛围沉思但不悲伤。使用海军蓝与青色调，搭配克制的青柠色光芒。不含文字、字母、对话、界面、标志、边框或水印。',
    portraits: '使用 OpenAI GPT Image 2.5 Burst。创作一张横向双帧精灵图，恰好包含两个等宽正方形 16 位像素风对话肖像，中间不留空隙：左侧是棕发年轻探险者，穿绿色衣领、系梅紫围巾，面向右；右侧是由树皮和石头组成、长有苔藓且金色眼眸温和的古老树灵，面向左。肩部以上构图，表情清晰，背景为深海军蓝与青色神殿，像素块锐利。不含标签、文字、边框、界面或水印。'
  },
  ms: {
    comic: 'Gunakan OpenAI GPT Image 2.5 Burst. Cipta jalur komik seni piksel 16-bit empat panel mendatar 16:9 untuk permainan platform fantasi asli. Kekalkan pengembara muda bertunik hijau dan skarf plum serta penjaga pokok purba daripada kulit kayu dan batu yang sama dalam setiap panel. Tunjukkan: (1) berhadapan di kuil akar, (2) wira mengelak gelombang akar, (3) tebasan pedang penentu mengenai teras bercahaya, (4) penjaga yang kalah lenyap dengan aman menjadi daun dan cahaya, meninggalkan benih jantung. Aksi dramatik dan jelas; tanpa darah, gore, teks, huruf, gelembung dialog, logo atau UI.',
    scene: 'Gunakan OpenAI GPT Image 2.5 Burst. Cipta latar permainan seni piksel 16-bit tulen, lebar 16:9, untuk dialog terakhir sebelum pengakhiran bercabang. Di kuil hutan bawah tanah, pengembara muda bertunik hijau dan skarf plum berhadapan dengan penjaga pokok purba selepas pertempuran. Benih jantung bercahaya terapung di atas konsol akar berukir di antara mereka. Gunakan seni bina batu dan akar biru laut gelap, tingkap kristal sian, tumbuhan zamrud dan cahaya benih hijau limau. Letakkan watak di sepertiga bawah dan biarkan ruang gelap yang lapang di bahagian atas untuk UI dialog. Tanpa perkataan, teks, logo, gelembung dialog, bingkai atau antara muka.',
    awaken: 'Gunakan OpenAI GPT Image 2.5 Burst. Cipta adegan pengakhiran “PULIHKAN RIMBA” seni piksel 16-bit, lebar 16:9, di kuil akar yang sama dengan pengembara dan penjaga pokok yang sama. Wira meletakkan benih jantung pada konsol akar; cahaya kehidupan menjalar melalui akar, daun dan bunga berkembang, lalu rimba yang lena terjaga. Suasana penuh harapan dan bermakna. Bayang biru laut dan sian, dedaun zamrud, benih hijau limau yang bercahaya. Tanpa teks, huruf, UI, logo, bingkai atau tera air.',
    dormant: 'Gunakan OpenAI GPT Image 2.5 Burst. Cipta adegan pengakhiran “BIARKAN BENIH TIDUR” seni piksel 16-bit, lebar 16:9, di kuil akar yang sama dengan pengembara dan penjaga purba yang sama. Pengembara mengunci benih bercahaya di dalam tanglung kristal kecil; rimba kekal tenang dan selamat, penjaga berehat dengan aman, dan cahaya biru fajar muncul di sebalik gerbang. Suasana renungan, bukan tragedi. Palet biru laut dan sian dengan cahaya hijau limau yang sederhana. Tanpa teks, huruf, dialog, UI, logo, bingkai atau tera air.',
    portraits: 'Gunakan OpenAI GPT Image 2.5 Burst. Cipta jalur sprite mendatar dua bingkai dengan tepat dua potret dialog seni piksel 16-bit berbentuk segi empat sama dan sama lebar tanpa jarak: kiri, pengembara muda berambut perang gelap dengan kolar tunik hijau dan skarf plum, menghadap kanan; kanan, roh penjaga purba yang baik hati dengan wajah kulit kayu dan batu, lumut serta mata emas lembut, menghadap kiri. Potret dari bahu ke atas, wajah jelas dan ekspresif, latar kuil biru laut/sian gelap, kelompok piksel tajam. Tanpa label, perkataan, bingkai, UI atau tera air.'
  }
};
const copy = {
  en: { back:'← GODOT FORGE / LEARNING PATH',chapter:'CHAPTER 12 / ENDING CUTSCENE',language:'Language',stageAria:'Playable ending cutscene',portraitAria:'Portrait of the grove guardian',continueAria:'Continue dialogue',choiceAria:'Choose the ending',eyebrow:'THE FINAL CHOICE',title:'Every ending starts with a choice.',intro:'First, see how the last battle ended. Then decide what the hero does with the heartseed.',comicLabel:'FINAL BATTLE / RECAP',cutsceneLabel:'THE FINAL SCENE',comicHeading:'THE LAST BATTLE',comicCaption:'The guardian falls. The heartseed remains.',continue:'CONTINUE TO THE ENDING ↗',speakerGuardian:'THE GROVE ECHO',speakerHero:'THE EXPLORER',lines:["The heartseed can wake every root and flower in the grove.","And what happens to the spring if I use it?","The grove will bloom again—but the old spring will run dry. Keep the seed safe, and the water remains, but the grove will sleep on."],choiceQuestion:'What will you do with the heartseed?',awaken:'AWAKEN THE GROVE',dormant:'KEEP IT DORMANT',endAwaken:'THE GROVE REMEMBERS',descAwaken:'The heartseed wakes the roots. New leaves return, and the grove begins again.',endDormant:'A QUIET PROMISE',descDormant:'The spring keeps flowing. The seed rests safely, and the grove waits for another day.',unlocked:'ENDING REACHED',next:'CONTINUE ▼',skip:'SKIP DIALOGUE',restart:'RESTART CUTSCENE',replay:'REPLAY THE FINALE',complete:'COMPLETE MODULE',completed:'MODULE COMPLETE ✓',reopen:'REOPEN MODULE',comicStatus:'Read the comic recap, then continue to the final choice.',storyStatus:'Follow the conversation, then choose what matters most.',choiceStatus:'Both choices change the grove. Choose an ending.',saved:'Ending cutscene complete. Progress saved.',saveError:'Could not save module progress.',copied:'Image prompt copied.',copyError:'Could not copy this prompt.',promptsEyebrow:'ARTWORK PROMPTS / GPT IMAGE 2.5 BURST',promptsTitle:'Every cutscene image has a prompt.',promptsIntro:'Read or copy each image prompt. English, Chinese and Malay versions are available.',promptNames:{comic:'Comic strip · final boss defeat',scene:'Dialogue scene · heartseed shrine',awaken:'Ending scene · awaken the grove',dormant:'Ending scene · keep seed dormant',portraits:'Dialogue portraits · hero and guardian'},copyPrompt:'COPY PROMPT',chapterEnd:'ENDING SEQUENCE'},
  zh: { back:'← GODOT FORGE / 学习路径',chapter:'第 12 章 / 结局过场动画',language:'语言',stageAria:'可互动的结局过场动画',portraitAria:'森林守卫的肖像',continueAria:'继续对话',choiceAria:'选择结局',eyebrow:'最终抉择',title:'每个结局，都始于一次选择。',intro:'先看看最终决战如何结束，再决定主角如何处置生命种子。',comicLabel:'最终决战 / 漫画回顾',cutsceneLabel:'最终场景',comicHeading:'最终决战',comicCaption:'守卫倒下了，生命种子仍在。',continue:'继续观看结局 ↗',speakerGuardian:'森林回响',speakerHero:'探险者',lines:['生命种子可以唤醒森林中的每一条根和每一朵花。','如果我使用它，泉水会怎么样？','森林会重新繁盛——但古老的泉水将会干涸。保护种子，泉水就能继续流淌，但森林会继续沉睡。'],choiceQuestion:'你会如何处置生命种子？',awaken:'唤醒森林',dormant:'让种子继续沉睡',endAwaken:'森林铭记于心',descAwaken:'生命种子唤醒了根系。新叶重返森林，森林重新开始生长。',endDormant:'静静的承诺',descDormant:'泉水继续流淌。种子被妥善保存，森林等待着另一天。',unlocked:'结局达成',next:'继续 ▼',skip:'跳过对话',restart:'重新开始过场',replay:'重播最终场景',complete:'完成模块',completed:'模块已完成 ✓',reopen:'重新打开模块',comicStatus:'阅读漫画回顾，然后继续观看最终抉择。',storyStatus:'跟随这段对话，然后选择你最看重的事物。',choiceStatus:'两个选择都会改变森林，请选择一个结局。',saved:'结局过场已完成，进度已保存。',saveError:'无法保存模块进度。',copied:'图像提示词已复制。',copyError:'无法复制提示词。',promptsEyebrow:'美术提示词 / GPT IMAGE 2.5 BURST',promptsTitle:'每张过场图片都有对应的提示词。',promptsIntro:'查看或复制每项图片提示词，可选择英文、中文和马来文版本。',promptNames:{comic:'漫画 · 击败最终首领',scene:'对话场景 · 生命种子神殿',awaken:'结局场景 · 唤醒森林',dormant:'结局场景 · 让种子沉睡',portraits:'对话肖像 · 探险者与守卫'},copyPrompt:'复制提示词',chapterEnd:'结局序列'},
  ms: { back:'← GODOT FORGE / LALUAN PEMBELAJARAN',chapter:'BAB 12 / BABAK AKHIR PERMAINAN',language:'Bahasa',stageAria:'Babak akhir permainan yang boleh dimainkan',portraitAria:'Potret penjaga rimba',continueAria:'Teruskan dialog',choiceAria:'Pilih pengakhiran',eyebrow:'PILIHAN TERAKHIR',title:'Setiap pengakhiran bermula dengan pilihan.',intro:'Lihat dahulu bagaimana pertempuran terakhir berakhir, kemudian tentukan nasib benih jantung.',comicLabel:'PERTEMPURAN AKHIR / REKAP',cutsceneLabel:'ADEGAN TERAKHIR',comicHeading:'PERTEMPURAN TERAKHIR',comicCaption:'Penjaga tewas. Benih jantung masih ada.',continue:'TERUSKAN KE PENGAKHIRAN ↗',speakerGuardian:'GEMA RIMBA',speakerHero:'PENGEMBARA',lines:['Benih jantung boleh membangunkan setiap akar dan bunga di rimba.','Apa yang akan berlaku kepada mata air jika saya menggunakannya?','Rimba akan berbunga semula—tetapi mata air lama akan kering. Jika benih disimpan, air terus mengalir tetapi rimba akan terus lena.'],choiceQuestion:'Apakah yang akan dilakukan dengan benih jantung?',awaken:'PULIHKAN RIMBA',dormant:'BIARKAN BENIH TIDUR',endAwaken:'RIMBA MENGINGATI',descAwaken:'Benih jantung membangunkan akar. Daun baharu kembali dan rimba memulakan hidup semula.',endDormant:'JANJI YANG TENANG',descDormant:'Mata air terus mengalir. Benih disimpan dengan selamat dan rimba menanti hari yang lain.',unlocked:'PENGAKHIRAN DICAPAI',next:'TERUSKAN ▼',skip:'LANGKAU DIALOG',restart:'MULA SEMULA BABAK',replay:'ULANG BABAK AKHIR',complete:'LENGKAPKAN MODUL',completed:'MODUL SELESAI ✓',reopen:'BUKA SEMULA MODUL',comicStatus:'Baca komik imbas kembali, kemudian teruskan kepada pilihan terakhir.',storyStatus:'Ikuti perbualan, kemudian pilih perkara yang paling penting.',choiceStatus:'Kedua-dua pilihan mengubah rimba. Pilih satu pengakhiran.',saved:'Babak akhir selesai. Kemajuan disimpan.',saveError:'Kemajuan modul tidak dapat disimpan.',copied:'Prom imej disalin.',copyError:'Prom tidak dapat disalin.',promptsEyebrow:'PROM SENI / GPT IMAGE 2.5 BURST',promptsTitle:'Setiap imej babak mempunyai prom.',promptsIntro:'Baca atau salin setiap prom imej. Versi bahasa Inggeris, Cina dan Melayu tersedia.',promptNames:{comic:'Jalur komik · menewaskan bos akhir',scene:'Adegan dialog · kuil benih jantung',awaken:'Adegan pengakhiran · pulihkan rimba',dormant:'Adegan pengakhiran · biarkan benih lena',portraits:'Potret dialog · wira dan penjaga'},copyPrompt:'SALIN PROM',chapterEnd:'URUTAN PENGAKHIRAN'}
};

const assetKeys = ['comic','scene','awaken','dormant','portraits'];
let locale = localStorage.getItem('godot-forge-locale') || 'en';
if (!copy[locale]) locale = 'en';
let mode = 'comic';
let dialogueIndex = 0;
let endingChoice = '';
let moduleData = null;

function t(){return copy[locale];}
function setStatus(text){document.getElementById('cutscene-status').textContent=text;}
function renderPrompts(){
  const host=document.getElementById('asset-prompts');
  host.replaceChildren(...assetKeys.map((key,index)=>{
    const details=document.createElement('details');details.className='asset-prompt';if(index===0)details.open=true;
    const summary=document.createElement('summary');summary.textContent=t().promptNames[key];
    const prompt=document.createElement('pre');prompt.textContent=prompts[locale][key];
    const button=document.createElement('button');button.type='button';button.className='copy-prompt';button.dataset.asset=key;button.textContent=t().copyPrompt;
    button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(prompts[locale][key]);window.showToast?.(t().copied,'success');}catch{window.showToast?.(t().copyError,'error');}});
    details.append(summary,prompt,button);return details;
  }));
}
function applyCopy(){
  const c=t();document.documentElement.lang=locale==='zh'?'zh-CN':locale;document.title=`${c.chapter.split('/').at(-1).trim()} · Godot Forge`;
  document.querySelectorAll('[data-locale]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.locale===locale)));
  const values={'back-link':'back','chapter-label':'chapter','intro-eyebrow':'eyebrow','page-title':'title','intro-copy':'intro','prompt-eyebrow':'promptsEyebrow','prompts-title':'promptsTitle','prompts-intro':'promptsIntro','choose-awaken':'awaken','choose-dormant':'dormant','continue-to-ending':'continue','comic-caption':'comicCaption','skip-dialogue':'skip','restart-cutscene':'restart','replay-ending':'replay','complete-module':moduleData?.completed?'reopen':'complete'};
  for(const [id,key]of Object.entries(values))document.getElementById(id).textContent=c[key];
  document.getElementById('languages').setAttribute('aria-label',c.language);
  document.getElementById('cutscene-stage').setAttribute('aria-label',c.stageAria);
  document.getElementById('speaker-portrait').setAttribute('aria-label',c.portraitAria);
  document.getElementById('advance-dialogue').setAttribute('aria-label',c.continueAria);
  document.getElementById('choice-panel').setAttribute('aria-label',c.choiceAria);
  document.getElementById('scene-label').textContent=mode==='comic'?c.comicLabel:mode==='ending'?c.chapterEnd:c.cutsceneLabel;
  document.getElementById('screen-heading').textContent=mode==='comic'?c.comicHeading:mode==='ending'?c.unlocked:'';
  document.getElementById('choice-question').textContent=c.choiceQuestion;
  renderPrompts();
  if(mode==='dialogue')renderDialogue();
  if(mode==='ending')renderEnding();
  updateControls();
}
function renderDialogue(){
  const speaker=dialogueIndex===1?'hero':'guardian';
  document.getElementById('speaker-portrait').dataset.speaker=speaker;
  document.getElementById('speaker-portrait').setAttribute('aria-label',speaker==='hero'?t().speakerHero:t().speakerGuardian);
  document.getElementById('speaker-name').textContent=speaker==='hero'?t().speakerHero:t().speakerGuardian;
  document.getElementById('dialogue-line').textContent=t().lines[dialogueIndex];
}
function updateControls(){
  document.getElementById('continue-to-ending').hidden=mode!=='comic';
  document.getElementById('comic-caption').hidden=mode!=='comic';
  document.getElementById('dialogue-box').hidden=mode!=='dialogue';
  document.getElementById('choice-panel').hidden=mode!=='choices';
  document.getElementById('ending-card').hidden=mode!=='ending';
  document.getElementById('skip-dialogue').hidden=mode!=='dialogue';
  document.getElementById('complete-module').disabled=mode!=='ending'&&!moduleData?.completed;
  document.getElementById('complete-module').textContent=moduleData?.completed?t().reopen:t().complete;
  document.getElementById('scene-label').textContent=mode==='comic'?t().comicLabel:mode==='ending'?t().chapterEnd:t().cutsceneLabel;
  document.getElementById('cutscene-status').textContent=mode==='comic'?t().comicStatus:mode==='choices'?t().choiceStatus:mode==='ending'?t().saved:t().storyStatus;
}
function enterDialogue(){
  mode='dialogue';dialogueIndex=0;
  const image=document.getElementById('scene-image');image.src='https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-ending-cutscene/images/shrine-choice.webp';image.alt='Pixel-art forest shrine where the explorer faces the ancient guardian and the glowing heartseed.';
  document.getElementById('screen-heading').textContent=t().cutsceneLabel;
  renderDialogue();updateControls();
}
function advanceDialogue(){
  if(mode!=='dialogue')return;
  if(dialogueIndex<t().lines.length-1){dialogueIndex++;renderDialogue();return;}
  mode='choices';document.getElementById('dialogue-box').hidden=true;updateControls();
}
function showEnding(choice){
  endingChoice=choice;mode='ending';
  const image=document.getElementById('scene-image');image.src=`https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-ending-cutscene/images/ending-${choice}.webp`;
  image.alt=choice==='awaken'?'Pixel-art ending: the hero awakens the grove with the heartseed.':'Pixel-art ending: the hero keeps the heartseed safely dormant.';
  renderEnding();updateControls();saveEndingProgress(true);
}
function renderEnding(){
  if(!endingChoice)return;
  document.getElementById('ending-title').textContent=endingChoice==='awaken'?t().endAwaken:t().endDormant;
  document.getElementById('ending-description').textContent=endingChoice==='awaken'?t().descAwaken:t().descDormant;
  document.getElementById('screen-heading').textContent=t().unlocked;
}
async function saveEndingProgress(completed){
  try{
    const response=await fetch(`/api/modules/${slug}/progress`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({learnerId,completed})});
    if(!response.ok)throw new Error('save failed');
    moduleData={...moduleData,completed:(await response.json()).completed};
    localStorage.setItem('godot-forge-ending-cutscene-choice',endingChoice);
    updateControls();window.showToast?.(t().saved,'success');
  }catch{setStatus(t().saveError);window.showToast?.(t().saveError,'error');}
}
function resetCutscene(){mode='comic';dialogueIndex=0;endingChoice='';
  const image=document.getElementById('scene-image');image.src='https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-ending-cutscene/images/final-boss-comic.webp';image.alt='Four-panel pixel-art recap showing the explorer defeating the ancient tree guardian.';
  document.getElementById('screen-heading').textContent=t().comicHeading;
  document.getElementById('choice-panel').hidden=true;document.getElementById('ending-card').hidden=true;
  applyCopy();
}
async function toggleCompletion(){
  if(moduleData?.completed){await saveEndingProgress(false);localStorage.removeItem('godot-forge-ending-cutscene-choice');resetCutscene();return;}
  if(mode==='ending')await saveEndingProgress(true);
}

document.getElementById('languages').addEventListener('click',event=>{
  const next=event.target.closest('[data-locale]')?.dataset.locale;if(!copy[next])return;
  locale=next;localStorage.setItem('godot-forge-locale',locale);applyCopy();
});
document.getElementById('continue-to-ending').addEventListener('click',enterDialogue);
document.getElementById('advance-dialogue').addEventListener('click',advanceDialogue);
document.getElementById('skip-dialogue').addEventListener('click',()=>{if(mode==='dialogue'){dialogueIndex=t().lines.length-1;mode='choices';updateControls();}});
document.getElementById('choose-awaken').addEventListener('click',()=>showEnding('awaken'));
document.getElementById('choose-dormant').addEventListener('click',()=>showEnding('dormant'));
document.getElementById('restart-cutscene').addEventListener('click',()=>{if(moduleData?.completed)saveEndingProgress(false);localStorage.removeItem('godot-forge-ending-cutscene-choice');resetCutscene();window.showToast?.(t().restart,'success');});
document.getElementById('replay-ending').addEventListener('click',()=>{if(moduleData?.completed)saveEndingProgress(false);localStorage.removeItem('godot-forge-ending-cutscene-choice');resetCutscene();});
document.getElementById('complete-module').addEventListener('click',toggleCompletion);
document.addEventListener('keydown',event=>{if(event.code==='Space'&&mode==='dialogue'&&event.target.tagName!=='BUTTON'){event.preventDefault();advanceDialogue();}});
window.addEventListener('godot-forge-module-reset',event=>{if(event.detail?.slug!==slug)return;moduleData={...moduleData,completed:false};localStorage.removeItem('godot-forge-ending-cutscene-choice');resetCutscene();window.showToast?.(t().restart,'success');});

applyCopy();
(async()=>{
  try{const response=await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`);if(!response.ok)throw new Error('load failed');moduleData=(await response.json()).find(module=>module.slug===slug);applyCopy();}
  catch{setStatus(t().saveError);}
})();
