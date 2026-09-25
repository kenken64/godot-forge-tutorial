const supportedLocales = ["en", "zh", "ms"];
const savedLocale = window.localStorage.getItem("godot-forge-locale");
let currentLocale = supportedLocales.includes(savedLocale) ? savedLocale : "en";

const copy = {
  en: {
    pageTitle: "Character Creation — Godot Forge",
    backLink: "← GODOT FORGE / LEARNING PATH",
    chapterLabel: "CHAPTER 01 / CHARACTER CREATION",
    language: "Language",
    localeEnglish: "EN",
    localeChinese: "中文",
    localeMalay: "BM",
    introEyebrow: "A creative prompt-to-motion character lab",
    titleFirst: "Make your",
    titleSecond: "character move.",
    introCopy: "Start with your own imagination. Codex will help shape it into a playable character, then we will turn the design into an animated sprite sheet.",
    introNote: "PROMPT / SPRITE / MOTION",
    creativeBriefTitle: "START WITH YOUR IDEA",
    proxyBadge: "CODEX VIA PROXY",
    creativePromptLabel: "Describe the character you imagine",
    creativePromptPlaceholder: "A tiny storm keeper who collects thunder in glass bottles...",
    templateLabel: "Quick test template",
    templateAria: "Quick test template",
    loadTemplate: "LOAD TEMPLATE",
    previewTemplate: "PREVIEW SAMPLE ANIMATION",
    templateHelp: "Prefills the guide so you can test character and sprite generation quickly.",
    chatAria: "Character prompt chat",
    guideTitle: "CHARACTER GUIDE",
    profileTitle: "CHARACTER PROFILE",
    draft: "DRAFT",
    profileEmpty: "Your character will take shape here as you answer.",
    fieldRole: "ROLE",
    fieldName: "NAME",
    fieldFocusAttribute: "FOCUS ATTRIBUTES",
    fieldWeapon: "WEAPON",
    fieldCombatStyle: "COMBAT STYLE",
    fieldWeakness: "WEAKNESS / COST",
    buildCharacter: "BUILD CHARACTER + SPRITE",
    saveCharacter: "SAVE CHARACTER",
    promptTitle: "DESIGN PROMPT",
    copyPrompt: "COPY",
    promptEmpty: "Complete the guide to generate a reusable character prompt.",
    answerPlaceholder: "Type your answer...",
    answerAria: "Type your answer",
    send: "SEND",
    botLabel: "GUIDE",
    userLabel: "YOU",
    saveSuccess: "Character saved. Its sprite sheet and coordinates JSON are in the Final Game asset library.",
    saveError: "Could not publish the character to Final Game. Generate the sprite sheet, then try again.",
    generationProgress: "GENERATION IN PROGRESS",
    generationDesignProgress: "DESIGNING CHARACTER",
    generationSpriteProgress: "CREATING SPRITE SHEET",
    generationWait: "Creating the character sheet, then a separate eight-pose walk/run pass. This can take several minutes.",
    copied: "Prompt copied.",
    footerMessage: "BUILD THE HERO BEFORE THE WORLD",
    welcome: "I’m your character designer. Bring your own idea, then I’ll guide you through seven focused decisions: role, name, attribute, weapon, combat, visual identity, and weakness.",
    finalMessage: "Your character brief is ready. Ask Codex to shape the visual identity and gameplay direction.",
    productionEyebrow: "FROM IDEA TO MOTION",
    productionTitle: "Build the sprite sheet.",
    createSprite: "CREATE SPRITE SHEET",
    codexDesignTitle: "CODEX CHARACTER DESIGN",
    designEmpty: "Build your character to see the visual and gameplay direction.",
    waiting: "WAITING",
    ready: "READY",
    spriteSheetTitle: "SPRITE SHEET",
    spriteSheetAria: "Generated sprite sheet",
    spritePreviewAria: "Animated sprite preview",
    animationLabel: "Animation",
    animationAria: "Animation selection",
    saveSprite: "SAVE PNG",
    spriteSaved: "Sprite sheet saved to the assets volume.",
    pause: "PAUSE",
    play: "PLAY",
    movementTitle: "CHARACTER MOVEMENT",
    keyboard: "KEYBOARD CONTROLS",
    keyboardMapAria: "Keyboard controls for character movement",
    noKeys: "NO MOVE KEY",
    moveLeft: "Move left",
    moveRight: "Move right",
    moveKeys: "A / D / ← / →",
    spaceKey: "SPACE",
    resetIdle: "Reset to Idle",
    movementAria: "Character movement preview",
    poseControlsAria: "Animation test controls",
    testAttack: "ATTACK",
    testDeath: "DIE",
    resetPose: "RESET",
    movementHelp: "Release the movement keys to stand idle. Press I to return to Idle after an attack or defeat.",
    designVisual: "VISUAL IDENTITY",
    designRole: "GAMEPLAY ROLE",
    designAttribute: "FOCUS ATTRIBUTE",
    designWeapon: "WEAPON",
    designCombat: "COMBAT STYLE",
    designMovement: "MOVEMENT FEEL",
    designSilhouette: "SILHOUETTE",
    designHook: "EMOTIONAL HOOK",
    designPalette: "PALETTE",
    designPrompt: "SPRITE DIRECTION",
    idle: "Idle",
    walk: "Walk",
    run: "Run",
    jump: "Jump",
    attack: "Attack",
    hurt: "Hurt",
    death: "Death",
    deadState: "DEFEATED",
    building: "Codex is shaping your character...",
    spriteBuilding: "Generating transparent sprite artwork...",
    proxyError: "The proxy could not answer. Start it with npm start, then try again.",
    invalidAi: "Codex returned an unexpected format. Try the request again.",
    steps: [
      { field: "role", prompt: "What is your character's role or class in the game? Choose one, combine classes, or write your own.", choices: ["Warrior", "Rogue", "Ranger", "Mage", "Healer", "Tank", "Summoner", "Engineer"] },
      { field: "name", prompt: "What should the player call this character?", choices: [] },
      { field: "focusAttribute", prompt: "Which attribute or combination of attributes defines this class? Choose one or more, or type your own. Examples: strength, agility, vitality, defense, intelligence, magic, spirit, luck, or charisma.", choices: ["Strength", "Agility", "Speed", "Vitality", "Defense", "Intelligence", "Magic", "Spirit", "Luck", "Charisma"] },
      { field: "weapon", prompt: "What is their choice of weapon or tool?", choices: ["Sword", "Bow", "Staff", "Gauntlets"] },
      { field: "combatStyle", prompt: "How do they fight? Describe their combat style or signature attack.", choices: ["Fast combos", "Heavy strikes", "Long-range shots", "Elemental bursts"] },
      { field: "visualHook", prompt: "What visual detail makes them instantly recognisable? Think silhouette, clothing, colour, or a companion.", choices: [] },
      { field: "weakness", prompt: "What weakness or cost creates tension, and what should we see when the character is hurt or defeated?", choices: ["Power drains memory", "Armour cracks under pressure", "Cannot refuse a challenge", "Needs light to recover"] },
    ],
    promptTemplate: (profile) => `You are a thoughtful 2D game character designer. Create a playable ${profile.role} named ${profile.name}. Their focus attributes are ${profile.focusAttribute}; they use a ${profile.weapon}; their combat style is ${profile.combatStyle}. Their visual identity is ${profile.visualHook}. Their weakness or cost is ${profile.weakness}. Define a readable silhouette, movement feel, attack readability, hurt reaction, and death state.`,
  },
  zh: {
    pageTitle: "角色创建 — Godot Forge",
    backLink: "← GODOT FORGE / 学习路径",
    chapterLabel: "第 01 章 / 角色创建",
    language: "语言",
    localeEnglish: "英文",
    localeChinese: "中文",
    localeMalay: "马来文",
    introEyebrow: "从创意提示到动作的角色实验室",
    titleFirst: "让你的",
    titleSecond: "角色动起来。",
    introCopy: "先从你的想象开始。Codex 会帮助你把它塑造成可玩的角色，然后将设计转换成可以动画化的精灵表。",
    introNote: "提示 / 精灵表 / 动作",
    creativeBriefTitle: "从你的创意开始",
    proxyBadge: "通过代理连接 CODEX",
    creativePromptLabel: "描述你想象中的角色",
    creativePromptPlaceholder: "一个把雷声收集在玻璃瓶里的小小风暴守护者……",
    templateLabel: "快速测试模板",
    templateAria: "快速测试模板",
    loadTemplate: "加载模板",
    previewTemplate: "预览示例动画",
    templateHelp: "预先填写指南，快速测试角色和精灵生成。",
    chatAria: "角色提示聊天",
    guideTitle: "角色指南",
    profileTitle: "角色档案",
    draft: "草稿",
    profileEmpty: "回答问题后，你的角色会在这里逐渐成形。",
    fieldRole: "角色定位",
    fieldName: "名字",
    fieldFocusAttribute: "核心属性",
    fieldWeapon: "武器",
    fieldCombatStyle: "战斗风格",
    fieldWeakness: "弱点 / 代价",
    buildCharacter: "使用 CODEX 创建角色和精灵",
    saveCharacter: "保存角色",
    promptTitle: "设计提示",
    copyPrompt: "复制",
    promptEmpty: "完成指南后即可生成可重复使用的角色提示。",
    answerPlaceholder: "输入你的答案……",
    answerAria: "输入你的答案",
    send: "发送",
    botLabel: "指南",
    userLabel: "你",
    saveSuccess: "角色已保存，精灵表和坐标 JSON 已加入最终游戏素材库。",
    saveError: "无法将角色发布到最终游戏。请先生成精灵表，再试一次。",
    generationProgress: "正在生成",
    generationDesignProgress: "正在设计角色",
    generationSpriteProgress: "正在创建精灵表",
    generationWait: "先生成角色精灵表，再单独生成八帧行走和奔跑动作。这可能需要几分钟。",
    copied: "提示已复制。",
    footerMessage: "先创造英雄，再创造世界",
    welcome: "我是你的角色设计师。先带来你的创意，然后我会引导你完成七个决定：定位、名字、属性、武器、战斗、视觉身份和弱点。",
    finalMessage: "角色简报已经准备好。让 Codex 整理视觉身份和玩法方向。",
    productionEyebrow: "从创意到动作",
    productionTitle: "制作精灵表。",
    createSprite: "创建精灵表",
    codexDesignTitle: "CODEX 角色设计",
    designEmpty: "创建角色后，你会在这里看到视觉和玩法方向。",
    waiting: "等待中",
    ready: "准备好了",
    spriteSheetTitle: "精灵表",
    spriteSheetAria: "生成的精灵表",
    spritePreviewAria: "动画精灵预览",
    animationLabel: "动画",
    animationAria: "动画选择",
    saveSprite: "保存 PNG",
    spriteSaved: "精灵表已保存到素材卷。",
    pause: "暂停",
    play: "播放",
    movementTitle: "角色移动",
    keyboard: "键盘操作",
    keyboardMapAria: "角色移动键盘操作",
    noKeys: "不按方向键",
    moveLeft: "向左移动",
    moveRight: "向右移动",
    moveKeys: "A / D / ← / →",
    spaceKey: "空格",
    resetIdle: "重置为待机",
    movementAria: "角色移动预览",
    poseControlsAria: "动画测试控制",
    testAttack: "攻击",
    testDeath: "倒下",
    resetPose: "重置",
    movementHelp: "松开方向键会自动进入待机。攻击或倒下后按 I 可恢复待机。",
    designVisual: "视觉身份",
    designRole: "玩法定位",
    designAttribute: "核心属性",
    designWeapon: "武器",
    designCombat: "战斗风格",
    designMovement: "移动手感",
    designSilhouette: "轮廓",
    designHook: "情感钩子",
    designPalette: "配色",
    designPrompt: "精灵方向",
    idle: "待机",
    walk: "行走",
    run: "奔跑",
    jump: "跳跃",
    attack: "攻击",
    hurt: "受伤",
    death: "死亡",
    deadState: "已倒下",
    building: "Codex 正在塑造你的角色……",
    spriteBuilding: "正在生成透明精灵图素材……",
    proxyError: "代理没有响应。请用 npm start 启动代理后重试。",
    invalidAi: "Codex 返回了无法识别的格式。请重新请求。",
    steps: [
      { field: "role", prompt: "你的角色在游戏中的定位或职业是什么？可以选择、组合职业，也可以自己填写。", choices: ["战士", "盗贼", "游侠", "法师", "治疗者", "坦克", "召唤师", "工程师"] },
      { field: "name", prompt: "玩家应该怎样称呼这个角色？", choices: [] },
      { field: "focusAttribute", prompt: "哪些属性定义了这个职业？可以选择一个或多个，也可以自己输入。例如：力量、敏捷、速度、生命、防御、智力、魔法、精神、幸运或魅力。", choices: ["力量", "敏捷", "速度", "生命", "防御", "智力", "魔法", "精神", "幸运", "魅力"] },
      { field: "weapon", prompt: "他选择使用什么武器或工具？", choices: ["剑", "弓", "法杖", "拳套"] },
      { field: "combatStyle", prompt: "他如何战斗？描述他的战斗风格或标志攻击。", choices: ["快速连击", "重型打击", "远程射击", "元素爆发"] },
      { field: "visualHook", prompt: "什么视觉细节能让大家一眼认出他？可以是轮廓、服装、颜色或伙伴。", choices: [] },
      { field: "weakness", prompt: "什么弱点或代价制造紧张感？角色受伤或被击败时，我们应该看到什么？", choices: ["力量会消耗记忆", "护甲在压力下碎裂", "无法拒绝挑战", "需要光线才能恢复"] },
    ],
    promptTemplate: (profile) => `你是一名细致的 2D 游戏角色设计师。请创建一名${profile.role}角色，名字是${profile.name}。核心属性是${profile.focusAttribute}，使用${profile.weapon}，战斗风格是${profile.combatStyle}。视觉特征是${profile.visualHook}。弱点或代价是${profile.weakness}。请定义清晰的轮廓、移动手感、攻击辨识度、受伤反应和死亡状态。`,
  },
  ms: {
    pageTitle: "Penciptaan Watak — Godot Forge",
    backLink: "← GODOT FORGE / LALUAN PEMBELAJARAN",
    chapterLabel: "BAB 01 / PENCIPTAAN WATAK",
    language: "Bahasa",
    localeEnglish: "Inggeris",
    localeChinese: "Cina",
    localeMalay: "BM",
    introEyebrow: "Makmal watak daripada idea kepada pergerakan",
    titleFirst: "Gerakkan",
    titleSecond: "watak anda.",
    introCopy: "Mulakan dengan imaginasi anda. Codex membantu membentuknya menjadi watak yang boleh dimainkan, kemudian menukarkan reka bentuk itu kepada helaian sprite beranimasi.",
    introNote: "PROMPT / SPRITE / PERGERAKAN",
    creativeBriefTitle: "MULAKAN DENGAN IDEA ANDA",
    proxyBadge: "CODEX MELALUI PROKSI",
    creativePromptLabel: "Terangkan watak yang anda bayangkan",
    creativePromptPlaceholder: "Penjaga ribut kecil yang mengumpul guruh dalam botol kaca...",
    templateLabel: "Templat ujian pantas",
    templateAria: "Templat ujian pantas",
    loadTemplate: "MUAT TEMPLAT",
    previewTemplate: "PRATONTON ANIMASI CONTOH",
    templateHelp: "Isi panduan terlebih dahulu supaya anda boleh menguji penjanaan watak dan sprite dengan cepat.",
    chatAria: "Sembang prompt watak",
    guideTitle: "PANDUAN WATAK",
    profileTitle: "PROFIL WATAK",
    draft: "DRAF",
    profileEmpty: "Watak anda akan terbentuk di sini apabila anda menjawab.",
    fieldRole: "PERANAN",
    fieldName: "NAMA",
    fieldFocusAttribute: "ATRIBUT FOKUS",
    fieldWeapon: "SENJATA",
    fieldCombatStyle: "GAYA TEMPUR",
    fieldWeakness: "KELEMAHAN / KOS",
    buildCharacter: "BINA WATAK + SPRITE",
    saveCharacter: "SIMPAN WATAK",
    promptTitle: "PROMPT REKAAN",
    copyPrompt: "SALIN",
    promptEmpty: "Lengkapkan panduan untuk menjana prompt watak yang boleh digunakan semula.",
    answerPlaceholder: "Taip jawapan anda...",
    answerAria: "Taip jawapan anda",
    send: "HANTAR",
    botLabel: "PANDUAN",
    userLabel: "ANDA",
    saveSuccess: "Watak disimpan. Helaian sprite dan JSON koordinat kini berada dalam pustaka aset Permainan Akhir.",
    saveError: "Watak tidak dapat diterbitkan ke Permainan Akhir. Jana helaian sprite dahulu, kemudian cuba lagi.",
    generationProgress: "PENJANAAN SEDANG BERJALAN",
    generationDesignProgress: "MEREKA WATAK",
    generationSpriteProgress: "MENCIPTA HELAIAN SPRITE",
    generationWait: "Mencipta helaian watak, kemudian lapan pose berjalan dan berlari secara berasingan. Ini mungkin mengambil beberapa minit.",
    copied: "Prompt disalin.",
    footerMessage: "BINA WIRA SEBELUM DUNIA",
    welcome: "Saya pereka watak anda. Bawa idea sendiri, kemudian saya akan membimbing tujuh keputusan: peranan, nama, atribut, senjata, tempur, identiti visual dan kelemahan.",
    finalMessage: "Ringkasan watak anda sudah siap. Minta Codex membentuk identiti visual dan arah permainan.",
    productionEyebrow: "DARIPADA IDEA KEPADA PERGERAKAN",
    productionTitle: "Bina helaian sprite.",
    createSprite: "CIPTA HELAIAN SPRITE",
    codexDesignTitle: "REKAAN WATAK CODEX",
    designEmpty: "Bina watak anda untuk melihat arah visual dan permainan.",
    waiting: "MENUNGGU",
    ready: "SEDIA",
    spriteSheetTitle: "HELAIAN SPRITE",
    spriteSheetAria: "Helaian sprite yang dijana",
    spritePreviewAria: "Pratonton sprite beranimasi",
    animationLabel: "Animasi",
    animationAria: "Pilihan animasi",
    saveSprite: "SIMPAN PNG",
    spriteSaved: "Helaian sprite disimpan ke volum aset.",
    pause: "JEDA",
    play: "MAIN",
    movementTitle: "PERGERAKAN WATAK",
    keyboard: "KAWALAN PAPAN KEKUNCI",
    keyboardMapAria: "Kawalan papan kekunci untuk pergerakan watak",
    noKeys: "TIADA KEKUNCI GERAK",
    moveLeft: "Gerak kiri",
    moveRight: "Gerak kanan",
    moveKeys: "A / D / ← / →",
    spaceKey: "SPACE",
    resetIdle: "Kembali rehat",
    movementAria: "Pratonton pergerakan watak",
    poseControlsAria: "Kawalan ujian animasi",
    testAttack: "SERANG",
    testDeath: "MATI",
    resetPose: "SET SEMULA",
    movementHelp: "Lepaskan kekunci gerak untuk kembali rehat. Tekan I untuk kembali rehat selepas serangan atau tewas.",
    designVisual: "IDENTITI VISUAL",
    designRole: "PERANAN PERMAINAN",
    designAttribute: "ATRIBUT FOKUS",
    designWeapon: "SENJATA",
    designCombat: "GAYA TEMPUR",
    designMovement: "RASA PERGERAKAN",
    designSilhouette: "SILUET",
    designHook: "TARIKAN EMOSI",
    designPalette: "PALET",
    designPrompt: "ARAH SPRITE",
    idle: "Rehat",
    walk: "Berjalan",
    run: "Berlari",
    jump: "Lompat",
    attack: "Serang",
    hurt: "Cedera",
    death: "Mati",
    deadState: "TEWAS",
    building: "Codex sedang membentuk watak anda...",
    spriteBuilding: "Menjana karya sprite lutsinar...",
    proxyError: "Proksi tidak menjawab. Mulakannya dengan npm start, kemudian cuba lagi.",
    invalidAi: "Codex mengembalikan format yang tidak dijangka. Cuba permintaan sekali lagi.",
    steps: [
      { field: "role", prompt: "Apakah peranan atau kelas watak anda dalam permainan? Pilih, gabungkan kelas atau tulis idea sendiri.", choices: ["Pahlawan", "Penyangak", "Renjer", "Ahli sihir", "Penyembuh", "Tank", "Pemanggil", "Jurutera"] },
      { field: "name", prompt: "Apakah panggilan untuk watak ini?", choices: [] },
      { field: "focusAttribute", prompt: "Atribut atau gabungan atribut manakah yang menentukan kelas ini? Pilih satu atau lebih, atau taip sendiri. Contohnya: kekuatan, ketangkasan, kelajuan, vitaliti, pertahanan, kecerdasan, sihir, semangat, nasib atau karisma.", choices: ["Kekuatan", "Ketangkasan", "Kelajuan", "Vitaliti", "Pertahanan", "Kecerdasan", "Sihir", "Semangat", "Nasib", "Karisma"] },
      { field: "weapon", prompt: "Apakah pilihan senjata atau alatnya?", choices: ["Pedang", "Busur", "Tongkat", "Sarung tangan tempur"] },
      { field: "combatStyle", prompt: "Bagaimanakah dia bertempur? Terangkan gaya tempur atau serangan ikoniknya.", choices: ["Kombo pantas", "Hentaman berat", "Tembakan jarak jauh", "Letupan unsur"] },
      { field: "visualHook", prompt: "Apakah perincian visual yang menjadikannya mudah dikenali? Fikirkan siluet, pakaian, warna atau teman.", choices: [] },
      { field: "weakness", prompt: "Apakah kelemahan atau kos yang mencipta ketegangan, dan apakah yang kita lihat apabila watak cedera atau tewas?", choices: ["Kuasa menghakis ingatan", "Perisai retak di bawah tekanan", "Tidak boleh menolak cabaran", "Perlu cahaya untuk pulih"] },
    ],
    promptTemplate: (profile) => `Anda ialah pereka watak permainan 2D yang teliti. Cipta watak ${profile.role} bernama ${profile.name}. Atribut utamanya ialah ${profile.focusAttribute}; senjatanya ialah ${profile.weapon}; gaya tempurnya ialah ${profile.combatStyle}. Identiti visualnya ialah ${profile.visualHook}. Kelemahan atau kosnya ialah ${profile.weakness}. Tentukan siluet, rasa pergerakan, serangan yang mudah dibaca, reaksi cedera dan keadaan mati.`,
  },
};

