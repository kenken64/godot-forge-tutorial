import { createServer } from "node:http";
import { createProvisioningController } from "./lightsail-provisioning.mjs";
import { promises as fs } from "node:fs";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import { DuckDBInstance } from "@duckdb/node-api";
import sharp from "sharp";
import { inspectBossLayout, bossRows } from "../boss-creation/sprite-layout.mjs";
import { repairBossSheet, bossAnimationRows } from "../boss-creation/animation-pipeline.mjs";
import { animationRows, gaitPrompt, createGaitGuide, normalizeGrid, validateGait, packSpriteSheet } from "../character-creation/locomotion.mjs";
import { characterManifest, bossManifest, assetPackManifest } from './sprite-manifest.mjs';
import { quizQuestionBank } from './quiz-question-bank.mjs';
import { quizQuestionTranslations } from './quiz-question-translations.mjs';
import { attachMultiplayerRooms } from './multiplayer-rooms.mjs';
import { attachFinalGameRooms } from './final-game-rooms.mjs';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(appDirectory, "..");
const publicDirectory = appDirectory;
const lightsailProvisioning = createProvisioningController({ projectDirectory });
const starterKitPath = path.join(projectDirectory, "final-game", "dist", "godot-forge-starter-v1.zip");
const starterKitUrl = process.env.GODOT_STARTER_KIT_URL || "";
const publishedStarterKitUrl = "https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/final-game/starter/godot-forge-starter-v1.zip";
const spacesManifest = await fs.readFile(path.join(projectDirectory, "SPACES_PUBLIC_URLS.json"), "utf8")
  .then(JSON.parse)
  .catch(error => {
    console.warn(`Spaces image manifest unavailable (${error.message}); using local images.`);
    return { assets: [] };
  });
const spacesAssetUrls = new Map(spacesManifest.assets.map(({ localPath, publicUrl }) => [localPath, publicUrl]));
const publishedStoredAssetUrls = new Map(
  spacesManifest.assets.flatMap(({ localPath, publicUrl }) => {
    const match = localPath.match(/^tutorial-web-app\/storage\/assets\/(?:[^/]+\/)*([^/]+)$/);
    return match ? [[match[1], publicUrl]] : [];
  }),
);
const publishedStoredAssetNames = new Map(
  [...publishedStoredAssetUrls].map(([storedName, publicUrl]) => [publicUrl, storedName]),
);

