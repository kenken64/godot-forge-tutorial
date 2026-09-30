const overviewCopy = {
  en: { back: "← Learning path", language: "Language", topics: "Planned topics", notice: "This module overview is ready. Interactive lessons are coming next.", openEditor: "Open Godot Web Editor ↗", complete: "Mark complete", reopen: "Reopen module", saved: "Progress saved.", error: "Unable to load or save this module. Please refresh and try again.", chapter: (n, minutes) => `CHAPTER ${String(n).padStart(2, "0")} · ${minutes} min` },
  zh: { back: "← 学习路径", language: "语言", topics: "计划学习内容", notice: "本模块概览已就绪，互动课程将在后续添加。", openEditor: "打开 Godot 网页编辑器 ↗", complete: "标记完成", reopen: "重新打开模块", saved: "进度已保存。", error: "无法加载或保存本模块，请刷新后重试。", chapter: (n, minutes) => `第 ${String(n).padStart(2, "0")} 章 · ${minutes} 分钟` },
  ms: { back: "← Laluan pembelajaran", language: "Bahasa", topics: "Topik yang dirancang", notice: "Gambaran keseluruhan modul ini tersedia. Pelajaran interaktif akan ditambah kemudian.", openEditor: "Buka Godot Web Editor ↗", complete: "Tanda selesai", reopen: "Buka semula modul", saved: "Kemajuan disimpan.", error: "Modul ini tidak dapat dimuatkan atau disimpan. Sila muat semula dan cuba lagi.", chapter: (n, minutes) => `BAB ${String(n).padStart(2, "0")} · ${minutes} min` },
};
const plannedTopics = {
  "items-spawning": {
    en: ["Spawn pickups at randomized world positions on a timer.", "Collect items through player contact and update the pickup counter.", "Defeat the grove monster with two attacks and gather its randomized loot drop."],
    zh: ["按时间间隔在地图随机位置生成拾取物。", "玩家接触道具时收集，并更新拾取计数。", "攻击两次击败林地怪物，并收集随机掉落的战利品。"],
    ms: ["Munculkan item kutipan di lokasi dunia rawak mengikut pemasa.", "Kutip item apabila pemain menyentuhnya dan kemas kini pembilang kutipan.", "Serang raksasa rimba dua kali dan kutip loot rawak yang dijatuhkannya."],
  },
  "game-controls": {
    en: ["Detect connected and disconnected gamepads and read input each frame.", "Customize mappings for left, right, jump, crouch/roll, and attack.", "Visualize button presses and analog-stick movement, then save the mapping locally."],
    zh: ["检测手柄的连接与断开，并逐帧读取输入。", "自定义左移、右移、跳跃、蹲下／翻滚和攻击的按键映射。", "可视化按钮按压与摇杆移动，并在本地保存映射。"],
    ms: ["Kesan sambungan atau pemutusan pad dan baca input pada setiap bingkai.", "Sesuaikan pemetaan gerak kiri, kanan, lompat, mencangkung/berguling dan serang.", "Visualisasikan tekanan butang serta pergerakan kayu analog, kemudian simpan pemetaan secara setempat."],
  },
  "game-settings": {
    en: ["Place the player health bar on the left and the collected-coin counter on the right.", "Pause with Escape and resume without resetting the player's world state.", "Persist independent music and sound-effect toggles and reflect each choice in the interface."],
    zh: ["将玩家生命条放在左侧，并在右侧显示已收集金币数量。", "按 Escape 暂停，并在继续游戏时保留玩家和世界状态。", "分别保存背景音乐与音效开关，并在界面中显示当前选择。"],
    ms: ["Letakkan bar nyawa pemain di sebelah kiri dan pembilang syiling di sebelah kanan.", "Jeda dengan Escape dan sambung permainan tanpa menetapkan semula keadaan dunia pemain.", "Simpan tetapan muzik dan kesan bunyi secara berasingan serta paparkan pilihannya pada antara muka."],
  },
  "game-physics": {
    en: ["Change drop height and gravity to compare fall time and impact speed.", "Change boulder mass to see its effect on impact energy without changing ideal fall time.", "Watch a stylized splash when the falling boulder meets the pool."],
    zh: ["调整下落高度和重力，比较下落时间与撞击速度。", "改变巨石质量，观察撞击能量的变化，而理想下落时间不变。", "观察巨石入水时的示意性水花。"],
    ms: ["Ubah ketinggian jatuhan dan graviti untuk membandingkan masa jatuh serta laju hentaman.", "Ubah jisim batu untuk melihat kesannya pada tenaga hentaman tanpa mengubah masa jatuh ideal.", "Lihat percikan bergaya apabila batu menyentuh kolam."],
  },
  "game-ending-cutscene": {
    en: ["Open with a generated four-panel pixel-art recap of the hero defeating the final boss.", "Stage a portrait-led dialogue scene, then offer a consequential heartseed choice.", "Show a distinct generated ending for each choice and save module completion."],
    zh: ["先播放 GPT Image 2.5 Burst 生成的四格像素漫画，回顾主角击败最终首领。", "通过肖像对话呈现最终场景，然后提供会带来后果的生命种子抉择。", "为每个选择展示不同的生成结局，并保存模块完成状态。"],
    ms: ["Mulakan dengan imbas kembali komik piksel empat panel yang dijana, menunjukkan wira menewaskan bos akhir.", "Paparkan dialog berpotret, kemudian tawarkan pilihan benih jantung yang membawa kesan.", "Tunjukkan pengakhiran berbeza yang dijana bagi setiap pilihan dan simpan status modul."],
  },
  credits: {
    en: ["Scroll fictional contributor names and job roles in a readable closing sequence.", "Rotate randomly generated game screenshots beside the credits without immediate repeats.", "Add pause, restart, skip, reduced-motion support, localization, and a clear completion state."],
    zh: ["在易读的片尾名单中滚动显示虚构贡献者姓名和职位。", "在名单旁随机轮播生成的游戏截图，并避免连续重复。", "添加暂停、重播、跳过、减少动态效果支持、本地化和明确的完成状态。"],
    ms: ["Tatal nama penyumbang rekaan dan peranan kerja dalam urutan penutup yang mudah dibaca.", "Putarkan tangkap layar permainan yang dijana secara rawak di sisi senarai tanpa ulangan serta-merta.", "Tambah jeda, mula semula, langkau, sokongan gerakan terhad, penyetempatan dan status selesai yang jelas."],
  },
  "marketplace-system": {
    en: ["Browse normal, rare, and epic armor, weapons, rings, and necklaces; compare prices and buy with gold.", "Sell owned gear back to the merchant for gold, with clear ownership and affordability feedback.", "Salvage gear for enchanting materials by paying a grade-based gold fee; track your wallet and materials."],
    zh: ["浏览普通、稀有和史诗品质的护甲、武器、戒指与项链；比较价格并使用金币购买。", "将已拥有的装备卖给商人换取金币，并清楚显示物品归属与购买能力。", "支付与品质相应的金币费用，将装备分解为附魔材料，并追踪金币和材料数量。"],
    ms: ["Semak perisai, senjata, cincin dan rantai leher gred biasa, langka dan epik; bandingkan harga dan beli dengan emas.", "Jual kelengkapan milik anda kepada pedagang untuk mendapatkan emas, dengan maklumat pemilikan dan kemampuan yang jelas.", "Leraikan kelengkapan menjadi bahan pempesonaan dengan yuran emas mengikut gred; pantau emas dan bahan anda."],
  },
  "game-achievement": {
    en: ["Define achievements with observable unlock conditions and optional progress counters.", "Award each milestone exactly once, persist it, and restore it when the player returns.", "Show accessible badge notifications and let players browse earned and locked achievements."],
    zh: ["用可检测的解锁条件和可选进度计数器定义成就。", "每个里程碑只授予一次，并在玩家返回时恢复保存记录。", "展示无障碍徽章通知，让玩家查看已获得与未解锁的成就。"],
    ms: ["Takrif pencapaian dengan syarat buka kunci yang boleh diperhatikan dan pembilang kemajuan pilihan.", "Anugerahkan setiap pencapaian sekali sahaja, simpan dan pulihkan apabila pemain kembali.", "Papar pemberitahuan lencana yang boleh diakses dan benarkan pemain melihat pencapaian yang diperoleh atau terkunci."],
  },
  "game-leaderboard": {
    en: ["Choose a score metric, ranking direction, tie-break rule, and leaderboard scope.", "Validate score submissions and prevent duplicate or implausible entries.", "Display ranks accessibly, protect player names, and refresh results without losing context."],
    zh: ["选择分数指标、排名方向、平分规则和排行榜范围。", "验证分数提交，防止重复或不合理的记录。", "以无障碍方式显示名次，保护玩家名称，并在刷新结果时保留浏览位置。"],
    ms: ["Pilih ukuran markah, arah kedudukan, peraturan seri dan skop papan pendahulu.", "Sahkan penghantaran markah dan cegah rekod pendua atau tidak munasabah.", "Paparkan kedudukan secara mudah diakses, lindungi nama pemain dan segar semula keputusan tanpa kehilangan konteks."],
  },
  "local-coop": {
    en: ["Add and remove players during play with separate keyboard or gamepad controls.", "Keep player positions, shared-screen camera framing, and cooperative objectives readable.", "Handle player join, leave, pause, and restart without breaking the local session."],
    zh: ["在游戏过程中通过独立键盘或手柄控制添加或移除玩家。", "保持玩家位置、共享屏幕镜头构图和合作目标清晰易读。", "妥善处理玩家加入、离开、暂停和重新开始，避免破坏本地会话。"],
    ms: ["Tambah dan keluarkan pemain semasa permainan dengan kawalan papan kekunci atau pad permainan berasingan.", "Pastikan kedudukan pemain, bingkai kamera skrin kongsi dan objektif koperatif mudah difahami.", "Urus pemain masuk, keluar, jeda dan mula semula tanpa merosakkan sesi setempat."],
  },
  "multiplayer-game": {
    en: ["Choose a host/client or dedicated-server model and define which system owns game state.", "Synchronize movement and shared events while smoothing latency and handling disconnects.", "Validate network messages, reconnect safely, and test the session under realistic conditions."],
    zh: ["选择主机／客户端或专用服务器模式，并明确游戏状态由哪个系统负责。", "同步移动与共享事件，同时平滑处理延迟和断线情况。", "验证网络消息、安全重连，并在真实条件下测试会话。"],
    ms: ["Pilih model hos/pelanggan atau pelayan khusus dan tentukan sistem yang mengawal keadaan permainan.", "Segerakkan pergerakan dan peristiwa bersama sambil melancarkan kependaman serta mengendalikan pemutusan sambungan.", "Sahkan mesej rangkaian, sambung semula dengan selamat dan uji sesi dalam keadaan yang realistik."],
  },
  "enemies-ai": {
    en: ["Create enemy states for idle, patrol, chase, attack, hurt, and defeat.", "Use detection ranges, line of sight, navigation, and cooldowns to make decisions readable.", "Build and debug a finite-state machine that always returns enemies to a valid behavior."],
    zh: ["创建待机、巡逻、追击、攻击、受伤和击败等敌人状态。", "使用侦测范围、视线、导航和冷却时间，让决策过程清晰可读。", "构建并调试有限状态机，确保敌人始终回到有效行为。"],
    ms: ["Cipta keadaan musuh untuk diam, meronda, mengejar, menyerang, cedera dan tewas.", "Gunakan julat pengesanan, garis penglihatan, navigasi dan tempoh bertenang supaya keputusan mudah difahami.", "Bina dan nyahpepijat mesin keadaan terhingga yang sentiasa mengembalikan musuh kepada tingkah laku yang sah."],
  },
  "setup-godot-with-ai": {
    en: ["Open the Godot Web Editor and import a Godot project ZIP.", "Explore scenes, the asset library, and the 2D editor; edit a scene and run it in the browser.", "Download the project source ZIP to keep a copy of your work."],
    zh: ["打开 Godot 网页编辑器并导入 Godot 项目 ZIP。", "浏览场景、素材库和 2D 编辑器；编辑场景并在浏览器中运行。", "下载项目源代码 ZIP，保存自己的作品。"],
    ms: ["Buka Godot Web Editor dan import ZIP projek Godot.", "Terokai adegan, pustaka aset dan editor 2D; sunting adegan dan jalankannya dalam pelayar.", "Muat turun ZIP sumber projek untuk menyimpan salinan kerja anda."],
  },
};
const slug = document.body.dataset.module;
const learnerId = (() => { const key = 'godot-forge-learner-id'; let value = localStorage.getItem(key); if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); } return value; })();
let locale = localStorage.getItem("godot-forge-locale") || "en";
if (!overviewCopy[locale]) locale = "en";
let moduleData = null;
let statusKey = "";
const completionButton = document.querySelector("#complete");

