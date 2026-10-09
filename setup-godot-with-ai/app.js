const copy = {
  en: {
    back: '← Learning path', chapter: 'CHAPTER 20 / GODOT WEB EDITOR', title: 'Learn Godot Web Editor.',
    language: 'Language', homeAria: 'Godot Forge home', walkthroughAria: 'Godot Web Editor walkthrough',
    intro: 'Open the starter project in your browser, explore the 2D editor, make one change, run it, and save your work.',
    downloadKit: 'Download starter ZIP · 83 MiB', openEditor: 'Open Godot Web Editor ↗', stepsLabel: 'Walkthrough steps',
    step1Title: 'Download the starter project',
    step1Body: 'Use Download starter ZIP above. Keep the ZIP intact; it already contains project.godot, a welcome scene, lesson artwork, and an asset catalog.',
    step1Tip: 'The kit is about 83 MiB. Download it before opening the editor so it is ready for the next step.',
    step2Title: 'Preload the ZIP in the Web Editor',
    step2Body: 'Open Godot Web Editor. On its Loader page, choose your ZIP in “Preload project ZIP”, then select “Start Godot Editor”. The Project Manager appears after the editor loads.',
    managerCaption: 'Project Manager layout. The Web Editor opens its Project Manager after the Loader.',
    step3Title: 'Install and open the project',
    step3Body: 'In the import dialog, create a project folder under /home/web_user/projects, then choose “Install & Edit”. Let Godot import the images; a large starter kit can take a while.',
    step3Tip: 'Keep the project inside /home/web_user/ so the Web Editor can retain it in this browser.',
    step4Title: 'Find your way around the editor',
    step4Body: 'Use the 2D workspace in the center. The Scene dock lists nodes, the Inspector edits the selected node, and FileSystem lists project files.',
    editorCaption: 'Choose 2D at the top to work in the 2D workspace.',
    sceneCaption: 'Scene lists the nodes in the open scene.',
    step5Title: 'Open assets and make one change',
    step5Body: 'In FileSystem, open res://assets to see artwork grouped by lesson module. Then open res://scenes/Main.tscn, select the Welcome Label in Scene, and change its text in Inspector.',
    filesCaption: 'Look for your starter kit’s assets and scenes in FileSystem.',
    inspectorCaption: 'Inspector lets you edit the selected Label’s text.',
    step6Title: 'Run the scene and save your source',
    step6Body: 'Save your scene with Ctrl+S (Cmd+S on Mac), then press F5 or the Play button. The game opens in the Web Editor’s Game tab. Return to Editor and use Project → Tools → Download Project Source to save your project ZIP.',
    toolbarCaption: 'The Play controls are at the top right of the editor.',
    finish: 'You are ready to use these assets in Final Game.', next: 'Continue to Final Game →',
    complete: 'Mark lesson complete', reopen: 'Reopen lesson', saved: 'Progress saved.', error: 'Unable to load or save progress. Please refresh and try again.',
    credit: 'Godot editor screenshots by Juan Linietsky, Ariel Manzur, and the Godot Engine community. The Web Editor also has Loader, Editor, and Game tabs.',
    source: 'Screenshot source',
    managerAlt: 'Godot Project Manager with project list and project actions',
    editorAlt: 'Godot editor with the 2D workspace active',
    sceneAlt: 'Godot Scene dock showing the node tree',
    filesAlt: 'Godot FileSystem dock listing project folders and files',
    inspectorAlt: 'Godot Inspector dock showing editable node properties',
    toolbarAlt: 'Top of the Godot editor with workspace tabs and play controls'
  },
  zh: {
    back: '← 学习路径', chapter: '第 20 章 / GODOT 网页编辑器', title: '学习 Godot 网页编辑器。',
    language: '语言', homeAria: 'Godot Forge 首页', walkthroughAria: 'Godot 网页编辑器操作指南',
    intro: '在浏览器中打开入门项目，探索 2D 编辑器，做一处修改，运行场景并保存作品。',
    downloadKit: '下载入门 ZIP · 83 MiB', openEditor: '打开 Godot 网页编辑器 ↗', stepsLabel: '操作步骤',
    step1Title: '下载入门项目',
    step1Body: '点击上方的“下载入门 ZIP”。不要解压；其中已包含 project.godot、欢迎场景、课程美术素材和素材目录。',
    step1Tip: '文件约 83 MiB。先下载，再打开编辑器，以便在下一步导入。',
    step2Title: '在网页编辑器中预载 ZIP',
    step2Body: '打开 Godot 网页编辑器。在 Loader 页面通过“Preload project ZIP”选择 ZIP，然后点击“Start Godot Editor”。加载完成后会出现项目管理器。',
    managerCaption: '项目管理器布局。网页编辑器在 Loader 加载完成后会打开项目管理器。',
    step3Title: '安装并打开项目',
    step3Body: '在导入窗口中，在 /home/web_user/projects 下创建项目文件夹，然后选择“Install & Edit”。Godot 需要一些时间导入素材。',
    step3Tip: '将项目保存在 /home/web_user/ 内，网页编辑器才能在此浏览器中保留项目。',
    step4Title: '认识编辑器界面',
    step4Body: '中央是 2D 工作区。Scene 面板列出节点，Inspector 用来编辑所选节点，FileSystem 列出项目文件。',
    editorCaption: '点击顶部的 2D，进入 2D 工作区。',
    sceneCaption: 'Scene 面板列出当前场景中的节点。',
    step5Title: '查看素材并修改场景',
    step5Body: '在 FileSystem 中打开 res://assets，查看按课程模块分组的美术素材。再打开 res://scenes/Main.tscn，在 Scene 中选择 Welcome Label，并在 Inspector 中修改它的文字。',
    filesCaption: '在 FileSystem 中查找入门项目的素材和场景。',
    inspectorCaption: '在 Inspector 中修改所选 Label 的文字。',
    step6Title: '运行场景并保存源文件',
    step6Body: '先按 Ctrl+S（Mac 上按 Cmd+S）保存场景，再按 F5 或点击播放按钮。游戏会在网页编辑器的 Game 标签页打开。返回 Editor，使用 Project → Tools → Download Project Source 下载项目 ZIP。',
    toolbarCaption: '播放按钮位于编辑器右上角。',
    finish: '现在可以在最终游戏中使用这些素材了。', next: '继续前往最终游戏 →',
    complete: '标记课程完成', reopen: '重新打开课程', saved: '进度已保存。', error: '无法加载或保存进度，请刷新后重试。',
    credit: 'Godot 编辑器截图作者：Juan Linietsky、Ariel Manzur 和 Godot Engine 社区。网页编辑器另有 Loader、Editor 和 Game 标签页。',
    source: '截图来源',
    managerAlt: 'Godot 项目管理器，显示项目列表和操作',
    editorAlt: 'Godot 编辑器，显示已启用的 2D 工作区',
    sceneAlt: 'Godot Scene 面板，显示场景节点树',
    filesAlt: 'Godot FileSystem 面板，列出项目文件夹和文件',
    inspectorAlt: 'Godot Inspector 面板，显示可编辑的节点属性',
    toolbarAlt: 'Godot 编辑器顶部的工作区标签和播放按钮'
  },
  ms: {
    back: '← Laluan pembelajaran', chapter: 'BAB 20 / GODOT WEB EDITOR', title: 'Pelajari Godot Web Editor.',
    language: 'Bahasa', homeAria: 'Laman utama Godot Forge', walkthroughAria: 'Panduan Godot Web Editor',
    intro: 'Buka projek permulaan dalam pelayar, terokai editor 2D, buat satu perubahan, jalankan dan simpan kerja anda.',
    downloadKit: 'Muat turun ZIP permulaan · 83 MiB', openEditor: 'Buka Godot Web Editor ↗', stepsLabel: 'Langkah panduan',
    step1Title: 'Muat turun projek permulaan',
    step1Body: 'Gunakan butang Muat turun ZIP permulaan di atas. Biarkan ZIP itu utuh; ia sudah mengandungi project.godot, adegan alu-aluan, karya seni modul dan katalog aset.',
    step1Tip: 'Kit ini kira-kira 83 MiB. Muat turunnya sebelum membuka editor supaya sedia untuk langkah seterusnya.',
    step2Title: 'Pramuat ZIP dalam Web Editor',
    step2Body: 'Buka Godot Web Editor. Pada halaman Loader, pilih ZIP melalui “Preload project ZIP”, kemudian pilih “Start Godot Editor”. Project Manager muncul selepas editor dimuatkan.',
    managerCaption: 'Susun atur Project Manager. Web Editor membukanya selepas Loader.',
    step3Title: 'Pasang dan buka projek',
    step3Body: 'Dalam dialog import, cipta folder projek di bawah /home/web_user/projects, kemudian pilih “Install & Edit”. Beri masa kepada Godot untuk mengimport imej.',
    step3Tip: 'Simpan projek di dalam /home/web_user/ supaya Web Editor dapat mengekalkannya dalam pelayar ini.',
    step4Title: 'Kenali bahagian editor',
    step4Body: 'Gunakan ruang kerja 2D di tengah. Panel Scene menyenaraikan nod, Inspector mengubah nod yang dipilih, dan FileSystem menyenaraikan fail projek.',
    editorCaption: 'Pilih 2D di bahagian atas untuk menggunakan ruang kerja 2D.',
    sceneCaption: 'Panel Scene menyenaraikan nod dalam adegan yang dibuka.',
    step5Title: 'Buka aset dan buat satu perubahan',
    step5Body: 'Dalam FileSystem, buka res://assets untuk melihat karya seni mengikut modul. Kemudian buka res://scenes/Main.tscn, pilih Welcome Label dalam Scene dan ubah teksnya dalam Inspector.',
    filesCaption: 'Cari aset dan adegan kit permulaan anda dalam FileSystem.',
    inspectorCaption: 'Inspector membolehkan anda mengubah teks Label yang dipilih.',
    step6Title: 'Jalankan adegan dan simpan sumber',
    step6Body: 'Simpan adegan dengan Ctrl+S (Cmd+S pada Mac), kemudian tekan F5 atau butang Play. Permainan terbuka pada tab Game dalam Web Editor. Kembali ke Editor dan gunakan Project → Tools → Download Project Source untuk menyimpan ZIP projek.',
    toolbarCaption: 'Kawalan Play berada di bahagian kanan atas editor.',
    finish: 'Anda kini sedia menggunakan aset ini dalam Permainan Akhir.', next: 'Teruskan ke Permainan Akhir →',
    complete: 'Tanda pelajaran selesai', reopen: 'Buka semula pelajaran', saved: 'Kemajuan disimpan.', error: 'Tidak dapat memuat atau menyimpan kemajuan. Sila segar semula dan cuba lagi.',
    credit: 'Tangkap layar editor Godot oleh Juan Linietsky, Ariel Manzur dan komuniti Godot Engine. Web Editor juga mempunyai tab Loader, Editor dan Game.',
    source: 'Sumber tangkap layar',
    managerAlt: 'Godot Project Manager dengan senarai projek dan tindakan',
    editorAlt: 'Editor Godot dengan ruang kerja 2D aktif',
    sceneAlt: 'Panel Scene Godot yang menunjukkan pepohon nod',
    filesAlt: 'Panel FileSystem Godot yang menyenaraikan folder dan fail projek',
    inspectorAlt: 'Panel Inspector Godot yang menunjukkan sifat nod boleh ubah',
    toolbarAlt: 'Bahagian atas editor Godot dengan tab ruang kerja dan kawalan Play'
  }
};