function publishedAssetUrl(value) {
  if (typeof value !== "string") return value;
  const match = value.match(/^\/api\/assets\/([^/?#]+)$/);
  if (!match) return value;
  try {
    return publishedStoredAssetUrls.get(decodeURIComponent(match[1])) || value;
  } catch {
    return value;
  }
}
const storageDirectory = path.resolve(
  process.env.APP_STORAGE_DIR || process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(appDirectory, "storage"),
);
const assetDirectory = path.join(storageDirectory, "assets");
const storyVoiceDirectory = path.join(storageDirectory, "story-voices");
// Reuse existing checkpoints/assets; new installations use the renamed file.
const legacyDatabasePath = path.join(storageDirectory, "pixel-forge.duckdb");
const databasePath = await fs.access(legacyDatabasePath).then(
  () => legacyDatabasePath,
  () => path.join(storageDirectory, "godot-forge.duckdb"),
);
const port = Number(process.env.PORT || 3000);
const maxAssetBytes = 50 * 1024 * 1024;
const openAiApiKey = process.env.OPENAI_API_KEY || "";
const openAiApiBase = (process.env.OPENAI_API_BASE || "https://api.openai.com/v1").replace(/\/+$/, "");
const openAiImageModel = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-sunburst";
const openAiTtsModel = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const storyVoiceRequests = new Map();
const ollamaProxyUrl = (process.env.OLLAMA_PROXY_URL || "http://127.0.0.1:8788").replace(/\/+$/, "");

const modules = [
  {
    slug: "character-creation",
    title: "Character Creation",
    description: "Design a playable hero with a clear role, personality, movement style, and visual identity.",
    level: 1,
    durationMinutes: 30,
    tag: "PLAYER",
    translations: {
      zh: { title: "角色创建", description: "打造拥有移动、个性与目标的玩家角色。" },
      ms: { title: "Penciptaan watak", description: "Bina watak pemain dengan pergerakan, personaliti dan tujuan." },
    },
  },
  {
    slug: "game-assets-creation",
    title: "Game Asset Creation",
    description: "Establish a cohesive visual language and produce reusable art for your game world.",
    level: 2,
    durationMinutes: 25,
    tag: "FOUNDATION",
    translations: {
      zh: { title: "游戏资产创建", description: "创建游戏世界的视觉语言和可重用素材。" },
      ms: { title: "Penciptaan aset permainan", description: "Cipta bahasa visual dan aset boleh guna semula untuk dunia permainan." },
    },
  },
  {
    slug: "parallax-tiling-map",
    title: "Parallax & Tilemaps",
    description: "Construct reusable tilemaps and layered parallax backgrounds that add depth and scale.",
    level: 5,
    durationMinutes: 35,
    tag: "WORLD",
    translations: {
      zh: { title: "视差平铺地图", description: "构建分层环境，让每一步探索都更有空间感。" },
      ms: { title: "Peta jubin paralaks", description: "Bina persekitaran berlapis yang menjadikan setiap langkah terasa luas." },
    },
  },
  {
    slug: "game-loop-engine",
    title: "Game Loop Architecture",
    description: "Build a playable quest loop: collect 20 coins, reach the goal, celebrate level completion, and restart with Continue.",
    level: 8,
    durationMinutes: 45,
    tag: "CORE",
    translations: {
      zh: { title: "游戏循环架构", description: "完成可玩的任务循环：收集 20 枚金币、抵达终点、庆祝通关，并点击继续重新开始。" },
      ms: { title: "Seni Bina Gelung Permainan", description: "Bina gelung misi yang boleh dimainkan: kutip 20 syiling, capai matlamat, raikan tamat aras dan mula semula dengan Teruskan." },
    },
  },
  {
    slug: "game-controls",
    title: "Gamepad Controls",
    description: "Customize left/right movement, jump, crouch/roll, and attack mappings, then inspect live button and stick input on a visual gamepad.",
    level: 9,
    durationMinutes: 30,
    tag: "INPUT",
    translations: {
      zh: { title: "游戏手柄控制", description: "自定义左右移动、跳跃、蹲下／翻滚和攻击映射，并通过手柄示意图查看实时按键与摇杆输入。" },
      ms: { title: "Kawalan Pad Permainan", description: "Sesuaikan pemetaan gerak kiri/kanan, lompat, mencangkung/berguling dan serang, kemudian lihat input butang dan kayu analog pada visualisasi pad permainan." },
    },
  },
  {
    slug: "game-settings",
    title: "Game HUD and Settings",
    description: "Build a clear player HUD for health and coins, then pause play to control and save music and sound options.",
    level: 10,
    durationMinutes: 25,
    tag: "SETTINGS",
    translations: {
      zh: { title: "游戏 HUD 与设置", description: "构建清晰的生命值与金币 HUD，并通过暂停菜单控制和保存音乐与音效设置。" },
      ms: { title: "HUD dan Tetapan Permainan", description: "Bina HUD nyawa dan syiling yang jelas, kemudian jeda permainan untuk mengawal dan menyimpan tetapan muzik serta kesan bunyi." },
    },
  },
  {
    slug: "game-physics",
    title: "Game Physics",
    description: "Swim and dive across a forest pool while a boulder drop reveals gravity, fall time, impact speed, and energy.",
    level: 11,
    durationMinutes: 40,
    tag: "PHYSICS",
    translations: {
      zh: { title: "游戏物理", description: "操控探险者游过森林水池并潜水，同时通过巨石落水探索重力、下落时间、撞击速度和能量。" },
      ms: { title: "Fizik Permainan", description: "Berenang dan menyelam merentasi kolam hutan sambil batu jatuh memperlihatkan graviti, masa jatuh, laju hentaman dan tenaga." },
    },
  },
  {
    slug: "items-spawning",
    title: "Item Spawning",
    description: "Create random world pickups, collect them through player contact, and drop loot when an enemy is defeated.",
    level: 6,
    durationMinutes: 20,
    tag: "SYSTEM",
    translations: {
      zh: { title: "道具生成", description: "在地图中随机生成可拾取道具，让玩家触碰收集，并在敌人被击败时掉落战利品。" },
      ms: { title: "Penjanaan item", description: "Munculkan item secara rawak di dunia, kutip dengan menyentuhnya, dan jatuhkan loot apabila musuh ditewaskan." },
    },
  },
  {
    slug: "enemies-ai",
    title: "Enemies & AI",
    description: "Create two forest enemies with patrol, proximity detection, chase, close-range attacks, and player feedback.",
    level: 7,
    durationMinutes: 45,
    tag: "AI",
    translations: {
      zh: { title: "敌人与 AI", description: "创建两种森林敌人，加入巡逻、近距离侦测、追逐、近战攻击和玩家反馈。" },
      ms: { title: "Musuh & AI", description: "Cipta dua musuh hutan dengan rondaan, pengesanan jarak dekat, kejaran, serangan jarak dekat dan maklum balas pemain." },
    },
  },
  {
    slug: "boss-creation",
    title: "Boss Creation",
    description: "Design a memorable boss with readable combat patterns, animation states, and satisfying progression.",
    level: 3,
    durationMinutes: 40,
    tag: "CHALLENGE",
    translations: {
      zh: { title: "Boss 创建", description: "设计具有清晰模式和精彩回报的难忘挑战。" },
      ms: { title: "Penciptaan bos", description: "Reka cabaran yang mudah difahami dengan corak dan ganjaran yang berkesan." },
    },
  },
  {
    slug: "storyline-engine",
    title: "Storyline Engine",
    description: "Build a player-driven story with clear motivation, conflict, consequential choices, and playable outcomes.",
    level: 4,
    durationMinutes: 35,
    tag: "STORY",
    translations: {
      zh: { title: "故事线引擎", description: "用分支叙事节奏给玩家探索的理由。" },
      ms: { title: "Enjin jalan cerita", description: "Berikan sebab untuk meneroka melalui rentak naratif bercabang." },
    },
  },
  {
    slug: "game-ending-cutscene",
    title: "Ending Cutscene",
    description: "Recap the final boss battle, then let a consequential player choice shape the pixel-art ending.",
    level: 12,
    durationMinutes: 30,
    tag: "CINEMATIC",
    translations: {
      zh: { title: "游戏结局过场动画", description: "回顾最终首领战斗，再让玩家的重要抉择决定像素风结局。" },
      ms: { title: "Babak akhir permainan", description: "Imbas kembali pertarungan bos akhir, kemudian biarkan pilihan penting pemain menentukan pengakhiran seni piksel." },
    },
  },
  {
    slug: "credits",
    title: "Game Credits",
    description: "Produce readable, skippable, accessible credits that recognize contributors and tools.",
    level: 13,
    durationMinutes: 15,
    tag: "CREDITS",
    translations: {
      zh: { title: "游戏制作人员名单", description: "制作精致的致谢名单，向游戏背后的创作者、工具和创作历程致敬。" },
      ms: { title: "Penghargaan permainan", description: "Cipta urutan penghargaan yang kemas untuk meraikan orang, alatan dan perjalanan di sebalik permainan anda." },
    },
  },
  {
    slug: "marketplace-system",
    title: "Marketplace System",
    description: "Compare normal, rare, and epic armor, weapons, rings, and necklaces; buy with gold, sell owned gear, or salvage it into enchanting materials for a grade-based fee.",
    level: 14,
    durationMinutes: 35,
    tag: "ECONOMY",
    translations: {
      zh: { title: "游戏商店系统", description: "比较普通、稀有和史诗品质的护甲、武器、戒指及项链；使用金币购买、出售装备，或支付对应品质的费用来分解附魔材料。" },
      ms: { title: "Sistem pasaran", description: "Bandingkan perisai, senjata, cincin dan rantai leher gred biasa, langka atau epik; beli dengan emas, jual kelengkapan atau bayar yuran mengikut gred untuk meleraikannya menjadi bahan pempesonaan." },
    },
  },
  {
    slug: "game-achievement",
    title: "Achievements",
    description: "Collect ten gold coins and a healing heart, then watch earned badges animate and turn from grey to color.",
    level: 15,
    durationMinutes: 30,
    tag: "REWARDS",
    translations: {
      zh: { title: "游戏成就", description: "收集十枚金币和一颗恢复生命的爱心，让已获得的徽章从灰色变为彩色并播放动画。" },
      ms: { title: "Pencapaian Permainan", description: "Kumpul sepuluh syiling emas dan hati penyembuh, kemudian lihat lencana yang diperoleh beranimasi dan berubah daripada kelabu kepada berwarna." },
    },
  },
  {
    slug: "game-leaderboard",
    title: "Leaderboards",
    description: "Collect ten gold coins and a heart for 150 points, then watch your score animate onto a leaderboard that changes from grey to color.",
    level: 16,
    durationMinutes: 35,
    tag: "RANKING",
    translations: {
      zh: { title: "游戏排行榜", description: "收集十枚金币和一颗爱心得到 150 分，观看分数以动画登上由灰色变为彩色的排行榜。" },
      ms: { title: "Papan Pendahulu Permainan", description: "Kumpul sepuluh syiling emas dan satu hati untuk 150 mata, kemudian lihat markah anda beranimasi pada papan pendahulu yang berubah daripada kelabu kepada berwarna." },
    },
  },
  {
    slug: "local-coop",
    title: "Local Co-op",
    description: "Play a shared-screen coin run with one keyboard player, one gamepad player, and separate coin counters.",
    level: 17,
    durationMinutes: 35,
    tag: "CO-OP",
    translations: {
      zh: { title: "本地合作游戏", description: "在共享画面中收集金币：一位玩家使用键盘，另一位使用手柄，并分别记录金币数量。" },
      ms: { title: "Kerjasama Setempat", description: "Kumpul syiling pada skrin bersama: seorang pemain menggunakan papan kekunci, seorang lagi pad permainan, dengan kiraan syiling berasingan." },
    },
  },
  {
    slug: "multiplayer-game",
    title: "Multiplayer Game",
    description: "Host or join a two-player WebSocket room from either player view, chat, ready up, and collect coins in a synchronized game.",
    level: 18,
    durationMinutes: 45,
    tag: "NETWORKING",
    translations: {
      zh: { title: "多人联网游戏", description: "从任意玩家画面主持或加入双人 WebSocket 房间，聊天、准备并在同步游戏中收集金币。" },
      ms: { title: "Permainan Berbilang Pemain", description: "Jadi hos atau sertai bilik WebSocket dua pemain dari mana-mana paparan, bersembang, bersedia dan kumpul syiling dalam permainan segerak." },
    },
  },
  {
    slug: "math-stem-physics-quiz",
    title: "Math, STEM & Physics Quiz",
    description: "Assess maths, physics, game systems, and computer-game history with a 40-question checkpoint.",
    level: 19,
    durationMinutes: 40,
    tag: "STEM",
    translations: {
      zh: { title: "数学、STEM 与物理测验", description: "通过 40 道题测试游戏数学、物理、系统和电脑游戏史知识。" },
      ms: { title: "Kuiz matematik, STEM & fizik", description: "Uji matematik permainan, fizik, sistem dan sejarah permainan komputer melalui 40 soalan." },
    },
  },
  {
    slug: "setup-godot-with-ai",
    title: "Learn Godot Web Editor",
    description: "Run Godot in a cloud workspace, explore the 2D editor, and build with the lesson assets.",
    level: 20,
    durationMinutes: 45,
    tag: "GODOT",
    translations: {
      zh: { title: "学习 Godot 网页编辑器", description: "在云端工作区运行 Godot，探索 2D 编辑器，并使用课程素材制作游戏。" },
      ms: { title: "Pelajari Godot Web Editor", description: "Jalankan Godot dalam ruang kerja awan, terokai editor 2D dan bina permainan dengan aset pelajaran." },
    },
  },
  {
    slug: "final-game",
    title: "Final Game",
    description: "Build one complete Godot level with the art and systems from modules 1–18, then test solo, local co-op, and online play.",
    level: 21,
    durationMinutes: 180,
    tag: "SHIP IT",
    translations: {
      zh: { title: "最终游戏", description: "运用第 1–18 章的素材与系统，在 Godot 中制作并测试一个完整关卡。" },
      ms: { title: "Permainan akhir", description: "Gunakan aset dan sistem modul 1–18 untuk membina dan menguji satu tahap Godot yang lengkap." },
    },
  },
];

let database;

async function initializeDatabase() {
  await fs.mkdir(assetDirectory, { recursive: true });

  const instance = await DuckDBInstance.create(databasePath);
  database = await instance.connect();

  await database.run(`
    CREATE TABLE IF NOT EXISTS modules (
      slug VARCHAR PRIMARY KEY,
      title VARCHAR NOT NULL,
      description VARCHAR NOT NULL,
      level INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL,
      tag VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS module_content (
      module_slug VARCHAR PRIMARY KEY,
      body_markdown VARCHAR NOT NULL DEFAULT '',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS module_translations (
      module_slug VARCHAR NOT NULL,
      locale VARCHAR NOT NULL,
      title VARCHAR NOT NULL,
      description VARCHAR NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (module_slug, locale)
    );

    CREATE TABLE IF NOT EXISTS tutorial_progress (
      module_slug VARCHAR PRIMARY KEY,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS learner_progress (
      learner_id VARCHAR NOT NULL,
      module_slug VARCHAR NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (learner_id, module_slug)
    );

    CREATE TABLE IF NOT EXISTS assets (
      id VARCHAR PRIMARY KEY,
      module_slug VARCHAR NOT NULL,
      original_name VARCHAR NOT NULL,
      stored_name VARCHAR NOT NULL UNIQUE,
      relative_path VARCHAR NOT NULL,
      mime_type VARCHAR NOT NULL,
      byte_size BIGINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS characters (
      id VARCHAR PRIMARY KEY,
      module_slug VARCHAR NOT NULL,
      name VARCHAR NOT NULL,
      archetype VARCHAR NOT NULL,
      personality VARCHAR NOT NULL,
      ability VARCHAR NOT NULL,
      weakness VARCHAR NOT NULL,
      role VARCHAR NOT NULL DEFAULT '',
      focus_attribute VARCHAR NOT NULL DEFAULT '',
      weapon VARCHAR NOT NULL DEFAULT '',
      combat_style VARCHAR NOT NULL DEFAULT '',
      visual_hook VARCHAR NOT NULL DEFAULT '',
      profile_json VARCHAR NOT NULL,
      conversation_json VARCHAR NOT NULL,
      creative_prompt VARCHAR NOT NULL DEFAULT '',
      locale VARCHAR NOT NULL DEFAULT 'en',
      ai_design_json VARCHAR NOT NULL DEFAULT '{}',
      sprite_sheet_json VARCHAR NOT NULL DEFAULT '{}',
      movement_json VARCHAR NOT NULL DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quiz_questions (
      id VARCHAR PRIMARY KEY,
      module_slug VARCHAR NOT NULL,
      question VARCHAR NOT NULL,
      options_json VARCHAR NOT NULL,
      correct_option INTEGER NOT NULL,
      explanation VARCHAR NOT NULL,
      category VARCHAR NOT NULL DEFAULT 'Game Systems',
      source_url VARCHAR,
      position INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quiz_question_translations (
      question_id VARCHAR NOT NULL,
      locale VARCHAR NOT NULL,
      category VARCHAR NOT NULL,
      question VARCHAR NOT NULL,
      options_json VARCHAR NOT NULL,
      explanation VARCHAR NOT NULL,
      PRIMARY KEY (question_id, locale)
    );

    CREATE TABLE IF NOT EXISTS quiz_answers (
      learner_id VARCHAR NOT NULL,
      module_slug VARCHAR NOT NULL,
      question_id VARCHAR NOT NULL,
      selected_option INTEGER NOT NULL,
      answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (learner_id, module_slug, question_id)
    );

    CREATE TABLE IF NOT EXISTS boss_animation_artifacts (
      cache_key VARCHAR PRIMARY KEY,
      artifact_json VARCHAR NOT NULL
    );

    CREATE TABLE IF NOT EXISTS module_checkpoints (
      learner_id VARCHAR NOT NULL,
      module_slug VARCHAR NOT NULL,
      state_json VARCHAR NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (learner_id, module_slug)
    );
  `);

  await database.run(`
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS creative_prompt VARCHAR;
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS locale VARCHAR;
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS role VARCHAR;
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS focus_attribute VARCHAR;
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS weapon VARCHAR;
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS combat_style VARCHAR;
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS visual_hook VARCHAR;
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS ai_design_json VARCHAR;
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS sprite_sheet_json VARCHAR;
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS movement_json VARCHAR;
    ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS category VARCHAR DEFAULT 'Game Systems';
    ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS source_url VARCHAR;
  `);

  // Retire the previous combined module and carry any completed local-play progress
  // into the new Local Co-op module without marking online multiplayer complete.
  await database.run(`
    INSERT INTO learner_progress (learner_id, module_slug, completed)
    SELECT learner_id, 'local-coop', completed FROM learner_progress
    WHERE module_slug = 'local-coop-multiplayer'
    ON CONFLICT (learner_id, module_slug) DO NOTHING;
    INSERT INTO tutorial_progress (module_slug, completed)
    SELECT 'local-coop', completed FROM tutorial_progress
    WHERE module_slug = 'local-coop-multiplayer'
    ON CONFLICT (module_slug) DO NOTHING;
    DELETE FROM modules WHERE slug = 'local-coop-multiplayer';
    DELETE FROM module_translations WHERE module_slug = 'local-coop-multiplayer';
    DELETE FROM module_content WHERE module_slug = 'local-coop-multiplayer';
  `);

  for (const module of modules) {
    await database.run(
      `
        INSERT INTO modules (slug, title, description, level, duration_minutes, tag)
        VALUES ($slug, $title, $description, $level, $duration_minutes, $tag)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          level = EXCLUDED.level,
          duration_minutes = EXCLUDED.duration_minutes,
          tag = EXCLUDED.tag
      `,
      {
        slug: module.slug,
        title: module.title,
        description: module.description,
        level: module.level,
        duration_minutes: module.durationMinutes,
        tag: module.tag,
      },
    );

    await database.run(
      `INSERT INTO module_content (module_slug) VALUES ($module_slug) ON CONFLICT (module_slug) DO NOTHING`,
      { module_slug: module.slug },
    );

    for (const [locale, translation] of Object.entries({
      en: { title: module.title, description: module.description },
      ...module.translations,
    })) {
      await database.run(
        `
          INSERT INTO module_translations (module_slug, locale, title, description)
          VALUES ($module_slug, $locale, $title, $description)
          ON CONFLICT (module_slug, locale) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description
        `,
        {
          module_slug: module.slug,
          locale,
          title: translation.title,
          description: translation.description,
        },
      );
    }
  }

  for (const [position, question] of quizQuestionBank.entries()) {
    await database.run(
      `
        INSERT INTO quiz_questions (id, module_slug, question, options_json, correct_option, explanation, category, source_url, position)
        VALUES ($id, 'math-stem-physics-quiz', $question, $options_json, $correct_option, $explanation, $category, $source_url, $position)
        ON CONFLICT (id) DO UPDATE SET
          question = EXCLUDED.question,
          options_json = EXCLUDED.options_json,
          correct_option = EXCLUDED.correct_option,
          explanation = EXCLUDED.explanation,
          category = EXCLUDED.category,
          source_url = EXCLUDED.source_url,
          position = EXCLUDED.position
      `,
      { id: question.id, question: question.question, options_json: JSON.stringify(question.options), correct_option: question.correctOption, explanation: question.explanation, category: question.category, source_url: question.sourceUrl || null, position: position + 1 },
    );
    for (const locale of ['zh', 'ms']) {
      const translation = quizQuestionTranslations[locale][question.id];
      if (!translation) throw new Error(`Missing ${locale} quiz translation for ${question.id}`);
      await database.run(
        `INSERT INTO quiz_question_translations (question_id, locale, category, question, options_json, explanation)
         VALUES ($question_id, $locale, $category, $question, $options_json, $explanation)
         ON CONFLICT (question_id, locale) DO UPDATE SET
           category = EXCLUDED.category,
           question = EXCLUDED.question,
           options_json = EXCLUDED.options_json,
           explanation = EXCLUDED.explanation`,
        { question_id: question.id, locale, category: translation.category, question: translation.question, options_json: JSON.stringify(translation.options), explanation: translation.explanation },
      );
    }
  }
}

async function queryRows(sql, parameters) {
  const reader = await database.runAndReadAll(sql, parameters);
  return reader.getRowObjects();
}

async function getModules(learnerId = "") {
  const moduleRows = await queryRows(`
    SELECT
      m.slug,
      m.title,
      m.description,
      m.level,
      m.duration_minutes AS durationMinutes,
      m.tag,
      CASE WHEN m.slug = 'math-stem-physics-quiz' THEN COALESCE(lp.completed, FALSE)
           ELSE COALESCE(lp.completed, p.completed, FALSE) END AS completed
    FROM modules m
    LEFT JOIN learner_progress lp ON lp.module_slug = m.slug AND lp.learner_id = $learner_id
    LEFT JOIN tutorial_progress p ON p.module_slug = m.slug
    ORDER BY m.level
  `, { learner_id: learnerId });
  const translationRows = await queryRows(`
    SELECT module_slug AS moduleSlug, locale, title, description
    FROM module_translations
    ORDER BY module_slug, locale
  `);
  const translationsByModule = new Map();
  for (const translation of translationRows) {
    if (!translationsByModule.has(translation.moduleSlug)) translationsByModule.set(translation.moduleSlug, {});
    translationsByModule.get(translation.moduleSlug)[translation.locale] = {
      title: translation.title,
      description: translation.description,
    };
  }
  return moduleRows.map((module) => ({
    ...module,
    translations: translationsByModule.get(module.slug) || {},
  }));
}

function findModule(slug) {
  return modules.find((module) => module.slug === slug);
}

function validLearnerId(value) {
  return /^[a-zA-Z0-9_-]{16,100}$/.test(String(value || ""));
}

function quizLocale(value) { return ['zh', 'ms'].includes(value) ? value : 'en'; }

async function savedQuizAnswers(moduleSlug, learnerId, locale) {
  const rows = await queryRows(
    `SELECT a.question_id AS questionId, a.selected_option AS selectedOption,
            q.correct_option AS correctOption, COALESCE(t.explanation, q.explanation) AS explanation,
            q.source_url AS sourceUrl
     FROM quiz_answers a
     JOIN quiz_questions q ON q.id = a.question_id AND q.module_slug = a.module_slug
     LEFT JOIN quiz_question_translations t ON t.question_id = q.id AND t.locale = $locale
     WHERE a.module_slug = $module_slug AND a.learner_id = $learner_id
     ORDER BY q.position`,
    { module_slug: moduleSlug, learner_id: learnerId, locale: quizLocale(locale) },
  );
  return rows.map(row => ({
    questionId: row.questionId, option: Number(row.selectedOption),
    correct: Number(row.selectedOption) === Number(row.correctOption),
    correctOption: Number(row.correctOption), explanation: row.explanation, sourceUrl: row.sourceUrl || null,
  }));
}

async function evaluateQuizAnswer(moduleSlug, questionId, optionValue, locale) {
  const rows = await queryRows(
    `SELECT q.options_json AS optionsJson, q.correct_option AS correctOption,
            COALESCE(t.explanation, q.explanation) AS explanation, q.source_url AS sourceUrl
     FROM quiz_questions q
     LEFT JOIN quiz_question_translations t ON t.question_id = q.id AND t.locale = $locale
     WHERE q.id = $id AND q.module_slug = $module_slug LIMIT 1`,
    { id: String(questionId || ''), module_slug: moduleSlug, locale: quizLocale(locale) },
  );
  if (!rows.length) return { status: 404, payload: { error: 'Quiz question not found.' } };
  const option = Number(optionValue);
  const options = JSON.parse(rows[0].optionsJson);
  if (!Number.isInteger(option) || option < 0 || option >= options.length) return { status: 400, payload: { error: 'Choose a valid answer.' } };
  return { status: 200, payload: { correct: option === Number(rows[0].correctOption), correctOption: Number(rows[0].correctOption), explanation: rows[0].explanation, sourceUrl: rows[0].sourceUrl || null } };
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload, (_key, value) => publishedAssetUrl(value));
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
  });
  response.end(body);
}

