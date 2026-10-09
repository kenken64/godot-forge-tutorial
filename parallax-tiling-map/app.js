const moduleSlug = 'parallax-tiling-map';
const learnerId = (() => {
  const key = 'godot-forge-learner-id';
  let value = localStorage.getItem(key);
  if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); }
  return value;
})();

const CELL = 48, COLS = 60, ROWS = 12, VIEW_WIDTH = 960, VIEW_HEIGHT = ROWS * CELL, PAGE_COUNT = Math.ceil(COLS * CELL / VIEW_WIDTH);
const copy = {
  en: {
    title: 'Parallax & Tilemaps · Godot Forge', back: '← GODOT FORGE / LEARNING PATH', chapter: 'CHAPTER 05 / WORLD BUILDING', language: 'Language', homeAria: 'Godot Forge home', learningGoalsAria: 'Learning goals',
    introEyebrow: 'LEVEL WORKSHOP / PHASER PREVIEW', pageTitle: 'Build a world you can walk through.', introCopy: 'Place your generated assets on a tile grid, mark solid collision boundaries, then control one character through the scene.',
    conceptMapTitle: 'Compose the map', conceptMapCopy: 'Use a consistent grid so platforms align and can be edited predictably.', conceptCollisionTitle: 'Separate art from collision', conceptCollisionCopy: 'A tile can look solid without being solid. Mark the boundaries the player should touch.', conceptTestTitle: 'Test with a player', conceptTestCopy: 'Movement exposes gaps, blocked routes and platforms that only looked correct in the editor.',
    promptEyebrow: 'AI ART BREAKDOWN / REUSABLE PROMPTS', promptTitle: 'See the prompts that built this world.', promptIntro: 'Compare the role, composition and constraints in each prompt. Keeping those decisions consistent is what makes separate images feel like one game.', promptLoading: 'Loading the exact generation prompts…', promptUnavailable: 'The prompt record could not be loaded.', exactPrompt: 'EXACT PROMPT SENT TO GPT IMAGE', copyPrompt: 'COPY PROMPT', promptCopied: 'Generation prompt copied.', promptCopyError: 'The prompt could not be copied.',
    promptAssets: [{ title:'Far parallax background', purpose:'Builds depth, atmosphere and the distant silhouette without competing with gameplay.' },{ title:'Midground foliage & ruins', purpose:'Adds transparent scenery that scrolls at a different speed while keeping the play lane readable.' },{ title:'Tiles & gameplay props', purpose:'Uses an exact 4 × 4 grid and strict containment so the sheet can be sliced automatically.' },{ title:'Fallback forest explorer', purpose:'Defines a clean side profile, complete silhouette and transparent background for playable use.' },{ title:'Explorer walk & run', purpose:'Eight generated gait poses were aligned with the original idle art into twelve playable frames.' },{ title:'Explorer jump & landing', purpose:'Eight generated airborne and landing poses extend the atlas while grounded walk and run remain separate animation cycles.' }],
    workshopEyebrow: 'INTERACTIVE TILEMAP', workshopTitle: 'Build, collide, play', build: 'BUILD MODE', play: '▶ TEST LEVEL', assetPack: 'GAME ASSET PACK', character: 'PLAYER CHARACTER', refresh: 'REFRESH LIBRARY', loading: 'Loading saved assets…', loaded: (packs, chars) => `${packs} saved asset pack${packs === 1 ? '' : 's'} · ${chars} saved character${chars === 1 ? '' : 's'}`, fallbackTiles: 'GPT Image practice tiles & props', fallbackCharacter: 'GPT Image forest explorer', palette: 'TILE PALETTE', tiles: n => `${n} TILES`, tools: 'BUILD TOOLS', paint: 'PLACE TILE', collision: 'COLLISION', flip: 'FLIP LEFT / RIGHT', spawn: 'PLAYER START', erase: 'ERASE', solid: 'Make placed tiles solid', collisionLegend: 'Lime outline = collision boundary', spawnLegend: 'Violet marker = player start', panLeft: 'PAN LEFT', panRight: 'PAN RIGHT', view: (n, total) => `VIEW ${n} / ${total}`, clear: 'CLEAR MAP', confirmClear: 'CONFIRM CLEAR', buildNote: 'Choose a tile, then click the grid to place it. Use Flip to mirror an existing tile.', playNote: 'Walk through the level and check every landing, wall and route.', move: 'MOVE · A/D OR ←/→', jump: 'JUMP · W, ↑ OR SPACE', resetPlayer: 'RESET PLAYER', summary: (tiles, solids) => `${tiles} tiles · ${solids} collision boundaries`, checkpoint: 'Your layout is saved as a resumable learner checkpoint.', save: 'SAVE LAYOUT', complete: 'COMPLETE MODULE', completed: 'MODULE COMPLETE ✓', saved: 'Tilemap checkpoint saved.', saveError: 'The tilemap could not be saved. Please try again.', clearWarning: 'Click again to clear every placed tile. Your saved assets will remain available.', cleared: 'The tilemap was cleared.', needTile: 'Place a tile before assigning its collision boundary.', needFlipTile: 'Place a tile before flipping it.', flipped: 'Tile direction flipped.', toolSelected: name => `${name} selected.`, readyHint: 'Play-test the level before completing this module.', ready: 'Play-test complete. The module is ready to finish.', unavailable: 'The asset library is unavailable. Practice assets are ready instead.', packChanged: 'Asset pack changed.', characterChanged: 'Player character changed.',
  },
  zh: {
    title: '视差与瓦片地图 · Godot Forge', back: '← GODOT FORGE / 学习路径', chapter: '第 05 章 / 世界构建', language: '语言', homeAria: 'Godot Forge 首页', learningGoalsAria: '学习目标',
    introEyebrow: '关卡工坊 / PHASER 预览', pageTitle: '构建一个可以行走的世界。', introCopy: '把已生成的素材放到瓦片网格中，标记实体碰撞边界，然后控制一个角色穿过场景。',
    conceptMapTitle: '编排地图', conceptMapCopy: '使用统一网格，让平台整齐对齐并可预测地编辑。', conceptCollisionTitle: '分离美术与碰撞', conceptCollisionCopy: '看起来坚固的瓦片不一定具有实体碰撞。请标记玩家应接触的边界。', conceptTestTitle: '用玩家角色测试', conceptTestCopy: '实际移动能够发现缝隙、阻塞路线，以及只在编辑器中看似正确的平台。',
    promptEyebrow: 'AI 美术拆解 / 可复用提示词', promptTitle: '查看构建这个世界的提示词。', promptIntro: '比较每条提示词中的用途、构图与限制条件。保持这些决定一致，才能让不同图像看起来属于同一款游戏。', promptLoading: '正在载入精确的生成提示词…', promptUnavailable: '无法载入提示词记录。', exactPrompt: '发送至 GPT IMAGE 的精确提示词', copyPrompt: '复制提示词', promptCopied: '生成提示词已复制。', promptCopyError: '无法复制提示词。',
    promptAssets: [{ title:'远景视差背景', purpose:'营造深度、氛围和远处轮廓，同时不干扰玩法画面。' },{ title:'中景植被与遗迹', purpose:'通过透明场景和不同滚动速度增加层次，并保持游戏通道清晰。' },{ title:'瓦片与游戏道具', purpose:'使用精确的 4 × 4 网格和严格边界，让素材表可自动切割。' },{ title:'备用森林探险家', purpose:'定义清晰侧面、完整轮廓和透明背景，以便作为可玩角色。' },{ title:'探险家的步行与奔跑', purpose:'八个生成的步态姿势与原有待机美术对齐，组合成十二个可播放帧。' },{ title:'探险家的跳跃与落地', purpose:'八个生成的腾空和落地姿势扩展了素材表，地面的步行与奔跑仍使用独立动画循环。' }],
    workshopEyebrow: '互动瓦片地图', workshopTitle: '构建、碰撞、试玩', build: '构建模式', play: '▶ 测试关卡', assetPack: '游戏素材包', character: '玩家角色', refresh: '刷新素材库', loading: '正在载入已保存素材…', loaded: (packs, chars) => `${packs} 个素材包 · ${chars} 个角色`, fallbackTiles: 'GPT Image 练习瓦片与道具', fallbackCharacter: 'GPT Image 森林探险家', palette: '瓦片调色板', tiles: n => `${n} 个瓦片`, tools: '构建工具', paint: '放置瓦片', collision: '碰撞', flip: '左右翻转', spawn: '玩家起点', erase: '擦除', solid: '放置时设为实体', collisionLegend: '青柠色边框 = 碰撞边界', spawnLegend: '紫色标记 = 玩家起点', panLeft: '向左平移', panRight: '向右平移', view: (n, total) => `视图 ${n} / ${total}`, clear: '清空地图', confirmClear: '确认清空', buildNote: '选择瓦片，然后点击网格进行放置。使用“翻转”镜像已有瓦片。', playNote: '穿过关卡，检查每个落点、墙壁和路线。', move: '移动 · A/D 或 ←/→', jump: '跳跃 · W、↑ 或空格', resetPlayer: '重置玩家', summary: (tiles, solids) => `${tiles} 个瓦片 · ${solids} 个碰撞边界`, checkpoint: '布局会保存为可继续学习的检查点。', save: '保存布局', complete: '完成模块', completed: '模块已完成 ✓', saved: '瓦片地图检查点已保存。', saveError: '无法保存瓦片地图，请重试。', clearWarning: '再次点击将清除所有已放置瓦片；已保存的素材会保留。', cleared: '瓦片地图已清空。', needTile: '请先放置瓦片，再设置碰撞边界。', needFlipTile: '请先放置瓦片，再进行翻转。', flipped: '瓦片方向已翻转。', toolSelected: name => `已选择${name}。`, readyHint: '完成关卡试玩后即可完成本模块。', ready: '试玩完成，可以结束本模块。', unavailable: '素材库暂时不可用，已启用练习素材。', packChanged: '素材包已更换。', characterChanged: '玩家角色已更换。',
  },
  ms: {
    title: 'Paralaks & Peta Jubin · Godot Forge', back: '← GODOT FORGE / LALUAN PEMBELAJARAN', chapter: 'BAB 05 / PEMBINAAN DUNIA', language: 'Bahasa', homeAria: 'Laman utama Godot Forge', learningGoalsAria: 'Matlamat pembelajaran',
    introEyebrow: 'BENGKEL ARAS / PRATONTON PHASER', pageTitle: 'Bina dunia yang boleh diterokai.', introCopy: 'Letakkan aset yang dijana pada grid jubin, tandakan sempadan perlanggaran pepejal, kemudian kawal satu watak merentasi adegan.',
    conceptMapTitle: 'Susun peta', conceptMapCopy: 'Gunakan grid yang konsisten supaya platform sejajar dan boleh disunting dengan tepat.', conceptCollisionTitle: 'Pisahkan seni dan perlanggaran', conceptCollisionCopy: 'Jubin boleh kelihatan pepejal tanpa menjadi pepejal. Tandakan sempadan yang patut disentuh pemain.', conceptTestTitle: 'Uji dengan pemain', conceptTestCopy: 'Pergerakan mendedahkan jurang, laluan tersekat dan platform yang hanya kelihatan betul dalam penyunting.',
    promptEyebrow: 'PECAHAN SENI AI / PROM BOLEH GUNA SEMULA', promptTitle: 'Lihat prom yang membina dunia ini.', promptIntro: 'Bandingkan peranan, komposisi dan kekangan dalam setiap prom. Keputusan yang konsisten menjadikan imej berasingan kelihatan seperti satu permainan.', promptLoading: 'Memuatkan prom penjanaan yang tepat…', promptUnavailable: 'Rekod prom tidak dapat dimuatkan.', exactPrompt: 'PROM TEPAT YANG DIHANTAR KE GPT IMAGE', copyPrompt: 'SALIN PROM', promptCopied: 'Prom penjanaan telah disalin.', promptCopyError: 'Prom tidak dapat disalin.',
    promptAssets: [{ title:'Latar paralaks jauh', purpose:'Membina kedalaman, suasana dan siluet jauh tanpa mengganggu permainan.' },{ title:'Dedaun & runtuhan pertengahan', purpose:'Menambah pemandangan lutsinar yang bergerak pada kelajuan berlainan sambil mengekalkan laluan yang jelas.' },{ title:'Jubin & prop permainan', purpose:'Menggunakan grid 4 × 4 tepat dan kekangan ketat supaya helaian boleh dipotong secara automatik.' },{ title:'Penjelajah hutan sandaran', purpose:'Menentukan profil sisi, siluet lengkap dan latar lutsinar untuk kegunaan watak pemain.' },{ title:'Penjelajah berjalan & berlari', purpose:'Lapan pose gerakan yang dijana disejajarkan dengan seni pegun asal menjadi dua belas bingkai permainan.' },{ title:'Penjelajah melompat & mendarat', purpose:'Lapan pose di udara dan ketika mendarat melengkapkan atlas, sementara berjalan dan berlari di tanah kekal sebagai kitaran animasi berasingan.' }],
    workshopEyebrow: 'PETA JUBIN INTERAKTIF', workshopTitle: 'Bina, langgar, main', build: 'MOD BINA', play: '▶ UJI ARAS', assetPack: 'PEK ASET PERMAINAN', character: 'WATAK PEMAIN', refresh: 'SEGAR SEMULA PUSTAKA', loading: 'Memuatkan aset tersimpan…', loaded: (packs, chars) => `${packs} pek aset · ${chars} watak tersimpan`, fallbackTiles: 'Jubin & prop latihan GPT Image', fallbackCharacter: 'Penjelajah hutan GPT Image', palette: 'PALET JUBIN', tiles: n => `${n} JUBIN`, tools: 'ALAT BINAAN', paint: 'LETAK JUBIN', collision: 'PERLANGGARAN', flip: 'TERBALIK KIRI / KANAN', spawn: 'MULA PEMAIN', erase: 'PADAM', solid: 'Jadikan jubin yang diletakkan pepejal', collisionLegend: 'Garis hijau = sempadan perlanggaran', spawnLegend: 'Penanda ungu = mula pemain', panLeft: 'ANJAK KIRI', panRight: 'ANJAK KANAN', view: (n, total) => `PAPARAN ${n} / ${total}`, clear: 'KOSONGKAN PETA', confirmClear: 'SAHKAN KOSONGKAN', buildNote: 'Pilih jubin, kemudian klik grid untuk meletakkannya. Gunakan Terbalik untuk mencerminkan jubin sedia ada.', playNote: 'Berjalan melalui aras dan periksa setiap tempat mendarat, dinding dan laluan.', move: 'GERAK · A/D ATAU ←/→', jump: 'LOMPAT · W, ↑ ATAU SPACE', resetPlayer: 'SET SEMULA PEMAIN', summary: (tiles, solids) => `${tiles} jubin · ${solids} sempadan perlanggaran`, checkpoint: 'Susun atur anda disimpan sebagai titik sambung semula pelajar.', save: 'SIMPAN SUSUN ATUR', complete: 'LENGKAPKAN MODUL', completed: 'MODUL SELESAI ✓', saved: 'Titik semak peta jubin disimpan.', saveError: 'Peta jubin tidak dapat disimpan. Sila cuba lagi.', clearWarning: 'Klik sekali lagi untuk membuang semua jubin. Aset tersimpan anda akan kekal.', cleared: 'Peta jubin telah dikosongkan.', needTile: 'Letakkan jubin sebelum menetapkan sempadan perlanggaran.', needFlipTile: 'Letakkan jubin sebelum menterbalikkannya.', flipped: 'Arah jubin telah diterbalikkan.', toolSelected: name => `${name} dipilih.`, readyHint: 'Uji aras sebelum melengkapkan modul ini.', ready: 'Ujian selesai. Modul sedia dilengkapkan.', unavailable: 'Pustaka aset tidak tersedia. Aset latihan telah disediakan.', packChanged: 'Pek aset ditukar.', characterChanged: 'Watak pemain ditukar.',
  },
};

