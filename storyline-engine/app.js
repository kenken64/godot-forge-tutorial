const slug = 'storyline-engine';
const learnerKey = 'godot-forge-learner-id';
let learnerId = localStorage.getItem(learnerKey);
if (!learnerId) { learnerId = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(learnerKey, learnerId); }
const copy = {
  en: {
    back: '← GODOT FORGE / LEARNING PATH', chapter: 'CHAPTER 04 / STORYLINE ENGINE', introEyebrow: 'STORY DESIGN / PLAYABLE EXAMPLE',
    title: 'Make the story happen in play.', intro: 'Watch five storytelling ingredients become a six-beat adventure. Make choices, then see the world and ending change.',
    attributesEyebrow: 'THE FIVE INGREDIENTS', attributesTitle: 'What makes this a game story?', example: 'Example',
    attributes: [
      ['Player fantasy', 'Who does the player get to be?', 'An explorer who can restore a sleeping grove.'],
      ['Motivation', 'Why keep moving?', 'Find a missing friend before the grove’s last spring dries up.'],
      ['Conflict', 'What keeps pushing back?', 'A guardian blocks the spring while supplies and trust run low.'],
      ['Player decisions', 'What changes because of a choice?', 'Sharing water helps villagers but leaves less for the repair.'],
      ['Story through gameplay', 'What can the player see and do?', 'Empty stalls, higher prices and fewer villagers reveal the shortage.'],
    ],
    demoEyebrow: 'PLAYABLE STORY', demoTitle: 'The Sleeping Grove', demoIntro: 'A reusable example: the explorer must wake the grove and find a missing friend.',
    beatNames: ['BEGINNING', 'EARLY REVELATION', 'ESCALATION', 'MAJOR REVELATION', 'DECISION', 'ENDING'],
    beats: [
      { title: 'Follow the missing explorer', body: 'Your friend vanished near the grove’s spring. The village is short of water. Where do you start?', choices: [['followTracks', 'Follow the tracks into the grove'], ['helpMarket', 'Help the market before leaving']] },
      { title: 'The guardian is protecting something', body: 'A guardian blocks the spring, but it is standing over a cracked water channel—not an enemy camp.', choices: [['listenGuardian', 'Observe the guardian and listen'], ['strikeGuardian', 'Attack to force a path through']] },
      { title: 'Shortages spread', body: 'The market raises prices. An abandoned house appears by the road. A villager asks for your water.', choices: [['shareWater', 'Share water with the villagers'], ['keepWater', 'Keep water for the journey']] },
      { title: 'Your friend sealed the spring', body: 'A journal reveals your friend activated the guardian to prevent a broken channel from flooding the village.', choices: [['repairClue', 'Use supplies to repair the channel'], ['chaseFriend', 'Search for your friend first']] },
      { title: 'Decide what matters', body: 'You can make a careful repair, or break the seal and release the spring immediately.', choices: [['repairChannels', 'Repair the channels together'], ['breakSeal', 'Break the seal now']] },
      { title: 'The grove remembers', body: '', choices: [] },
    ],
    endings: {
      repairGood: 'The spring returns gradually. Villagers reopen the market, your friend comes home, and the guardian rests beside a healthy grove.',
      repairHard: 'The channel is repaired, but earlier choices left the village short of water. The grove recovers slowly, and trust must be rebuilt.',
      breakSeal: 'Water surges through the grove, but the broken channel floods the village. Your friend survives; the guardian remains enraged.',
    },
    conversationTitle: 'CHARACTER CONVERSATION', previousLine: '← PREVIOUS LINE', nextLine: 'NEXT LINE →',
    playVoice: '▶ PLAY VOICE', stopVoice: '■ STOP VOICE', autoVoice: 'AUTO VOICE',
    voiceNote: 'Click Play Voice for the first line; Auto Voice speaks new lines. Voices are AI-generated with OpenAI, not human recordings. Replays use cached audio.',
    voiceUnavailable: 'OpenAI voice is not configured. Add OPENAI_API_KEY to the tutorial server .env.',
    voiceFailed: 'Voice playback failed. Check the server connection and your audio output.',
    speakers: { hero: 'Explorer', guardian: 'Guardian' },
    dialogue: [
      [['hero', 'I will find my friend before the last spring runs dry.'], ['guardian', 'The path to the spring is sealed for a reason.']],
      [['hero', 'You are guarding a broken water channel, not attacking us.'], ['guardian', 'If the channel fails, the village will flood.']],
      [['hero', 'The market is empty. People need water now.'], ['guardian', 'What you carry can save them—or protect the spring.']],
      [['hero', 'My friend awakened you to protect the village.'], ['guardian', 'They saw the crack before anyone else did.']],
      [['hero', 'I have to choose between speed and a careful repair.'], ['guardian', 'The grove will remember what your choice costs.']],
      [['hero', 'Our choices changed more than the spring.'], ['guardian', 'Look at the village. That is your ending.']],
    ],
    dialogueChoices: {
      helpMarket: [1, 0, 'The market was almost empty. I could not leave them alone.'],
      strikeGuardian: [2, 1, 'Your attack weakened the seal. Now the village is at risk.'],
      shareWater: [3, 0, 'I shared our water. The villagers may help us now.'],
      keepWater: [3, 0, 'I kept the water, but the villagers no longer trust me.'],
      repairClue: [4, 1, 'Your repair bought us time. Choose the final step wisely.'],
      chaseFriend: [4, 1, 'The crack keeps widening while you search. Decide now.'],
    },
    dialogueEndings: {
      repairGood: [['hero', 'The market is open again. We brought everyone home.'], ['guardian', 'The spring flows safely. I can finally rest.']],
      repairHard: [['hero', 'The spring survived, but we still owe the village help.'], ['guardian', 'A repair is a beginning. Trust takes longer to restore.']],
      breakSeal: [['hero', 'My friend is safe, but the village is flooded.'], ['guardian', 'You broke the seal. Now we must face the cost.']],
    },
    spriteFallback: 'GPT Image demo figure', heroPicker: 'PLAYER SPRITE', bossPicker: 'GUARDIAN SPRITE', refresh: 'REFRESH ASSETS',
    assetNote: 'The scenery and demo figures were generated with GPT Image 2.5. Save a character or boss sprite sheet to Final Game to animate your own artwork here.',
    assetLoading: 'Loading sprite library…', assetSaved: 'Saved sprite sheets loaded', assetNone: 'Using GPT Image demo art', assetError: 'Sprite library unavailable; demo art shown',
    trust: 'VILLAGE TRUST', supplies: 'SUPPLIES', water: 'GROVE WATER', price: 'MARKET PRICE', coins: 'coins',
    lesson: 'Notice how scarce water changes the market and scenery. The story is happening through gameplay, not only dialogue.',
    promptsEyebrow: 'BEHIND THE ARTWORK', promptsTitle: 'The prompts that made this world',
    promptsIntro: 'Open an asset to read and copy the exact English prompt used with GPT Image 2.5. Notice how the scene, silhouette and camera constraints keep the artwork consistent.',
    promptsModel: 'MODEL · gpt-image-2.5-sunburst', promptsLoading: 'Loading artwork prompts…',
    promptsError: 'Artwork prompts could not be loaded. Please refresh the page.', promptsShow: 'SHOW EXACT PROMPT',
    promptsCopy: 'COPY PROMPT', promptsCopied: 'Artwork prompt copied.', promptsCopyError: 'Could not copy the prompt.',
    promptsOriginal: 'SHOW ORIGINAL ENGLISH PROMPT', promptsTranslated: 'Translation for learning; the original English below was sent to GPT Image.',
    promptsCopyOriginal: 'COPY ORIGINAL',
    promptTitles: { 'grove-restored-v1.png': 'Grove restored', 'grove-drought-v1.png': 'Grove drought', 'grove-flood-v1.png': 'Grove flood', 'explorer-key-v1.png': 'Explorer stand-in', 'guardian-key-v1.png': 'Guardian stand-in', 'dialogue-bubble-key-v1.png': 'Conversation bubble' },
    promptsGenerated: 'GENERATED IMAGE', promptsEdited: 'EDITED FROM RESTORED GROVE',
    replay: 'REPLAY STORY', complete: 'COMPLETE MODULE', completed: 'MODULE COMPLETE ✓', saved: 'Story progress saved.', saveError: 'Could not save progress. Please try again.',
  },
  zh: {
    back: '← GODOT FORGE / 学习路径', chapter: '第 04 章 / 故事线引擎', introEyebrow: '故事设计 / 可玩示例',
    title: '让故事在游玩中发生。', intro: '看看五种叙事元素如何变成六个故事节点。做出选择，观察世界和结局如何变化。',
    attributesEyebrow: '五种叙事元素', attributesTitle: '什么让它成为游戏故事？', example: '例如',
    attributes: [
      ['玩家幻想', '玩家可以成为谁？', '能唤醒沉睡树林的探险者。'],
      ['动机', '为何继续前进？', '在最后一处泉水干涸前找到失踪的朋友。'],
      ['冲突', '什么不断阻碍玩家？', '守护者挡住泉水，补给和信任也越来越少。'],
      ['玩家决策', '选择会改变什么？', '分享饮水能帮助村民，但会减少维修所需资源。'],
      ['通过玩法讲故事', '玩家能看见和体验什么？', '空摊位、上涨的价格和稀少的村民展现缺水危机。'],
    ],
    demoEyebrow: '可玩的故事', demoTitle: '沉睡的树林', demoIntro: '可重复使用的示例：探险者必须唤醒树林并找到失踪的朋友。',
    beatNames: ['开端', '初次发现', '事态升级', '重大真相', '抉择', '结局'],
    beats: [
      { title: '追寻失踪的探险者', body: '朋友在树林的泉水附近失踪。村庄正缺水。你先从哪里开始？', choices: [['followTracks', '循着足迹进入树林'], ['helpMarket', '先帮助集市']] },
      { title: '守护者正在保护某物', body: '守护者挡住泉水，但它守着的是破裂的水渠，而不是敌人的营地。', choices: [['listenGuardian', '观察并倾听守护者'], ['strikeGuardian', '攻击以打开通路']] },
      { title: '物资短缺蔓延', body: '集市涨价了。路边出现废弃房屋。一位村民向你讨水。', choices: [['shareWater', '与村民分享饮水'], ['keepWater', '留下饮水继续旅程']] },
      { title: '朋友封锁了泉水', body: '日志显示，朋友唤醒守护者，是为了阻止破裂水渠淹没村庄。', choices: [['repairClue', '用补给修复水渠'], ['chaseFriend', '先寻找朋友']] },
      { title: '决定什么最重要', body: '你可以谨慎修复水渠，也可以立刻破除封印、释放泉水。', choices: [['repairChannels', '共同修复水渠'], ['breakSeal', '立刻破除封印']] },
      { title: '树林记住了一切', body: '', choices: [] },
    ],
    endings: {
      repairGood: '泉水逐渐恢复。村民重新开市，朋友回来了，守护者在健康的树林旁安息。',
      repairHard: '水渠修好了，但之前的选择让村庄仍然缺水。树林慢慢复原，信任还需重建。',
      breakSeal: '泉水冲进树林，破裂的水渠却淹没了村庄。朋友活了下来，守护者仍然愤怒。',
    },
    conversationTitle: '角色对话', previousLine: '← 上一句', nextLine: '下一句 →',
    playVoice: '▶ 播放语音', stopVoice: '■ 停止语音', autoVoice: '自动播放语音',
    voiceNote: '点击“播放语音”聆听第一句；自动播放会朗读后续对话。语音由 OpenAI AI 生成，并非真人录音；重播使用缓存。',
    voiceUnavailable: '尚未配置 OpenAI 语音。请在教程服务器的 .env 中设置 OPENAI_API_KEY。',
    voiceFailed: '语音播放失败。请检查服务器连接和音频输出。',
    speakers: { hero: '探险者', guardian: '守护者' },
    dialogue: [
      [['hero', '我要在最后一处泉水干涸前找到朋友。'], ['guardian', '通往泉水的道路被封锁，是有原因的。']],
      [['hero', '你守护的是破裂的水渠，并非在攻击我们。'], ['guardian', '水渠一旦崩塌，村庄就会被淹没。']],
      [['hero', '集市空了。人们现在就需要水。'], ['guardian', '你带着的资源可以救他们，也能保护泉水。']],
      [['hero', '我的朋友唤醒你，是为了保护村庄。'], ['guardian', '他们比所有人更早发现裂缝。']],
      [['hero', '我必须在快速行动与谨慎修复之间抉择。'], ['guardian', '树林会记住这个选择的代价。']],
      [['hero', '我们的选择改变的不只是泉水。'], ['guardian', '看看村庄。这就是你的结局。']],
    ],
    dialogueChoices: {
      helpMarket: [1, 0, '集市几乎空了。我不能丢下他们。'],
      strikeGuardian: [2, 1, '你的攻击削弱了封印。村庄现在有危险。'],
      shareWater: [3, 0, '我分享了饮水。村民或许会来帮忙。'],
      keepWater: [3, 0, '我留下了饮水，但村民不再信任我。'],
      repairClue: [4, 1, '你的修复为我们争取了时间。谨慎做最后决定。'],
      chaseFriend: [4, 1, '你寻找朋友时，裂缝仍在扩大。现在必须决定。'],
    },
    dialogueEndings: {
      repairGood: [['hero', '集市重新开张了。大家都平安回来了。'], ['guardian', '泉水平稳流淌。我终于可以休息。']],
      repairHard: [['hero', '泉水保住了，但我们还欠村庄一个交代。'], ['guardian', '修复只是开始。信任需要更久才能恢复。']],
      breakSeal: [['hero', '朋友安全了，但村庄被洪水淹没。'], ['guardian', '你破除了封印。现在必须面对代价。']],
    },
    spriteFallback: 'GPT Image 示例角色', heroPicker: '玩家精灵', bossPicker: '守护者精灵', refresh: '刷新素材',
    assetNote: '场景与示例角色由 GPT Image 2.5 生成。将角色或 Boss 精灵表保存到最终游戏后，可在这里播放自己的素材。',
    assetLoading: '正在载入精灵素材…', assetSaved: '已载入保存的精灵表', assetNone: '使用 GPT Image 示例素材', assetError: '无法载入精灵素材；显示示例素材',
    trust: '村庄信任', supplies: '补给', water: '树林水源', price: '集市价格', coins: '金币',
    lesson: '留意缺水如何改变集市和场景。故事正在通过玩法发生，而不只是通过对话讲述。',
    promptsEyebrow: '美术制作幕后', promptsTitle: '创造这个世界的提示词',
    promptsIntro: '展开素材，阅读并复制实际用于 GPT Image 2.5 的英文提示词。留意场景、轮廓和镜头限制如何让画风保持一致。',
    promptsModel: '模型 · gpt-image-2.5-sunburst', promptsLoading: '正在载入美术提示词…',
    promptsError: '无法载入美术提示词，请刷新页面。', promptsShow: '查看完整提示词',
    promptsCopy: '复制提示词', promptsCopied: '已复制美术提示词。', promptsCopyError: '无法复制提示词。',
    promptsOriginal: '查看原始英文提示词', promptsTranslated: '本翻译供学习参考；下方英文原文才是提交给 GPT Image 的提示词。',
    promptsCopyOriginal: '复制英文原文',
    promptTitles: { 'grove-restored-v1.png': '复苏的树林', 'grove-drought-v1.png': '干旱的树林', 'grove-flood-v1.png': '洪水中的树林', 'explorer-key-v1.png': '探险者示例精灵', 'guardian-key-v1.png': '守护者示例精灵', 'dialogue-bubble-key-v1.png': '对话气泡' },
    promptsGenerated: '生成图像', promptsEdited: '基于复苏树丛编辑',
    replay: '重玩故事', complete: '完成模块', completed: '模块已完成 ✓', saved: '故事进度已保存。', saveError: '无法保存进度，请重试。',
  },
  ms: {
    back: '← GODOT FORGE / LALUAN PEMBELAJARAN', chapter: 'BAB 04 / ENJIN JALAN CERITA', introEyebrow: 'REKA CERITA / CONTOH BOLEH MAIN',
    title: 'Biarkan cerita berlaku semasa bermain.', intro: 'Lihat lima unsur cerita menjadi pengembaraan enam babak. Buat pilihan, kemudian lihat dunia dan pengakhiran berubah.',
    attributesEyebrow: 'LIMA UNSUR CERITA', attributesTitle: 'Apa yang menjadikannya cerita permainan?', example: 'Contoh',
    attributes: [
      ['Fantasi pemain', 'Siapa yang pemain boleh jadi?', 'Penjelajah yang boleh memulihkan rimba yang tertidur.'],
      ['Motivasi', 'Mengapa terus bergerak?', 'Cari rakan yang hilang sebelum mata air terakhir kering.'],
      ['Konflik', 'Apa yang terus menghalang?', 'Penjaga menghalang mata air sementara bekalan dan kepercayaan menyusut.'],
      ['Keputusan pemain', 'Apa yang berubah kerana pilihan?', 'Berkongsi air membantu penduduk tetapi mengurangkan bekalan untuk pembaikan.'],
      ['Cerita melalui permainan', 'Apa yang pemain lihat dan lakukan?', 'Gerai kosong, harga tinggi dan penduduk yang semakin sedikit menunjukkan kekurangan air.'],
    ],
    demoEyebrow: 'CERITA BOLEH MAIN', demoTitle: 'Rimba yang Tertidur', demoIntro: 'Contoh boleh guna semula: penjelajah perlu membangunkan rimba dan mencari rakan yang hilang.',
    beatNames: ['PERMULAAN', 'PENDEDAHAN AWAL', 'KETEGANGAN', 'PENDEDAHAN BESAR', 'KEPUTUSAN', 'PENGAKHIRAN'],
    beats: [
      { title: 'Jejaki penjelajah yang hilang', body: 'Rakan anda hilang berhampiran mata air rimba. Kampung kekurangan air. Di mana anda bermula?', choices: [['followTracks', 'Ikut jejak ke dalam rimba'], ['helpMarket', 'Bantu pasar dahulu']] },
      { title: 'Penjaga melindungi sesuatu', body: 'Penjaga menghalang mata air, tetapi ia menjaga saluran air yang retak—bukan kem musuh.', choices: [['listenGuardian', 'Perhati dan dengar penjaga'], ['strikeGuardian', 'Serang untuk membuka laluan']] },
      { title: 'Kekurangan merebak', body: 'Harga pasar meningkat. Rumah terbiar muncul di tepi jalan. Seorang penduduk meminta air.', choices: [['shareWater', 'Kongsi air dengan penduduk'], ['keepWater', 'Simpan air untuk perjalanan']] },
      { title: 'Rakan anda menutup mata air', body: 'Jurnal mendedahkan rakan anda mengaktifkan penjaga supaya saluran yang rosak tidak membanjiri kampung.', choices: [['repairClue', 'Guna bekalan untuk baiki saluran'], ['chaseFriend', 'Cari rakan dahulu']] },
      { title: 'Tentukan yang penting', body: 'Anda boleh membaiki dengan cermat atau memecahkan meterai dan melepaskan mata air segera.', choices: [['repairChannels', 'Baiki saluran bersama-sama'], ['breakSeal', 'Pecahkan meterai sekarang']] },
      { title: 'Rimba mengingati semuanya', body: '', choices: [] },
    ],
    endings: {
      repairGood: 'Mata air pulih perlahan-lahan. Pasar dibuka semula, rakan anda pulang dan penjaga berehat di sisi rimba yang sihat.',
      repairHard: 'Saluran berjaya dibaiki, tetapi pilihan terdahulu membuat kampung masih kekurangan air. Rimba pulih perlahan-lahan dan kepercayaan perlu dibina semula.',
      breakSeal: 'Air mengalir deras ke rimba, tetapi saluran yang rosak membanjiri kampung. Rakan anda terselamat; penjaga masih mengamuk.',
    },
    conversationTitle: 'PERBUALAN WATAK', previousLine: '← AYAT SEBELUMNYA', nextLine: 'AYAT SETERUSNYA →',
    playVoice: '▶ MAIN SUARA', stopVoice: '■ HENTI SUARA', autoVoice: 'SUARA AUTOMATIK',
    voiceNote: 'Klik Main Suara untuk ayat pertama; Suara Automatik menyebut ayat seterusnya. Suara dijana oleh AI OpenAI, bukan rakaman manusia; main semula menggunakan cache.',
    voiceUnavailable: 'Suara OpenAI belum dikonfigurasi. Tetapkan OPENAI_API_KEY dalam .env pelayan tutorial.',
    voiceFailed: 'Suara gagal dimainkan. Semak sambungan pelayan dan output audio anda.',
    speakers: { hero: 'Penjelajah', guardian: 'Penjaga' },
    dialogue: [
      [['hero', 'Aku mesti mencari rakanku sebelum mata air terakhir kering.'], ['guardian', 'Laluan ke mata air ditutup atas sebab tertentu.']],
      [['hero', 'Kau menjaga saluran air yang rosak, bukan menyerang kami.'], ['guardian', 'Jika saluran runtuh, kampung akan dilanda banjir.']],
      [['hero', 'Pasar sudah kosong. Penduduk perlukan air sekarang.'], ['guardian', 'Bekalanmu boleh menyelamatkan mereka atau mata air.']],
      [['hero', 'Rakanku membangunkanmu untuk melindungi kampung.'], ['guardian', 'Mereka melihat rekahan itu sebelum orang lain.']],
      [['hero', 'Aku mesti memilih antara tindakan pantas dan pembaikan rapi.'], ['guardian', 'Rimba akan mengingati harga pilihanmu.']],
      [['hero', 'Pilihan kita mengubah lebih daripada mata air.'], ['guardian', 'Lihat kampung itu. Itulah pengakhiranmu.']],
    ],
    dialogueChoices: {
      helpMarket: [1, 0, 'Pasar hampir kosong. Aku tidak boleh meninggalkan mereka.'],
      strikeGuardian: [2, 1, 'Seranganmu melemahkan meterai. Kampung kini terancam.'],
      shareWater: [3, 0, 'Aku berkongsi air. Mungkin penduduk akan membantu kita.'],
      keepWater: [3, 0, 'Aku menyimpan air, tetapi penduduk tidak lagi percayakan aku.'],
      repairClue: [4, 1, 'Pembaikanmu memberi kita masa. Pilih langkah terakhir dengan bijak.'],
      chaseFriend: [4, 1, 'Rekahan makin besar semasa kau mencari. Putuskan sekarang.'],
    },
    dialogueEndings: {
      repairGood: [['hero', 'Pasar dibuka semula. Semua orang telah pulang.'], ['guardian', 'Mata air mengalir dengan selamat. Aku boleh berehat.']],
      repairHard: [['hero', 'Mata air selamat, tetapi kami masih berhutang pada kampung.'], ['guardian', 'Pembaikan hanya permulaan. Kepercayaan pulih lebih lama.']],
      breakSeal: [['hero', 'Rakanku selamat, tetapi kampung dilanda banjir.'], ['guardian', 'Kau memecahkan meterai. Kini kita hadapi akibatnya.']],
    },
    spriteFallback: 'Watak demo GPT Image', heroPicker: 'SPRIT PEMAIN', bossPicker: 'SPRIT PENJAGA', refresh: 'SEGAR SEMULA ASET',
    assetNote: 'Latar dan watak demo dijana dengan GPT Image 2.5. Simpan helaian sprit watak atau bos ke Final Game untuk menganimasikan karya anda di sini.',
    assetLoading: 'Memuatkan pustaka sprit…', assetSaved: 'Helaian sprit tersimpan dimuatkan', assetNone: 'Menggunakan karya demo GPT Image', assetError: 'Pustaka sprit tidak tersedia; karya demo ditunjukkan',
    trust: 'KEPERCAYAAN KAMPUNG', supplies: 'BEKALAN', water: 'AIR RIMBA', price: 'HARGA PASAR', coins: 'syiling',
    lesson: 'Perhatikan bagaimana kekurangan air mengubah pasar dan pemandangan. Cerita berlaku melalui permainan, bukan hanya dialog.',
    promptsEyebrow: 'DI SEBALIK KARYA SENI', promptsTitle: 'Prompt yang membina dunia ini',
    promptsIntro: 'Buka aset untuk membaca dan menyalin prompt bahasa Inggeris sebenar yang digunakan dengan GPT Image 2.5. Perhatikan bagaimana adegan, siluet dan sudut kamera mengekalkan gaya yang seragam.',
    promptsModel: 'MODEL · gpt-image-2.5-sunburst', promptsLoading: 'Memuatkan prompt karya seni…',
    promptsError: 'Prompt karya seni tidak dapat dimuatkan. Sila muat semula halaman.', promptsShow: 'LIHAT PROMPT PENUH',
    promptsCopy: 'SALIN PROMPT', promptsCopied: 'Prompt karya seni disalin.', promptsCopyError: 'Prompt tidak dapat disalin.',
    promptsOriginal: 'LIHAT PROMPT ASAL BAHASA INGGERIS', promptsTranslated: 'Terjemahan ini untuk pembelajaran; prompt asal bahasa Inggeris di bawah dihantar kepada GPT Image.',
    promptsCopyOriginal: 'SALIN PROMPT ASAL',
    promptTitles: { 'grove-restored-v1.png': 'Rimba yang pulih', 'grove-drought-v1.png': 'Rimba kemarau', 'grove-flood-v1.png': 'Rimba banjir', 'explorer-key-v1.png': 'Sprit penjelajah contoh', 'guardian-key-v1.png': 'Sprit penjaga contoh', 'dialogue-bubble-key-v1.png': 'Gelembung perbualan' },
    promptsGenerated: 'IMEJ DIJANA', promptsEdited: 'DIEDIT DARIPADA RIMBA PULIH',
    replay: 'MAIN SEMULA CERITA', complete: 'LENGKAPKAN MODUL', completed: 'MODUL SELESAI ✓', saved: 'Kemajuan cerita disimpan.', saveError: 'Kemajuan tidak dapat disimpan. Sila cuba lagi.',
  },
};