function sendText(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  response.end(body);
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

async function readAsset(request) {
  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > maxAssetBytes) {
    const error = new Error("Asset is larger than the 50 MB limit.");
    error.statusCode = 413;
    throw error;
  }

  const chunks = [];
  let receivedBytes = 0;
  for await (const chunk of request) {
    receivedBytes += chunk.length;
    if (receivedBytes > maxAssetBytes) {
      const error = new Error("Asset is larger than the 50 MB limit.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function safeOriginalName(value) {
  let originalName = "asset.bin";
  try {
    originalName = decodeURIComponent(value || originalName);
  } catch {
    originalName = value || originalName;
  }
  return path
    .basename(originalName)
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, 120) || "asset.bin";
}

function safeAssetStem(value) {
  return String(value || "character")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80) || "character";
}

async function persistAsset(moduleSlug, originalName, bytes, mimeType) {
  if (!bytes.length) {
    const error = new Error("The asset is empty.");
    error.statusCode = 400;
    throw error;
  }

  const id = randomUUID();
  const normalizedName = safeOriginalName(originalName);
  const extension = path.extname(normalizedName).toLowerCase().slice(0, 12);
  const storedName = `${id}${extension}`;
  // Final-game assets live in their own persistent library on the configured
  // local/Railway volume. Existing assets stay at their original flat paths.
  const assetSubdirectory = moduleSlug === "final-game" ? "final-game" : "";
  const relativePath = path.join("assets", assetSubdirectory, storedName);
  const filePath = path.join(assetDirectory, assetSubdirectory, storedName);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, bytes, { flag: "wx" });

  try {
    await database.run(
      `
        INSERT INTO assets (id, module_slug, original_name, stored_name, relative_path, mime_type, byte_size)
        VALUES ($id, $module_slug, $original_name, $stored_name, $relative_path, $mime_type, $byte_size)
      `,
      {
        id,
        module_slug: moduleSlug,
        original_name: normalizedName,
        stored_name: storedName,
        relative_path: relativePath,
        mime_type: mimeType || "application/octet-stream",
        byte_size: bytes.length,
      },
    );
  } catch (error) {
    await fs.rm(filePath, { force: true });
    throw error;
  }

  return {
    id,
    moduleSlug,
    originalName: normalizedName,
    storedName,
    byteSize: bytes.length,
    relativePath,
    assetUrl: `/api/assets/${encodeURIComponent(storedName)}`,
  };
}

function storedNameFromAssetUrl(assetUrl) {
  const publishedStoredName = publishedStoredAssetNames.get(String(assetUrl));
  if (publishedStoredName) return publishedStoredName;
  try {
    const pathname = new URL(String(assetUrl), "http://localhost").pathname;
    const match = pathname.match(/^\/api\/assets\/([^/]+)$/);
    const storedName = match ? decodeURIComponent(match[1]) : "";
    return path.basename(storedName) === storedName ? storedName : "";
  } catch {
    return "";
  }
}

async function publishCharacterSpriteToFinalGame(spriteSheet, characterName) {
  const storedName = storedNameFromAssetUrl(spriteSheet.assetUrl);
  if (!storedName) {
    const error = new Error("Generate and save a sprite sheet before publishing this character to Final Game.");
    error.statusCode = 400;
    throw error;
  }
  const assets = await queryRows(
    `SELECT original_name AS originalName, mime_type AS mimeType, relative_path AS relativePath
     FROM assets WHERE stored_name = $stored_name LIMIT 1`,
    { stored_name: storedName },
  );
  if (!assets.length) {
    const error = new Error("The character sprite sheet is not available in the asset library.");
    error.statusCode = 400;
    throw error;
  }
  const sourceRelativePath = path.relative("assets", assets[0].relativePath);
  const sourcePath = safePath(assetDirectory, `/${sourceRelativePath}`);
  const bytes = sourcePath ? await fs.readFile(sourcePath).catch(() => null) : null;
  if (!bytes) {
    const error = new Error("The character sprite sheet file could not be found on the asset volume.");
    error.statusCode = 400;
    throw error;
  }
  const image = await persistAsset(
    "final-game",
    `${safeAssetStem(characterName)}-sprite-sheet.png`,
    bytes,
    assets[0].mimeType,
  );
  const { width, height } = await sharp(bytes).metadata();
  return publishManifest(image, characterManifest(image, width, height, spriteSheet));
}