Object.assign(copy.en, {
  back: '← GODOT FORGE / LEARNING PATH', chapter: 'CHAPTER 20 / GODOT WEB EDITOR',
  introEyebrow: 'GUIDED WORKSPACE / STARTER PROJECT',
  intro: 'Run Godot on our cloud server, edit the starter project in this lesson, and keep your work on the server.',
  cloudTitle: 'Your cloud editor', cloudIntro: 'Your project opens with the lesson assets already installed. It remains on the server when you stop the editor.',
  startCloud: 'Start cloud editor', stopCloud: 'Stop my workspace', downloadCloud: 'Download my project ZIP',
  openCloudTab: 'Open cloud editor in a new tab ↗',
  cloudStarting: 'Starting your cloud workspace. The first launch may take a minute.', cloudReady: 'Your cloud editor is ready.',
  cloudStopping: 'Stopping your workspace…', cloudStopped: 'Workspace stopped. Your project remains saved on the server.',
  cloudUnavailable: 'Cloud editor hosting is being configured. Please try again later.',
  cloudFull: 'All cloud editor slots are in use. Please try again shortly.',
  cloudError: 'Could not start the cloud editor. Please try again.',
  cloudPopupBlocked: 'Allow pop-ups for this site to open the editor in a new tab.',
  step1Title: 'Start your cloud workspace',
  step1Body: 'Select Start cloud editor above. The server prepares a private Godot workspace with the starter project and opens it here. The first launch may take a minute.',
  step1Tip: 'The 83 MiB starter ZIP is available if you want a separate backup. You do not need to upload it to the cloud editor.',
  step2Title: 'Find the 2D workspace', step2Body: 'Godot opens the starter project directly. Choose 2D at the top. The canvas is in the center, with project panels around it.',
  step3Title: 'Read the Scene panel', step3Body: 'Open res://scenes/Main.tscn in FileSystem. The Scene panel lists its nodes. Select Welcome to inspect the Label in the starter scene.',
  step4Title: 'Explore the lesson assets', step4Body: 'In FileSystem, open res://assets. The art is grouped by lesson module, ready to use in your final game.',
  step5Title: 'Change the welcome text', step5Body: 'Select Welcome in Scene, then edit its Text property in Inspector. Save with Ctrl+S (Cmd+S on Mac); the project files stay in your server workspace.',
  step6Title: 'Run, back up, and stop', step6Body: 'Press F5 or the Play button to run the project. When done, use Download my project ZIP for a copy, then Stop my workspace. You can reopen the same server project later.',
  credit: 'Godot editor screenshots by Juan Linietsky, Ariel Manzur, and the Godot Engine community.'
});
Object.assign(copy.zh, {
  back: '← GODOT FORGE / 学习路径', chapter: '第 20 章 / GODOT 网页编辑器',
  introEyebrow: '操作指南 / 入门项目',
  intro: '在云服务器上运行 Godot，直接在本课中编辑入门项目，并将作品保存在服务器上。',
  cloudTitle: '你的云端编辑器', cloudIntro: '项目打开时已包含课程素材。停止编辑器后，作品仍保留在服务器上。',
  startCloud: '启动云端编辑器', stopCloud: '停止我的工作区', downloadCloud: '下载我的项目 ZIP',
  openCloudTab: '在新标签页打开云端编辑器 ↗',
  cloudStarting: '正在启动云端工作区。首次启动可能需要一分钟。', cloudReady: '云端编辑器已就绪。',
  cloudStopping: '正在停止工作区…', cloudStopped: '工作区已停止。项目仍保存在服务器上。',
  cloudUnavailable: '云端编辑器托管仍在配置中，请稍后再试。', cloudFull: '云端编辑器名额已满，请稍后再试。',
  cloudError: '无法启动云端编辑器，请重试。', cloudPopupBlocked: '请允许本站弹出新窗口，以便在新标签页打开编辑器。',
  step1Title: '启动云端工作区', step1Body: '点击上方的“启动云端编辑器”。服务器会准备包含入门项目的独立 Godot 工作区，并在本页打开。首次启动可能需要一分钟。',
  step1Tip: '如需另存备份，可下载约 83 MiB 的入门 ZIP。无需将它上传到云端编辑器。',
  step2Title: '找到 2D 工作区', step2Body: 'Godot 会直接打开入门项目。点击顶部的 2D。画布位于中央，项目面板环绕四周。',
  step3Title: '认识 Scene 面板', step3Body: '在 FileSystem 中打开 res://scenes/Main.tscn。Scene 面板列出场景节点。选择 Welcome，查看入门场景中的 Label。',
  step4Title: '浏览课程素材', step4Body: '在 FileSystem 中打开 res://assets。美术素材已按课程模块分组，可以用于最终游戏。',
  step5Title: '修改欢迎文字', step5Body: '在 Scene 中选择 Welcome，再在 Inspector 中修改 Text 属性。按 Ctrl+S（Mac 上按 Cmd+S）保存；项目文件会保留在服务器工作区。',
  step6Title: '运行、备份并停止', step6Body: '按 F5 或点击播放按钮运行项目。完成后，使用“下载我的项目 ZIP”保存副本，再点击“停止我的工作区”。以后可以重新打开同一个服务器项目。',
  credit: 'Godot 编辑器截图作者：Juan Linietsky、Ariel Manzur 和 Godot Engine 社区。'
});
Object.assign(copy.ms, {
  back: '← GODOT FORGE / LALUAN PEMBELAJARAN', chapter: 'BAB 20 / EDITOR GODOT WEB',
  introEyebrow: 'PANDUAN EDITOR / PROJEK PERMULAAN',
  intro: 'Jalankan Godot pada pelayan awan kami, sunting projek permulaan dalam pelajaran ini dan simpan kerja anda pada pelayan.',
  cloudTitle: 'Editor awan anda', cloudIntro: 'Projek anda dibuka dengan aset pelajaran siap dipasang. Projek kekal pada pelayan apabila editor dihentikan.',
  startCloud: 'Mulakan editor awan', stopCloud: 'Hentikan ruang kerja saya', downloadCloud: 'Muat turun ZIP projek saya',
  openCloudTab: 'Buka editor awan dalam tab baharu ↗',
  cloudStarting: 'Ruang kerja awan sedang dimulakan. Pelancaran pertama mungkin mengambil seminit.', cloudReady: 'Editor awan anda sudah sedia.',
  cloudStopping: 'Ruang kerja sedang dihentikan…', cloudStopped: 'Ruang kerja dihentikan. Projek anda masih disimpan pada pelayan.',
  cloudUnavailable: 'Pengehosan editor awan sedang disediakan. Cuba lagi nanti.',
  cloudFull: 'Semua ruang editor awan sedang digunakan. Cuba lagi sebentar lagi.',
  cloudError: 'Editor awan tidak dapat dimulakan. Sila cuba lagi.',
  cloudPopupBlocked: 'Benarkan tetingkap pop timbul untuk membuka editor dalam tab baharu.',
  step1Title: 'Mulakan ruang kerja awan anda', step1Body: 'Pilih Mulakan editor awan di atas. Pelayan menyediakan ruang kerja Godot peribadi dengan projek permulaan dan membukanya di sini. Pelancaran pertama mungkin mengambil seminit.',
  step1Tip: 'ZIP permulaan 83 MiB tersedia jika anda mahu salinan berasingan. Anda tidak perlu memuat naiknya ke editor awan.',
  step2Title: 'Cari ruang kerja 2D', step2Body: 'Godot membuka projek permulaan secara terus. Pilih 2D di bahagian atas. Kanvas berada di tengah, dengan panel projek di sekelilingnya.',
  step3Title: 'Kenali panel Scene', step3Body: 'Buka res://scenes/Main.tscn dalam FileSystem. Panel Scene menyenaraikan nodnya. Pilih Welcome untuk melihat Label dalam adegan permulaan.',
  step4Title: 'Terokai aset pelajaran', step4Body: 'Dalam FileSystem, buka res://assets. Karya seni disusun mengikut modul dan sedia digunakan dalam permainan akhir anda.',
  step5Title: 'Ubah teks alu-aluan', step5Body: 'Pilih Welcome dalam Scene, kemudian ubah sifat Text dalam Inspector. Simpan dengan Ctrl+S (Cmd+S pada Mac); fail projek kekal dalam ruang kerja pelayan anda.',
  step6Title: 'Jalankan, sandarkan dan hentikan', step6Body: 'Tekan F5 atau butang Play untuk menjalankan projek. Selepas selesai, gunakan Muat turun ZIP projek saya untuk menyimpan salinan, kemudian Hentikan ruang kerja saya. Projek pelayan yang sama boleh dibuka semula nanti.',
  credit: 'Tangkap layar editor Godot oleh Juan Linietsky, Ariel Manzur dan komuniti Godot Engine.'
});