let locale = copy[localStorage.getItem('godot-forge-locale')] ? localStorage.getItem('godot-forge-locale') : 'en';
let choices = [];
let dialogueIndex = 0;
let moduleCompleted = false;
let manifests = { character: [], boss: [] };
let previewGame = null;
let previewScene = null;
let checkpointWrite = Promise.resolve();
let artPrompts = [];
let artPromptTranslations = {};
let promptLoadFailed = false;
let activeAudio = null;
let voiceRequestSequence = 0;
let voiceConfigured = false;
const $ = selector => document.querySelector(selector);
const artPreviews = {
  'grove-restored-v1.png': 'grove-restored-stage.webp',
  'grove-drought-v1.png': 'grove-drought-stage.webp',
  'grove-flood-v1.png': 'grove-flood-stage.webp',
  'explorer-key-v1.png': 'explorer-stage.webp',
  'guardian-key-v1.png': 'guardian-stage.webp',
  'dialogue-bubble-key-v1.png': 'dialogue-bubble-stage.webp',
};

function worldState() {
  const state = { trust: 2, supplies: 2, water: 2, guardianAngry: false };
  for (const choice of choices) {
    if (choice === 'followTracks') state.supplies--;
    if (choice === 'helpMarket') { state.trust++; state.supplies--; }
    if (choice === 'listenGuardian') state.trust++;
    if (choice === 'strikeGuardian') { state.water--; state.guardianAngry = true; }
    if (choice === 'shareWater') { state.trust++; state.water--; }
    if (choice === 'keepWater') { state.supplies++; state.trust--; }
    if (choice === 'repairClue') { state.supplies--; state.water++; }
    if (choice === 'chaseFriend') state.trust--;
    if (choice === 'repairChannels') { state.water++; state.trust++; }
    if (choice === 'breakSeal') { state.water--; state.guardianAngry = true; }
  }
  state.price = Math.max(1, 4 - state.water + (state.trust < 2 ? 1 : 0));
  return state;
}