const characterTemplates = {
  stormWarden: {
    en: {
      label: "Storm Warden / Warrior",
      creativePrompt: "A storm warden who protects a floating village and stores lightning inside a massive hammer.",
      answers: { role: "Warrior", name: "Volt", focusAttribute: "Strength, Vitality", weapon: "Thunder hammer", combatStyle: "Heavy lightning strikes", visualHook: "A glowing storm cloak and crackling hammer", weakness: "The hammer drains their life when the sky is clear" },
    },
    zh: {
      label: "风暴守护者 / 战士",
      creativePrompt: "一名保护浮空村庄的风暴守护者，把闪电储存在巨大的战锤里。",
      answers: { role: "战士", name: "伏特", focusAttribute: "力量、生命", weapon: "雷霆战锤", combatStyle: "沉重的闪电打击", visualHook: "发光的风暴斗篷和噼啪作响的战锤", weakness: "天空晴朗时，战锤会消耗他的生命" },
    },
    ms: {
      label: "Penjaga Ribut / Pahlawan",
      creativePrompt: "Penjaga ribut yang melindungi kampung terapung dan menyimpan kilat dalam tukul gergasi.",
      answers: { role: "Pahlawan", name: "Volt", focusAttribute: "Kekuatan, Vitaliti", weapon: "Tukul guruh", combatStyle: "Hentaman kilat berat", visualHook: "Jubah ribut bercahaya dan tukul berpercikan", weakness: "Tukul menghakis hayatnya apabila langit cerah" },
    },
  },
  moonScout: {
    en: {
      label: "Moon Scout / Ranger",
      creativePrompt: "A moon scout who maps forgotten rooftops and fires arrows made from moonlight.",
      answers: { role: "Ranger", name: "Luma", focusAttribute: "Agility, Speed", weapon: "Moon bow", combatStyle: "Fast long-range shots", visualHook: "A crescent hood and a trail of silver footprints", weakness: "Their arrows fade when they lose sight of the moon" },
    },
    zh: {
      label: "月光侦察者 / 游侠",
      creativePrompt: "一名探索遗忘屋顶的月光侦察者，用月光制造箭矢。",
      answers: { role: "游侠", name: "露玛", focusAttribute: "敏捷、速度", weapon: "月光弓", combatStyle: "快速的远程射击", visualHook: "新月兜帽和银色脚印轨迹", weakness: "看不见月亮时，箭矢会逐渐消失" },
    },
    ms: {
      label: "Peninjau Bulan / Renjer",
      creativePrompt: "Peninjau bulan yang memetakan bumbung terlupa dan menembak anak panah daripada cahaya bulan.",
      answers: { role: "Renjer", name: "Luma", focusAttribute: "Ketangkasan, Kelajuan", weapon: "Busur bulan", combatStyle: "Tembakan jarak jauh yang pantas", visualHook: "Tudung bulan sabit dan jejak kaki perak", weakness: "Anak panahnya pudar apabila dia tidak melihat bulan" },
    },
  },
  emberSage: {
    en: {
      label: "Ember Sage / Mage",
      creativePrompt: "A young ember sage who uses a talking lantern to keep a frozen city alive.",
      answers: { role: "Mage", name: "Cinder", focusAttribute: "Intelligence, Magic, Spirit", weapon: "Talking lantern", combatStyle: "Elemental bursts and summoned flames", visualHook: "A floating lantern familiar and ember eyes", weakness: "Every spell makes the city colder" },
    },
    zh: {
      label: "余烬贤者 / 法师",
      creativePrompt: "一名年轻的余烬贤者，用会说话的提灯让冰冻城市继续生存。",
      answers: { role: "法师", name: "辛德", focusAttribute: "智力、魔法、精神", weapon: "会说话的提灯", combatStyle: "元素爆发和召唤火焰", visualHook: "漂浮的提灯伙伴和余烬般的眼睛", weakness: "每次施法都会让城市变得更冷" },
    },
    ms: {
      label: "Sage Bara / Ahli Sihir",
      creativePrompt: "Sage bara muda yang menggunakan tanglung bercakap untuk memastikan bandar beku terus hidup.",
      answers: { role: "Ahli sihir", name: "Cinder", focusAttribute: "Kecerdasan, Sihir, Semangat", weapon: "Tanglung bercakap", combatStyle: "Letupan unsur dan api yang dipanggil", visualHook: "Teman tanglung terapung dan mata bara", weakness: "Setiap jampi menjadikan bandar semakin sejuk" },
    },
  },
};