Object.assign(copy.en, {
  launchCloud: 'Launch cloud editor ↗', removeCloud: 'Remove cloud editor',
  preparingEyebrow: 'YOUR WORKSPACE IS ON ITS WAY', preparingTitle: 'Play while we prepare Godot.', preparingBadge: 'Preparing',
  gameTitle: 'Tic-tac-toe', gameScore: 'Sparks', gamePause: 'Pause game', gameResume: 'Resume game',
  gameHelp: 'You are X. Choose a square; the computer plays O.',
  gameAccessible: 'Tic-tac-toe board', moveLeft: 'Move left', moveRight: 'Move right',
  readinessTitle: 'Getting your editor ready', readinessAccessible: 'Editor preparation progress',
  stageInstance: 'Create your Lightsail server', stageNetwork: 'Connect your workspace', stageInstalling: 'Build the Godot editor service', stageSecure: 'Check the secure connection', stageReady: 'Ready to launch in a new tab',
  detailInstance: 'We are creating your personal Lightsail server. Play a round while it boots.',
  detailNetwork: 'Your server is running. We are connecting its address and workspace.',
  detailInstalling: 'Your server is connected. It is building and starting the Godot editor service. Your starter project loads when you launch it.',
  detailSecure: 'We are checking HTTPS and making sure your editor responds securely.',
  detailReady: 'Everything is ready. Select Launch cloud editor above to open Godot in a new tab.',
  preparingNote: 'First-time preparation can take about 20 minutes. Your game does not affect the setup.',
  readyBadge: 'Ready', failedBadge: 'Try again', preparingFailed: 'We could not finish preparing your editor. Select Start cloud editor to retry.',
  cloudPreparing: 'Preparing your personal cloud editor. Play below while we get it ready.',
  cloudPrepared: 'Your editor is ready. Select Launch cloud editor to open it in a new tab.',
  cloudStarting: 'Opening your Godot workspace in a new tab…', cloudRemoving: 'Removing your cloud editor and saved project…', cloudRemoved: 'Cloud editor removed. Select Start cloud editor to prepare a new workspace.',
  step1Body: 'Select Start cloud editor above. Play Tic-tac-toe while your personal server and Godot are prepared. When ready, use the same button to launch the editor in a new tab.',
});
Object.assign(copy.zh, {
  launchCloud: '打开云端编辑器 ↗', removeCloud: '删除云端编辑器',
  preparingEyebrow: '正在准备你的工作区', preparingTitle: '玩个小游戏，等待 Godot 就绪。', preparingBadge: '准备中',
  gameTitle: '井字棋', gameScore: '星光', gamePause: '暂停游戏', gameResume: '继续游戏',
  gameHelp: '使用 ← → 或 A / D 移动。在触摸屏上点击想去的位置。井字棋，避开落下的石头！',
  gameAccessible: '井字棋棋盘', moveLeft: '向左移动', moveRight: '向右移动',
  readinessTitle: '正在准备你的编辑器', readinessAccessible: '编辑器准备进度',
  stageInstance: '创建你的 Lightsail 服务器', stageNetwork: '连接工作区', stageInstalling: '构建 Godot 编辑器服务', stageSecure: '检查安全连接', stageReady: '可在新标签页打开',
  detailInstance: '正在创建你的独立 Lightsail 服务器。启动时可以玩一轮小游戏。', detailNetwork: '服务器已启动。正在连接地址和工作区。',
  detailInstalling: '服务器已连接。正在构建并启动 Godot 编辑器服务。启动编辑器时会加载入门项目。', detailSecure: '正在检查 HTTPS，并确认编辑器能够安全响应。',
  detailReady: '一切就绪。点击上方的打开云端编辑器，在新标签页打开 Godot。',
  preparingNote: '首次准备可能需要约 20 分钟。游戏不会影响安装进度。',
  readyBadge: '已就绪', failedBadge: '请重试', preparingFailed: '编辑器准备未能完成。点击启动云端编辑器重试。',
  cloudPreparing: '正在准备你的独立云端编辑器。可以玩下面的小游戏。', cloudPrepared: '编辑器已就绪。点击打开云端编辑器，在新标签页打开。',
  cloudStarting: '正在新标签页打开你的 Godot 工作区…', cloudRemoving: '正在删除云端编辑器和保存的项目…', cloudRemoved: '云端编辑器已删除。点击启动云端编辑器创建新工作区。',
  step1Body: '点击上方的启动云端编辑器。在准备你的独立服务器和 Godot 时，可以玩井字棋。就绪后，使用同一个按钮在新标签页打开编辑器。',
});
Object.assign(copy.ms, {
  launchCloud: 'Lancarkan editor awan ↗', removeCloud: 'Padam editor awan',
  preparingEyebrow: 'RUANG KERJA ANDA SEDANG DISEDIAKAN', preparingTitle: 'Main sambil kami menyediakan Godot.', preparingBadge: 'Menyediakan',
  gameTitle: 'Tic-tac-toe', gameScore: 'Cahaya', gamePause: 'Jeda permainan', gameResume: 'Sambung permainan',
  gameHelp: 'Anda X. Pilih petak; komputer bermain O.',
  gameAccessible: 'Papan tic-tac-toe', moveLeft: 'Gerak kiri', moveRight: 'Gerak kanan',
  readinessTitle: 'Menyediakan editor anda', readinessAccessible: 'Kemajuan penyediaan editor',
  stageInstance: 'Cipta pelayan Lightsail anda', stageNetwork: 'Sambungkan ruang kerja', stageInstalling: 'Bina perkhidmatan editor Godot', stageSecure: 'Semak sambungan selamat', stageReady: 'Sedia dilancarkan dalam tab baharu',
  detailInstance: 'Pelayan Lightsail peribadi anda sedang dicipta. Main sementara pelayan bermula.', detailNetwork: 'Pelayan sudah berjalan. Alamat dan ruang kerja sedang disambungkan.',
  detailInstalling: 'Pelayan disambungkan. Perkhidmatan editor Godot sedang dibina dan dimulakan. Projek permulaan dimuatkan apabila editor dilancarkan.', detailSecure: 'Kami sedang menyemak HTTPS dan respons selamat editor.',
  detailReady: 'Semuanya sedia. Pilih Lancarkan editor awan untuk membuka Godot dalam tab baharu.',
  preparingNote: 'Penyediaan pertama boleh mengambil kira-kira 20 minit. Permainan tidak mempengaruhi pemasangan.',
  readyBadge: 'Sedia', failedBadge: 'Cuba lagi', preparingFailed: 'Penyediaan editor tidak selesai. Pilih Mulakan editor awan untuk mencuba lagi.',
  cloudPreparing: 'Editor awan peribadi anda sedang disediakan. Main permainan di bawah sementara menunggu.', cloudPrepared: 'Editor anda sedia. Pilih Lancarkan editor awan untuk membuka tab baharu.',
  cloudStarting: 'Membuka ruang kerja Godot dalam tab baharu…', cloudRemoving: 'Memadam editor awan dan projek tersimpan…', cloudRemoved: 'Editor awan dipadam. Pilih Mulakan editor awan untuk menyediakan ruang kerja baharu.',
  step1Body: 'Pilih Mulakan editor awan. Main Tic-tac-toe sementara pelayan peribadi dan Godot disediakan. Apabila sedia, gunakan butang yang sama untuk membuka editor dalam tab baharu.',
});