function endingKey(state) {
  if (choices[4] === 'breakSeal') return 'breakSeal';
  return state.trust >= 3 && state.water >= 2 ? 'repairGood' : 'repairHard';
}

function conversationForBeat() {
  const t = copy[locale], beat = Math.min(choices.length, 5);
  const lines = (beat === 5 ? t.dialogueEndings[endingKey(worldState())] : t.dialogue[beat]).map(([speaker, line]) => ({ speaker, line }));
  const reaction = t.dialogueChoices[choices[beat - 1]];
  if (reaction?.[0] === beat && lines[reaction[1]]) lines[reaction[1]].line = reaction[2];
  return lines;
}

function updateVoiceControls() {
  const t = copy[locale];
  $('#play-line').textContent = activeAudio ? t.stopVoice : t.playVoice;
  $('#play-line').setAttribute('aria-pressed', String(Boolean(activeAudio)));
  $('#play-line').disabled = !voiceConfigured;
  $('#auto-voice').disabled = !voiceConfigured;
}

function stopVoice() {
  voiceRequestSequence++;
  if (activeAudio) {
    const oldAudio = activeAudio;
    activeAudio = null;
    oldAudio.pause(); oldAudio.removeAttribute('src'); oldAudio.load();
  }
  updateVoiceControls();
}