const tileGuides = {
  en: [
    ['Grass ground','Main solid floor for running and jumping.'],['Mossy stone','A durable solid block for walls or platforms.'],['Wooden platform','A raised foothold or bridge section.'],['Carved ruin','A sturdy block for ancient structures.'],
    ['Left grass edge','Finishes the left edge of a grass platform.'],['Center grass','Repeating middle section of a grass platform.'],['Right grass edge','Finishes the right edge of a grass platform.'],['Hanging vine','A gently swaying decorative vine.'],
    ['Fern','Animated foliage for the forest floor.'],['Glowing crystal','A softly pulsing magical landmark.'],['Mushroom cluster','A gently animated forest prop.'],['Wooden signpost','A direction marker for the player.'],
    ['Thorn patch','A hazard marker; add collision or damage logic later.'],['Stone step','A small foothold for vertical routes.'],['Broken pillar','Ancient scenery or a solid obstacle.'],['Treasure sprout','A softly glowing goal or pickup marker.'],
  ],
  zh: [
    ['草地地块','供玩家奔跑和跳跃的主要实体地面。'],['苔藓石块','可用于墙壁或平台的坚固实体方块。'],['木制平台','架高的落脚点或桥梁。'],['雕刻遗迹','用于古代建筑的坚固方块。'],
    ['左侧草地边缘','收尾草地平台的左边缘。'],['中央草地','草地平台可重复铺设的中段。'],['右侧草地边缘','收尾草地平台的右边缘。'],['垂挂藤蔓','轻轻摇摆的装饰性藤蔓。'],
    ['蕨类','森林地面的动态植被。'],['发光水晶','柔和闪烁的魔法路标。'],['蘑菇群','轻微动起来的森林道具。'],['木质路标','给玩家指明方向的标记。'],
    ['荆棘丛','危险区域标记；伤害逻辑可稍后添加。'],['石阶','垂直路线中的小落脚点。'],['断裂石柱','古代布景或实体障碍。'],['宝藏嫩芽','柔和发光的目标或拾取物标记。'],
  ],
  ms: [
    ['Tanah berumput','Lantai pepejal utama untuk berlari dan melompat.'],['Batu berlumut','Blok pepejal kukuh untuk dinding atau platform.'],['Platform kayu','Tempat berpijak tinggi atau bahagian jambatan.'],['Runtuhan berukir','Blok kukuh untuk binaan purba.'],
    ['Tepi rumput kiri','Menamatkan bahagian kiri platform berumput.'],['Rumput tengah','Bahagian tengah platform berumput yang boleh diulang.'],['Tepi rumput kanan','Menamatkan bahagian kanan platform berumput.'],['Sulur tergantung','Sulur hiasan yang berayun lembut.'],
    ['Pakis','Dedaun animasi di lantai hutan.'],['Kristal bercahaya','Tanda ajaib yang berdenyut lembut.'],['Kelompok cendawan','Prop hutan dengan gerakan halus.'],['Papan tanda kayu','Penanda arah untuk pemain.'],
    ['Tompok duri','Penanda bahaya; tambah logik kerosakan kemudian.'],['Anak tangga batu','Tempat berpijak kecil untuk laluan menegak.'],['Tiang patah','Pemandangan purba atau halangan pepejal.'],['Tunas harta karun','Penanda matlamat atau item yang bercahaya lembut.'],
  ],
};
const fallbackTileAnimations = {7:'sway',8:'sway',9:'glow',10:'pulse',15:'glow'};