const languageToggle = document.querySelector("#language-toggle");
const chatLog = document.querySelector("#chat-log");
const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer-input");
const choiceList = document.querySelector("#choice-list");
const stepCount = document.querySelector("#step-count");
const saveButton = document.querySelector("#save-character");
const buildButton = document.querySelector("#build-character");
const createSpriteButton = document.querySelector("#create-sprite");
const saveStatus = document.querySelector("#save-status");
const manifestDownload = document.createElement('a');
manifestDownload.className = 'small-action';
manifestDownload.textContent = 'DOWNLOAD COORDINATES JSON';
manifestDownload.hidden = true;
saveStatus.after(manifestDownload);
function showManifestLink(metadata) {
  manifestDownload.hidden = !metadata?.assetUrl;
  if (metadata?.assetUrl) { manifestDownload.href = metadata.assetUrl; manifestDownload.download = metadata.originalName; }
}
const generatedPrompt = document.querySelector("#generated-prompt");
const profileEmpty = document.querySelector("#profile-empty");
const creativePromptInput = document.querySelector("#creative-prompt");
const templateSelect = document.querySelector("#character-template");
const loadTemplateButton = document.querySelector("#load-template");
const previewTemplateButton = document.querySelector("#preview-template");
const productionWorkspace = document.querySelector("#production-workspace");
const aiDesignElement = document.querySelector("#ai-design");
const designStatus = document.querySelector("#design-status");
const spriteStatus = document.querySelector("#sprite-status");
const animationSelect = document.querySelector("#animation-select");
const saveSpriteButton = document.querySelector("#save-sprite");
const playButton = document.querySelector("#play-animation");
const testAttackButton = document.querySelector("#test-attack");
const testDeathButton = document.querySelector("#test-death");
const resetPoseButton = document.querySelector("#reset-pose");
const generationProgress = document.querySelector("#generation-progress");
const generationProgressStage = document.querySelector("#generation-progress-stage");
const generationProgressDetail = document.querySelector("#generation-progress-detail");
const spriteSheetCanvas = document.querySelector("#sprite-sheet-canvas");
const movementCanvas = document.querySelector("#movement-canvas");
const movementKeymap = document.querySelector("#movement-keymap");
const spritePreviewCanvas = document.querySelector("#sprite-preview-canvas");
const spriteContext = spriteSheetCanvas.getContext("2d");
const spritePreviewContext = spritePreviewCanvas.getContext("2d");
const movementContext = movementCanvas.getContext("2d");