Object.assign(copy.en, { gameNew: 'New game', gameTurn: 'Your turn — X', gameWon: 'You win!', gameLost: 'Computer wins. Try again!', gameDraw: 'Draw! Play another round.', gamePaused: 'Game paused', gameWaiting: 'Computer is choosing…' });
Object.assign(copy.zh, { gameNew: '新游戏', gameTurn: '轮到你 — X', gameWon: '你赢了！', gameLost: '电脑赢了。再试一次！', gameDraw: '平局！再来一轮。', gamePaused: '游戏已暂停', gameWaiting: '电脑正在选择…' });
Object.assign(copy.ms, { gameNew: 'Permainan baharu', gameTurn: 'Giliran anda — X', gameWon: 'Anda menang!', gameLost: 'Komputer menang. Cuba lagi!', gameDraw: 'Seri! Main lagi.', gamePaused: 'Permainan dijeda', gameWaiting: 'Komputer sedang memilih…' });

Object.assign(copy.en, {
  stopCloud: 'Stop and delete workspace', removingLabel: 'Removing…',
  cloudIntro: 'Your project opens with the lesson assets installed. Stopping deletes the Lightsail instance and its saved files. Download your project ZIP first.',
  step6Body: 'Press F5 or Play to run your project. Download your project ZIP before selecting Stop and delete workspace. Confirm the warning and wait for cleanup to finish.',
  removalFailed: 'Cleanup could not finish. Select Stop and delete workspace to retry removing the remaining resources.',
});
Object.assign(copy.zh, {
  stopCloud: '停止并删除工作区', removingLabel: '正在删除…',
  cloudIntro: '项目已包含课程素材。停止将删除 Lightsail 实例和保存的文件。请先下载项目 ZIP。',
  step6Body: '按 F5 或播放运行项目。先下载项目 ZIP，再选择停止并删除工作区。确认警告后等待清理完成。',
  removalFailed: '清理未完成。选择停止并删除工作区，重试删除剩余资源。',
});
Object.assign(copy.ms, {
  stopCloud: 'Hentikan dan padam ruang kerja', removingLabel: 'Memadam…',
  cloudIntro: 'Projek mengandungi aset pelajaran. Menghentikan akan memadam instance Lightsail dan fail tersimpan. Muat turun ZIP projek dahulu.',
  step6Body: 'Tekan F5 atau Play. Muat turun ZIP projek sebelum memilih Hentikan dan padam ruang kerja. Sahkan amaran dan tunggu pembersihan selesai.',
  removalFailed: 'Pembersihan belum selesai. Pilih Hentikan dan padam ruang kerja untuk mencuba memadam baki sumber.',
});