Object.assign(copy.en, {
  polygon:'FREEFORM COLLISION', polygonHelp:'Click at least three points, then finish the collision shape.', undoPoint:'UNDO POINT', finishPolygon:'FINISH SHAPE', freeformLegend:'Orange shape = freeform collision',
  buildNote:'Choose a tile, then click the grid to place it. Pan across three screens or draw a freeform collision shape.', summary:(tiles,solids,polygons)=>`${tiles} tiles · ${solids} square boundaries · ${polygons} freeform shapes`,
  polygonPoint:'Collision point added.', polygonFinished:'Freeform collision shape created.', polygonNeedPoints:'Add at least three points to finish the shape.', polygonUndo:'Last collision point removed.', polygonEmpty:'There are no collision points to undo.',
  templateKicker:'REUSABLE SIDE-SCROLLER TEMPLATE', templateCopy:'Save the complete multi-screen layout, spawn point and collision shapes to the Final Game library.', templateName:'TEMPLATE NAME', templateLibrary:'SAVED TEMPLATES', noTemplates:'No templates saved', saveTemplate:'SAVE AS TEMPLATE', loadTemplate:'LOAD TEMPLATE', templateSaved:'Side-scroller template saved to Final Game.', templateLoaded:'Side-scroller template loaded.', templateNameRequired:'Enter a template name first.', templateSaveError:'The template could not be saved.',
  originalPrompt:'ORIGINAL ENGLISH PROMPT',
  runHelp:'RUN · HOLD SHIFT + MOVE',
  jump:'JUMP · W, ↑ OR SPACE · PRESS AGAIN IN AIR TO DOUBLE JUMP',
  tileNumber:index=>`Tile ${String(index+1).padStart(2,'0')}`, tileDescription:'Place this asset in the map; set collision separately.', tileAnimated:'ANIMATED TILE', tileStatic:'STATIC TILE',
});
Object.assign(copy.zh, {
  polygon:'自由形状碰撞', polygonHelp:'点击至少三个点，然后完成碰撞形状。', undoPoint:'撤销点', finishPolygon:'完成形状', freeformLegend:'橙色形状 = 自由碰撞区域',
  buildNote:'选择瓦片并点击网格放置。可横跨三个画面，或绘制自由碰撞形状。', summary:(tiles,solids,polygons)=>`${tiles} 个瓦片 · ${solids} 个方形边界 · ${polygons} 个自由形状`,
  polygonPoint:'已添加碰撞点。', polygonFinished:'已创建自由碰撞形状。', polygonNeedPoints:'至少添加三个点才能完成形状。', polygonUndo:'已移除最后一个碰撞点。', polygonEmpty:'没有可撤销的碰撞点。',
  templateKicker:'可复用横向卷轴模板', templateCopy:'将完整多画面布局、玩家起点和碰撞形状保存到“最终游戏”素材库。', templateName:'模板名称', templateLibrary:'已保存模板', noTemplates:'尚未保存模板', saveTemplate:'保存为模板', loadTemplate:'载入模板', templateSaved:'横向卷轴模板已保存到最终游戏。', templateLoaded:'横向卷轴模板已载入。', templateNameRequired:'请先输入模板名称。', templateSaveError:'无法保存模板。',
  originalPrompt:'英文原始提示词',
  runHelp:'奔跑 · 按住 SHIFT 并移动',
  jump:'跳跃 · W、↑ 或空格 · 空中再按一次可二段跳',
  tileNumber:index=>`瓦片 ${String(index+1).padStart(2,'0')}`, tileDescription:'在地图中放置此素材；碰撞边界需要单独设置。', tileAnimated:'动态瓦片', tileStatic:'静态瓦片',
});
Object.assign(copy.ms, {
  polygon:'PERLANGGARAN BENTUK BEBAS', polygonHelp:'Klik sekurang-kurangnya tiga titik, kemudian lengkapkan bentuk perlanggaran.', undoPoint:'BATAL TITIK', finishPolygon:'SIAPKAN BENTUK', freeformLegend:'Bentuk jingga = perlanggaran bentuk bebas',
  buildNote:'Pilih jubin dan klik grid untuk meletakkannya. Anjak merentasi tiga skrin atau lukis bentuk perlanggaran bebas.', summary:(tiles,solids,polygons)=>`${tiles} jubin · ${solids} sempadan segi empat · ${polygons} bentuk bebas`,
  polygonPoint:'Titik perlanggaran ditambah.', polygonFinished:'Bentuk perlanggaran bebas dicipta.', polygonNeedPoints:'Tambah sekurang-kurangnya tiga titik untuk menyiapkan bentuk.', polygonUndo:'Titik perlanggaran terakhir dibuang.', polygonEmpty:'Tiada titik perlanggaran untuk dibatalkan.',
  templateKicker:'TEMPLAT TATAL SISI BOLEH GUNA SEMULA', templateCopy:'Simpan susun atur berbilang skrin, titik mula dan bentuk perlanggaran ke pustaka Permainan Akhir.', templateName:'NAMA TEMPLAT', templateLibrary:'TEMPLAT TERSIMPAN', noTemplates:'Tiada templat tersimpan', saveTemplate:'SIMPAN SEBAGAI TEMPLAT', loadTemplate:'MUAT TEMPLAT', templateSaved:'Templat tatal sisi disimpan ke Permainan Akhir.', templateLoaded:'Templat tatal sisi dimuatkan.', templateNameRequired:'Masukkan nama templat dahulu.', templateSaveError:'Templat tidak dapat disimpan.',
  originalPrompt:'PROM ASAL BAHASA INGGERIS',
  runHelp:'LARI · TAHAN SHIFT SAMBIL BERGERAK',
  jump:'LOMPAT · W, ↑ ATAU SPACE · TEKAN LAGI DI UDARA UNTUK LOMPATAN KEDUA',
  tileNumber:index=>`Jubin ${String(index+1).padStart(2,'0')}`, tileDescription:'Letakkan aset ini dalam peta; tetapkan perlanggaran secara berasingan.', tileAnimated:'JUBIN ANIMASI', tileStatic:'JUBIN STATIK',
});
const textBindings = {
  'back-link':'back', 'chapter-label':'chapter', 'intro-eyebrow':'introEyebrow', 'page-title':'pageTitle', 'intro-copy':'introCopy',
  'concept-map-title':'conceptMapTitle', 'concept-map-copy':'conceptMapCopy', 'concept-collision-title':'conceptCollisionTitle', 'concept-collision-copy':'conceptCollisionCopy', 'concept-test-title':'conceptTestTitle', 'concept-test-copy':'conceptTestCopy',
  'prompt-eyebrow':'promptEyebrow', 'prompt-title':'promptTitle', 'prompt-intro':'promptIntro',
  'workshop-eyebrow':'workshopEyebrow', 'workshop-title':'workshopTitle', 'asset-pack-label':'assetPack', 'character-label':'character', 'refresh-library':'refresh', 'palette-label':'palette', 'tools-label':'tools', 'paint-label':'paint', 'collision-label':'collision', 'polygon-label':'polygon', 'flip-label':'flip', 'spawn-label':'spawn', 'erase-label':'erase', 'solid-label':'solid', 'polygon-help':'polygonHelp', 'undo-point':'undoPoint', 'finish-polygon':'finishPolygon', 'legend-collision':'collisionLegend', 'legend-freeform':'freeformLegend', 'legend-spawn':'spawnLegend', 'pan-left-label':'panLeft', 'pan-right-label':'panRight', 'move-help':'move', 'run-help':'runHelp', 'jump-help':'jump', 'reset-player':'resetPlayer', 'template-kicker':'templateKicker', 'template-copy':'templateCopy', 'template-name-label':'templateName', 'template-library-label':'templateLibrary', 'save-template':'saveTemplate', 'load-template':'loadTemplate', 'save-status':'checkpoint', 'save-layout':'save',
};