async function publishManifest(image, manifest) {
  const metadataAsset = await persistAsset(
    'final-game', `${path.parse(image.originalName).name}.json`,
    Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`), 'application/json',
  );
  return { ...image, metadataAsset };
}

async function publishAssetToFinalGame({ assetUrl, sourceModule, name, category }) {
  let storedName = storedNameFromAssetUrl(assetUrl);
  if (!storedName || !findModule(sourceModule) || sourceModule === "final-game") {
    const error = new Error("Choose a saved tutorial asset before publishing it to Final Game.");
    error.statusCode = 400;
    throw error;
  }
  let assets = await queryRows(
    `SELECT module_slug AS moduleSlug, original_name AS originalName, mime_type AS mimeType, relative_path AS relativePath
     FROM assets WHERE stored_name = $stored_name LIMIT 1`,
    { stored_name: storedName },
  );
  if (!assets.length || assets[0].moduleSlug !== sourceModule) {
    const error = new Error("That source asset is not available in this module's library.");
    error.statusCode = 404;
    throw error;
  }
  let repaired = null;
  if (sourceModule === 'boss-creation') {
    repaired = await getBossArtifact(`${storedName}:animation-v3`);
    if (repaired?.asset?.storedName && repaired.asset.storedName !== storedName) {
      storedName = repaired.asset.storedName;
      assets = await queryRows(
        `SELECT module_slug AS moduleSlug, original_name AS originalName, mime_type AS mimeType, relative_path AS relativePath
         FROM assets WHERE stored_name = $stored_name LIMIT 1`, { stored_name: storedName },
      );
      if (!assets.length || assets[0].moduleSlug !== sourceModule) throw Object.assign(new Error('Repaired boss sheet not found.'), { statusCode: 404 });
    }
  }
  const sourceRelativePath = path.relative("assets", assets[0].relativePath);
  const sourcePath = safePath(assetDirectory, `/${sourceRelativePath}`);
  const bytes = sourcePath ? await fs.readFile(sourcePath).catch(() => null) : null;
  if (!bytes) {
    const error = new Error("The source asset file could not be found on the asset volume.");
    error.statusCode = 404;
    throw error;
  }
  const image = await persistAsset('final-game', name || assets[0].originalName, bytes, assets[0].mimeType);
  if (sourceModule !== 'boss-creation' && sourceModule !== 'game-assets-creation') return image;
  const { width, height } = await sharp(bytes).metadata();
  if (sourceModule === 'boss-creation') {
    const layout = repaired?.layout || inspectBossLayout((await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true })).data, width, height);
    return publishManifest(image, bossManifest(image, width, height, repaired ? { ...layout, spriteSheetVersion: 3 } : layout));
  }
  if (sourceModule === 'game-assets-creation') {
    const inferred = assets[0].originalName.match(/-(tileset|props|pickups|ui)-sheet\./)?.[1];
    return publishManifest(image, assetPackManifest(image, width, height, assetPackCategories.has(inferred) ? inferred : assetPackCategories.has(category) ? category : 'unknown'));
  }
  return image;
}

function safePath(root, pathname) {
  const resolvedRoot = path.resolve(root);
  const resolvedPath = path.resolve(root, `.${pathname}`);
  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)) return null;
  return resolvedPath;
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  }[extension] || "application/octet-stream";
}

async function serveStatic(request, response, pathname) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  const segments = pathname.split('/').filter(Boolean);
  const phaserBundle = pathname === '/node_modules/phaser/dist/phaser.min.js';
  if (segments.some(segment => segment.startsWith('.')) || (segments.includes('node_modules') && !phaserBundle) ||
      ['godot-cloud', 'ollama-api-proxy', 'tmp', 'output', 'storage'].includes(segments[0]) ||
      (segments[0] === 'tutorial-web-app' && segments[1] === 'storage') ||
      (segments[0] === 'final-game' && segments[1] === 'dist')) return false;

  // Serve published artwork from Spaces through this origin so Phaser and
  // canvas-based modules can use it without browser CORS restrictions.
  const relativePath = pathname.replace(/^\/+/, "");
  const spacesUrl = spacesAssetUrls.get(relativePath)
    || spacesAssetUrls.get(`tutorial-web-app/${relativePath}`);
  if (spacesUrl) {
    try {
      const upstream = await fetch(spacesUrl, {
        method: request.method,
        signal: AbortSignal.timeout(20000),
      });
      if (upstream.ok) {
        const bytes = request.method === "HEAD" ? null : Buffer.from(await upstream.arrayBuffer());
        const length = bytes?.length ?? Number(upstream.headers.get("content-length"));
        const headers = {
          "content-type": upstream.headers.get("content-type") || contentType(pathname),
          "cache-control": "no-cache",
          "x-asset-source": "digitalocean-spaces",
        };
        if (Number.isFinite(length)) headers["content-length"] = length;
        response.writeHead(200, headers);
        response.end(bytes);
        return true;
      }
      console.warn(`Spaces image ${relativePath} returned ${upstream.status}; using local copy.`);
    } catch (error) {
      console.warn(`Spaces image ${relativePath} failed: ${error.message}; using local copy.`);
    }
  }

  let filePath;
  if (pathname === "/") {
    filePath = path.join(publicDirectory, "index.html");
  } else {
    filePath = safePath(publicDirectory, pathname);
    try {
      const publicStats = await fs.stat(filePath);
      if (publicStats.isDirectory()) filePath = path.join(filePath, "index.html");
    } catch {
      filePath = safePath(projectDirectory, pathname);
      try {
        const projectStats = await fs.stat(filePath);
        if (projectStats.isDirectory()) filePath = path.join(filePath, "index.html");
      } catch {
        return false;
      }
    }
  }

  try {
    let file = await fs.readFile(filePath);
    const isModulePage = modules.some(({ slug }) => path.resolve(projectDirectory, slug, "index.html") === path.resolve(filePath));
    const isAppPage = path.extname(filePath).toLowerCase() === ".html"
      && (path.resolve(filePath) === path.join(publicDirectory, "index.html") || isModulePage);
    if (isAppPage) {
      const html = file.toString("utf8");
      const themeAssets = '    <link rel="stylesheet" href="/theme.css" />\n    <script src="/theme.js" defer></script>\n';
      if (!html.includes("/theme.js")) {
        file = Buffer.from(html.replace(/<\/head>/i, `${themeAssets}</head>`));
      }
    }
    response.writeHead(200, {
      "content-type": contentType(filePath),
      "content-length": file.length,
      "cache-control": "no-cache",
    });
    if (request.method === "HEAD") response.end();
    else response.end(file);
    return true;
  } catch {
    return false;
  }
}

function spriteGenerationPrompt(body) {
  const character = body.character && typeof body.character === "object" ? body.character : {};
  return `Draw a production-ready 2D game sprite sheet for this student-created character.

Character design:
${JSON.stringify(character, null, 2).slice(0, 20000)}

Create exactly one character in a precise 4-column by 7-row grid, for 28 square animation cells total. Use this row order from top to bottom:
1. idle: one exact neutral standing pose repeated identically in all four cells; feet, weapon, and center-bottom anchor must not move
2. walk: four unmistakable alternating footstep poses: left-foot contact, a passing pose with the right leg crossing the centerline, right-foot contact, and a passing pose with the left leg crossing the centerline; legs and feet must visibly move while the head and torso stay anchored
3. run: four unmistakable alternating stride poses with bent knees, clear leg separation, a forward lean, and passing poses where the knees cross the centerline; do not duplicate standing poses
4. attack: anticipation, swing, impact, and recovery
5. jump: crouch, lift-off, airborne, and landing
6. hurt: impact and recoil
7. death: stagger, fall, kneel, and final defeated pose

Keep the same character identity, face, costume, colors, weapon, facing direction, camera angle, scale, and center-bottom anchor in every cell. Keep every limb, weapon, hair, cloth, and effect inside its cell. Use genuinely transparent alpha pixels with no backdrop or floor shadow. Do not include labels, numbers, grid lines, borders, text, watermark, checkerboard, white background, black background, blue background, gray background, green background, gradient, glow haze, extra characters, cropped content, or camera movement. Do not add attack or magic effects to idle, walk, or run. The result will be used directly by a browser sprite animator, so the 4 by 7 cell layout must be exact.`;
}

async function generateSpriteAsset(body) {
  if (!openAiApiKey) {
    const error = new Error("Sprite image generation is not configured. Set OPENAI_API_KEY for the tutorial server.");
    error.statusCode = 503;
    error.code = "image_generation_not_configured";
    throw error;
  }

  const upstream = await fetch(`${openAiApiBase}/images/generations`, {
    method: "POST",
    signal: AbortSignal.timeout(600000),
    headers: {
      authorization: `Bearer ${openAiApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: openAiImageModel,
      prompt: spriteGenerationPrompt(body),
      background: "transparent",
      output_format: "png",
      quality: "medium",
      size: "1024x1792",
    }),
  });
  const payload = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    const error = new Error(payload.error?.message || "The image-generation service rejected the request.");
    error.statusCode = 502;
    throw error;
  }

  const encodedImage = payload.data?.[0]?.b64_json;
  if (!encodedImage) {
    const error = new Error("The image-generation service returned no PNG data.");
    error.statusCode = 502;
    throw error;
  }

  const characterName = body.character?.name || "character";
  const baseImage = Buffer.from(encodedImage, "base64");
  const guide = await createGaitGuide(sharp);
  let gaitImage;
  let validationError;
  // All briefs enter this pass, including templates. Never silently publish the
  // base sheet's four often-repeated walk/run poses as successful animation.
  for (let attempt = 0; attempt < 2; attempt++) {
    const form = new FormData();
    form.set("model", openAiImageModel);
    form.set("prompt", gaitPrompt + (validationError ? `\nPrevious attempt failed validation: ${validationError.message}` : ""));
    form.set("background", "transparent");
    form.set("output_format", "png");
    form.set("quality", "high");
    form.set("size", "1024x1024");
    form.append("image[]", new Blob([baseImage], { type: "image/png" }), "character-reference.png");
    form.append("image[]", new Blob([guide], { type: "image/png" }), "gait-pose-guide.png");
    const edited = await fetch(`${openAiApiBase}/images/edits`, {
      method: "POST", headers: { authorization: `Bearer ${openAiApiKey}` }, body: form,
      signal: AbortSignal.timeout(600000),
    });
    const result = await edited.json().catch(() => ({}));
    if (!edited.ok || !result.data?.[0]?.b64_json) {
      throw Object.assign(new Error(result.error?.message || "The locomotion pass returned no PNG data."), { statusCode: 502 });
    }
    try {
      gaitImage = await normalizeGrid(sharp, Buffer.from(result.data[0].b64_json, "base64"), 4, 4);
      await validateGait(sharp, gaitImage);
      validationError = null;
      break;
    } catch (error) { validationError = error; }
  }
  if (validationError) throw Object.assign(validationError, { statusCode: 502 });
  const packed = await packSpriteSheet(sharp, baseImage, gaitImage);
  const asset = await persistAsset(
    "character-creation",
    `${safeAssetStem(characterName)}-sprite-sheet.png`,
    packed,
    "image/png",
  );

  return {
    ...asset,
    model: openAiImageModel,
    spriteSheet: {
      frameWidth: 256,
      frameHeight: 256,
      columns: 8,
      rows: animationRows,
      animationVersion: 2,
      direction: "Consistent transparent 2D game animation with a center-bottom anchor.",
      assetUrl: asset.assetUrl,
    },
  };
}

const assetPackCategories = new Set(["tileset", "props", "pickups", "ui"]);

function assetPackGenerationPrompt(body) {
  const category = assetPackCategories.has(body.category) ? body.category : "props";
  const brief = body.brief && typeof body.brief === "object" ? body.brief : {};
  const categoryDirections = {
    tileset: "Create a 4 by 4 grid of seamless SIDE-VIEW platformer terrain and platform tiles: solid ground, platform tops, undersides, left/right edges, corners, slopes, and two subtle decorative variants. Every tile must join cleanly to its immediate neighbours for left-to-right traversal.",
    props: "Create a 4 by 4 grid of readable SIDE-VIEW platformer environmental props. Include large and small silhouettes, but keep each object fully inside its own cell.",
    pickups: "Create a 4 by 4 grid of SIDE-VIEW platformer collectible pickups and reward icons. Each item must have a distinct silhouette that reads at small size.",
    ui: "Create a 4 by 4 grid of simple HUD UI icons for a 2D platformer: health, currency, inventory, quest, settings, map, confirm, cancel, and status effects. Keep symbols clear at small size.",
  };
  return `Draw one production-ready 2D game asset sheet for a student project.

Asset-pack direction:
${JSON.stringify(brief, null, 2).slice(0, 12000)}

Requested category: ${category}.
${categoryDirections[category]}

This is for a SIDE-VIEW, left-to-right 2D platformer. Use a strict orthographic side elevation: platforms read from the side, with clear top, underside, and edge faces. Never use a top-down, isometric, three-quarter, RPG battle, dungeon-map, card, or diorama perspective.

Use a precise 4-column by 4-row grid with 16 equally sized square cells. Keep a single consistent pixel-art style, palette, line weight, side-on camera angle, and scale. Put exactly one asset in each cell, with a clear transparent gutter around it. Use genuine transparent alpha outside the assets. Do not include labels, text, numbers, borders, grid lines, watermarks, a checkerboard, a background scene, floor shadows, cropped content, or extra objects outside the 16 cells. This sheet will be cut into game assets after generation, so every cell must be clean and usable.`;
}