let currentStep = 0;
let isComplete = false;
let isPlaying = true;
let aiDesign = null;
let spriteSheet = null;
let spriteAsset = null;
let spriteImage = null;
let cleanedSpriteImage = null;
let cleanedSpriteSource = null;
let idleCleanupApplied = false;
let movementSpec = null;
let selectedAnimation = "idle";
let lastFrameTime = 0;
const answers = {};
const learnerId = (() => {
  const key = "godot-forge-learner-id";
  let value = localStorage.getItem(key);
  if (!value) { value = crypto.randomUUID().replace(/-/g, ""); localStorage.setItem(key, value); }
  return value;
})();
const selectedAttributes = new Set();
const keys = new Set();
const movementState = { x: 0.5, y: 0, velocityY: 0, grounded: true };
let facingDirection = 1;
let forcedPose = null;
let forcedPoseUntil = 0;
let isDead = false;
let generationInProgress = false;
let generationStage = "design";
let generationButtonStates = null;

async function saveCharacterCheckpoint() {
  const state = { creativePrompt: creativePromptInput.value, answers, currentStep, isComplete, aiDesign, spriteSheet, spriteAsset, movementSpec, selectedAnimation };
  await fetch("/api/modules/character-creation/checkpoint", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ learnerId, state }) }).catch(() => {});
}

async function restoreCharacterCheckpoint() {
  const response = await fetch(`/api/modules/character-creation/checkpoint?learnerId=${encodeURIComponent(learnerId)}`).catch(() => null);
  const checkpoint = response?.ok ? await response.json() : null;
  const state = checkpoint?.state;
  if (!state || typeof state !== "object") return;
  creativePromptInput.value = String(state.creativePrompt || "");
  Object.assign(answers, state.answers && typeof state.answers === "object" ? state.answers : {});
  currentStep = Math.min(currentCopy().steps.length - 1, Number(state.currentStep) || Math.max(0, Object.keys(answers).length - 1));
  isComplete = Boolean(state.isComplete) || Object.keys(answers).length >= currentCopy().steps.length;
  aiDesign = state.aiDesign && typeof state.aiDesign === "object" ? state.aiDesign : null;
  spriteSheet = state.spriteSheet && typeof state.spriteSheet === "object" ? state.spriteSheet : null;
  showManifestLink(spriteSheet?.finalGameAsset?.metadataAsset);
  spriteAsset = state.spriteAsset && typeof state.spriteAsset === "object" ? state.spriteAsset : spriteSheet?.asset || null;
  movementSpec = state.movementSpec && typeof state.movementSpec === "object" ? state.movementSpec : null;
  selectedAnimation = String(state.selectedAnimation || "idle");
  renderChat(); renderProfile(); renderAiDesign();
  if (spriteSheet?.assetUrl) {
    try {
      spriteImage = await loadSpriteImage(spriteSheet.assetUrl);
      productionWorkspace.hidden = false;
      renderAnimationOptions(); drawSpriteSheet();
      saveSpriteButton.disabled = Boolean(spriteAsset) && !idleCleanupApplied;
      designStatus.textContent = currentCopy().ready; spriteStatus.textContent = currentCopy().ready;
      saveStatus.textContent = "Resumed your saved character direction and sprite sheet.";
    } catch { spriteSheet = null; spriteAsset = null; spriteImage = null; }
  } else if (aiDesign) {
    productionWorkspace.hidden = false;
    designStatus.textContent = currentCopy().ready;
    saveStatus.textContent = "Resumed your saved character direction. Create the sprite sheet when you are ready.";
  }
  renderProfile();
}

function currentCopy() {
  return copy[currentLocale];
}

function applyCopy() {
  const localeCopy = currentCopy();
  document.title = localeCopy.pageTitle;
  document.documentElement.lang = currentLocale === "zh" ? "zh-CN" : currentLocale === "ms" ? "ms" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = localeCopy[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const value = localeCopy[element.dataset.i18nAria];
    if (value) element.setAttribute("aria-label", value);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const value = localeCopy[element.dataset.i18nPlaceholder];
    if (value) element.placeholder = value;
  });
  languageToggle.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.locale === currentLocale);
  });
  renderTemplates();
  renderChat();
  renderProfile();
  renderAnimationOptions();
  renderAiDesign();
  playButton.textContent = isPlaying ? localeCopy.pause : localeCopy.play;
  if (generationInProgress) updateGenerationProgress(generationStage);
}

function updateGenerationProgress(stage) {
  generationStage = stage;
  generationProgressStage.textContent = stage === "sprite"
    ? currentCopy().generationSpriteProgress
    : currentCopy().generationDesignProgress;
  generationProgressDetail.textContent = currentCopy().generationWait;
}

function setGenerationState(isBusy, stage = "design") {
  if (isBusy) {
    if (!generationInProgress) {
      generationInProgress = true;
      keys.clear();
      generationButtonStates = new Map(
        [...document.querySelectorAll("button, input, select, textarea")].map((button) => [button, button.disabled]),
      );
      document.querySelectorAll("button, input, select, textarea").forEach((button) => {
        button.disabled = true;
      });
    }
    generationProgress.hidden = false;
    generationProgress.setAttribute("aria-busy", "true");
    updateGenerationProgress(stage);
    return;
  }

  if (!generationInProgress) return;
  generationButtonStates?.forEach((wasDisabled, button) => {
    button.disabled = wasDisabled;
  });
  generationButtonStates = null;
  generationInProgress = false;
  generationProgress.hidden = true;
  generationProgress.setAttribute("aria-busy", "false");
}

function renderTemplates() {
  const previousValue = templateSelect.value;
  templateSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = `— ${currentCopy().templateLabel} —`;
  templateSelect.append(placeholder);
  Object.entries(characterTemplates).forEach(([key, template]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = template[currentLocale].label;
    templateSelect.append(option);
  });
  templateSelect.value = previousValue in characterTemplates ? previousValue : "";
}

function loadSelectedTemplate() {
  if (generationInProgress) return;
  const template = characterTemplates[templateSelect.value]?.[currentLocale];
  if (!template) return;
  creativePromptInput.value = template.creativePrompt;
  Object.keys(answers).forEach((field) => delete answers[field]);
  Object.assign(answers, template.answers);
  selectedAttributes.clear();
  currentStep = currentCopy().steps.length - 1;
  isComplete = true;
  aiDesign = null;
  spriteSheet = null;
  spriteAsset = null;
  spriteImage = null;
  movementSpec = null;
  forcedPose = null;
  isDead = false;
  productionWorkspace.hidden = true;
  createSpriteButton.disabled = true;
  saveSpriteButton.disabled = true;
  saveStatus.textContent = "";
  renderChat();
  renderProfile();
  renderAiDesign();
  drawSpritePreview(performance.now());
  saveCharacterCheckpoint();
}