const starterPlacements = () => [
  ...Array.from({ length: COLS }, (_, x) => ({ x, y: ROWS - 1, frame: x % 4 === 3 ? 1 : 0, solid: true })),
  ...[6,7,8,13,14,20,21,22,26,33,34,35,41,42,49,50,51,57].map((x,index) => ({ x, y:[8,8,8,7,7,9,9,9,6,8,8,8,6,6,9,9,9,7][index], frame:2, solid:true })),
  { x:8, y:7, frame:9, solid:false }, { x:14, y:6, frame:10, solid:false }, { x:21, y:8, frame:8, solid:false }, { x:26, y:5, frame:15, solid:false }, { x:17, y:10, frame:11, solid:false }, { x:35,y:7,frame:10,solid:false }, { x:42,y:5,frame:9,solid:false }, { x:51,y:8,frame:8,solid:false }, { x:57,y:6,frame:11,solid:false },
];
let state = { version: 2, placements: starterPlacements(), collisionPolygons:[], spawn: { x: 2, y: 10 }, selectedPack: 'fallback', selectedCharacter: 'fallback', hasTested: false, cameraPage: 0 };
let locale = copy[localStorage.getItem('godot-forge-locale')] ? localStorage.getItem('godot-forge-locale') : 'en';
let assetPacks = [], characters = [], levelTemplates = [], selectedTile = 0, activeTool = 'paint', buildMode = true, completed = false, draftCollision = [];
let game, scene, player, tileGroup, collisionOverlay, spawnMarker, gridOverlay, farLayer, nearLayer, cursors, keys, walkAnimation, runAnimation, idleAnimation, jumpPoseFrames = [], gameGeneration = 0;
let lastGroundedAt = -Infinity, jumpQueuedUntil = -Infinity, jumpStartedAt = -Infinity, landingStartedAt = -Infinity, jumpsUsed = 0, wasAirborne = false, movementPhase = 'idle';
let saveTimer, clearTimer;
let generationPrompts = [], libraryStatus = 'loading';

const $ = selector => document.querySelector(selector);
const currentCopy = () => copy[locale];
const currentPack = () => assetPacks.find(item => item.id === state.selectedPack) || null;
const currentCharacter = () => characters.find(item => item.id === state.selectedCharacter) || null;
const frameCount = () => currentPack()?.manifest.cells?.length || 16;

function normalizeState(value) {
  if (!value || typeof value !== 'object') return;
  const placements = Array.isArray(value.placements) ? value.placements.filter(item => Number.isInteger(item.x) && Number.isInteger(item.y) && item.x >= 0 && item.x < COLS && item.y >= 0 && item.y < ROWS).map(item => ({ x:item.x, y:item.y, frame:Math.max(0, Number(item.frame) || 0), solid:Boolean(item.solid), flipped:Boolean(item.flipped) })) : starterPlacements();
  const spawn = value.spawn && Number.isInteger(value.spawn.x) && Number.isInteger(value.spawn.y) ? { x:Math.max(0,Math.min(COLS - 1,value.spawn.x)), y:Math.max(0,Math.min(ROWS - 1,value.spawn.y)) } : { x:2,y:10 };
  const collisionPolygons=Array.isArray(value.collisionPolygons) ? value.collisionPolygons.map(shape=>({points:(shape.points||[]).filter(point=>Number.isFinite(point.x)&&Number.isFinite(point.y)).map(point=>({x:Math.max(0,Math.min(COLS*CELL,Number(point.x))),y:Math.max(0,Math.min(VIEW_HEIGHT,Number(point.y)))}))})).filter(shape=>shape.points.length>=3) : [];
  state = { version:2, placements, collisionPolygons, spawn, selectedPack:String(value.selectedPack || 'fallback'), selectedCharacter:String(value.selectedCharacter || 'fallback'), hasTested:Boolean(value.hasTested), cameraPage:Math.max(0,Math.min(PAGE_COUNT-1,Number(value.cameraPage) || 0)) };
}