async function generateAssetPackAsset(body) {
  if (!openAiApiKey) {
    const error = new Error("Asset image generation is not configured. Set OPENAI_API_KEY for the tutorial server.");
    error.statusCode = 503;
    error.code = "image_generation_not_configured";
    throw error;
  }
  const category = assetPackCategories.has(body.category) ? body.category : "props";
  const upstream = await fetch(`${openAiApiBase}/images/generations`, {
    method: "POST",
    signal: AbortSignal.timeout(600000),
    headers: { authorization: `Bearer ${openAiApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: openAiImageModel,
      prompt: assetPackGenerationPrompt({ ...body, category }),
      background: "transparent",
      output_format: "png",
      quality: "medium",
      size: "1024x1024",
    }),
  });
  const payload = await upstream.json().catch(() => ({}));
  if (!upstream.ok) throw Object.assign(new Error(payload.error?.message || "The image-generation service rejected the request."), { statusCode: 502 });
  const encodedImage = payload.data?.[0]?.b64_json;
  if (!encodedImage) throw Object.assign(new Error("The image-generation service returned no PNG data."), { statusCode: 502 });
  const packName = safeAssetStem(body.brief?.packName || body.brief?.theme || "asset-pack");
  const moduleSlug = body.moduleSlug === "game-settings" && category === "ui" ? "game-settings" : "game-assets-creation";
  const asset = await persistAsset(moduleSlug, `${packName}-${category}-sheet.png`, Buffer.from(encodedImage, "base64"), "image/png");
  return { ...asset, category, model: openAiImageModel, revisedPrompt: payload.data?.[0]?.revised_prompt || "" };
}

async function generateLandingHeroAsset() {
  if (!openAiApiKey) {
    throw Object.assign(new Error("Landing artwork generation is not configured. Set OPENAI_API_KEY for the tutorial server."), { statusCode: 503 });
  }
  const prompt = `Use case: stylized-concept.
Asset type: wide landing-page hero illustration for Godot Forge, a 2D platform-game tutorial.
Primary request: create one polished, cohesive pixel-art scene that looks like a playable moment from the same forest adventure as the tutorial's generated character, boss, and pickups.
Scene/backdrop: a lush side-scrolling forest platform level with layered teal-green trees, distant misty waterfalls, mossy stone ruins, and a few clear floating grassy platforms. Keep the scene readable and uncluttered.
Subject: one small but clearly readable brown-haired explorer with a purple scarf, green tunic, leather boots, and a steel sword, standing confidently on a platform; include one moss-armored boar-like grove brute farther away as a secondary threat and a small glowing teal crystal pickup.
Style/medium: refined hand-crafted 2D pixel art, crisp intentional pixel clusters, rich detail at game resolution; match the visual language of the tutorial's forest explorer, mossy brute, and collectible assets. Strict side-view platformer camera, not isometric or top-down.
Composition/framing: wide landscape key art, fills the frame edge to edge, strong readable silhouettes, explorer near center-right, clear layered depth, designed to crop responsively inside a rectangular web hero panel.
Lighting/mood: adventurous, inviting, polished indie-game atmosphere with soft forest light and restrained crystal glow.
Color palette: deep forest greens and teal shadows, moss/lime highlights, restrained purple scarf accent, warm earthy browns, small crystal teal glow.
Constraints: no UI, no text, no labels, no letters, no numbers, no border, no grid, no watermark, no sprite-sheet cells, no collage, no extra heroes, no realistic 3D rendering, no painterly blur.`;
  const upstream = await fetch(`${openAiApiBase}/images/generations`, {
    method: "POST",
    signal: AbortSignal.timeout(600000),
    headers: { authorization: `Bearer ${openAiApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ model: openAiImageModel, prompt, output_format: "png", quality: "high", size: "1536x1024" }),
  });
  const payload = await upstream.json().catch(() => ({}));
  if (!upstream.ok) throw Object.assign(new Error(payload.error?.message || "The image-generation service rejected the request."), { statusCode: 502 });
  const encodedImage = payload.data?.[0]?.b64_json;
  if (!encodedImage) throw Object.assign(new Error("The image-generation service returned no image data."), { statusCode: 502 });
  const asset = await persistAsset("landing-page", "godot-forge-forest-hero.png", Buffer.from(encodedImage, "base64"), "image/png");
  return { ...asset, model: openAiImageModel, revisedPrompt: payload.data?.[0]?.revised_prompt || "" };
}

function enemyGenerationPrompt(enemy) {
  return `Create one production-ready transparent-background 2D pixel-art enemy sprite sheet for a side-view forest platformer.

Enemy design:
Name: ${String(enemy.name || "Forest enemy").slice(0, 80)}
Visual direction: ${String(enemy.visualDescription || "Distinct forest creature with a readable silhouette.").slice(0, 1400)}

Use exact orthographic side-view, facing right. Create a strict 4-column by 4-row grid of sixteen equal 256 by 256 pixel cells, with one complete enemy centered in every occupied cell and a consistent baseline, silhouette, scale, proportions, lighting, and facing direction. The four rows must be: (1) four subtle idle/breathing poses; (2) four clearly different patrol/walk cycle poses with alternating legs; (3) four energetic chase/run cycle poses with strong forward lean and visibly pumping legs; (4) four readable close-range attack poses: anticipation, strike, follow-through, recovery. Keep the entire creature, limbs, leaves, horns, and effects inside each cell with generous transparent margins. Fill all 16 cells; do not leave any animation row blank.

Polished hand-crafted pixel art matching a cohesive forest-adventure game: crisp intentional pixel clusters, rich but controlled shading, strong small-size silhouette. Genuine transparent alpha outside the character. No scenery, floor, shadow, text, labels, letters, numbers, borders, grid lines, watermark, checkerboard, extra characters, cropped content, RPG battle perspective, isometric view, or top-down view.`;
}

async function generateEnemyAsset(body) {
  if (!openAiApiKey) throw Object.assign(new Error("Enemy image generation is not configured. Set OPENAI_API_KEY for the tutorial server."), { statusCode: 503 });
  const enemy = body.enemy && typeof body.enemy === "object" ? body.enemy : {};
  const upstream = await fetch(`${openAiApiBase}/images/generations`, {
    method: "POST",
    signal: AbortSignal.timeout(600000),
    headers: { authorization: `Bearer ${openAiApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ model: openAiImageModel, prompt: enemyGenerationPrompt(enemy), background: "transparent", output_format: "png", quality: "high", size: "1024x1024" }),
  });
  const payload = await upstream.json().catch(() => ({}));
  if (!upstream.ok) throw Object.assign(new Error(payload.error?.message || "The image-generation service rejected the request."), { statusCode: 502 });
  const encodedImage = payload.data?.[0]?.b64_json;
  if (!encodedImage) throw Object.assign(new Error("The image-generation service returned no enemy image data."), { statusCode: 502 });
  const asset = await persistAsset("enemies-ai", `${safeAssetStem(enemy.name)}-enemy-sprite-sheet.png`, Buffer.from(encodedImage, "base64"), "image/png");
  return { ...asset, name: String(enemy.name || "Forest enemy"), model: openAiImageModel, spriteSheet: { frameWidth: 256, frameHeight: 256, columns: 4, rows: 4, states: { idle: [0, 3], patrol: [4, 7], chase: [8, 11], attack: [12, 15] } } };
}

function bossGenerationPrompt(body) {
  const boss = body.boss && typeof body.boss === "object" ? body.boss : {};
  return `Draw one production-ready 2D SIDE-VIEW PLATFORMER boss sprite sheet on a fully transparent background.

Boss direction:
${JSON.stringify(boss, null, 2).slice(0, 12000)}

This boss must look undeniably badass: imposing, powerful, mythic, and confidently dangerous without being graphic or gory. Give it an iconic silhouette that reads instantly at game distance; a dramatic stance; an oversized weapon, armour shape, horns, cloak, wings, or energy source that supports its identity; sharp readable contrast; and a believable sense of weight and authority. The character must feel like the climax of an adventure, never cute, harmless, bland, comedic, or a generic monster.

Create one exact 4-column by 7-row grid of 28 equally sized 256 by 256 pixel cells. Every cell must show this same boss in a strict side-view, facing right, with a center-bottom anchor and consistent scale, costume, weapon, and silhouette. Row 1: four idle/breathing poses. Row 2: four walk/advance poses. Row 3: four run/charge poses. Row 4: four attack poses with anticipation, strike, impact, and recovery. Row 5: four hurt/stagger/recoil poses. Row 6: four death/defeat poses that end in a fully defeated pose without gore. Row 7: four unmistakable ENRAGE poses: controlled power gathering, body tensing, armour or energy breaking open, then a full enraged battle stance. Use the student’s final-phase direction for this row and make the escalation readable without obscuring the boss silhouette. Each complete boss, weapon, cape, and effect must stay within the inner 80% of its own cell, with at least a 24-pixel fully transparent gutter around all cell edges. Never let an element cross into a neighbouring cell. The sheet must be ready for a browser sprite animator: one boss only per cell and no camera movement.

Never use top-down, isometric, RPG battle, or three-quarter perspective. Do not include any background, floor, shadow, labels, text, numbers, grid lines, watermark, UI, border, checkerboard, cropped content, blood, gore, or dismemberment.`;
}

async function generateBossAsset(body) {
  if (!openAiApiKey) {
    const error = new Error("Boss image generation is not configured. Set OPENAI_API_KEY for the tutorial server.");
    error.statusCode = 503;
    error.code = "image_generation_not_configured";
    throw error;
  }
  const upstream = await fetch(`${openAiApiBase}/images/generations`, {
    method: "POST",
    signal: AbortSignal.timeout(600000),
    headers: { authorization: `Bearer ${openAiApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ model: openAiImageModel, prompt: bossGenerationPrompt(body), background: "transparent", output_format: "png", quality: "high", size: "1024x1792" }),
  });
  const payload = await upstream.json().catch(() => ({}));
  if (!upstream.ok) throw Object.assign(new Error(payload.error?.message || "The image-generation service rejected the request."), { statusCode: 502 });
  const encodedImage = payload.data?.[0]?.b64_json;
  if (!encodedImage) throw Object.assign(new Error("The image-generation service returned no PNG data."), { statusCode: 502 });
  // Persist the reference first, so subsequent animation passes can resume.
  const source = await persistAsset("boss-creation", `${safeAssetStem(body.boss?.name || "boss")}-boss-sprite-sheet.png`, Buffer.from(encodedImage, "base64"), "image/png");
  return { ...source, model: openAiImageModel, needsAnimationRepair: true };
}