async function previewTemplate() {
  if (generationInProgress) return;
  const slug = { stormWarden: "storm-warden", moonScout: "moon-scout", emberSage: "ember-sage" }[templateSelect.value];
  if (!slug) return;
  loadSelectedTemplate();
  setGenerationState(true, "sprite");
  try {
    const response = await fetch(`data/${slug}-sprite-sheet-v2.json`);
    if (!response.ok) throw new Error(currentCopy().proxyError);
    const sheet = await response.json();
    const image = await loadSpriteImage(sheet.assetUrl);
    aiDesign = normalizeDesign({ character: { ...answers, visualIdentity: creativePromptInput.value } });
    spriteSheet = sheet;
    spriteImage = image;
    spriteAsset = null;
    movementSpec = normalizeMovement({});
    movementState.x = .5;
    movementState.y = 0;
    movementState.velocityY = 0;
    movementState.grounded = true;
    facingDirection = 1;
    selectedAnimation = "walk";
    isPlaying = true;
    playButton.textContent = currentCopy().pause;
    productionWorkspace.hidden = false;
    renderAiDesign();
    renderAnimationOptions();
    drawSpriteSheet();
    designStatus.textContent = currentCopy().ready;
    spriteStatus.textContent = currentCopy().ready;
    productionWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    saveStatus.textContent = error.message;
  } finally {
    setGenerationState(false);
    createSpriteButton.disabled = !aiDesign;
    saveSpriteButton.disabled = !spriteSheet;
    saveButton.disabled = !spriteSheet;
  }
}

function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;
  message.innerHTML = `<span class="message-label">${role === "user" ? currentCopy().userLabel : currentCopy().botLabel}</span><div class="message-body"></div>`;
  message.querySelector(".message-body").textContent = text;
  chatLog.append(message);
}

function renderChat() {
  const localeCopy = currentCopy();
  chatLog.innerHTML = "";
  addMessage("bot", localeCopy.welcome);
  localeCopy.steps.forEach((step, index) => {
    if (answers[step.field]) {
      addMessage("bot", step.prompt);
      addMessage("user", answers[step.field]);
    }
    if (index === currentStep && !isComplete) addMessage("bot", step.prompt);
  });
  if (isComplete) addMessage("bot", localeCopy.finalMessage);
  chatLog.scrollTop = chatLog.scrollHeight;
  renderChoices();
  stepCount.textContent = isComplete
    ? `${localeCopy.steps.length} / ${localeCopy.steps.length}`
    : `${String(currentStep + 1).padStart(2, "0")} / ${String(localeCopy.steps.length).padStart(2, "0")}`;
}

function renderChoices() {
  const step = currentCopy().steps[currentStep];
  choiceList.innerHTML = "";
  if (!step || isComplete) return;
  step.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = choice;
    if (step.field === "focusAttribute") {
      button.classList.toggle("selected", selectedAttributes.has(choice));
      button.setAttribute("aria-pressed", String(selectedAttributes.has(choice)));
      button.addEventListener("click", () => {
        if (selectedAttributes.has(choice)) selectedAttributes.delete(choice);
        else selectedAttributes.add(choice);
        answerInput.value = [...selectedAttributes].join(", ");
        renderChoices();
      });
      choiceList.append(button);
      return;
    }
    button.addEventListener("click", () => {
      answerInput.value = choice;
      answerForm.requestSubmit();
    });
    choiceList.append(button);
  });
}

function renderProfile() {
  ["role", "name", "focusAttribute", "weapon", "combatStyle", "weakness"].forEach((field) => {
    document.querySelector(`#profile-${field}`).textContent = answers[field] || "—";
  });
  const hasAnswers = Object.keys(answers).length > 0;
  profileEmpty.hidden = hasAnswers;
  saveButton.disabled = generationInProgress || !isComplete || !spriteSheet?.assetUrl;
  buildButton.disabled = generationInProgress || !isComplete;
  generatedPrompt.textContent = isComplete ? currentCopy().promptTemplate(answers) : currentCopy().promptEmpty;
}

function submitAnswer(value) {
  const cleanValue = value.trim();
  if (!cleanValue || isComplete) return;
  const field = currentCopy().steps[currentStep].field;
  answers[field] = cleanValue;
  if (field === "focusAttribute") selectedAttributes.clear();
  if (currentStep === currentCopy().steps.length - 1) isComplete = true;
  else currentStep += 1;
  answerInput.value = "";
  saveStatus.textContent = "";
  renderChat();
  renderProfile();
  saveCharacterCheckpoint();
}

function textValue(value, fallback) {
  if (Array.isArray(value)) return value.join(", ");
  return String(value || fallback);
}

function numberValue(value, fallback, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(number)));
}

function parseStructuredResponse(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const objectText = fenced || text.match(/\{[\s\S]*\}/)?.[0];
  if (!objectText) throw new Error(currentCopy().invalidAi);
  try {
    return JSON.parse(objectText);
  } catch {
    throw new Error(currentCopy().invalidAi);
  }
}

async function callProxy(messages) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: "gpt-5.6-luna", stream: false, messages }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || payload.error || currentCopy().proxyError);
  const content = payload.message?.content;
  if (!content) throw new Error(currentCopy().proxyError);
  return content;
}

function characterDesignPrompt() {
  const languageName = currentLocale === "zh" ? "Simplified Chinese" : currentLocale === "ms" ? "Malay" : "English";
  return `Create a production-ready 2D game character from this student's idea and guided answers.

Student's creative idea:
${creativePromptInput.value.trim() || "The student has not written a separate idea. Expand the guided answers with imagination."}

Guided answers:
${JSON.stringify(answers, null, 2)}

Return ONLY valid JSON. Write all descriptive text in ${languageName}. Use exactly this shape:
{
  "character": {
    "name": "...",
    "role": "...",
    "focusAttribute": "one or more of strength, agility, speed, vitality, defense, intelligence, magic, spirit, luck, or charisma",
    "weapon": "...",
    "combatStyle": "...",
    "weakness": "...",
    "visualHook": "...",
    "visualIdentity": "...",
    "gameplayRole": "...",
    "movementFeel": "...",
    "silhouette": "...",
    "emotionalHook": "...",
    "palette": ["#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB"]
  },
  "spriteDirection": "A concise art direction for a pixel-art sprite sheet."
}

Use the role to suggest sensible attribute combinations: warriors often value strength, vitality, or defense; rogues value agility, speed, or luck; rangers value agility, speed, or precision; mages value intelligence, magic, or spirit; healers value spirit, intelligence, or vitality; tanks value strength, vitality, or defense; summoners value intelligence, magic, or spirit; engineers value intelligence, defense, or luck. Keep the student's choices when they provide their own combination. Make the silhouette readable at small size and make the gameplay role concrete.`;
}

function normalizeDesign(raw) {
  const character = raw.character || raw;
  return {
    name: textValue(character.name, answers.name),
    role: textValue(character.role || character.gameplayRole, answers.role),
    focusAttribute: textValue(character.focusAttribute || character.attribute, answers.focusAttribute),
    weapon: textValue(character.weapon, answers.weapon),
    combatStyle: textValue(character.combatStyle || character.combat, answers.combatStyle),
    weakness: textValue(character.weakness, answers.weakness),
    visualHook: textValue(character.visualHook, answers.visualHook),
    visualIdentity: textValue(character.visualIdentity || character.visual, "A readable pixel-art hero with one strong shape."),
    gameplayRole: textValue(character.gameplayRole || character.role, "A flexible player character."),
    movementFeel: textValue(character.movementFeel || character.movement, "Responsive and expressive."),
    silhouette: textValue(character.silhouette, "A clear head, body, and signature prop."),
    emotionalHook: textValue(character.emotionalHook || character.emotion, "A brave hero carrying a private worry."),
    palette: Array.isArray(character.palette) && character.palette.length ? character.palette.slice(0, 6) : ["#c7f36b", "#7065e5", "#edf3e9", "#18251f"],
    spriteDirection: textValue(raw.spriteDirection || raw.sprite_direction, "Readable pixel art with four-frame movement cycles."),
  };
}

function defaultSpriteSheet() {
  return {
      frameWidth: 64,
      frameHeight: 64,
      columns: 8,
      rows: [
      { key: "idle", frames: 1, fps: 1 },
      { key: "walk", frames: 8, fps: 12 },
      { key: "run", frames: 8, fps: 18 },
      { key: "attack", frames: 4, fps: 10 },
      { key: "jump", frames: 4, fps: 7 },
      { key: "hurt", frames: 4, fps: 5 },
      { key: "death", frames: 4, fps: 6 },
    ],
  };
}