Object.assign(copy.en, {
  removeEyebrow: 'PERMANENT DELETION', removeTitle: 'Delete your cloud workspace?',
  removeDescription: 'This will permanently delete your Lightsail instance and all saved project files.',
  removeInstance: 'Your Godot editor instance', removeFiles: 'All project files saved on the instance',
  removeNetwork: 'Its static IP and subdomain DNS record',
  removeWarning: 'This cannot be undone. Download your project ZIP before continuing.',
  removeCancel: 'Keep workspace', removeAction: 'Delete workspace',
});
Object.assign(copy.zh, {
  removeEyebrow: '永久删除', removeTitle: '删除你的云端工作区？',
  removeDescription: '此操作会永久删除你的 Lightsail 实例和所有已保存的项目文件。',
  removeInstance: '你的 Godot 编辑器实例', removeFiles: '实例中保存的所有项目文件',
  removeNetwork: '实例的静态 IP 和子域名 DNS 记录',
  removeWarning: '此操作无法撤销。请先下载项目 ZIP。',
  removeCancel: '保留工作区', removeAction: '删除工作区',
});
Object.assign(copy.ms, {
  removeEyebrow: 'PEMADAMAN KEKAL', removeTitle: 'Padam ruang kerja awan anda?',
  removeDescription: 'Ini akan memadam instance Lightsail dan semua fail projek yang disimpan secara kekal.',
  removeInstance: 'Instance editor Godot anda', removeFiles: 'Semua fail projek yang disimpan pada instance',
  removeNetwork: 'IP statik dan rekod DNS subdomainnya',
  removeWarning: 'Tindakan ini tidak boleh dibatalkan. Muat turun ZIP projek anda dahulu.',
  removeCancel: 'Simpan ruang kerja', removeAction: 'Padam ruang kerja',
});