const bossRepairsInFlight = new Map();
async function getBossArtifact(key) {
  const rows = await queryRows('SELECT artifact_json AS artifact FROM boss_animation_artifacts WHERE cache_key = $key', { key });
  return rows.length ? JSON.parse(rows[0].artifact) : null;
}
async function saveBossArtifact(key, artifact) {
  await database.run('INSERT INTO boss_animation_artifacts VALUES ($key, $artifact) ON CONFLICT (cache_key) DO UPDATE SET artifact_json = EXCLUDED.artifact_json', { key, artifact: JSON.stringify(artifact) });
}
async function repairSavedBoss(body) {
  const storedName = storedNameFromAssetUrl(body.assetUrl);
  const sources = await queryRows("SELECT relative_path AS relativePath, original_name AS originalName FROM assets WHERE stored_name = $name AND module_slug = 'boss-creation'", { name: storedName });
  if (!sources.length) throw Object.assign(new Error('Saved boss not found.'), { statusCode: 404 });
  const key = `${storedName}:animation-v3`;
  const complete = await getBossArtifact(key);
  if (complete) return complete.asset;
  if (bossRepairsInFlight.has(key)) return bossRepairsInFlight.get(key);
  if (!openAiApiKey) throw Object.assign(new Error('Boss image generation is not configured.'), { statusCode: 503 });
  const work = (async () => {
    const sourcePath = safePath(storageDirectory, `/${sources[0].relativePath}`);
    if (!sourcePath) throw Object.assign(new Error('Invalid source asset.'), { statusCode: 400 });
    const source = await fs.readFile(sourcePath);
    const { bytes, layout } = await repairBossSheet(sharp, source, body.boss || {}, {
      load: async pass => {
        const cached = await getBossArtifact(`${key}:${pass}`);
        if (!cached) return null;
        const file = safePath(storageDirectory, `/${cached.relativePath}`);
        return file ? fs.readFile(file).catch(() => null) : null;
      },
      save: async (pass, bytes) => {
        const asset = await persistAsset('boss-creation', `${safeAssetStem(sources[0].originalName)}-${pass}-pass.png`, bytes, 'image/png');
        await saveBossArtifact(`${key}:${pass}`, asset);
      },
      saveRaw: async (pass, bytes) => {
        const asset = await persistAsset('boss-creation', `${safeAssetStem(sources[0].originalName)}-${pass}-raw.png`, bytes, 'image/png');
        await saveBossArtifact(`${key}:${pass}:raw`, asset);
      },
      edit: async ({ reference, guide, prompt, size }) => {
        const form = new FormData();
        form.set('model', openAiImageModel); form.set('prompt', prompt);
        form.set('background', 'transparent'); form.set('output_format', 'png');
        form.set('quality', 'high'); form.set('size', size);
        form.append('image[]', new Blob([reference], { type: 'image/png' }), 'boss-reference.png');
        form.append('image[]', new Blob([guide], { type: 'image/png' }), 'pose-guide.png');
        const upstream = await fetch(`${openAiApiBase}/images/edits`, { method: 'POST', headers: { authorization: `Bearer ${openAiApiKey}` }, body: form, signal: AbortSignal.timeout(600000) });
        const payload = await upstream.json().catch(() => ({}));
        if (!upstream.ok || !payload.data?.[0]?.b64_json) throw Object.assign(new Error(payload.error?.message || 'Animation generation returned no image.'), { statusCode: 502 });
        return Buffer.from(payload.data[0].b64_json, 'base64');
      },
    });
    const stored = await persistAsset('boss-creation', `${safeAssetStem(body.boss?.name || sources[0].originalName.replace(/-boss-sprite-sheet\.png$/, ''))}-boss-sprite-sheet-v3.png`, bytes, 'image/png');
    const asset = { ...stored, spriteSheetVersion: 3, columns: 8, frameWidth: 256, frameHeight: 256, rows: bossAnimationRows, model: openAiImageModel };
    await saveBossArtifact(`${asset.storedName}:animation-v3`, { asset, layout });
    await saveBossArtifact(key, { asset, layout });
    return asset;
  })();
  bossRepairsInFlight.set(key, work);
  try { return await work; } finally { bossRepairsInFlight.delete(key); }
}

function storyVoiceRequest({ locale, speaker, text }) {
  const language = { en: 'English', zh: 'Mandarin Chinese', ms: 'Malay' }[locale];
  const voice = speaker === 'guardian' ? 'cedar' : 'marin';
  const instructions = speaker === 'guardian'
    ? `Speak naturally in ${language} as an ancient, calm forest guardian. Deep, resonant, warm and solemn, with measured dramatic pauses. Sound like a character in a fantasy adventure, not a narrator.`
    : `Speak naturally in ${language} as a brave young forest explorer. Warm, expressive, curious and determined, with conversational pacing. Sound like a character talking to someone nearby, not a narrator.`;
  const key = createHash('sha256').update(JSON.stringify([openAiTtsModel, voice, instructions, text])).digest('hex');
  return { key, voice, instructions };
}