function normalizeSpriteSheet(raw) {
  const sheet = raw.spriteSheet || raw.sheet || raw;
  const defaults = defaultSpriteSheet();
  const rawRows = Array.isArray(sheet.rows) ? sheet.rows : Array.isArray(sheet.animations) ? sheet.animations : sheet.rows || sheet.animations;
  const sourceRows = Array.isArray(rawRows)
    ? rawRows
    : rawRows && typeof rawRows === "object"
      ? Object.entries(rawRows).map(([key, value]) => ({ key, ...(value && typeof value === "object" ? value : {}) }))
      : [];
  const keys = ["idle", "walk", "run", "attack", "jump", "hurt", "death"];
  return {
    frameWidth: numberValue(sheet.frameWidth, 64, 32, 512),
    frameHeight: numberValue(sheet.frameHeight, 64, 32, 512),
    columns: 8,
    rows: keys.map((key, index) => {
      const source = sourceRows.find((row) => row && (row.key === key || row.name === key)) || defaults.rows[index];
      return {
        key,
        frames: defaults.rows[index].frames,
        fps: key === "idle" ? 1 : numberValue(source.fps, defaults.rows[index].fps, 1, 24),
      };
    }),
    direction: textValue(sheet.direction || raw.spriteDirection, aiDesign?.spriteDirection || "Eight-phase walk and run cycles with alternating leading legs."),
    assetUrl: textValue(sheet.assetUrl || sheet.asset?.assetUrl, "") || null,
  };
}

function normalizeMovement(raw) {
  const movement = raw.movement || raw;
  return {
    speed: numberValue(movement.speed, 160, 60, 360),
    acceleration: numberValue(movement.acceleration, 900, 100, 2000),
    jumpForce: numberValue(movement.jumpForce || movement.jump, 340, 180, 600),
    gravity: numberValue(movement.gravity, 980, 400, 1800),
    notes: textValue(movement.notes || movement.feel, aiDesign?.movementFeel || "Responsive movement with a light jump."),
  };
}

function renderAiDesign() {
  aiDesignElement.innerHTML = "";
  aiDesignElement.classList.toggle("empty-design", !aiDesign);
  if (!aiDesign) {
    aiDesignElement.textContent = currentCopy().designEmpty;
    return;
  }
  const fields = [
    ["designRole", aiDesign.role],
    ["designAttribute", aiDesign.focusAttribute],
    ["designWeapon", aiDesign.weapon],
    ["designCombat", aiDesign.combatStyle],
    ["designVisual", aiDesign.visualIdentity],
    ["designRole", aiDesign.gameplayRole],
    ["designMovement", aiDesign.movementFeel],
    ["designSilhouette", aiDesign.silhouette],
    ["designHook", aiDesign.emotionalHook],
  ];
  const heading = document.createElement("h3");
  heading.textContent = aiDesign.name;
  aiDesignElement.append(heading);
  fields.forEach(([labelKey, value]) => {
    const item = document.createElement("div");
    item.className = "design-item";
    const label = document.createElement("span");
    label.textContent = currentCopy()[labelKey];
    const content = document.createElement("p");
    content.textContent = value;
    item.append(label, content);
    aiDesignElement.append(item);
  });
  const paletteLabel = document.createElement("span");
  paletteLabel.className = "design-label";
  paletteLabel.textContent = currentCopy().designPalette;
  const palette = document.createElement("div");
  palette.className = "palette-row";
  aiDesign.palette.forEach((color) => {
    const swatch = document.createElement("span");
    swatch.className = "palette-swatch";
    swatch.style.background = color;
    swatch.title = color;
    palette.append(swatch);
  });
  aiDesignElement.append(paletteLabel, palette);
  const direction = document.createElement("p");
  direction.className = "sprite-direction";
  direction.textContent = `${currentCopy().designPrompt}: ${aiDesign.spriteDirection}`;
  aiDesignElement.append(direction);
}

function renderAnimationOptions() {
  const oldValue = selectedAnimation;
  animationSelect.innerHTML = "";
  ["idle", "walk", "run", "attack", "jump", "hurt", "death"].forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = currentCopy()[key];
    animationSelect.append(option);
  });
  animationSelect.value = oldValue;
}

function buildPromptForSpriteSheet() {
  return `Turn this 2D character design into a sprite-sheet and movement plan.

Character design:
${JSON.stringify(aiDesign, null, 2)}

Return ONLY valid JSON in ${currentLocale === "zh" ? "Simplified Chinese" : currentLocale === "ms" ? "Malay" : "English"} with exactly this shape:
{
  "spriteSheet": {
    "frameWidth": 64,
    "frameHeight": 64,
    "columns": 8,
    "rows": [
      {"key":"idle","frames":1,"fps":1},
      {"key":"walk","frames":8,"fps":12},
      {"key":"run","frames":8,"fps":18},
      {"key":"attack","frames":4,"fps":10},
      {"key":"jump","frames":4,"fps":7},
      {"key":"hurt","frames":4,"fps":5},
      {"key":"death","frames":4,"fps":6}
    ],
    "direction":"..."
  },
  "movement": {
    "speed": 160,
    "acceleration": 900,
    "jumpForce": 340,
    "gravity": 980,
    "notes":"..."
  }
}

Keep seven rows: idle, walk, run, attack, jump, hurt, and death. Idle has one static neutral pose. Walk and run each have EIGHT phases: near-foot contact, down, passing, up, far-foot contact, down, opposite passing, up. The same anatomical near leg must move from in front to behind the hips; the legs overlap at passing, not stay apart in a standing pose. Run has bent recovery knees, longer strides and airborne phases. Other actions have four frames. Feet must remain visible under robes and capes. Adapt this to the student's anatomy without adding legs to legless characters. Values must be practical for a beginner's 2D platform game.

Asset requirement: every generated character reference and exported animation frame must use a genuinely transparent alpha background. Do not bake in white, black, blue, green, gray, gradient, floor, glow haze, or a checkerboard background. Keep the complete character, weapon, hair, cloth, and effects inside consistent frame margins with the same anchor point. Do not add attack or magic effects to idle, walk, or run rows.`;
}

async function buildCharacter() {
  if (!isComplete) return;
  if (generationInProgress) return;
  if (spriteSheet?.assetUrl) {
    productionWorkspace.hidden = false;
    renderAiDesign(); renderAnimationOptions(); drawSpriteSheet();
    saveStatus.textContent = "Using your saved sprite sheet. Change the guide to create a new character.";
    return;
  }
  if (aiDesign) {
    productionWorkspace.hidden = false;
    await createSpriteSheet();
    return;
  }
  setGenerationState(true, "design");
  buildButton.disabled = true;
  designStatus.textContent = currentCopy().building;
  saveStatus.textContent = "";
  try {
    const response = await callProxy([
      { role: "system", content: "You are a patient 2D game design mentor. Preserve student creativity, make the result concrete, and follow the requested JSON format exactly." },
      { role: "user", content: characterDesignPrompt() },
    ]);
    aiDesign = normalizeDesign(parseStructuredResponse(response));
    spriteSheet = null;
    spriteAsset = null;
    spriteImage = null;
    movementSpec = null;
    saveSpriteButton.disabled = true;
    productionWorkspace.hidden = false;
    designStatus.textContent = currentCopy().ready;
    createSpriteButton.disabled = true;
    renderAiDesign();
    renderProfile();
    saveCharacterCheckpoint();
    updateGenerationProgress("sprite");
    await createSpriteSheet(true);
    productionWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    designStatus.textContent = currentCopy().waiting;
    saveStatus.textContent = error.message || currentCopy().proxyError;
  } finally {
    setGenerationState(false);
    buildButton.disabled = false;
    createSpriteButton.disabled = !aiDesign;
    saveSpriteButton.disabled = !spriteAsset;
    saveButton.disabled = !spriteAsset;
  }
}

async function createSpriteSheet(fromBuild = false) {
  if (!aiDesign) return;
  if (spriteSheet?.assetUrl) {
    productionWorkspace.hidden = false;
    renderAnimationOptions(); drawSpriteSheet();
    saveStatus.textContent = "Using your saved sprite sheet. Change the guide to create a new character.";
    return;
  }
  if (generationInProgress && fromBuild !== true) return;
  if (generationInProgress && generationStage !== "sprite") updateGenerationProgress("sprite");
  const ownsGenerationLock = !generationInProgress;
  if (ownsGenerationLock) setGenerationState(true, "sprite");
  createSpriteButton.disabled = true;
  spriteStatus.textContent = currentCopy().spriteBuilding;
  try {
    const response = await callProxy([
      { role: "system", content: "You are a 2D animation mentor. Return only valid JSON and keep the requested keys stable." },
      { role: "user", content: buildPromptForSpriteSheet() },
    ]);
    const parsed = parseStructuredResponse(response);
    const plan = normalizeSpriteSheet(parsed);
    const generated = await requestGeneratedSpriteSheet(plan);
    const nextSheet = {
      ...plan,
      ...generated.spriteSheet,
      asset: generated,
      assetUrl: generated.assetUrl,
    };
    const nextImage = await loadSpriteImage(nextSheet.assetUrl);
    spriteSheet = nextSheet;
    spriteAsset = generated;
    movementSpec = normalizeMovement(parsed);
    selectedAnimation = "idle";
    spriteImage = nextImage;
    renderAnimationOptions();
    drawSpriteSheet();
    spriteStatus.textContent = currentCopy().ready;
    saveCharacterCheckpoint();
    saveSpriteButton.disabled = generationInProgress;
    saveButton.disabled = generationInProgress;
  } catch (error) {
    spriteStatus.textContent = currentCopy().waiting;
    saveStatus.textContent = error.message || currentCopy().proxyError;
  } finally {
    if (ownsGenerationLock) {
      setGenerationState(false);
      createSpriteButton.disabled = false;
      saveSpriteButton.disabled = !spriteAsset;
      saveButton.disabled = !spriteAsset;
    }
  }
}