async function loadCheckpoint() {
  const response = await fetch(`/api/modules/${moduleSlug}/checkpoint?learnerId=${encodeURIComponent(learnerId)}`);
  if (response.ok) normalizeState((await response.json()).state);
  const modules = await (await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`)).json();
  completed = Boolean(modules.find(item => item.slug === moduleSlug)?.completed);
}

async function saveCheckpoint(showFeedback = false) {
  try {
    const response = await fetch(`/api/modules/${moduleSlug}/checkpoint`, { method:'PUT', headers:{'content-type':'application/json'}, body:JSON.stringify({ learnerId, state }) });
    if (!response.ok) throw new Error('Save failed');
    if (showFeedback) window.showToast?.(currentCopy().saved, 'success');
    $('#save-status').textContent = currentCopy().checkpoint;
    return true;
  } catch {
    $('#save-status').textContent = currentCopy().saveError;
    if (showFeedback) window.showToast?.(currentCopy().saveError, 'error');
    return false;
  }
}

function queueCheckpoint() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveCheckpoint(false), 500);
}

async function loadLibrary(showFeedback = false) {
  libraryStatus='loading';
  $('#library-status').textContent = currentCopy().loading;
  try {
    const response = await fetch('/api/assets?module=final-game');
    if (!response.ok) throw new Error('Library unavailable');
    const assets = await response.json();
    const manifests = [], templates = [];
    for (const asset of assets.filter(item => item.mimeType === 'application/json' || item.originalName.endsWith('.json'))) {
      const manifest = await fetch(asset.assetUrl).then(result => result.ok ? result.json() : null).catch(() => null);
      if (manifest?.kind === 'parallax-template') templates.push({ id:asset.storedName, label:manifest.name || asset.originalName, manifest });
      else if (manifest?.kind && manifest?.image?.assetUrl) manifests.push({ id:asset.storedName, label:manifest.image.file || asset.originalName, manifest });
    }
    assetPacks = manifests.filter(item => item.manifest.kind === 'asset-pack');
    characters = manifests.filter(item => item.manifest.kind === 'character');
    levelTemplates = templates;
    libraryStatus='ready';
    if (!assetPacks.some(item => item.id === state.selectedPack)) state.selectedPack = 'fallback';
    if (!characters.some(item => item.id === state.selectedCharacter)) state.selectedCharacter = 'fallback';
    populateAssetSelectors(); populateTemplateSelector();
    $('#library-status').textContent = currentCopy().loaded(assetPacks.length, characters.length);
    if (showFeedback) window.showToast?.($('#library-status').textContent, 'success');
  } catch {
    libraryStatus='unavailable'; assetPacks = []; characters = []; levelTemplates = []; state.selectedPack = 'fallback'; state.selectedCharacter = 'fallback';
    populateAssetSelectors(); populateTemplateSelector();
    $('#library-status').textContent = currentCopy().unavailable;
    if (showFeedback) window.showToast?.(currentCopy().unavailable, 'error');
  }
}

function populateAssetSelectors() {
  const packSelect = $('#asset-pack'), characterSelect = $('#character');
  packSelect.replaceChildren(new Option(currentCopy().fallbackTiles, 'fallback'), ...assetPacks.map(item => new Option(`${item.label} · ${item.manifest.category || 'asset pack'}`, item.id)));
  characterSelect.replaceChildren(new Option(currentCopy().fallbackCharacter, 'fallback'), ...characters.map(item => new Option(item.label, item.id)));
  packSelect.value = state.selectedPack; characterSelect.value = state.selectedCharacter;
  renderPalette();
}

function populateTemplateSelector() {
  const select=$('#template-library'); if(!select) return;
  const previous=select.value;
  select.replaceChildren(new Option(currentCopy().noTemplates,''),...levelTemplates.map(item=>new Option(item.label,item.id)));
  select.value=levelTemplates.some(item=>item.id===previous)?previous:'';
  $('#load-template').disabled=!select.value;
}

async function saveAsTemplate() {
  const name=$('#template-name').value.trim();
  if(!name) { window.showToast?.(currentCopy().templateNameRequired,'error'); return; }
  const fileName=`${name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'side-scroller'}-parallax-template.json`;
  const template={version:1,kind:'parallax-template',name,createdAt:new Date().toISOString(),dimensions:{columns:COLS,rows:ROWS,cellSize:CELL,screens:PAGE_COUNT},placements:state.placements,collisionPolygons:state.collisionPolygons,spawn:state.spawn,selectedPack:state.selectedPack,selectedCharacter:state.selectedCharacter,layers:{far:'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/parallax-tiling-map/images/parallax-far.webp',midground:'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/parallax-tiling-map/images/parallax-midground.webp'}};
  try {
    const response=await fetch('/api/assets?module=final-game',{method:'POST',headers:{'content-type':'application/json','x-file-name':fileName},body:JSON.stringify(template)});
    if(!response.ok) throw new Error('Template save failed');
    const saved=await response.json(); await loadLibrary(false); $('#template-library').value=saved.storedName; $('#load-template').disabled=false; window.showToast?.(currentCopy().templateSaved,'success');
  } catch { window.showToast?.(currentCopy().templateSaveError,'error'); }
}

function loadSelectedTemplate() {
  const template=levelTemplates.find(item=>item.id===$('#template-library').value)?.manifest;
  if(!template) return;
  normalizeState({...template,hasTested:false,cameraPage:0}); draftCollision=[]; buildMode=true; activeTool='paint';
  if(!assetPacks.some(item=>item.id===state.selectedPack)) state.selectedPack='fallback';
  if(!characters.some(item=>item.id===state.selectedCharacter)) state.selectedCharacter='fallback';
  document.querySelectorAll('[data-tool]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tool==='paint')));
  $('#polygon-actions').hidden=true; populateAssetSelectors(); createGame(); updateModeControls(); queueCheckpoint(); window.showToast?.(currentCopy().templateLoaded,'success');
}

function tileAnimationKind(index, pack=currentPack()) {
  if(!pack) return fallbackTileAnimations[index] || '';
  const cell=pack.manifest.cells?.[index];
  const specified=typeof cell?.animation==='string'?cell.animation:cell?.animation?.type || cell?.animation?.kind;
  if(['sway','glow','pulse'].includes(specified)) return specified;
  if(cell?.animated) return 'pulse';
  return pack.manifest.category==='pickups'?'glow':pack.manifest.category==='props'?'sway':'';
}

function tileInfo(index, pack=currentPack()) {
  const guide=pack?null:tileGuides[locale]?.[index];
  const cell=pack?.manifest.cells?.[index];
  const name=guide?.[0] || cell?.name?.[locale] || cell?.name?.en || (typeof cell?.name==='string'?cell.name:null) || currentCopy().tileNumber(index);
  const description=guide?.[1] || cell?.description?.[locale] || cell?.description?.en || (typeof cell?.description==='string'?cell.description:null) || currentCopy().tileDescription;
  const animation=tileAnimationKind(index,pack);
  return {name,description,animation,motion:animation?currentCopy().tileAnimated:currentCopy().tileStatic};
}

function hideTileTooltip() { const tooltip=$('#tile-tooltip'); if(tooltip) tooltip.hidden=true; }

function showTileTooltip(button, info) {
  let tooltip=$('#tile-tooltip');
  if(!tooltip) { tooltip=document.createElement('div'); tooltip.id='tile-tooltip'; tooltip.className='tile-tooltip'; tooltip.setAttribute('role','tooltip'); document.body.append(tooltip); }
  const title=document.createElement('strong'), description=document.createElement('p'), motion=document.createElement('span');
  title.textContent=info.name; description.textContent=info.description; motion.textContent=info.motion;
  tooltip.replaceChildren(title,description,motion); tooltip.hidden=false;
  const rect=button.getBoundingClientRect(), width=tooltip.offsetWidth, height=tooltip.offsetHeight;
  tooltip.style.left=`${Math.max(8,Math.min(innerWidth-width-8,rect.left+rect.width/2-width/2))}px`;
  const preferredTop=rect.top-height-9>8?rect.top-height-9:rect.bottom+9;
  tooltip.style.top=`${Math.max(8,Math.min(innerHeight-height-8,preferredTop))}px`;
}

function renderPalette() {
  const palette = $('#tile-palette'), pack = currentPack(), total = frameCount();
  if (selectedTile >= total) selectedTile = 0;
  hideTileTooltip(); palette.replaceChildren();
  for (let index = 0; index < total; index++) {
    const button = document.createElement('button'), preview = document.createElement('span'), number = document.createElement('small');
    const info=tileInfo(index,pack);
    button.type = 'button'; button.className = 'tile-option'; button.dataset.tile = String(index); button.setAttribute('role','option'); button.setAttribute('aria-selected', String(index === selectedTile));
    button.dataset.animation=info.animation || 'static'; button.setAttribute('aria-label',`${info.name}. ${info.description} ${info.motion}`); button.setAttribute('aria-describedby','tile-tooltip');
    preview.className='tile-thumb';
    number.textContent = String(index + 1).padStart(2,'0');
    if (pack) {
      const grid = pack.manifest.grid || { columns:1,rows:1 }, column = index % grid.columns, row = Math.floor(index / grid.columns);
      preview.style.backgroundImage = `url("${pack.manifest.image.assetUrl}")`;
      preview.style.backgroundSize = `${grid.columns * 100}% ${grid.rows * 100}%`;
      preview.style.backgroundPosition = `${grid.columns === 1 ? 0 : column / (grid.columns - 1) * 100}% ${grid.rows === 1 ? 0 : row / (grid.rows - 1) * 100}%`;
    } else {
      const column=index%4,row=Math.floor(index/4);
      preview.style.backgroundImage='url("https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/parallax-tiling-map/images/practice-tiles-props.webp")';
      preview.style.backgroundSize='400% 400%';
      preview.style.backgroundPosition=`${column/3*100}% ${row/3*100}%`;
    }
    button.append(preview, number);
    button.addEventListener('click', () => { selectedTile = index; renderPalette(); });
    button.addEventListener('pointerenter',()=>showTileTooltip(button,info));
    button.addEventListener('pointerleave',hideTileTooltip);
    button.addEventListener('focus',()=>showTileTooltip(button,info));
    button.addEventListener('blur',hideTileTooltip);
    palette.append(button);
  }
  $('#tile-count').textContent = currentCopy().tiles(total);
  const selected=tileInfo(selectedTile,pack);
  $('#tile-info-title').textContent=selected.name;
  $('#tile-info-description').textContent=selected.description;
  $('#tile-info-motion').textContent=selected.motion;
  $('#tile-info-motion').dataset.animated=String(Boolean(selected.animation));
}

function applyLocale() {
  const t = currentCopy();
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  document.title = t.title;
  $('#languages').setAttribute('aria-label', t.language);
  $('.home-mark').setAttribute('aria-label', t.homeAria);
  $('#learning-goals').setAttribute('aria-label', t.learningGoalsAria);
  $('#tile-palette').setAttribute('aria-label', t.palette);
  document.querySelectorAll('#languages button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
  for (const [id,key] of Object.entries(textBindings)) document.getElementById(id).textContent = t[key];
  $('#build-mode').textContent = t.build; $('#play-mode').textContent = t.play; $('#clear-map').textContent = $('#clear-map').dataset.confirming === 'true' ? t.confirmClear : t.clear;
  $('#stage-note').textContent = buildMode ? t.buildNote : t.playNote;
  $('#library-status').textContent=libraryStatus==='ready' ? t.loaded(assetPacks.length,characters.length) : libraryStatus==='unavailable' ? t.unavailable : t.loading;
  renderGenerationPrompts();
  populateAssetSelectors(); populateTemplateSelector(); updateSummary(); updateModeControls(); updatePolygonControls();
}

function renderGenerationPrompts() {
  const grid = $('#prompt-grid'), t = currentCopy();
  if (!grid) return;
  if (!generationPrompts.length) {
    grid.innerHTML = `<p class="prompt-loading" id="prompt-loading">${t.promptLoading}</p>`;
    return;
  }
  grid.replaceChildren(...generationPrompts.map((asset,index) => {
    const info=t.promptAssets[index] || {title:asset.file,purpose:''};
    const article=document.createElement('article'); article.className='prompt-card';
    const preview=document.createElement('div'); preview.className=`prompt-preview prompt-preview-${index}`;
    const image=document.createElement('img'); image.src=`https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/parallax-tiling-map/images/${asset.file}`; image.alt=info.title; preview.append(image);
    const body=document.createElement('div'); body.className='prompt-card-body';
    const heading=document.createElement('div'); heading.className='prompt-card-heading';
    const title=document.createElement('h3'); title.textContent=info.title;
    const number=document.createElement('span'); number.textContent=String(index+1).padStart(2,'0'); heading.append(title,number);
    const purpose=document.createElement('p'); purpose.className='prompt-purpose'; purpose.textContent=info.purpose;
    const promptHeading=document.createElement('div'); promptHeading.className='prompt-code-heading';
    const label=document.createElement('span'); label.textContent=t.exactPrompt;
    const button=document.createElement('button'); button.type='button'; button.dataset.promptIndex=String(index); button.textContent=t.copyPrompt; promptHeading.append(label,button);
    const localizedPrompt=locale==='en' ? asset.prompt : asset.translations?.[locale] || asset.prompt;
    const pre=document.createElement('pre'); const code=document.createElement('code'); code.textContent=localizedPrompt; pre.append(code);
    body.append(heading,purpose,promptHeading,pre);
    if(locale!=='en'&&localizedPrompt!==asset.prompt) {
      const details=document.createElement('details'),summary=document.createElement('summary'),original=document.createElement('pre'),originalCode=document.createElement('code');
      summary.textContent=t.originalPrompt; originalCode.textContent=asset.prompt; original.append(originalCode); details.append(summary,original); body.append(details);
    }
    article.append(preview,body); return article;
  }));
}

async function loadGenerationPrompts() {
  try {
    const response=await fetch('/parallax-tiling-map/images/prompts.json');
    if(!response.ok) throw new Error('Prompt record unavailable');
    generationPrompts=(await response.json()).assets || [];
    renderGenerationPrompts();
  } catch {
    $('#prompt-grid').innerHTML=`<p class="prompt-loading">${currentCopy().promptUnavailable}</p>`;
  }
}

async function copyGenerationPrompt(index) {
  const asset=generationPrompts[index], prompt=locale==='en' ? asset?.prompt : asset?.translations?.[locale] || asset?.prompt;
  if(!prompt) return;
  try {
    let copied=false;
    if(navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(prompt); copied=true; } catch { /* Use the browser fallback below. */ }
    }
    if(!copied) {
      const field=document.createElement('textarea'); field.value=prompt; field.style.position='fixed'; field.style.opacity='0'; document.body.append(field); field.select();
      copied=document.execCommand('copy'); field.remove();
    }
    if(!copied) throw new Error('Copy failed');
    window.showToast?.(currentCopy().promptCopied,'success');
  } catch { window.showToast?.(currentCopy().promptCopyError,'error'); }
}

function updateSummary() {
  const solids = state.placements.filter(item => item.solid).length, t = currentCopy();
  $('#layout-summary').textContent = t.summary(state.placements.length, solids, state.collisionPolygons.length);
  $('#camera-position').textContent = t.view(state.cameraPage + 1, PAGE_COUNT);
  $('#complete-module').disabled = !state.hasTested || completed;
  $('#complete-module').textContent = completed ? t.completed : t.complete;
  $('#save-status').textContent = state.hasTested ? t.ready : t.readyHint;
}

function createParallax(targetScene) {
  farLayer=targetScene.add.image(768,VIEW_HEIGHT/2,'parallax-far').setDisplaySize(1536,VIEW_HEIGHT).setScrollFactor(.08).setDepth(-30);
  nearLayer=targetScene.add.image(768,VIEW_HEIGHT/2,'parallax-midground').setDisplaySize(1536,VIEW_HEIGHT).setScrollFactor(.3).setDepth(-20);
}

function createGrid(targetScene) {
  gridOverlay = targetScene.add.graphics().setDepth(20);
  gridOverlay.lineStyle(1,0xffffff,0.12);
  for(let x=0;x<=COLS;x++) gridOverlay.lineBetween(x*CELL,0,x*CELL,ROWS*CELL);
  for(let y=0;y<=ROWS;y++) gridOverlay.lineBetween(0,y*CELL,COLS*CELL,y*CELL);
  collisionOverlay = targetScene.add.graphics().setDepth(18);
  spawnMarker = targetScene.add.graphics().setDepth(19);
}

function tileTexture(frame) {
  return currentPack() && scene?.textures.exists('asset-pack') ? ['asset-pack', frame % frameCount()] : ['practice-tiles', frame % 16];
}

const fallbackFrameBounds = [
  {minX:30,minY:46,maxX:234,maxY:234},{minX:32,minY:47,maxX:221,maxY:236},{minX:3,minY:80,maxX:252,maxY:235},{minX:36,minY:43,maxX:223,maxY:235},
  {minX:38,minY:48,maxX:224,maxY:229},{minX:17,minY:58,maxX:240,maxY:229},{minX:33,minY:49,maxX:225,maxY:228},
];

function fitPracticeTerrain(sprite, frame, cellX, cellY) {
  const bounds=fallbackFrameBounds[frame];
  if(!bounds) { sprite.setDisplaySize(CELL,CELL); return; }
  const width=bounds.maxX-bounds.minX+1, height=bounds.maxY-bounds.minY+1, target=CELL+1;
  const scaleX=target/width, scaleY=frame<=3&&frame!==2 ? target/height : scaleX;
  const alphaCenterX=(bounds.minX+bounds.maxX+1)/2, centerX=cellX+CELL/2;
  sprite.setScale(scaleX,scaleY).setX(centerX-(alphaCenterX-128)*scaleX);
  if(frame<=3&&frame!==2) {
    const alphaCenterY=(bounds.minY+bounds.maxY+1)/2;
    sprite.setY(cellY+CELL/2-(alphaCenterY-128)*scaleY);
  } else sprite.setY(cellY-(bounds.minY-128)*scaleY);
}

function pointInPolygon(point, points) {
  let inside=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++) {
    const a=points[i],b=points[j],crosses=(a.y>point.y)!==(b.y>point.y)&&point.x<(b.x-a.x)*(point.y-a.y)/(b.y-a.y)+a.x;
    if(crosses) inside=!inside;
  }
  return inside;
}

function addPolygonBodies(points) {
  const step=12, minY=Math.max(0,Math.floor(Math.min(...points.map(point=>point.y))/step)*step), maxY=Math.min(VIEW_HEIGHT,Math.ceil(Math.max(...points.map(point=>point.y))/step)*step);
  for(let y=minY+step/2;y<maxY;y+=step) {
    const intersections=[];
    for(let index=0;index<points.length;index++) {
      const a=points[index],b=points[(index+1)%points.length];
      if((a.y<=y&&b.y>y)||(b.y<=y&&a.y>y)) intersections.push(a.x+(y-a.y)*(b.x-a.x)/(b.y-a.y));
    }
    intersections.sort((a,b)=>a-b);
    for(let index=0;index+1<intersections.length;index+=2) {
      const left=Math.max(0,intersections[index]),right=Math.min(COLS*CELL,intersections[index+1]),width=right-left;
      if(width<2) continue;
      tileGroup.create(left+width/2,y,'practice-tiles',0).setDisplaySize(width,step+1).setVisible(false).refreshBody();
    }
  }
}

function drawCollisionShape(points, draft=false) {
  if(!points.length) return;
  collisionOverlay.lineStyle(draft?2:3,0xffbd78,draft ? .75 : .95);
  if(points.length>=3&&!draft) collisionOverlay.fillStyle(0xffbd78,.14).fillPoints(points,true);
  if(points.length>1) collisionOverlay.strokePoints(points,!draft);
  for(const point of points) collisionOverlay.fillStyle(0xffbd78,1).fillCircle(point.x,point.y,draft?5:3);
}

function updatePolygonControls() {
  const panel=$('#polygon-actions'); if(!panel) return;
  panel.hidden=activeTool!=='polygon'||!buildMode;
  $('#finish-polygon').disabled=draftCollision.length<3;
  $('#undo-point').disabled=!draftCollision.length;
}

function animatePlacedTile(sprite, kind) {
  if(!kind) return;
  sprite.setData('tile-animation',kind);
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const delay=(Math.round(sprite.x/CELL)*73+Math.round(sprite.y/CELL)*127)%500;
  if(kind==='sway') scene.tweens.add({targets:sprite,angle:{from:-3,to:3},duration:1500,delay,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
  else if(kind==='glow') scene.tweens.add({targets:sprite,alpha:{from:.7,to:1},scaleX:{from:sprite.scaleX*.96,to:sprite.scaleX*1.04},scaleY:{from:sprite.scaleY*.96,to:sprite.scaleY*1.04},duration:1100,delay,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
  else if(kind==='pulse') scene.tweens.add({targets:sprite,scaleX:{from:sprite.scaleX*.97,to:sprite.scaleX*1.03},scaleY:{from:sprite.scaleY*.97,to:sprite.scaleY*1.03},duration:1350,delay,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
}

function renderMap() {
  if (!scene) return;
  tileGroup?.clear(true,true);
  scene.children.list.filter(child => child.getData?.('map-tile')).forEach(child => { scene.tweens.killTweensOf(child); child.destroy(); });
  collisionOverlay.clear(); spawnMarker.clear();
  for (const placement of state.placements) {
    const [texture,frame] = tileTexture(placement.frame);
    const cellX=placement.x*CELL, cellY=placement.y*CELL, sprite=scene.add.image(cellX+CELL/2,cellY+CELL/2,texture,frame);
    if(texture==='practice-tiles') fitPracticeTerrain(sprite,frame,cellX,cellY); else sprite.setDisplaySize(CELL,CELL);
    sprite.setFlipX(Boolean(placement.flipped)).setDepth(2).setData('map-tile',true);
    animatePlacedTile(sprite,tileAnimationKind(placement.frame));
    if (placement.solid) tileGroup.create(cellX+CELL/2,cellY+CELL/2,texture,frame).setDisplaySize(CELL,CELL).setVisible(false).refreshBody();
    if (placement.solid) { collisionOverlay.lineStyle(2,0xc4f265,0.9).fillStyle(0xc4f265,0.08).fillRect(placement.x*CELL+2,placement.y*CELL+2,CELL-4,CELL-4).strokeRect(placement.x*CELL+2,placement.y*CELL+2,CELL-4,CELL-4); }
  }
  for(const shape of state.collisionPolygons) { addPolygonBodies(shape.points); drawCollisionShape(shape.points); }
  drawCollisionShape(draftCollision,true);
  const sx=state.spawn.x*CELL+CELL/2, sy=state.spawn.y*CELL+CELL/2;
  spawnMarker.fillStyle(0x9c8cff,0.28).fillCircle(sx,sy,15).lineStyle(3,0x9c8cff,1).strokeCircle(sx,sy,15).lineBetween(sx,sy-21,sx,sy+21).lineBetween(sx-21,sy,sx+21,sy);
  collisionOverlay.setVisible(buildMode); spawnMarker.setVisible(buildMode); gridOverlay.setVisible(buildMode);
  updateSummary();
}

function buildCharacter(targetScene) {
  const character = currentCharacter();
  walkAnimation = runAnimation = idleAnimation = null; jumpPoseFrames=[];
  if (character && targetScene.textures.exists('player-sheet')) {
    const manifest=character.manifest, frameWidth=manifest.frameSize?.width || manifest.animations?.[0]?.frames?.[0]?.width || 256, frameHeight=manifest.frameSize?.height || manifest.animations?.[0]?.frames?.[0]?.height || 256, columns=Math.max(1,Math.round(manifest.image.width/frameWidth));
    for(const animation of manifest.animations || []) {
      const key=`player-${animation.name}`;
      if (!animation.frames?.length || targetScene.anims.exists(key)) continue;
      const frames=animation.frames.map(frame => Math.round(frame.y/frameHeight)*columns+Math.round(frame.x/frameWidth));
      targetScene.anims.create({ key, frames:frames.map(frame => ({key:'player-sheet',frame})), frameRate:animation.fps || 6, repeat:animation.loop ? -1 : 0 });
      if (animation.name === 'idle') idleAnimation=key;
      if (animation.name === 'walk') walkAnimation=key;
      if (animation.name === 'run') runAnimation=key;
      if (animation.name === 'jump') jumpPoseFrames=frames;
    }
    if (!jumpPoseFrames.length) jumpPoseFrames=[0];
    player=targetScene.physics.add.sprite(0,0,'player-sheet',0).setScale(76/frameHeight);
    player.body.setSize(frameWidth*.36,frameHeight*.7).setOffset(frameWidth*.32,frameHeight*.25);
  } else {
    const animationRows=[['idle',[0]],['walk',[4,5,6,7]],['run',[8,9,10,11]]];
    for(const [name,frames] of animationRows) targetScene.anims.create({key:`practice-${name}`,frames:frames.map(frame=>({key:'fallback-player',frame})),frameRate:name==='run'?12:name==='walk'?8:1,repeat:-1});
    idleAnimation='practice-idle'; walkAnimation='practice-walk'; runAnimation='practice-run'; jumpPoseFrames=[12,13,14,15,16,17,18,19];
    player=targetScene.physics.add.sprite(0,0,'fallback-player',0).setScale(88/192);
    player.body.setSize(50,150).setOffset(55,30);
  }
  player.setDepth(15).setCollideWorldBounds(true).setBounce(0);
  tileGroup = tileGroup || targetScene.physics.add.staticGroup();
  targetScene.physics.add.collider(player,tileGroup);
  resetPlayer();
}

function resetPlayer() {
  if (!player) return;
  const halfHeight=player.displayHeight/2;
  player.setPosition(state.spawn.x*CELL+CELL/2,(state.spawn.y+1)*CELL-halfHeight-2).setVelocity(0,0).setVisible(!buildMode);
  lastGroundedAt=jumpQueuedUntil=jumpStartedAt=landingStartedAt=-Infinity; jumpsUsed=0; wasAirborne=false; movementPhase='idle';
}

function showJumpPose(phase) {
  if (!jumpPoseFrames.length) return;
  const index=Math.round(phase*(jumpPoseFrames.length-1)/7);
  player.anims.stop(); player.setFrame(jumpPoseFrames[index]); player.anims.timeScale=1;
}

function preload() {
  this.load.setCORS('anonymous');
  const pack=currentPack(), character=currentCharacter();
  this.load.image('parallax-far','https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/parallax-tiling-map/images/parallax-far.webp');
  this.load.image('parallax-midground','https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/parallax-tiling-map/images/parallax-midground.webp');
  this.load.spritesheet('practice-tiles','https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/parallax-tiling-map/images/practice-tiles-props.webp',{frameWidth:256,frameHeight:256});
  this.load.spritesheet('fallback-player','https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/parallax-tiling-map/images/practice-explorer-motion-v2.webp',{frameWidth:160,frameHeight:192});
  if (pack) this.load.spritesheet('asset-pack',pack.manifest.image.assetUrl,{frameWidth:pack.manifest.grid.cellWidth,frameHeight:pack.manifest.grid.cellHeight});
  if (character) {
    const first=character.manifest.animations?.[0]?.frames?.[0], width=character.manifest.frameSize?.width || first?.width, height=character.manifest.frameSize?.height || first?.height;
    if (width && height) this.load.spritesheet('player-sheet',character.manifest.image.assetUrl,{frameWidth:width,frameHeight:height});
  }
}

function create() {
  scene=this; createParallax(this);
  this.physics.world.setBounds(0,0,COLS*CELL,ROWS*CELL);
  this.cameras.main.setBounds(0,0,COLS*CELL,ROWS*CELL).setBackgroundColor('#17332a');
  tileGroup=this.physics.add.staticGroup(); createGrid(this); buildCharacter(this); renderMap();
  cursors=this.input.keyboard.createCursorKeys(); keys=this.input.keyboard.addKeys('A,D,W');
  this.input.on('pointerdown', pointer => {
    if (!buildMode || pointer.rightButtonDown()) return;
    const world=pointer.positionToCamera(this.cameras.main), x=Math.floor(world.x/CELL), y=Math.floor(world.y/CELL);
    if(x<0||x>=COLS||y<0||y>=ROWS) return;
    const index=state.placements.findIndex(item => item.x===x && item.y===y);
    if(activeTool==='polygon') {
      draftCollision.push({x:Math.round(world.x),y:Math.round(world.y)}); renderMap(); updatePolygonControls(); window.showToast?.(currentCopy().polygonPoint); return;
    } else if(activeTool==='paint') {
      const next={x,y,frame:selectedTile,solid:$('#solid-on-place').checked,flipped:false};
      if(index>=0) state.placements[index]=next; else state.placements.push(next);
    } else if(activeTool==='collision') {
      if(index<0) { window.showToast?.(currentCopy().needTile); return; }
      state.placements[index].solid=!state.placements[index].solid;
    } else if(activeTool==='flip') {
      if(index<0) { window.showToast?.(currentCopy().needFlipTile); return; }
      state.placements[index].flipped=!state.placements[index].flipped;
      window.showToast?.(currentCopy().flipped,'success');
    } else if(activeTool==='spawn') state.spawn={x,y};
    else if(activeTool==='erase') {
      if(index>=0) state.placements.splice(index,1);
      else {
        const shapeIndex=state.collisionPolygons.findIndex(shape=>pointInPolygon(world,shape.points));
        if(shapeIndex>=0) state.collisionPolygons.splice(shapeIndex,1);
      }
    }
    state.hasTested=false;
    renderMap(); queueCheckpoint();
  });
  this.physics.pause(); panCamera();
  window.tilemapWorkshop = { ready:true, getSnapshot:() => JSON.parse(JSON.stringify(state)), get playerX(){ return player?.x || 0; }, get playerY(){ return player?.y || 0; }, get grounded(){ return Boolean(player?.body?.blocked?.down); }, get velocityX(){ return player?.body?.velocity?.x || 0; }, get velocityY(){ return player?.body?.velocity?.y || 0; }, get jumpsUsed(){ return jumpsUsed; }, get movementPhase(){ return movementPhase; }, get landingElapsed(){ return scene.time.now-landingStartedAt; }, get animation(){ return player?.anims?.currentAnim?.key || ''; }, get frameIndex(){ return Number(player?.frame?.name) || 0; }, get animatedTileCount(){ return scene.children.list.filter(child=>child.getData?.('tile-animation')).length; }, get animatedGlowAlpha(){ return scene.children.list.find(child=>child.getData?.('tile-animation')==='glow')?.alpha ?? null; }, get buildMode(){ return buildMode; }, get pageCount(){ return PAGE_COUNT; } };
}

function update() {
  if (buildMode || !player) return;
  const now=scene.time.now, left=cursors.left.isDown||keys.A.isDown, right=cursors.right.isDown||keys.D.isDown, sprint=cursors.shift.isDown&&(left||right);
  const jumpPressed=Phaser.Input.Keyboard.JustDown(cursors.up)||Phaser.Input.Keyboard.JustDown(cursors.space)||Phaser.Input.Keyboard.JustDown(keys.W);
  const jumpHeld=cursors.up.isDown||cursors.space.isDown||keys.W.isDown;
  const speed=sprint?340:220;
  player.setVelocityX(left?-speed:right?speed:0);
  const grounded=player.body.blocked.down||player.body.touching.down;
  if(grounded&&player.body.velocity.y>=-20) { lastGroundedAt=now; jumpsUsed=0; }
  if(jumpPressed&&jumpsUsed<2) jumpQueuedUntil=now+120;
  let didJump=false;
  const groundJump=jumpsUsed===0&&now-lastGroundedAt<=100;
  const airJump=!grounded&&jumpsUsed<2;
  if(jumpQueuedUntil>=now&&(groundJump||airJump)) {
    player.setVelocityY(groundJump?-520:-480); jumpsUsed++; jumpStartedAt=now; jumpQueuedUntil=-Infinity; landingStartedAt=-Infinity; wasAirborne=true; didJump=true;
  }
  if(!jumpHeld&&now-jumpStartedAt<500&&player.body.velocity.y<-220) player.setVelocityY(-220);
  const airborne=didJump||!grounded||player.body.velocity.y<-20;
  if(airborne) {
    if(didJump||Math.abs(player.body.velocity.y)>140) wasAirborne=true;
    const verticalSpeed=player.body.velocity.y, elapsed=now-jumpStartedAt;
    let pose=verticalSpeed<-280?1:verticalSpeed<-110?2:verticalSpeed<100?3:verticalSpeed<250?4:5;
    if(elapsed<45) pose=0;
    showJumpPose(pose);
    movementPhase=pose===0?'takeoff':pose<=2?'rise':pose===3?'apex':'fall';
  } else {
    if(wasAirborne) { landingStartedAt=now; wasAirborne=false; }
    const landingElapsed=now-landingStartedAt;
    // A moving player only needs a quick impact beat; the walk/run cycle owns
    // every grounded frame after it, including the frames after a running jump.
    const landingDuration=left||right?60:150;
    if(landingElapsed<landingDuration) {
      showJumpPose(landingElapsed<landingDuration/2?6:7); movementPhase='land';
    } else if(left||right) {
      const animation=sprint?(runAnimation||walkAnimation):(walkAnimation||runAnimation);
      if(animation) player.play(animation,true); else player.anims.stop();
      player.anims.timeScale=sprint&&!runAnimation?1.55:1;
      movementPhase=sprint?'run':'walk';
    } else {
      player.anims.timeScale=1;
      if(idleAnimation) player.play(idleAnimation,true); else player.anims.stop();
      movementPhase='idle';
    }
  }
  if(left||right) {
    player.setFlipX(left);
  }
  if(player.y>VIEW_HEIGHT+80) resetPlayer();
}

function createGame() {
  const generation=++gameGeneration;
  window.tilemapWorkshop={ready:false};
  if(game) { game.destroy(true); game=null; scene=null; player=null; }
  game=new Phaser.Game({ type:Phaser.AUTO, parent:'phaser-stage', width:VIEW_WIDTH, height:VIEW_HEIGHT, backgroundColor:'#17332a', pixelArt:false, physics:{default:'arcade',arcade:{gravity:{y:1200},debug:false}}, scene:{preload,create:function(){if(generation===gameGeneration) create.call(this);},update:function(){if(generation===gameGeneration) update.call(this);}}, scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH} });
}

function panCamera() {
  if(!scene||!buildMode) return;
  const maxScroll=COLS*CELL-VIEW_WIDTH;
  scene.cameras.main.stopFollow(); scene.cameras.main.setScroll(Math.min(maxScroll,state.cameraPage*VIEW_WIDTH),0);
  $('#camera-position').textContent=currentCopy().view(state.cameraPage+1,PAGE_COUNT);
  $('#pan-left').disabled=!buildMode||state.cameraPage===0; $('#pan-right').disabled=!buildMode||state.cameraPage===PAGE_COUNT-1;
}

function updateModeControls() {
  $('#build-mode').setAttribute('aria-pressed',String(buildMode)); $('#play-mode').setAttribute('aria-pressed',String(!buildMode));
  $('#play-help').hidden=buildMode; $('#stage-note').textContent=buildMode?currentCopy().buildNote:currentCopy().playNote;
  $('.builder-panel').inert=!buildMode; $('#clear-map').disabled=!buildMode; updatePolygonControls(); panCamera();
}

function setMode(nextBuildMode) {
  buildMode=nextBuildMode;
  if(!scene) return;
  collisionOverlay.setVisible(buildMode); spawnMarker.setVisible(buildMode); gridOverlay.setVisible(buildMode); player.setVisible(!buildMode);
  if(buildMode) { scene.physics.pause(); player.setVelocity(0,0); panCamera(); }
  else { state.hasTested=true; scene.physics.resume(); resetPlayer(); scene.cameras.main.startFollow(player,true,.12,.12); queueCheckpoint(); }
  updateModeControls(); updateSummary();
}

function bindControls() {
  $('#prompt-grid').addEventListener('click',event=>{const button=event.target.closest('[data-prompt-index]');if(button) copyGenerationPrompt(Number(button.dataset.promptIndex));});
  $('#languages').addEventListener('click',event => { const next=event.target.closest('button')?.dataset.locale; if(!copy[next]) return; locale=next; localStorage.setItem('godot-forge-locale',locale); applyLocale(); });
  $('#tile-palette').addEventListener('keydown',event => { if(!['ArrowLeft','ArrowRight'].includes(event.key)) return; selectedTile=(selectedTile+(event.key==='ArrowRight'?1:-1)+frameCount())%frameCount(); renderPalette(); $('#tile-palette [aria-selected="true"]').focus(); });
  $('#tool-grid').addEventListener('click',event => { const button=event.target.closest('[data-tool]'); if(!button) return; activeTool=button.dataset.tool; document.querySelectorAll('[data-tool]').forEach(item => item.setAttribute('aria-pressed',String(item===button))); updatePolygonControls(); window.showToast?.(currentCopy().toolSelected(currentCopy()[activeTool])); });
  $('#build-mode').addEventListener('click',()=>setMode(true)); $('#play-mode').addEventListener('click',()=>setMode(false));
  $('#reset-player').addEventListener('click',resetPlayer);
  $('#pan-left').addEventListener('click',()=>{state.cameraPage=Math.max(0,state.cameraPage-1);panCamera();queueCheckpoint();window.showToast?.(currentCopy().view(state.cameraPage+1,PAGE_COUNT));}); $('#pan-right').addEventListener('click',()=>{state.cameraPage=Math.min(PAGE_COUNT-1,state.cameraPage+1);panCamera();queueCheckpoint();window.showToast?.(currentCopy().view(state.cameraPage+1,PAGE_COUNT));});
  $('#asset-pack').addEventListener('change',event=>{state.selectedPack=event.target.value;state.hasTested=false;selectedTile=0;buildMode=true;renderPalette();createGame();updateModeControls();queueCheckpoint();window.showToast?.(currentCopy().packChanged,'success');});
  $('#character').addEventListener('change',event=>{state.selectedCharacter=event.target.value;state.hasTested=false;buildMode=true;createGame();updateModeControls();queueCheckpoint();window.showToast?.(currentCopy().characterChanged,'success');});
  $('#refresh-library').addEventListener('click',async()=>{await loadLibrary(true);createGame();});
  $('#template-library').addEventListener('change',event=>{$('#load-template').disabled=!event.target.value;});
  $('#save-template').addEventListener('click',saveAsTemplate); $('#load-template').addEventListener('click',loadSelectedTemplate);
  $('#undo-point').addEventListener('click',()=>{if(!draftCollision.length){window.showToast?.(currentCopy().polygonEmpty);return;}draftCollision.pop();renderMap();updatePolygonControls();window.showToast?.(currentCopy().polygonUndo);});
  $('#finish-polygon').addEventListener('click',()=>{if(draftCollision.length<3){window.showToast?.(currentCopy().polygonNeedPoints,'error');return;}state.collisionPolygons.push({points:draftCollision.map(point=>({...point}))});draftCollision=[];state.hasTested=false;renderMap();updatePolygonControls();queueCheckpoint();window.showToast?.(currentCopy().polygonFinished,'success');});
  $('#save-layout').addEventListener('click',()=>saveCheckpoint(true));
  $('#clear-map').addEventListener('click',()=>{
    const button=$('#clear-map');
    if(button.dataset.confirming!=='true') { button.dataset.confirming='true';button.textContent=currentCopy().confirmClear;window.showToast?.(currentCopy().clearWarning);clearTimeout(clearTimer);clearTimer=setTimeout(()=>{button.dataset.confirming='false';button.textContent=currentCopy().clear;},8000);return; }
    clearTimeout(clearTimer);button.dataset.confirming='false';button.textContent=currentCopy().clear;state.placements=[];state.collisionPolygons=[];draftCollision=[];state.hasTested=false;renderMap();updatePolygonControls();queueCheckpoint();window.showToast?.(currentCopy().cleared,'success');
  });
  $('#complete-module').addEventListener('click',async()=>{
    if(!state.hasTested||completed) return;
    const response=await fetch(`/api/modules/${moduleSlug}/progress`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({learnerId,completed:true})});
    if(response.ok){completed=true;updateSummary();}
  });
}

async function initialize() {
  bindControls(); applyLocale();
  await loadGenerationPrompts();
  try { await loadCheckpoint(); } catch { /* The practice map remains usable offline. */ }
  await loadLibrary(false); applyLocale(); createGame(); updateSummary();
}

initialize();