Object.assign(copy.en, {
  readinessChecks: count => `${count} of 5 readiness checks complete`,
  readinessElapsed: minutes => `${minutes} min since start`,
  readinessChecking: 'Checking live server status…',
  readinessCurrent: 'Live status checked just now',
  readinessUnavailable: 'Could not check live status. Retrying…',
});
Object.assign(copy.zh, {
  readinessChecks: count => `已完成 5 项就绪检查中的 ${count} 项`,
  readinessElapsed: minutes => `启动至今 ${minutes} 分钟`,
  readinessChecking: '正在检查服务器实时状态…',
  readinessCurrent: '刚刚已检查实时状态',
  readinessUnavailable: '暂时无法检查实时状态，正在重试…',
});
Object.assign(copy.ms, {
  readinessChecks: count => `${count} daripada 5 semakan kesediaan selesai`,
  readinessElapsed: minutes => `${minutes} minit sejak bermula`,
  readinessChecking: 'Menyemak status pelayan langsung…',
  readinessCurrent: 'Status langsung baru sahaja disemak',
  readinessUnavailable: 'Status langsung tidak dapat disemak. Mencuba lagi…',
});

const learnerId = (() => {
  const key = 'godot-forge-learner-id';
  let value = localStorage.getItem(key);
  if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); }
  return value;
})();
let moduleData = null, statusKey = '', cloudStatusKey = '', readinessStage = 'instance';
let cloudConfigured = false, provisioningEnabled = false, busy = false, preparing = false, gamePaused = false;
let currentSession = null, sessionRequest = null, pollTimer, lastProvisioning = null, statusChecked = false, statusCheckFailed = false;
const completionButton = document.querySelector('#complete');
const startButton = document.querySelector('#start-cloud');
const stopButton = document.querySelector('#stop-cloud');
const removeButton = document.querySelector('#remove-cloud');
const removeDialog = document.querySelector('#remove-dialog');
const confirmRemoveButton = document.querySelector('#confirm-remove');
const downloadLink = document.querySelector('#download-cloud');
const starterDownload = document.querySelector('#download-starter');
const preparation = document.querySelector('#cloud-preparing');
const stageOrder = ['instance', 'network', 'installing', 'secure', 'ready'];
const detailKeys = { instance: 'detailInstance', network: 'detailNetwork', installing: 'detailInstalling', secure: 'detailSecure', ready: 'detailReady' };
const savedLocale = localStorage.getItem('godot-forge-locale');
let locale = copy[savedLocale] ? savedLocale : 'en';
const game = window.createWaitingGame({ board: document.querySelector('#waiting-game'), resultElement: document.querySelector('#game-result'), newButton: document.querySelector('#game-new'), text: key => copy[locale][key] });