function renderOverview() {
  const copy = overviewCopy[locale];
  document.documentElement.lang = locale === "zh" ? "zh-CN" : locale;
  document.querySelectorAll("[data-copy]").forEach(el => { el.textContent = copy[el.dataset.copy]; });
  document.querySelector("#languages").setAttribute("aria-label", copy.language);
  document.querySelectorAll("[data-locale]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.locale === locale)));
  document.querySelector("#topics").replaceChildren(...(plannedTopics[slug]?.[locale] || []).map(topic => {
    const item = document.createElement("li"); item.textContent = topic; return item;
  }));
  if (moduleData) {
    const translation = moduleData.translations[locale];
    document.title = `${translation.title} · Godot Forge`;
    document.querySelector("#title").textContent = translation.title;
    document.querySelector("#description").textContent = translation.description;
    document.querySelector("#chapter").textContent = slug === "marketplace-system"
      ? ({ en: `CHAPTER ${String(moduleData.level).padStart(2, "0")} / MARKETPLACE SYSTEM`, zh: `第 ${String(moduleData.level).padStart(2, "0")} 章 / 游戏商店系统`, ms: `BAB ${String(moduleData.level).padStart(2, "0")} / SISTEM PASARAN` }[locale])
      : copy.chapter(moduleData.level, moduleData.durationMinutes);
    if (slug === "marketplace-system") {
      document.querySelector("#back-link").textContent = ({ en: "← GODOT FORGE / LEARNING PATH", zh: "← GODOT FORGE / 学习路径", ms: "← GODOT FORGE / LALUAN PEMBELAJARAN" }[locale]);
    }
  }
  completionButton.textContent = moduleData?.completed ? copy.reopen : copy.complete;
  document.querySelector("#status").textContent = statusKey ? copy[statusKey] : "";
}

document.querySelector("#languages").addEventListener("click", event => {
  const language = event.target.closest("button")?.dataset.locale;
  if (!overviewCopy[language]) return;
  locale = language;
  localStorage.setItem("godot-forge-locale", locale);
  renderOverview();
});
completionButton.addEventListener("click", async () => {
  if (!moduleData || completionButton.disabled) return;
  completionButton.disabled = true;
  try {
    const response = await fetch(`/api/modules/${slug}/progress`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ learnerId, completed: !moduleData.completed }) });
    if (!response.ok) throw new Error("Save failed");
    moduleData.completed = (await response.json()).completed;
    statusKey = "saved";
  } catch { statusKey = "error"; }
  finally { completionButton.disabled = false; renderOverview(); }
});
renderOverview();
(async () => {
  try {
    const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`);
    if (!response.ok) throw new Error("Load failed");
    moduleData = (await response.json()).find(module => module.slug === slug);
    if (!moduleData) throw new Error("Module not registered");
    completionButton.disabled = false;
  } catch { statusKey = "error"; }
  renderOverview();
})();