async function speakCurrentLine(toggle = false) {
  if (!voiceConfigured) return;
  if (toggle && activeAudio) { stopVoice(); return; }
  stopVoice();
  const sequence = voiceRequestSequence;
  const line = conversationForBeat()[dialogueIndex];
  const params = new URLSearchParams({ locale, speaker: line.speaker, text: line.line });
  let audioUrl = `/api/storyline/voice?${params}`;
  try {
    const response = await fetch(`/api/storyline/voice/url?${params}`);
    if (response.ok) audioUrl = (await response.json()).url || audioUrl;
  } catch { /* Keep the existing voice endpoint as a fallback. */ }
  if (sequence !== voiceRequestSequence) return;
  const audio = new Audio(audioUrl);
  audio.onended = () => { if (activeAudio === audio) { activeAudio = null; updateVoiceControls(); } };
  audio.onerror = () => {
    if (activeAudio !== audio) return;
    activeAudio = null; updateVoiceControls(); window.showToast?.(copy[locale].voiceFailed, 'error');
  };
  activeAudio = audio;
  updateVoiceControls();
  audio.play().catch(() => {
    if (activeAudio !== audio) return;
    activeAudio = null; updateVoiceControls(); window.showToast?.(copy[locale].voiceFailed, 'error');
  });
}