async function requestGeneratedSpriteSheet(plan) {
  const response = await fetch("/api/sprites/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      character: aiDesign,
      spriteSheet: plan,
      locale: currentLocale,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || currentCopy().proxyError);
  return payload;
}

function loadSpriteImage(assetUrl) {
  if (!assetUrl) return Promise.reject(new Error("The generated sprite sheet has no asset URL."));
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The generated sprite sheet could not be loaded."));
    image.src = assetUrl;
  });
}

function spriteImageForDisplay() {
  if (!spriteImage || !spriteSheet) return null;
  if (cleanedSpriteSource === spriteImage) return cleanedSpriteImage;
  const { frameWidth, frameHeight, columns, rows } = spriteSheet;
  const canvas = document.createElement("canvas");
  canvas.width = frameWidth * columns;
  canvas.height = frameHeight * rows.length;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.imageSmoothingEnabled = false;
  context.drawImage(spriteImage, 0, 0, canvas.width, canvas.height);

  // A generated next-row pose can leave a detached head inside the idle cell.
  // Keep the main idle figure and remove only a later island separated by a
  // transparent band; the other animation rows are untouched.
  const idle = context.getImageData(0, 0, frameWidth, frameHeight);
  const bands = [];
  for (let y = 0; y < frameHeight; y += 1) {
    let pixels = 0;
    for (let x = 0; x < frameWidth; x += 1) {
      if (idle.data[(y * frameWidth + x) * 4 + 3] > 32) pixels += 1;
    }
    if (!pixels) continue;
    const previous = bands[bands.length - 1];
    if (previous && y - previous.end < 8) { previous.end = y; previous.pixels += pixels; }
    else bands.push({ end: y, pixels });
  }
  const main = bands.reduce((largest, band) => !largest || band.pixels > largest.pixels ? band : largest, null);
  idleCleanupApplied = Boolean(main && bands.some((band) => band.end > main.end));
  if (idleCleanupApplied) {
    context.clearRect(0, main.end + 1, frameWidth, frameHeight - main.end - 1);
  }
  cleanedSpriteSource = spriteImage;
  cleanedSpriteImage = canvas;
  return canvas;
}

function canvasBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("The sprite sheet could not be exported."));
    }, "image/png");
  });
}

function animationFrameCount(row) {
  if (!row) return 1;
  return row.key === "idle" ? 1 : Math.max(1, Math.min(row.frames || 1, spriteSheet?.columns || 4));
}