async function storyVoiceAudio({ locale, speaker, text }) {
  const { key, voice, instructions } = storyVoiceRequest({ locale, speaker, text });
  const cachePath = path.join(storyVoiceDirectory, `${key}.mp3`);
  try { return await fs.readFile(cachePath); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (storyVoiceRequests.has(key)) return storyVoiceRequests.get(key);
  const work = (async () => {
    const upstream = await fetch(`${openAiApiBase}/audio/speech`, {
      method: 'POST',
      headers: { authorization: `Bearer ${openAiApiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ model: openAiTtsModel, voice, input: text, instructions, response_format: 'mp3' }),
      signal: AbortSignal.timeout(120000),
    });
    if (!upstream.ok) throw Object.assign(new Error('OpenAI voice generation failed.'), { statusCode: 502 });
    const bytes = Buffer.from(await upstream.arrayBuffer());
    if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw Object.assign(new Error('OpenAI voice returned invalid audio.'), { statusCode: 502 });
    await fs.mkdir(storyVoiceDirectory, { recursive: true });
    await fs.writeFile(cachePath, bytes);
    return bytes;
  })();
  storyVoiceRequests.set(key, work);
  try { return await work; } finally { storyVoiceRequests.delete(key); }
}

function studentProvisionStatus(job) {
  const { state, stage, startedAt, finishedAt } = job;
  return { state, stage, startedAt, finishedAt };
}

async function handleApi(request, response, url) {
  if (url.pathname === '/api/godot/config' && request.method === 'GET') {
    const learnerId = url.searchParams.get('learnerId');
    const connection = learnerId ? await lightsailProvisioning.connection(learnerId) : null;
    const provisioning = learnerId ? await lightsailProvisioning.status(learnerId) : null;
    return sendJson(response, 200, { provisioningEnabled: lightsailProvisioning.enabled, configured: Boolean(connection), provisioning: provisioning ? studentProvisionStatus(provisioning) : null });
  }
  if (['/api/godot/session', '/api/godot/stop'].includes(url.pathname) && request.method === 'POST') {
    const body = await readJson(request);
    if (typeof body.learnerId !== 'string' || !/^[a-zA-Z0-9_-]{8,100}$/.test(body.learnerId)) {
      return sendJson(response, 400, { error: 'A valid learner ID is required.' });
    }
    const connection = await lightsailProvisioning.connection(body.learnerId);
    if (!connection) {
      if (url.pathname === '/api/godot/stop') return sendJson(response, 200, { stopped: true });
      const job = await lightsailProvisioning.start(body.learnerId);
      return sendJson(response, 202, { provisioning: studentProvisionStatus(job) });
    }
    let upstream;
    try {
      upstream = await fetch(`${connection.serviceUrl}${url.pathname === '/api/godot/stop' ? '/internal/stop' : '/internal/session'}`, {
        method: 'POST',
        headers: { authorization: `Bearer ${connection.secret}`, 'content-type': 'application/json' },
        body: JSON.stringify({ learnerId: body.learnerId }),
        signal: AbortSignal.timeout(180_000),
      });
    } catch {
      return sendJson(response, 502, { error: 'The cloud Godot server is unavailable.' });
    }
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return sendJson(response, upstream.status, { error: result.error || 'Cloud editor request failed.' });
    if (url.pathname === '/api/godot/stop') return sendJson(response, 200, { stopped: true });
    if (!/^\/s\/[a-f0-9]{64}\/$/.test(result.path || '') || !/^\/download\/[a-f0-9]{64}$/.test(result.downloadPath || '')) {
      return sendJson(response, 502, { error: 'Cloud editor returned an invalid session.' });
    }
    return sendJson(response, 200, {
      url: `${connection.publicUrl}${result.path}`,
      downloadUrl: `${connection.publicUrl}${result.downloadPath}`,
    });
  }
  if (url.pathname === '/api/godot/workspace' && request.method === 'DELETE') {
    const body = await readJson(request);
    if (body.confirmed !== true) return sendJson(response, 400, { error: 'Confirm removal of your workspace first.' });
    const job = await lightsailProvisioning.remove(body.learnerId);
    return sendJson(response, 202, { provisioning: studentProvisionStatus(job) });
  }
  if (url.pathname === "/api/final-game/starter-kit" && (request.method === "GET" || request.method === "HEAD")) {
    if (starterKitUrl) {
      response.writeHead(302, { location: starterKitUrl, "cache-control": "no-store" });
      response.end();
      return;
    }
    const stats = await fs.stat(starterKitPath).catch(() => null);
    if (!stats?.isFile()) {
      response.writeHead(302, { location: publishedStarterKitUrl, "cache-control": "no-store" });
      response.end();
      return;
    }
    response.writeHead(200, {
      "content-type": "application/zip",
      "content-disposition": 'attachment; filename="godot-forge-starter-v1.zip"',
      "content-length": stats.size,
      "cache-control": "no-cache",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(starterKitPath).pipe(response);
    return;
  }
  if (request.method === 'GET' && url.pathname === '/api/storyline/voice/config') {
    return sendJson(response, 200, { configured: Boolean(openAiApiKey), model: openAiTtsModel });
  }
  if (request.method === 'GET' && ['/api/storyline/voice', '/api/storyline/voice/url'].includes(url.pathname)) {
    const locale = url.searchParams.get('locale'), speaker = url.searchParams.get('speaker'), text = url.searchParams.get('text');
    if (!['en', 'zh', 'ms'].includes(locale) || !['hero', 'guardian'].includes(speaker) ||
        typeof text !== 'string' || !text.trim() || text.length > 240 || /[\r\n\u0000-\u001f]/.test(text)) {
      return sendJson(response, 400, { error: 'A valid storyline voice line is required.' });
    }
    if (url.pathname === '/api/storyline/voice/url') {
      const { key } = storyVoiceRequest({ locale, speaker, text });
      const publicUrl = spacesAssetUrls.get(`tutorial-web-app/storage/story-voices/${key}.mp3`);
      if (publicUrl) return sendJson(response, 200, { url: publicUrl });
      if (!openAiApiKey) return sendJson(response, 503, { error: 'OpenAI voice is not configured. Set OPENAI_API_KEY.' });
      return sendJson(response, 200, { url: `/api/storyline/voice?${new URLSearchParams({ locale, speaker, text })}` });
    }
    if (!openAiApiKey) return sendJson(response, 503, { error: 'OpenAI voice is not configured. Set OPENAI_API_KEY.' });
    const bytes = await storyVoiceAudio({ locale, speaker, text });
    response.writeHead(200, { 'content-type': 'audio/mpeg', 'content-length': bytes.length, 'cache-control': 'private, max-age=86400' });
    response.end(bytes);
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/chat") {
    const body = await readJson(request);
    let upstream;
    try {
      upstream = await fetch(`${ollamaProxyUrl}/api/chat`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.OLLAMA_PROXY_API_KEY ? { authorization: `Bearer ${process.env.OLLAMA_PROXY_API_KEY}` } : {}),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(300000),
      });
    } catch {
      return sendJson(response, 502, { error: "Could not reach the configured Ollama proxy. Check OLLAMA_PROXY_URL in tutorial-web-app/.env and make sure the proxy is running." });
    }
    const payload = await upstream.json().catch(() => null);
    if (!payload) return sendJson(response, 502, { error: "The configured Ollama proxy returned an invalid response." });
    return sendJson(response, upstream.status, payload);
  }
  if (request.method === 'POST' && url.pathname === '/api/bosses/repair') {
    return sendJson(response, 200, await repairSavedBoss(await readJson(request)));
  }
  if (request.method === "GET" && url.pathname === "/api/bosses/layout") {
    const storedName = storedNameFromAssetUrl(url.searchParams.get("assetUrl"));
    const assets = await queryRows(
      `SELECT relative_path AS relativePath, original_name AS originalName FROM assets WHERE stored_name = $stored_name AND module_slug = 'boss-creation' LIMIT 1`,
      { stored_name: storedName },
    );
    if (!assets.length) return sendJson(response, 404, { error: "Saved boss sheet not found." });
    const repaired = await getBossArtifact(`${storedName}:animation-v3`);
    if (repaired) return sendJson(response, 200, { ...repaired.layout, asset: repaired.asset, spriteSheetVersion: 3 });
    if (!assets[0].originalName.includes("sprite-sheet")) return sendJson(response, 422, { error: "This saved boss is a single concept image. Animation requires a sprite sheet." });
    const source = safePath(assetDirectory, `/${path.relative("assets", assets[0].relativePath)}`);
    if (!source) return sendJson(response, 400, { error: "Invalid asset path." });
    const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const keys = url.searchParams.get("rows") === "4" ? ['idle', 'walk', 'attack', 'phase'] : bossRows;
    return sendJson(response, 200, inspectBossLayout(data, info.width, info.height, keys));
  }
  if (request.method === "GET" && url.pathname === "/api/health") {
    return sendJson(response, 200, {
      ok: true,
      databasePath,
      storageDirectory,
      assetDirectory,
      imageGenerationConfigured: Boolean(openAiApiKey),
      imageModel: openAiImageModel,
    });
  }

  if (request.method === "GET" && url.pathname === "/api/modules") {
    const learnerId = String(url.searchParams.get("learnerId") || "");
    if (learnerId && !validLearnerId(learnerId)) return sendJson(response, 400, { error: "A valid learner is required." });
    return sendJson(response, 200, await getModules(learnerId));
  }

  const resetMatch = url.pathname.match(/^\/api\/modules\/([^/]+)\/reset$/);
  if (resetMatch && request.method === "POST") {
    const slug = decodeURIComponent(resetMatch[1]);
    const { learnerId } = await readJson(request);
    if (!findModule(slug) || !validLearnerId(learnerId)) return sendJson(response, 400, { error: "A valid module and learner are required." });
    await database.run(
      `INSERT INTO learner_progress (learner_id, module_slug, completed)
       VALUES ($learner_id, $module_slug, FALSE)
       ON CONFLICT (learner_id, module_slug) DO UPDATE SET completed = FALSE`,
      { learner_id: learnerId, module_slug: slug },
    );
    await database.run(
      `DELETE FROM module_checkpoints WHERE learner_id = $learner_id AND module_slug = $module_slug`,
      { learner_id: learnerId, module_slug: slug },
    );
    if (slug === 'math-stem-physics-quiz') await database.run(
      `DELETE FROM quiz_answers WHERE learner_id = $learner_id AND module_slug = $module_slug`,
      { learner_id: learnerId, module_slug: slug },
    );
    return sendJson(response, 200, { slug, completed: false, checkpointCleared: true, assetsPreserved: true });
  }

  const checkpointMatch = url.pathname.match(/^\/api\/modules\/([^/]+)\/checkpoint$/);
  if (checkpointMatch && request.method === "GET") {
    const moduleSlug = decodeURIComponent(checkpointMatch[1]);
    const learnerId = String(url.searchParams.get("learnerId") || "");
    if (!findModule(moduleSlug) || !validLearnerId(learnerId)) return sendJson(response, 400, { error: "A valid module and learner are required." });
    const rows = await queryRows(
      `SELECT state_json AS stateJson, CAST(updated_at AS VARCHAR) AS updatedAt FROM module_checkpoints WHERE learner_id = $learner_id AND module_slug = $module_slug LIMIT 1`,
      { learner_id: learnerId, module_slug: moduleSlug },
    );
    return sendJson(response, 200, rows.length ? { state: JSON.parse(rows[0].stateJson), updatedAt: rows[0].updatedAt } : { state: null });
  }

  if (checkpointMatch && request.method === "PUT") {
    const moduleSlug = decodeURIComponent(checkpointMatch[1]);
    const body = await readJson(request);
    const learnerId = String(body.learnerId || "");
    if (!findModule(moduleSlug) || !validLearnerId(learnerId) || !body.state || typeof body.state !== "object") return sendJson(response, 400, { error: "A valid module, learner, and checkpoint are required." });
    const stateJson = JSON.stringify(body.state);
    if (stateJson.length > 200000) return sendJson(response, 413, { error: "Checkpoint data is too large." });
    await database.run(
      `INSERT INTO module_checkpoints (learner_id, module_slug, state_json)
       VALUES ($learner_id, $module_slug, $state_json)
       ON CONFLICT (learner_id, module_slug) DO UPDATE SET state_json = EXCLUDED.state_json`,
      { learner_id: learnerId, module_slug: moduleSlug, state_json: stateJson },
    );
    return sendJson(response, 200, { saved: true });
  }

  const quizMatch = url.pathname.match(/^\/api\/quizzes\/([^/]+)$/);
  if (quizMatch && request.method === "GET") {
    const moduleSlug = decodeURIComponent(quizMatch[1]);
    if (!findModule(moduleSlug)) return sendJson(response, 404, { error: "Quiz module not found." });
    const questions = await queryRows(
      `SELECT q.id, COALESCE(t.question, q.question) AS question,
              COALESCE(t.category, q.category) AS category,
              COALESCE(t.options_json, q.options_json) AS optionsJson, q.position
       FROM quiz_questions q
       LEFT JOIN quiz_question_translations t ON t.question_id = q.id AND t.locale = $locale
       WHERE q.module_slug = $module_slug ORDER BY q.position`,
      { module_slug: moduleSlug, locale: quizLocale(url.searchParams.get('locale')) },
    );
    return sendJson(response, 200, questions.map(question => ({ id: question.id, category: question.category, question: question.question, options: JSON.parse(question.optionsJson) })));
  }

  const quizAnswerMatch = url.pathname.match(/^\/api\/quizzes\/([^/]+)\/answer$/);
  if (quizAnswerMatch && request.method === "POST") {
    const moduleSlug = decodeURIComponent(quizAnswerMatch[1]);
    const body = await readJson(request);
    if (moduleSlug !== 'math-stem-physics-quiz' || !validLearnerId(body.learnerId)) return sendJson(response, 400, { error: 'A valid quiz and learner are required.' });
    const evaluated = await evaluateQuizAnswer(moduleSlug, body.questionId, body.option, body.locale);
    if (evaluated.status !== 200) return sendJson(response, evaluated.status, evaluated.payload);
    await database.run(
      `INSERT INTO quiz_answers (learner_id, module_slug, question_id, selected_option)
       VALUES ($learner_id, $module_slug, $question_id, $selected_option)
       ON CONFLICT (learner_id, module_slug, question_id) DO NOTHING`,
      { learner_id: body.learnerId, module_slug: moduleSlug, question_id: String(body.questionId), selected_option: Number(body.option) },
    );
    const saved = await savedQuizAnswers(moduleSlug, body.learnerId, body.locale);
    const answer = saved.find(item => item.questionId === String(body.questionId));
    return sendJson(response, 200, answer);
  }

  const quizReviewMatch = url.pathname.match(/^\/api\/quizzes\/([^/]+)\/review$/);
  if (quizReviewMatch && request.method === 'POST') {
    const moduleSlug = decodeURIComponent(quizReviewMatch[1]);
    const body = await readJson(request);
    if (moduleSlug !== 'math-stem-physics-quiz' || !validLearnerId(body.learnerId)) return sendJson(response, 400, { error: 'A valid quiz and learner are required.' });
    return sendJson(response, 200, { answers: await savedQuizAnswers(moduleSlug, body.learnerId, body.locale) });
  }

  const quizRetryMatch = url.pathname.match(/^\/api\/quizzes\/([^/]+)\/retry$/);
  if (quizRetryMatch && request.method === 'POST') {
    const moduleSlug = decodeURIComponent(quizRetryMatch[1]);
    const body = await readJson(request);
    if (moduleSlug !== 'math-stem-physics-quiz' || !validLearnerId(body.learnerId)) return sendJson(response, 400, { error: 'A valid quiz and learner are required.' });
    await database.run(`DELETE FROM quiz_answers WHERE learner_id = $learner_id AND module_slug = $module_slug`, { learner_id: body.learnerId, module_slug: moduleSlug });
    await database.run(`DELETE FROM module_checkpoints WHERE learner_id = $learner_id AND module_slug = $module_slug`, { learner_id: body.learnerId, module_slug: moduleSlug });
    await database.run(`INSERT INTO learner_progress (learner_id, module_slug, completed)
                        VALUES ($learner_id, $module_slug, FALSE)
                        ON CONFLICT (learner_id, module_slug) DO UPDATE SET completed = FALSE`,
      { learner_id: body.learnerId, module_slug: moduleSlug });
    return sendJson(response, 200, { restarted: true });
  }

  const progressMatch = url.pathname.match(/^\/api\/modules\/([^/]+)\/progress$/);
  if (progressMatch && request.method === "PATCH") {
    const slug = decodeURIComponent(progressMatch[1]);
    if (!findModule(slug)) return sendJson(response, 404, { error: "Module not found." });
    const body = await readJson(request);
    const completed = Boolean(body.completed);
    if (body.learnerId !== undefined && !validLearnerId(body.learnerId)) return sendJson(response, 400, { error: "A valid learner is required." });
    if (slug === 'math-stem-physics-quiz') {
      if (!validLearnerId(body.learnerId)) return sendJson(response, 400, { error: 'A valid learner is required to update quiz progress.' });
      if (completed) {
        const rows = await queryRows(
          `SELECT COUNT(*) AS total, COUNT(a.question_id) AS answered,
                  COALESCE(SUM(CASE WHEN a.selected_option = q.correct_option THEN 1 ELSE 0 END), 0) AS score
           FROM quiz_questions q
           LEFT JOIN quiz_answers a ON a.question_id = q.id AND a.module_slug = q.module_slug AND a.learner_id = $learner_id
           WHERE q.module_slug = $module_slug`,
          { learner_id: body.learnerId, module_slug: slug },
        );
        const total = Number(rows[0].total), answered = Number(rows[0].answered), score = Number(rows[0].score);
        const passMark = Math.ceil(total * 0.75);
        if (!total || answered !== total || score < passMark) return sendJson(response, 403, { error: `Answer all ${total} questions and score at least ${passMark} to complete this module.`, answered, score, passMark });
      }
    }
    if (body.learnerId) {
      await database.run(
        `INSERT INTO learner_progress (learner_id, module_slug, completed)
         VALUES ($learner_id, $module_slug, $completed)
         ON CONFLICT (learner_id, module_slug) DO UPDATE SET completed = EXCLUDED.completed`,
        { learner_id: body.learnerId, module_slug: slug, completed },
      );
    } else {
      await database.run(
        `INSERT INTO tutorial_progress (module_slug, completed)
         VALUES ($module_slug, $completed)
         ON CONFLICT (module_slug) DO UPDATE SET completed = EXCLUDED.completed`,
        { module_slug: slug, completed },
      );
    }
    return sendJson(response, 200, { slug, completed });
  }

  if (request.method === "POST" && url.pathname === "/api/assets") {
    const moduleSlug = String(url.searchParams.get("module") || "");
    if (!findModule(moduleSlug)) return sendJson(response, 400, { error: "A valid module query parameter is required." });

    const bytes = await readAsset(request);
    if (!bytes.length) return sendJson(response, 400, { error: "The uploaded asset is empty." });

    const originalName = safeOriginalName(request.headers["x-file-name"]);
    return sendJson(
      response,
      201,
      await persistAsset(moduleSlug, originalName, bytes, request.headers["content-type"]),
    );
  }

  if (request.method === "POST" && url.pathname === "/api/assets/publish") {
    const body = await readJson(request);
    return sendJson(response, 201, await publishAssetToFinalGame({
      assetUrl: String(body.assetUrl || ""),
      sourceModule: String(body.sourceModule || ""),
      name: safeOriginalName(body.name || "final-game-asset.png"),
      category: String(body.category || ''),
    }));
  }

  const assetMatch = url.pathname.match(/^\/api\/assets\/([^/]+)$/);
  if (assetMatch && request.method === "GET") {
    const storedName = decodeURIComponent(assetMatch[1]);
    if (path.basename(storedName) !== storedName) return sendJson(response, 400, { error: "Invalid asset path." });
    const rows = await queryRows(
      `SELECT mime_type AS mimeType, relative_path AS relativePath FROM assets WHERE stored_name = $stored_name LIMIT 1`,
      { stored_name: storedName },
    );
    if (!rows.length) return sendJson(response, 404, { error: "Asset not found." });
    const storageRelativePath = path.relative("assets", rows[0].relativePath);
    const filePath = safePath(assetDirectory, `/${storageRelativePath}`);
    if (!filePath) return sendJson(response, 400, { error: "Invalid asset path." });
    const bytes = await fs.readFile(filePath).catch(() => null);
    if (!bytes) return sendJson(response, 404, { error: "Asset file not found." });
    if (rows[0].mimeType === "application/json") {
      try {
        const parsed = JSON.parse(bytes.toString("utf8"));
        let changed = false;
        const body = JSON.stringify(parsed, (_key, value) => {
          const next = publishedAssetUrl(value);
          if (next !== value) changed = true;
          return next;
        });
        if (changed) {
          response.writeHead(200, {
            "content-type": "application/json; charset=utf-8",
            "content-length": Buffer.byteLength(body),
            "cache-control": "no-store",
          });
          response.end(body);
          return;
        }
      } catch {
        // Preserve stored bytes if this asset is not valid JSON.
      }
    }
    response.writeHead(200, {
      "content-type": rows[0].mimeType || "application/octet-stream",
      "content-length": bytes.length,
      "cache-control": "public, max-age=31536000, immutable",
    });
    response.end(bytes);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/sprites/generate") {
    return sendJson(response, 201, await generateSpriteAsset(await readJson(request)));
  }

  if (request.method === "POST" && url.pathname === "/api/assets/generate") {
    const body = await readJson(request);
    if (!assetPackCategories.has(body.category)) return sendJson(response, 400, { error: "Choose tileset, props, pickups, or UI before generating." });
    if (body.moduleSlug !== undefined && !["game-assets-creation", "game-settings"].includes(body.moduleSlug)) return sendJson(response, 400, { error: "Choose game-assets-creation or game-settings as the asset destination." });
    if (!body.brief || typeof body.brief !== "object") return sendJson(response, 400, { error: "Build an asset-pack direction before generating." });
    if (body.moduleSlug === "game-settings" && body.category !== "ui") return sendJson(response, 400, { error: "Game HUD assets must use the UI category." });
    return sendJson(response, 201, await generateAssetPackAsset(body));
  }

  if (request.method === "POST" && url.pathname === "/api/landing-art/generate") {
    return sendJson(response, 201, await generateLandingHeroAsset());
  }

  if (request.method === "POST" && url.pathname === "/api/enemies/generate") {
    const body = await readJson(request);
    if (!String(body.enemy?.name || "").trim() || !String(body.enemy?.visualDescription || "").trim()) {
      return sendJson(response, 400, { error: "Provide an enemy name and visual description before generating." });
    }
    return sendJson(response, 201, await generateEnemyAsset(body));
  }

  if (request.method === "POST" && url.pathname === "/api/bosses/generate") {
    const body = await readJson(request);
    if (!body.boss || typeof body.boss !== "object" || !String(body.boss.name || "").trim()) return sendJson(response, 400, { error: "Build a complete boss direction before generating." });
    return sendJson(response, 201, await generateBossAsset(body));
  }

  if (request.method === "GET" && url.pathname === "/api/assets") {
    const moduleSlug = String(url.searchParams.get("module") || "");
    if (!findModule(moduleSlug)) return sendJson(response, 400, { error: "A valid module query parameter is required." });
    const assets = await queryRows(
      `SELECT id, module_slug AS moduleSlug, original_name AS originalName, stored_name AS storedName,
        relative_path AS relativePath, mime_type AS mimeType, byte_size AS byteSize,
        CAST(created_at AS VARCHAR) AS createdAt
       FROM assets WHERE module_slug = $module_slug ORDER BY created_at DESC`,
      { module_slug: moduleSlug },
    );
    return sendJson(response, 200, assets.map(asset => ({
      ...asset,
      byteSize: Number(asset.byteSize),
      assetUrl: `/api/assets/${encodeURIComponent(asset.storedName)}`,
    })));
  }

  if (request.method === "GET" && url.pathname === "/api/characters") {
    const moduleSlug = url.searchParams.get("module");
    const rows = await queryRows(
      `
        SELECT id, module_slug AS moduleSlug, name, archetype, personality, ability, weakness,
          role, focus_attribute AS focusAttribute, weapon, combat_style AS combatStyle,
          visual_hook AS visualHook,
          profile_json AS profileJson, conversation_json AS conversationJson,
          creative_prompt AS creativePrompt, locale,
          ai_design_json AS aiDesignJson, sprite_sheet_json AS spriteSheetJson,
          movement_json AS movementJson,
          CAST(created_at AS VARCHAR) AS createdAt
        FROM characters
        ${moduleSlug ? "WHERE module_slug = $module_slug" : ""}
        ORDER BY created_at DESC
      `,
      moduleSlug ? { module_slug: moduleSlug } : undefined,
    );
    return sendJson(
      response,
      200,
      rows.map((row) => ({
        ...row,
        profile: JSON.parse(row.profileJson),
        conversation: JSON.parse(row.conversationJson),
        aiDesign: JSON.parse(row.aiDesignJson || "{}"),
        spriteSheet: JSON.parse(row.spriteSheetJson || "{}"),
        movement: JSON.parse(row.movementJson || "{}"),
      })),
    );
  }

  if (request.method === "POST" && url.pathname === "/api/characters") {
    const body = await readJson(request);
    if (body.learnerId !== undefined && !validLearnerId(body.learnerId)) return sendJson(response, 400, { error: "A valid learner is required." });
    const profile = body.profile || {};
    const hasRole = String(profile.role || profile.archetype || "").trim();
    const hasFocusAttribute = String(profile.focusAttribute || profile.personality || "").trim();
    const hasWeapon = String(profile.weapon || profile.ability || "").trim();
    if (body.moduleSlug !== "character-creation" || !String(profile.name || "").trim() || !hasRole || !hasFocusAttribute || !hasWeapon || !String(profile.weakness || "").trim()) {
      return sendJson(response, 400, { error: "A complete character profile is required." });
    }

    const name = String(profile.name || "").trim().slice(0, 500);
    const role = String(profile.role || profile.archetype || "").trim().slice(0, 500);
    const focusAttribute = String(profile.focusAttribute || profile.personality || "").trim().slice(0, 500);
    const weapon = String(profile.weapon || profile.ability || "").trim().slice(0, 500);
    const combatStyle = String(profile.combatStyle || "Direct ability use").trim().slice(0, 500);
    const visualHook = String(profile.visualHook || "").trim().slice(0, 500);
    const weakness = String(profile.weakness || "").trim().slice(0, 500);
    if (!name || !role || !focusAttribute || !weapon || !combatStyle || !weakness) {
      return sendJson(response, 400, { error: "A complete character design guide is required." });
    }
    const legacyCharacter = {
      name,
      archetype: role,
      personality: focusAttribute,
      ability: weapon,
      weakness,
    };
    const character = {
      ...legacyCharacter,
      role,
      focusAttribute,
      weapon,
      combatStyle,
      visualHook,
    };
    const profileRecord = { ...character };
    const id = randomUUID();
    const conversation = Array.isArray(body.conversation) ? body.conversation.slice(0, 100) : [];
    const creativePrompt = String(body.creativePrompt || "").trim().slice(0, 1800);
    const locale = ["en", "zh", "ms"].includes(body.locale) ? body.locale : "en";
    const aiDesign = body.aiDesign && typeof body.aiDesign === "object" ? body.aiDesign : {};
    const spriteSheet = body.spriteSheet && typeof body.spriteSheet === "object" ? body.spriteSheet : {};
    const movement = body.movement && typeof body.movement === "object" ? body.movement : {};
    const finalGameAsset = await publishCharacterSpriteToFinalGame(spriteSheet, name);
    const finalGameSpriteSheet = {
      ...spriteSheet,
      assetUrl: finalGameAsset.assetUrl,
      asset: finalGameAsset,
      finalGameAsset,
    };
    await database.run(
      `
        INSERT INTO characters (
          id, module_slug, name, archetype, personality, ability, weakness,
          role, focus_attribute, weapon, combat_style, visual_hook,
          profile_json, conversation_json, creative_prompt, locale,
          ai_design_json, sprite_sheet_json, movement_json
        )
        VALUES (
          $id, $module_slug, $name, $archetype, $personality, $ability, $weakness,
          $role, $focus_attribute, $weapon, $combat_style, $visual_hook,
          $profile_json, $conversation_json, $creative_prompt, $locale,
          $ai_design_json, $sprite_sheet_json, $movement_json
        )
      `,
      {
        id,
        module_slug: body.moduleSlug,
        ...legacyCharacter,
        profile_json: JSON.stringify(profileRecord),
        conversation_json: JSON.stringify(conversation),
        role,
        focus_attribute: focusAttribute,
        weapon,
        combat_style: combatStyle,
        visual_hook: visualHook,
        creative_prompt: creativePrompt,
        locale,
        ai_design_json: JSON.stringify(aiDesign).slice(0, 100000),
        sprite_sheet_json: JSON.stringify(finalGameSpriteSheet).slice(0, 20000),
        movement_json: JSON.stringify(movement).slice(0, 20000),
      },
    );
    if (body.learnerId) {
      await database.run(
        `INSERT INTO learner_progress (learner_id, module_slug, completed)
         VALUES ($learner_id, 'character-creation', TRUE)
         ON CONFLICT (learner_id, module_slug) DO UPDATE SET completed = TRUE`,
        { learner_id: body.learnerId },
      );
    } else {
      await database.run(
        `INSERT INTO tutorial_progress (module_slug, completed)
         VALUES ('character-creation', TRUE)
         ON CONFLICT (module_slug) DO UPDATE SET completed = TRUE`,
      );
    }
    return sendJson(response, 201, {
      id,
      moduleSlug: body.moduleSlug,
      profile: profileRecord,
      creativePrompt,
      locale,
      aiDesign,
      spriteSheet: finalGameSpriteSheet,
      finalGameAsset,
      movement,
    });
  }

  return sendJson(response, 404, { error: "API route not found." });
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }

    if (!(await serveStatic(request, response, decodeURIComponent(url.pathname)))) {
      sendText(response, 404, "Not found");
    }
  } catch (error) {
    console.error(error);
    sendJson(response, error.statusCode || 500, { error: error.message || "Internal server error." });
  }
});
attachMultiplayerRooms(server);
attachFinalGameRooms(server);

await initializeDatabase();
server.listen(port, "0.0.0.0", () => {
  console.log(`Godot Forge is running on http://localhost:${server.address().port}`);
  console.log(`DuckDB: ${databasePath}`);
  console.log(`Assets: ${assetDirectory}`);
});