async function loadVoiceConfig() {
  try {
    const response = await fetch('/api/storyline/voice/config');
    voiceConfigured = response.ok && Boolean((await response.json()).configured);
  } catch { voiceConfigured = false; }
  $('#voice-note').textContent = voiceConfigured ? copy[locale].voiceNote : copy[locale].voiceUnavailable;
  updateVoiceControls();
}

function renderArtPrompts() {
  const t = copy[locale], grid = $('#prompt-grid');
  if (promptLoadFailed) { grid.replaceChildren(); const error = document.createElement('p'); error.className = 'prompt-error'; error.textContent = t.promptsError; grid.append(error); return; }
  if (!artPrompts.length) { grid.replaceChildren(); const loading = document.createElement('p'); loading.textContent = t.promptsLoading; grid.append(loading); return; }
  grid.replaceChildren(...artPrompts.map(({ title, filename, prompt }, index) => {
    const card = document.createElement('article'); card.className = 'prompt-card';
    const localizedTitle = t.promptTitles?.[filename] || title;
    const image = document.createElement('img'); image.src = `https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/storyline-engine/images/${artPreviews[filename]}`; image.alt = localizedTitle; image.loading = 'lazy';
    const body = document.createElement('div'); body.className = 'prompt-card-body';
    const heading = document.createElement('h3'); heading.textContent = localizedTitle;
    const kind = document.createElement('p'); kind.className = 'prompt-kind'; kind.textContent = ['grove-drought-v1.png', 'grove-flood-v1.png'].includes(filename) ? t.promptsEdited : t.promptsGenerated;
    const details = document.createElement('details'); details.open = index === 0;
    const summary = document.createElement('summary'); summary.textContent = t.promptsShow;
    const translated = locale === 'en' ? null : artPromptTranslations[locale]?.[filename];
    const content = document.createElement('pre'); content.textContent = translated || prompt;
    const copyButton = document.createElement('button'); copyButton.type = 'button'; copyButton.className = 'prompt-copy'; copyButton.textContent = t.promptsCopy;
    copyButton.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(translated || prompt); window.showToast?.(copy[locale].promptsCopied, 'success'); }
      catch { window.showToast?.(copy[locale].promptsCopyError, 'error'); }
    });
    details.append(summary, content, copyButton); body.append(heading, kind, details); card.append(image, body);
    if (translated) {
      const note = document.createElement('p'); note.className = 'prompt-translation-note'; note.textContent = t.promptsTranslated;
      const original = document.createElement('details'); original.className = 'prompt-original';
      const originalSummary = document.createElement('summary'); originalSummary.textContent = t.promptsOriginal;
      const originalText = document.createElement('pre'); originalText.textContent = prompt;
      const originalCopy = document.createElement('button'); originalCopy.type = 'button'; originalCopy.className = 'prompt-copy'; originalCopy.textContent = t.promptsCopyOriginal;
      originalCopy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(prompt); window.showToast?.(copy[locale].promptsCopied, 'success'); }
        catch { window.showToast?.(copy[locale].promptsCopyError, 'error'); }
      });
      original.append(originalSummary, originalText, originalCopy); details.append(note, original);
    }
    return card;
  }));
}