async function saveSpriteSheetAsset() {
  if (!spriteSheet) return null;
  if (spriteAsset && !idleCleanupApplied) return spriteAsset;
  saveSpriteButton.disabled = true;
  try {
    // Export the transparent cleaned sheet, not the on-screen grid/background.
    let blob;
    if (spriteImage) blob = await canvasBlob(spriteImageForDisplay());
    else if (spriteSheet.assetUrl) {
      const source = await fetch(spriteSheet.assetUrl);
      if (!source.ok) throw new Error(currentCopy().saveError);
      blob = await source.blob();
    } else blob = await canvasBlob(spriteSheetCanvas);
    const characterName = (aiDesign?.name || answers.name || "character")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "character";
    const response = await fetch("/api/assets?module=character-creation", {
      method: "POST",
      headers: {
        "content-type": "image/png",
        "x-file-name": `${characterName}-sprite-sheet.png`,
      },
      body: blob,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || currentCopy().saveError);
    spriteAsset = payload;
    spriteSheet = { ...spriteSheet, asset: spriteAsset, assetUrl: spriteAsset.assetUrl };
    idleCleanupApplied = false;
    await saveCharacterCheckpoint();
    spriteStatus.textContent = currentCopy().spriteSaved;
    return spriteAsset;
  } finally {
    saveSpriteButton.disabled = Boolean(spriteAsset) || !spriteSheet;
  }
}

function colorAt(index, fallback) {
  return aiDesign?.palette?.[index] || fallback;
}

function drawActor(context, x, y, width, height, rowIndex, frameIndex, scale = 1) {
  const unit = Math.max(2, Math.floor(Math.min(width, height) / 28)) * scale;
  const cycle = frameIndex % 4;
  const bob = rowIndex === 0 ? [0, -unit, 0, -unit][cycle] : 0;
  const walking = rowIndex === 1 || rowIndex === 2;
  const attacking = rowIndex === 3;
  const airborne = rowIndex === 4;
  const hurt = rowIndex === 5;
  const defeated = rowIndex === 6;
  const legOffset = walking ? [unit, -unit, -unit, unit][cycle] : 0;
  const centerX = x + width / 2;
  const groundY = y + height - unit * 5;
  context.save();
  context.imageSmoothingEnabled = false;
  context.fillStyle = "rgba(0, 0, 0, 0.28)";
  context.fillRect(centerX - unit * (airborne ? 3 : 5), y + height - unit * 2, unit * (airborne ? 6 : 10), unit * 2);
  context.translate(centerX, bob + (airborne ? -unit * 3 : 0));
  if (defeated) context.rotate(-0.85);
  context.fillStyle = colorAt(1, "#7065e5");
  context.fillRect(-unit * 6, groundY - y - unit * 12, unit * 12, unit * 12);
  context.fillStyle = colorAt(0, "#c7f36b");
  context.fillRect(-unit * 5, groundY - y - unit * 21, unit * 10, unit * 9);
  context.fillStyle = colorAt(2, "#edf3e9");
  context.fillRect(-unit * 3, groundY - y - unit * 18, unit * 2, unit * 2);
  context.fillRect(unit, groundY - y - unit * 18, unit * 2, unit * 2);
  context.fillStyle = hurt ? "#f3bd75" : colorAt(1, "#7065e5");
  context.fillRect(
    attacking ? unit * 5 : -unit * 10,
    groundY - y - unit * 10 + (cycle === 1 ? unit : 0),
    attacking ? unit * 11 : unit * 4,
    unit * 3,
  );
  context.fillRect(
    attacking ? -unit * 16 : unit * 6,
    groundY - y - unit * 10 + (cycle === 3 ? unit : 0),
    attacking ? unit * 11 : unit * 4,
    unit * 3,
  );
  context.fillStyle = colorAt(3, "#18251f");
  context.fillRect(-unit * 5 + legOffset, groundY - y, unit * 4, unit * 5);
  context.fillRect(unit + legOffset * -1, groundY - y, unit * 4, unit * 5);
  context.restore();
}

function drawSpriteFrame(context, x, y, width, height, rowIndex, frameIndex, flipX = false) {
  context.save();
  context.imageSmoothingEnabled = false;
  if (flipX) {
    context.translate(x + width, y);
    context.scale(-1, 1);
    x = 0;
    y = 0;
  }
  if (!spriteImage || !spriteSheet) {
    drawActor(context, x, y, width, height, rowIndex, frameIndex);
    context.restore();
    return;
  }
  const sourceX = frameIndex * spriteSheet.frameWidth;
  const sourceY = rowIndex * spriteSheet.frameHeight;
  context.drawImage(
    spriteImageForDisplay(),
    sourceX,
    sourceY,
    spriteSheet.frameWidth,
    spriteSheet.frameHeight,
    x,
    y,
    width,
    height,
  );
  context.restore();
}

function drawSpriteSheet() {
  if (!spriteSheet) return;
  const { frameWidth, frameHeight, columns, rows } = spriteSheet;
  spriteSheetCanvas.width = frameWidth * columns;
  spriteSheetCanvas.height = frameHeight * rows.length;
  spriteContext.fillStyle = "#0d1713";
  spriteContext.fillRect(0, 0, spriteSheetCanvas.width, spriteSheetCanvas.height);
  if (spriteImage) {
    spriteContext.imageSmoothingEnabled = false;
    spriteContext.drawImage(spriteImageForDisplay(), 0, 0, spriteSheetCanvas.width, spriteSheetCanvas.height);
  }
  rows.forEach((row, rowIndex) => {
    for (let frameIndex = 0; frameIndex < columns; frameIndex += 1) {
      const x = frameIndex * frameWidth;
      const y = rowIndex * frameHeight;
      spriteContext.strokeStyle = "rgba(199, 243, 107, 0.16)";
      spriteContext.strokeRect(x + 0.5, y + 0.5, frameWidth - 1, frameHeight - 1);
      if (!spriteImage) drawActor(spriteContext, x, y, frameWidth, frameHeight, rowIndex, frameIndex);
    }
  });
}

function drawSpritePreview(now) {
  const width = spritePreviewCanvas.width;
  const height = spritePreviewCanvas.height;
  spritePreviewContext.clearRect(0, 0, width, height);
  spritePreviewContext.fillStyle = "#0d1713";
  spritePreviewContext.fillRect(0, 0, width, height);
  if (!spriteSheet) {
    spritePreviewContext.fillStyle = "#9aa99e";
    spritePreviewContext.font = "13px DM Mono, monospace";
    spritePreviewContext.fillText(currentCopy().waiting, 18, 28);
    return;
  }
  const rowIndex = Math.max(0, spriteSheet.rows.findIndex((row) => row.key === selectedAnimation));
  const row = spriteSheet.rows[rowIndex];
  const frameCount = animationFrameCount(row);
  const frameIndex = isPlaying ? Math.floor((now / 1000) * row.fps) % frameCount : 0;
  drawSpriteFrame(spritePreviewContext, 15, 15, width - 30, height - 30, rowIndex, frameIndex);
  spritePreviewContext.fillStyle = "#9aa99e";
  spritePreviewContext.font = "12px DM Mono, monospace";
  spritePreviewContext.fillText(currentCopy()[selectedAnimation] || selectedAnimation, 14, height - 12);
}

function drawMovement(now) {
  const width = movementCanvas.width;
  const height = movementCanvas.height;
  movementContext.clearRect(0, 0, width, height);
  movementContext.fillStyle = "#0d1713";
  movementContext.fillRect(0, 0, width, height);
  movementContext.fillStyle = "#18251f";
  movementContext.fillRect(0, height - 58, width, 58);
  movementContext.strokeStyle = "#34453a";
  movementContext.beginPath();
  movementContext.moveTo(0, height - 58.5);
  movementContext.lineTo(width, height - 58.5);
  movementContext.stroke();
  if (!spriteSheet) {
    movementKeymap.dataset.state = "waiting";
    movementCanvas.dataset.animation = "waiting";
    movementContext.fillStyle = "#9aa99e";
    movementContext.font = "16px DM Mono, monospace";
    movementContext.fillText(currentCopy().designEmpty, 20, 36);
    return;
  }
  const delta = Math.min(0.04, (now - (lastFrameTime || now)) / 1000);
  const direction = keys.has("ArrowRight") || keys.has("d") ? 1 : keys.has("ArrowLeft") || keys.has("a") ? -1 : 0;
  if (direction) facingDirection = direction;
  const speed = (movementSpec?.speed || 160) * (keys.has("Shift") ? 1.6 : 1);
  if (!isDead) {
    movementState.x = Math.max(0.08, Math.min(0.92, movementState.x + (direction * speed * delta) / width));
    if ((keys.has(" ") || keys.has("Spacebar")) && movementState.grounded) {
      movementState.velocityY = -(movementSpec?.jumpForce || 340);
      movementState.grounded = false;
    }
    movementState.velocityY += (movementSpec?.gravity || 980) * delta;
    movementState.y += movementState.velocityY * delta;
  }
  const floor = height - 58;
  if (movementState.y >= 0) {
    movementState.y = 0;
    movementState.velocityY = 0;
    movementState.grounded = true;
  }
  if (!isDead && forcedPose && now >= forcedPoseUntil) forcedPose = null;
  const rowKey = isDead ? "death" : forcedPose || (!movementState.grounded ? "jump" : direction ? (keys.has("Shift") ? "run" : "walk") : "idle");
  if (movementKeymap.dataset.state !== rowKey) movementKeymap.dataset.state = rowKey;
  const directionValue = String(direction);
  if (movementKeymap.dataset.direction !== directionValue) movementKeymap.dataset.direction = directionValue;
  movementCanvas.dataset.animation = rowKey;
  const rowIndex = Math.max(0, spriteSheet.rows.findIndex((row) => row.key === rowKey));
  const row = spriteSheet.rows[rowIndex];
  const frameCount = animationFrameCount(row);
  const frameIndex = isPlaying ? Math.floor((now / 1000) * row.fps) % frameCount : 0;
  const spriteSize = 150;
  drawSpriteFrame(
    movementContext,
    movementState.x * width - spriteSize / 2,
    floor - spriteSize + movementState.y,
    spriteSize,
    spriteSize,
    rowIndex,
    frameIndex,
    facingDirection < 0,
  );
  movementContext.fillStyle = "#9aa99e";
  movementContext.font = "14px DM Mono, monospace";
  movementContext.fillText(currentCopy()[rowKey] || rowKey, 20, 28);
}

function setPose(pose, duration = 0) {
  isDead = pose === "death";
  forcedPose = pose;
  forcedPoseUntil = duration ? performance.now() + duration : Number.POSITIVE_INFINITY;
  selectedAnimation = pose;
  animationSelect.value = pose;
}

function resetPose() {
  isDead = false;
  forcedPose = null;
  forcedPoseUntil = 0;
  selectedAnimation = "idle";
  animationSelect.value = selectedAnimation;
  movementState.y = 0;
  movementState.velocityY = 0;
  movementState.grounded = true;
}

function animationLoop(now) {
  drawSpritePreview(now);
  drawMovement(now);
  lastFrameTime = now;
  window.requestAnimationFrame(animationLoop);
}

async function saveCharacter() {
  if (!isComplete) return;
  saveButton.disabled = true;
  saveStatus.textContent = "";
  const conversation = [...chatLog.querySelectorAll(".chat-message")].map((message) => ({
    role: message.classList.contains("user") ? "user" : "guide",
    text: message.querySelector(".message-body").textContent,
  }));
  try {
    if (spriteSheet && (!spriteAsset || idleCleanupApplied)) await saveSpriteSheetAsset();
    const response = await fetch("/api/characters", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        moduleSlug: "character-creation",
        learnerId,
        locale: currentLocale,
        creativePrompt: creativePromptInput.value.trim(),
        profile: answers,
        conversation,
        aiDesign,
        spriteSheet,
        movement: movementSpec,
      }),
    });
    if (!response.ok) throw new Error("Save failed");
    const saved = await response.json();
    spriteAsset = saved.finalGameAsset || spriteAsset;
    spriteSheet = saved.spriteSheet || spriteSheet;
    showManifestLink(saved.finalGameAsset?.metadataAsset);
    await saveCharacterCheckpoint();
    saveStatus.textContent = currentCopy().saveSuccess;
  } catch {
    saveStatus.textContent = currentCopy().saveError;
    saveButton.disabled = false;
  }
}

document.querySelector("#copy-prompt").addEventListener("click", async () => {
  if (!isComplete) return;
  await navigator.clipboard.writeText(generatedPrompt.textContent);
  saveStatus.textContent = currentCopy().copied;
});

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitAnswer(answerInput.value);
});

buildButton.addEventListener("click", buildCharacter);
createSpriteButton.addEventListener("click", createSpriteSheet);
saveSpriteButton.addEventListener("click", async () => {
  try {
    await saveSpriteSheetAsset();
  } catch (error) {
    saveStatus.textContent = error.message || currentCopy().saveError;
    saveSpriteButton.disabled = false;
  }
});
saveButton.addEventListener("click", saveCharacter);
testAttackButton.addEventListener("click", () => setPose("attack", 900));
testDeathButton.addEventListener("click", () => setPose("death"));
resetPoseButton.addEventListener("click", resetPose);

animationSelect.addEventListener("change", () => {
  selectedAnimation = animationSelect.value;
});

playButton.addEventListener("click", () => {
  isPlaying = !isPlaying;
  playButton.textContent = isPlaying ? currentCopy().pause : currentCopy().play;
});

creativePromptInput.addEventListener("change", saveCharacterCheckpoint);

loadTemplateButton.addEventListener("click", loadSelectedTemplate);
previewTemplateButton.addEventListener("click", previewTemplate);
templateSelect.addEventListener("change", () => { previewTemplateButton.disabled = generationInProgress || !templateSelect.value; });

window.addEventListener("keydown", (event) => {
  if (generationInProgress || ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
  if (event.key.toLowerCase() === "i") {
    resetPose();
    event.preventDefault();
    return;
  }
  if (["j", "f"].includes(event.key.toLowerCase())) {
    setPose("attack", 900);
    event.preventDefault();
    return;
  }
  if (event.key.toLowerCase() === "x") {
    setPose("death");
    event.preventDefault();
    return;
  }
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (["ArrowLeft", "ArrowRight", "a", "d", " ", "Spacebar", "Shift"].includes(key)) {
    keys.add(key);
    if ([" ", "ArrowLeft", "ArrowRight"].includes(event.key)) event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key));
window.addEventListener("blur", () => keys.clear());

languageToggle.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-locale]");
  if (!button) return;
  currentLocale = button.dataset.locale;
  window.localStorage.setItem("godot-forge-locale", currentLocale);
  applyCopy();
});

applyCopy();
restoreCharacterCheckpoint();
window.requestAnimationFrame(animationLoop);