function renderReadiness() {
  const failed = ['failed', 'interrupted', 'remove_failed'].includes(lastProvisioning?.state);
  const index = Math.max(0, stageOrder.indexOf(readinessStage));
  const ready = cloudConfigured && !preparing;
  const completed = ready ? 5 : index;
  document.querySelector('#readiness-progress').value = completed;
  const startedAt = Date.parse(lastProvisioning?.startedAt || '');
  const elapsed = Number.isFinite(startedAt) ? Math.max(0, Math.floor((Date.now() - startedAt) / 60000)) : null;
  document.querySelector('#readiness-summary').textContent = [copy[locale].readinessChecks(completed), elapsed === null ? null : copy[locale].readinessElapsed(elapsed)].filter(Boolean).join(' · ');
  document.querySelector('#readiness-checked').textContent = copy[locale][statusCheckFailed ? 'readinessUnavailable' : statusChecked ? 'readinessCurrent' : 'readinessChecking'];
  document.querySelectorAll('#readiness-steps li').forEach((item, i) => {
    const complete = ready || i < index;
    const active = !ready && !failed && i === index;
    item.dataset.status = complete ? 'complete' : active ? 'active' : 'pending';
    if (active) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
    item.querySelector('.step-dot').textContent = complete ? '✓' : String(i + 1);
  });
  document.querySelector('#preparing-badge').textContent = copy[locale][ready ? 'readyBadge' : failed ? 'failedBadge' : 'preparingBadge'];
  document.querySelector('#readiness-detail').textContent = copy[locale][failed ? 'preparingFailed' : ready ? 'detailReady' : detailKeys[readinessStage]];
  game.render();
  document.querySelector('#game-pause').textContent = copy[locale][gamePaused ? 'gameResume' : 'gamePause'];
}
function renderControls() {
  const canDownloadStarter = cloudConfigured && !preparing && lastProvisioning?.state !== 'removing' && !(busy && cloudStatusKey === 'cloudRemoving');
  starterDownload.setAttribute('aria-disabled', String(!canDownloadStarter));
  starterDownload.tabIndex = canDownloadStarter ? 0 : -1;
  if (canDownloadStarter) starterDownload.href = '/api/final-game/starter-kit';
  else starterDownload.removeAttribute('href');
  startButton.textContent = copy[locale][cloudConfigured ? 'launchCloud' : 'startCloud'];
  startButton.disabled = busy || preparing || ['removing', 'remove_failed'].includes(lastProvisioning?.state) || (!cloudConfigured && !provisioningEnabled);
  stopButton.textContent = copy[locale][(lastProvisioning?.state === 'removing' || (busy && cloudStatusKey === 'cloudRemoving')) ? 'removingLabel' : 'stopCloud'];
  stopButton.disabled = busy || preparing || lastProvisioning?.state === 'removing' || (!cloudConfigured && !['failed', 'interrupted', 'remove_failed'].includes(lastProvisioning?.state));
  removeButton.hidden = !lastProvisioning || ['idle', 'removed'].includes(lastProvisioning.state);
  removeButton.disabled = busy || preparing || lastProvisioning?.state === 'removing';
}
function applyLocale(value) {
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : value;
  document.querySelectorAll('[data-copy]').forEach(element => { element.textContent = copy[value][element.dataset.copy]; });
  document.querySelectorAll('[data-alt]').forEach(element => { element.alt = copy[value][element.dataset.alt]; });
  document.querySelectorAll('[data-aria-label]').forEach(element => { element.setAttribute('aria-label', copy[value][element.dataset.ariaLabel]); });
  document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === value)));
  completionButton.textContent = moduleData?.completed ? copy[value].reopen : copy[value].complete;
  document.querySelector('#status').textContent = statusKey ? copy[value][statusKey] : '';
  document.querySelector('#cloud-status').textContent = cloudStatusKey ? copy[value][cloudStatusKey] : '';
  document.title = `${copy[value].title} · Godot Forge`;
  renderControls(); renderReadiness();
}
function setCloudStatus(key) { cloudStatusKey = key; applyLocale(locale); }
function showPreparation() { preparation.hidden = false; game.start(); }
function finishPreparation(job) {
  lastProvisioning = job; preparing = false; cloudConfigured = true; readinessStage = 'ready';
  game.stop(); setCloudStatus('cloudPrepared');
}
function failPreparation(job) {
  lastProvisioning = job; preparing = false; game.stop(); setCloudStatus('preparingFailed');
}
function scheduleStatus() { clearTimeout(pollTimer); pollTimer = setTimeout(refreshCloudStatus, 3000); }
async function refreshCloudStatus() {
  try {
    const response = await fetch(`/api/godot/config?learnerId=${encodeURIComponent(learnerId)}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Config unavailable');
    const config = await response.json();
    statusChecked = true; statusCheckFailed = false;
    provisioningEnabled = config.provisioningEnabled === true;
    cloudConfigured = config.configured === true;
    lastProvisioning = config.provisioning;
    if (lastProvisioning?.state === 'running') {
      preparing = true; readinessStage = lastProvisioning.stage || 'instance'; showPreparation(); setCloudStatus('cloudPreparing'); scheduleStatus();
    } else if (cloudConfigured) {
      if (preparing || !preparation.hidden) finishPreparation(lastProvisioning);
      else setCloudStatus('cloudPrepared');
    } else if (lastProvisioning?.state === 'remove_failed') {
      preparing = false; game.stop(); setCloudStatus('removalFailed');
    } else if (['failed', 'interrupted'].includes(lastProvisioning?.state)) {
      readinessStage = lastProvisioning.stage || readinessStage; showPreparation(); failPreparation(lastProvisioning);
    } else if (lastProvisioning?.state === 'removing') {
      preparing = false; setCloudStatus('cloudRemoving'); scheduleStatus();
    } else {
      preparing = false;
      if (lastProvisioning?.state === 'removed') { preparation.hidden = true; game.stop(); setCloudStatus('cloudRemoved'); }
      else if (!provisioningEnabled) setCloudStatus('cloudUnavailable');
      else { cloudStatusKey = ''; applyLocale(locale); }
    }
  } catch {
    statusCheckFailed = true;
    if (preparing || lastProvisioning?.state === 'removing') scheduleStatus();
    else setCloudStatus('cloudError');
  }
  renderControls(); renderReadiness();
}
async function sessionResponse() {
  const response = await fetch('/api/godot/session', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId }) });
  const result = await response.json();
  if (!response.ok) throw new Error(response.status === 503 ? 'cloudUnavailable' : 'cloudError');
  return { response, result };
}
async function prepareCloudEditor() {
  busy = true; preparing = true; lastProvisioning = { state: 'running', stage: 'instance' }; readinessStage = 'instance'; showPreparation(); setCloudStatus('cloudPreparing');
  try {
    const { response, result } = await sessionResponse();
    if (response.status === 202) {
      lastProvisioning = result.provisioning; readinessStage = result.provisioning.stage || 'instance'; scheduleStatus();
    } else {
      currentSession = result; downloadLink.href = result.downloadUrl; downloadLink.hidden = false; finishPreparation({ state: 'succeeded', stage: 'ready' });
    }
  } catch (error) { failPreparation({ state: 'failed', stage: readinessStage }); }
  finally { busy = false; renderControls(); renderReadiness(); }
}
async function requestCloudSession() {
  if (currentSession) return currentSession;
  if (sessionRequest) return sessionRequest;
  sessionRequest = (async () => {
    const { response, result } = await sessionResponse();
    if (response.status === 202) throw new Error('cloudPreparing');
    if (!result.url?.startsWith('https://') || !result.downloadUrl?.startsWith('https://')) throw new Error('cloudError');
    currentSession = result; downloadLink.href = result.downloadUrl; downloadLink.hidden = false;
    return result;
  })();
  try { return await sessionRequest; } finally { sessionRequest = null; }
}
startButton.addEventListener('click', async () => {
  if (!cloudConfigured) return prepareCloudEditor();
  const tab = window.open('about:blank', '_blank');
  if (!tab) return setCloudStatus('cloudPopupBlocked');
  tab.opener = null;
  tab.document.title = copy[locale].cloudTitle;
  tab.document.body.textContent = copy[locale].cloudStarting;
  busy = true; setCloudStatus('cloudStarting');
  try {
    const session = await requestCloudSession(); tab.location.replace(session.url); preparation.hidden = true; game.stop(); setCloudStatus('cloudReady');
  } catch (error) { tab.close(); setCloudStatus(error.message in copy[locale] ? error.message : 'cloudError'); }
  finally { busy = false; renderControls(); }
});
async function destroyWorkspace() {
  if (busy || preparing) return;
  busy = true; setCloudStatus('cloudRemoving');
  try {
    const response = await fetch('/api/godot/workspace', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, confirmed: true }) });
    if (!response.ok) throw new Error('Removal failed');
    currentSession = null; cloudConfigured = false; downloadLink.hidden = true; downloadLink.removeAttribute('href');
    lastProvisioning = (await response.json()).provisioning; scheduleStatus();
  } catch { setCloudStatus('cloudError'); }
  finally { busy = false; renderControls(); }
}
function confirmWorkspaceRemoval() {
  if (busy || preparing || removeDialog.open) return;
  removeDialog.showModal();
}
stopButton.addEventListener('click', confirmWorkspaceRemoval);
removeButton.addEventListener('click', confirmWorkspaceRemoval);
confirmRemoveButton.addEventListener('click', () => { removeDialog.close(); void destroyWorkspace(); });
document.querySelector('#game-pause').addEventListener('click', () => { gamePaused = !gamePaused; game.setPaused(gamePaused); renderReadiness(); });
document.querySelector('#languages').addEventListener('click', event => {
  const value = event.target.closest('[data-locale]')?.dataset.locale;
  if (!copy[value]) return; locale = value; localStorage.setItem('godot-forge-locale', locale); applyLocale(locale);
});
completionButton.addEventListener('click', async () => {
  if (!moduleData || completionButton.disabled) return;
  completionButton.disabled = true;
  try {
    const response = await fetch('/api/modules/setup-godot-with-ai/progress', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed: !moduleData.completed }) });
    if (!response.ok) throw new Error('Save failed'); moduleData.completed = (await response.json()).completed; statusKey = 'saved';
  } catch { statusKey = 'error'; }
  finally { completionButton.disabled = false; applyLocale(locale); }
});
applyLocale(locale);
refreshCloudStatus();
(async () => {
  try {
    const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`);
    if (!response.ok) throw new Error('Load failed');
    moduleData = (await response.json()).find(module => module.slug === 'setup-godot-with-ai');
    if (!moduleData) throw new Error('Module not registered'); completionButton.disabled = false;
  } catch { statusKey = 'error'; }
  applyLocale(locale);
})();