async function loadArtPrompts() {
  try {
    const [sourceResponse, translationResponse] = await Promise.all([
      fetch('/storyline-engine/images/GENERATION_PROMPTS.md'),
      fetch('/storyline-engine/images/prompt-translations.json'),
    ]);
    if (!sourceResponse.ok || !translationResponse.ok) throw new Error('Artwork prompts unavailable');
    const source = await sourceResponse.text();
    artPromptTranslations = await translationResponse.json();
    artPrompts = source.split(/^## /m).slice(1).map(section => {
      const [heading, ...lines] = section.split('\n');
      const filename = heading.match(/`([^`]+)`/)?.[1];
      const prompt = lines.filter(line => line.startsWith('> ')).map(line => line.slice(2)).join('\n');
      return { title: heading.split(' — ')[0], filename, prompt };
    }).filter(item => artPreviews[item.filename] && item.prompt);
    if (artPrompts.length !== Object.keys(artPreviews).length ||
        ['zh', 'ms'].some(language => artPrompts.some(item => !artPromptTranslations[language]?.[item.filename]))) {
      throw new Error('Artwork prompts incomplete');
    }
  } catch { promptLoadFailed = true; }
  renderArtPrompts();
}

function render() {
  const t = copy[locale], beat = Math.min(choices.length, 5), state = worldState();
  const conversation = conversationForBeat();
  dialogueIndex = Math.min(Math.max(dialogueIndex, 0), conversation.length - 1);
  const currentLine = conversation[dialogueIndex];
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  document.title = `${t.demoTitle} · Godot Forge`;
  $('#back-link').textContent = t.back; $('#chapter-label').textContent = t.chapter;
  $('#intro-eyebrow').textContent = t.introEyebrow; $('#page-title').textContent = t.title; $('#intro-copy').textContent = t.intro;
  $('#attributes-eyebrow').textContent = t.attributesEyebrow; $('#attributes-title').textContent = t.attributesTitle;
  $('#attribute-grid').replaceChildren(...t.attributes.map(([name, question, example], index) => {
    const card = document.createElement('article'); card.className = 'attribute-card';
    const number = document.createElement('span'); number.textContent = `0${index + 1} / 05`;
    const heading = document.createElement('h3'); heading.textContent = name;
    const prompt = document.createElement('p'); prompt.textContent = question;
    const sample = document.createElement('p'); sample.className = 'example';
    const label = document.createElement('strong'); label.textContent = `${t.example}: `; sample.append(label, example);
    card.append(number, heading, prompt, sample); return card;
  }));
  $('#demo-eyebrow').textContent = t.demoEyebrow; $('#demo-title').textContent = t.demoTitle; $('#demo-intro').textContent = t.demoIntro;
  $('#beat-label').textContent = `${String(beat + 1).padStart(2, '0')} / ${t.beatNames[beat]}`;
  $('#beat-kind').textContent = t.beatNames[beat]; $('#beat-title').textContent = t.beats[beat].title;
  $('#beat-body').textContent = beat === 5 ? t.endings[endingKey(state)] : t.beats[beat].body;
  $('.dialogue-strip').setAttribute('aria-label', t.conversationTitle);
  $('#conversation-title').textContent = t.conversationTitle;
  $('#dialogue-speaker').textContent = t.speakers[currentLine.speaker];
  $('#dialogue-line').textContent = currentLine.line;
  $('#dialogue-count').textContent = `${dialogueIndex + 1} / ${conversation.length}`;
  $('#previous-line').textContent = t.previousLine;
  $('#next-line').textContent = t.nextLine;
  $('#previous-line').disabled = dialogueIndex === 0;
  $('#next-line').disabled = dialogueIndex === conversation.length - 1;
  $('#auto-voice-label').textContent = t.autoVoice;
  $('#voice-note').textContent = voiceConfigured ? t.voiceNote : t.voiceUnavailable;
  updateVoiceControls();
  $('#beat-track').replaceChildren(...t.beatNames.map((_, index) => {
    const marker = document.createElement('span'); marker.className = index <= beat ? 'active' : ''; return marker;
  }));
  $('#choices').replaceChildren(...t.beats[beat].choices.map(([key, label]) => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
    button.addEventListener('click', () => choose(key)); return button;
  }));
  $('#replay-story').textContent = t.replay;
  $('#complete-story').hidden = beat !== 5;
  $('#complete-story').textContent = moduleCompleted ? t.completed : t.complete;
  $('#complete-story').disabled = moduleCompleted;
  $('#hero-picker-label').textContent = t.heroPicker; $('#boss-picker-label').textContent = t.bossPicker;
  $('#refresh-assets').textContent = t.refresh; $('#asset-note').textContent = t.assetNote;
  $('#trust-label').textContent = t.trust; $('#supplies-label').textContent = t.supplies;
  $('#water-label').textContent = t.water; $('#price-label').textContent = t.price;
  $('#trust-value').textContent = state.trust; $('#supplies-value').textContent = state.supplies;
  $('#water-value').textContent = state.water; $('#price-value').textContent = `${state.price} ${t.coins}`;
  $('#lesson-note').textContent = t.lesson;
  $('#prompts-eyebrow').textContent = t.promptsEyebrow; $('#prompts-title').textContent = t.promptsTitle;
  $('#prompts-intro').textContent = t.promptsIntro; $('#prompt-model').textContent = t.promptsModel;
  $('#languages').setAttribute('aria-label', locale === 'zh' ? '语言' : locale === 'ms' ? 'Bahasa' : 'Language');
  document.querySelectorAll('#languages button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
  for (const type of ['character', 'boss']) $('#'+(type === 'character' ? 'hero' : 'boss')+'-picker option[value=""]').textContent = t.spriteFallback;
  previewScene?.renderStory();
}

function saveCheckpoint() {
  const body = JSON.stringify({ learnerId, state: { choices, dialogueIndex } });
  checkpointWrite = checkpointWrite.catch(() => {}).then(async () => {
    const response = await fetch(`/api/modules/${slug}/checkpoint`, {
      method: 'PUT', headers: { 'content-type': 'application/json' }, body,
    });
    if (!response.ok) throw new Error(copy[locale].saveError);
  });
  return checkpointWrite;
}

async function choose(key) {
  const beat = choices.length;
  if (beat >= 5 || !copy.en.beats[beat].choices.some(choice => choice[0] === key)) return;
  stopVoice(); choices.push(key); dialogueIndex = 0; render();
  if ($('#auto-voice').checked) speakCurrentLine();
  try { await saveCheckpoint(); window.showToast?.(copy[locale].saved, 'success'); }
  catch { $('#story-status').textContent = copy[locale].saveError; window.showToast?.(copy[locale].saveError, 'error'); }
}

async function changeDialogue(delta) {
  const next = dialogueIndex + delta;
  if (next < 0 || next >= conversationForBeat().length) return;
  stopVoice(); dialogueIndex = next; render();
  if ($('#auto-voice').checked) speakCurrentLine();
  try { await saveCheckpoint(); }
  catch { window.showToast?.(copy[locale].saveError, 'error'); }
}

function validManifest(manifest) {
  const assetUrl = manifest?.image?.assetUrl || '';
  const savedAsset = /^\/api\/assets\/[^/]+$/.test(assetUrl);
  const publishedAsset = /^https:\/\/godot-forge\.sgp1\.digitaloceanspaces\.com\/2d-game-development\/tutorial-web-app\/storage\/assets\/(?:final-game\/)?[^/?#]+$/.test(assetUrl);
  if (!['character', 'boss'].includes(manifest?.kind) || (!savedAsset && !publishedAsset)) return false;
  const { width, height } = manifest.image;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || !Array.isArray(manifest.animations)) return false;
  return manifest.animations.some(row => Array.isArray(row.frames) && row.frames.some(frame =>
    Number.isInteger(frame.x) && Number.isInteger(frame.y) && Number.isInteger(frame.width) && Number.isInteger(frame.height) &&
    frame.x >= 0 && frame.y >= 0 && frame.width > 0 && frame.height > 0 && frame.x + frame.width <= width && frame.y + frame.height <= height));
}

async function loadAssetLibrary() {
  $('#asset-status').textContent = copy[locale].assetLoading;
  const assets = await fetch('/api/assets?module=final-game').then(response => response.ok ? response.json() : Promise.reject());
  const jsonFiles = assets.filter(asset => asset.mimeType === 'application/json' || asset.originalName.endsWith('.json'));
  const candidates = await Promise.all(jsonFiles.map(async asset => {
    try { const manifest = await fetch(asset.assetUrl).then(response => response.json()); return validManifest(manifest) ? { name: manifest.image.file, manifest } : null; }
    catch { return null; }
  }));
  manifests = { character: candidates.filter(item => item?.manifest.kind === 'character'), boss: candidates.filter(item => item?.manifest.kind === 'boss') };
  for (const [type, pickerId] of [['character', '#hero-picker'], ['boss', '#boss-picker']]) {
    const picker = $(pickerId), previous = picker.value;
    picker.replaceChildren();
    const fallback = document.createElement('option'); fallback.value = ''; fallback.textContent = copy[locale].spriteFallback; picker.append(fallback);
    manifests[type].forEach((item, index) => { const option = document.createElement('option'); option.value = String(index); option.textContent = item.name; picker.append(option); });
    picker.value = previous && manifests[type][Number(previous)] ? previous : manifests[type].length ? '0' : '';
  }
  $('#asset-status').textContent = manifests.character.length || manifests.boss.length ? copy[locale].assetSaved : copy[locale].assetNone;
  createPreview();
}

function selectedManifest(type) {
  const picker = $(type === 'character' ? '#hero-picker' : '#boss-picker');
  return picker.value === '' ? null : manifests[type][Number(picker.value)]?.manifest || null;
}

function registerAnimations(scene, key, manifest) {
  const texture = scene.textures.get(key);
  const available = [];
  for (const row of manifest.animations) {
    if (!Array.isArray(row.frames)) continue;
    const frames = [];
    row.frames.forEach((rect, index) => {
      const frameName = `${row.name}-${index}`;
      if (!Number.isInteger(rect.x) || !Number.isInteger(rect.y) || !Number.isInteger(rect.width) || !Number.isInteger(rect.height) ||
          rect.x < 0 || rect.y < 0 || rect.width < 1 || rect.height < 1 || rect.x + rect.width > manifest.image.width || rect.y + rect.height > manifest.image.height) return;
      texture.add(frameName, 0, rect.x, rect.y, rect.width, rect.height);
      frames.push({ key, frame: frameName });
    });
    if (frames.length) {
      const animationKey = `${key}-${row.name}`;
      scene.anims.create({ key: animationKey, frames, frameRate: Math.max(1, Math.min(18, Number(row.fps) || 4)), repeat: row.loop ? -1 : 0 });
      available.push(animationKey);
    }
  }
  return available;
}

function createPreview() {
  if (previewGame) { previewGame.destroy(true); previewGame = null; previewScene = null; }
  if (!window.Phaser) { $('#asset-status').textContent = 'Phaser could not load.'; return; }
  const heroManifest = selectedManifest('character'), bossManifest = selectedManifest('boss');
  $('#asset-status').textContent = heroManifest || bossManifest ? copy[locale].assetSaved : copy[locale].assetNone;
  class StoryScene extends Phaser.Scene {
    constructor() { super('StoryPreview'); }
    preload() {
      this.load.setCORS('anonymous');
      for (const mood of ['drought', 'restored', 'flood']) this.load.image(`grove-${mood}`, `https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/storyline-engine/images/grove-${mood}-stage.webp`);
      this.load.image('fallback-hero', 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/storyline-engine/images/explorer-stage.webp');
      this.load.image('fallback-boss', 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/storyline-engine/images/guardian-stage.webp');
      this.load.image('dialogue-bubble', 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/storyline-engine/images/dialogue-bubble-stage.webp');
      if (heroManifest) this.load.image('story-hero', heroManifest.image.assetUrl);
      if (bossManifest) this.load.image('story-boss', bossManifest.image.assetUrl);
    }
    create() {
      previewScene = this;
      this.background = this.add.image(480, 180, 'grove-drought').setDisplaySize(960, 360);
      if (heroManifest && this.textures.exists('story-hero')) {
        this.heroAnimations = registerAnimations(this, 'story-hero', heroManifest);
        this.hero = this.add.sprite(275, 279, 'story-hero'); this.hero.setOrigin(.5, 1);
        const first = heroManifest.animations.find(row => row.frames?.length)?.frames[0];
        if (first) this.hero.setDisplaySize(Math.min(190, 174 * first.width / first.height), 174);
      } else this.heroFallback = this.add.image(275, 279, 'fallback-hero').setOrigin(.5, 1).setDisplaySize(120, 183);
      if (bossManifest && this.textures.exists('story-boss')) {
        this.bossAnimations = registerAnimations(this, 'story-boss', bossManifest);
        this.boss = this.add.sprite(745, 279, 'story-boss'); this.boss.setOrigin(.5, 1);
        const first = bossManifest.animations.find(row => row.frames?.length)?.frames[0];
        if (first) this.boss.setDisplaySize(Math.min(230, 210 * first.width / first.height), 210);
      } else this.bossFallback = this.add.image(745, 279, 'fallback-boss').setOrigin(.5, 1).setDisplaySize(170, 218);
      this.dialogueBubble = this.add.image(0, 0, 'dialogue-bubble').setOrigin(0, 0).setDisplaySize(450, 92).setInteractive();
      this.dialogueBubble.on('pointerdown', () => changeDialogue(1));
      this.dialogueSpeaker = this.add.text(0, 0, '', { fontFamily: 'system-ui, sans-serif', fontSize: '13px', fontStyle: 'bold', color: '#754522' });
      this.dialogueText = this.add.text(0, 0, '', { fontFamily: 'system-ui, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#35261b', wordWrap: { width: 398 } });
      window.storyPreview = { usesHeroSprite: Boolean(this.hero), usesBossSprite: Boolean(this.boss), generatedFallbacks: Boolean(this.heroFallback || this.bossFallback), hasBubbleTexture: this.textures.exists('dialogue-bubble'), renderer: 'Phaser' };
      this.renderStory();
    }
    renderStory() {
      const state = worldState(), beat = Math.min(choices.length, 5);
      const ending = beat === 5 ? endingKey(state) : null;
      const mood = ending === 'breakSeal' ? 'flood' : ending === 'repairGood' || (beat >= 3 && state.water >= 3 && state.trust >= 3) ? 'restored' : 'drought';
      this.background.setTexture(`grove-${mood}`);
      this.heroFallback?.setX(beat >= 2 && beat <= 4 ? 330 : 275);
      (this.boss || this.bossFallback)?.setTint(state.guardianAngry ? 0xffd0a6 : 0xffffff);
      this.playPose(this.hero, 'story-hero', beat >= 2 && beat <= 4 ? 'walk' : 'idle', this.heroAnimations);
      this.playPose(this.boss, 'story-boss', state.guardianAngry ? 'enrage' : 'idle', this.bossAnimations);
      this.renderDialogue();
      window.storyPreview.mood = mood;
    }
    renderDialogue() {
      const line = conversationForBeat()[dialogueIndex], isGuardian = line.speaker === 'guardian';
      const x = isGuardian ? 420 : 135, y = 7;
      this.dialogueBubble.setPosition(x, y).setFlipX(isGuardian);
      this.dialogueSpeaker.setPosition(x + 25, y + 12).setText(copy[locale].speakers[line.speaker]);
      this.dialogueText.setPosition(x + 25, y + 31).setText(line.line).setFontSize(16);
      if (this.dialogueText.height > 47) this.dialogueText.setFontSize(14);
      if (this.dialogueText.height > 47) this.dialogueText.setFontSize(12);
      window.storyPreview.dialogue = { speaker: line.speaker, line: line.line, index: dialogueIndex };
    }
    playPose(sprite, key, preferred, available = []) {
      if (!sprite) return;
      const candidate = [`${key}-${preferred}`, `${key}-idle`, `${key}-walk`, ...available].find(name => this.anims.exists(name));
      if (candidate) sprite.play(candidate, true);
    }
  }
  previewGame = new Phaser.Game({ type: Phaser.AUTO, parent: 'phaser-stage', width: 960, height: 360, backgroundColor: '#10221d',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, render: { pixelArt: true, antialias: false }, scene: StoryScene });
}

$('#languages').addEventListener('click', event => {
  const next = event.target.closest('button[data-locale]')?.dataset.locale;
  if (!copy[next] || next === locale) return;
  stopVoice(); locale = next; localStorage.setItem('godot-forge-locale', locale); render(); renderArtPrompts();
  if ($('#auto-voice').checked) speakCurrentLine();
  $('#asset-status').textContent = selectedManifest('character') || selectedManifest('boss') ? copy[locale].assetSaved : copy[locale].assetNone;
});
$('#previous-line').addEventListener('click', () => changeDialogue(-1));
$('#next-line').addEventListener('click', () => changeDialogue(1));
$('#play-line').addEventListener('click', () => speakCurrentLine(true));
$('#auto-voice').addEventListener('change', event => { if (event.target.checked) speakCurrentLine(); else stopVoice(); });
$('#replay-story').addEventListener('click', async () => {
  stopVoice(); choices = []; dialogueIndex = 0; $('#story-status').textContent = ''; render();
  if ($('#auto-voice').checked) speakCurrentLine();
  try { await saveCheckpoint(); window.showToast?.(copy[locale].saved, 'success'); }
  catch { window.showToast?.(copy[locale].saveError, 'error'); }
});
$('#complete-story').addEventListener('click', async () => {
  if (choices.length !== 5 || moduleCompleted) return;
  const button = $('#complete-story'); button.disabled = true;
  try {
    const response = await fetch(`/api/modules/${slug}/progress`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed: true }) });
    if (!response.ok) throw new Error();
    moduleCompleted = true; $('#story-status').textContent = copy[locale].saved; window.showToast?.(copy[locale].saved, 'success');
  } catch { $('#story-status').textContent = copy[locale].saveError; window.showToast?.(copy[locale].saveError, 'error'); }
  finally { render(); }
});
for (const picker of ['#hero-picker', '#boss-picker']) $(picker).addEventListener('change', createPreview);
$('#refresh-assets').addEventListener('click', () => loadAssetLibrary().catch(() => { $('#asset-status').textContent = copy[locale].assetError; createPreview(); }));

async function init() {
  render();
  loadArtPrompts();
  loadVoiceConfig();
  try {
    const [checkpoint, modules] = await Promise.all([
      fetch(`/api/modules/${slug}/checkpoint?learnerId=${encodeURIComponent(learnerId)}`).then(response => response.json()),
      fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`).then(response => response.json()),
    ]);
    const saved = checkpoint.state?.choices;
    if (Array.isArray(saved)) {
      choices = [];
      for (const choice of saved.slice(0, 5)) {
        if (!copy.en.beats[choices.length].choices.some(option => option[0] === choice)) break;
        choices.push(choice);
      }
    }
    dialogueIndex = checkpoint.state?.dialogueIndex === 1 ? 1 : 0;
    moduleCompleted = Boolean(modules.find(module => module.slug === slug)?.completed);
    render();
  } catch { $('#story-status').textContent = copy[locale].saveError; }
  try { await loadAssetLibrary(); }
  catch { $('#asset-status').textContent = copy[locale].assetError; createPreview(); }
}
init();
