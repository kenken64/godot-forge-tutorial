(() => {
  const learnerId = localStorage.getItem('godot-forge-learner-id') || 'local-player';
  const storageKey = `godot-forge-marketplace:${learnerId}`;
  const messages = {
    en: { introEyebrow:'PLAYER ECONOMY / SHOP DEMO', label:'GROVE TRADER · PRACTICE SHOP', title:'The Grove Exchange', intro:'Trade forest-forged gear, sell what you no longer need, or pay a small fee to salvage it into enchanting materials.', gold:'gold', dust:'arcane dust', all:'All gear', armor:'Armor', weapon:'Weapons', ring:'Rings', necklace:'Necklaces', gradeLabel:'GRADE', gradeAll:'All grades', normal:'Normal', rare:'Rare', epic:'Epic', inventoryLabel:'YOUR PACK', inventoryTitle:'Owned gear', empty:'Your pack is empty. Buy an item to get started.', buy:'Buy', owned:'Owned', sell:'Sell', salvage:'Salvage', fee:'fee', earns:'get', yields:'yields', noGold:'Not enough gold for this transaction.', alreadyOwned:'You already own this piece of gear.', bought:'Purchased and added to your pack.', sold:'Sold for', salvaged:'Salvaged into enchanting materials.', promptSummary:'OpenAI GPT Image 2.5 Burst · view and copy the gear-art prompts', promptDescription:'These reusable prompts describe the four generated shop icons. Change language above to read them in Chinese or Malay.', copy:'Copy prompt', copied:'Prompt copied.', copyError:'Could not copy the prompt.', salvageHint:'Salvaging consumes the item and charges a gold fee. It cannot be undone.', confirmSalvage:'Salvage this item for', slot:{armor:'Armor',weapon:'Weapon',ring:'Ring',necklace:'Necklace'} },
    zh: { introEyebrow:'玩家经济 / 商店演示', label:'林地商人 · 交易练习', title:'林地集市', intro:'交易林地锻造的装备，出售不再需要的物品，或支付少量金币将其分解为附魔材料。', gold:'金币', dust:'奥术粉尘', all:'全部装备', armor:'护甲', weapon:'武器', ring:'戒指', necklace:'项链', gradeLabel:'品质', gradeAll:'全部品质', normal:'普通', rare:'稀有', epic:'史诗', inventoryLabel:'你的背包', inventoryTitle:'已拥有的装备', empty:'背包目前是空的。购买一件装备开始体验吧。', buy:'购买', owned:'已拥有', sell:'出售', salvage:'分解', fee:'费用', earns:'获得', yields:'产出', noGold:'金币不足，无法完成此交易。', alreadyOwned:'你已经拥有这件装备。', bought:'购买成功，装备已放入背包。', sold:'出售成功，获得', salvaged:'分解完成，已获得附魔材料。', promptSummary:'OpenAI GPT Image 2.5 Burst · 查看并复制装备美术提示词', promptDescription:'以下可重复使用的提示词描述了四款已生成的商店图标。切换上方语言即可查看中文或马来语版本。', copy:'复制提示词', copied:'提示词已复制。', copyError:'无法复制提示词。', salvageHint:'分解会消耗该装备并扣除金币费用，且无法撤销。', confirmSalvage:'支付以下费用分解此物品：', slot:{armor:'护甲',weapon:'武器',ring:'戒指',necklace:'项链'} },
    ms: { introEyebrow:'EKONOMI PEMAIN / DEMO KEDAI', label:'PEDAGANG RIMBA · KEDAI LATIHAN', title:'Pasar Rimba', intro:'Dagangkan kelengkapan tempa rimba, jual barangan yang tidak diperlukan, atau bayar sedikit emas untuk meleraikannya menjadi bahan pempesonaan.', gold:'emas', dust:'debu arkana', all:'Semua gear', armor:'Perisai', weapon:'Senjata', ring:'Cincin', necklace:'Rantai leher', gradeLabel:'GRED', gradeAll:'Semua gred', normal:'Biasa', rare:'Langka', epic:'Epik', inventoryLabel:'BEKALAN ANDA', inventoryTitle:'Kelengkapan milik anda', empty:'Bekalan anda kosong. Beli satu item untuk bermula.', buy:'Beli', owned:'Dimiliki', sell:'Jual', salvage:'Leraikan', fee:'yuran', earns:'dapat', yields:'hasil', noGold:'Emas tidak mencukupi untuk urus niaga ini.', alreadyOwned:'Anda sudah memiliki kelengkapan ini.', bought:'Pembelian berjaya. Item ditambah ke dalam bekalan.', sold:'Dijual dengan hasil', salvaged:'Selesai dileraikan menjadi bahan pempesonaan.', promptSummary:'OpenAI GPT Image 2.5 Burst · lihat dan salin prompt seni gear', promptDescription:'Prompt boleh guna semula ini menerangkan empat ikon kedai yang dijana. Tukar bahasa di atas untuk melihat versi Cina atau Melayu.', copy:'Salin prompt', copied:'Prompt telah disalin.', copyError:'Prompt tidak dapat disalin.', salvageHint:'Meleraikan akan menggunakan item dan mengenakan yuran emas. Tindakan ini tidak boleh dibatalkan.', confirmSalvage:'Leraikan item ini dengan bayaran', slot:{armor:'Perisai',weapon:'Senjata',ring:'Cincin',necklace:'Rantai leher'} },
  };
  const items = [
    { id:'mossweave-armor', type:'armor', grade:'normal', image:'mossweave-armor.webp', price:145, sale:74, fee:18, dust:5, name:{en:'Mossweave Mantle',zh:'苔纹披甲',ms:'Mantel Anyaman Lumut'}, desc:{en:'Leaf-layered leather armor, light on the trail.',zh:'层叠叶片与皮革制成，轻盈耐用。',ms:'Perisai kulit berlapis daun yang ringan untuk meredah denai.'} },
    { id:'leafsteel-sword', type:'weapon', grade:'normal', image:'leafsteel-sword.webp', price:165, sale:86, fee:22, dust:6, name:{en:'Leafsteel Blade',zh:'叶钢剑',ms:'Pedang Keluli Daun'}, desc:{en:'A balanced blade set with a grove emerald.',zh:'镶嵌林地翡翠，攻守平衡的长剑。',ms:'Pedang seimbang berhias zamrud rimba.'} },
    { id:'emerald-ring', type:'ring', grade:'normal', image:'emerald-ring.webp', price:82, sale:42, fee:12, dust:3, name:{en:'Verdant Signet',zh:'翠绿徽戒',ms:'Cincin Mohor Hijau'}, desc:{en:'A modest ring with a softly glowing green gem.',zh:'镶有柔和发光绿宝石的精致戒指。',ms:'Cincin ringkas dengan permata hijau bercahaya lembut.'} },
    { id:'heartseed-necklace', type:'necklace', grade:'normal', image:'heartseed-necklace.webp', price:98, sale:51, fee:14, dust:4, name:{en:'Heartseed Pendant',zh:'心种吊坠',ms:'Loket Benih Jantung'}, desc:{en:'An old bronze charm warmed by a heartseed.',zh:'被心种温暖的古铜护身符。',ms:'Azimat gangsa lama yang dihangatkan benih jantung.'} },
    { id:'moonfern-cuirass', type:'armor', grade:'rare', image:'mossweave-armor.webp', price:285, sale:148, fee:32, dust:10, name:{en:'Moonfern Cuirass',zh:'月蕨胸甲',ms:'Kuiras Pakis Bulan'}, desc:{en:'Reinforced fern scales shimmer in moonlight.',zh:'加固的蕨叶甲片在月光下闪烁。',ms:'Sisik pakis bertetulang berkilau di bawah sinar bulan.'} },
    { id:'silverbranch-saber', type:'weapon', grade:'rare', image:'leafsteel-sword.webp', price:320, sale:166, fee:36, dust:12, name:{en:'Silverbranch Saber',zh:'银枝军刀',ms:'Pedang Cabang Perak'}, desc:{en:'A quicksilver edge etched with old runes.',zh:'刻有古老符文的灵巧银刃。',ms:'Bilah pantas berukir tulisan runik purba.'} },
    { id:'dewdrop-circlet', type:'ring', grade:'rare', image:'emerald-ring.webp', price:172, sale:89, fee:22, dust:7, name:{en:'Dewdrop Circlet',zh:'露珠指环',ms:'Cincin Titisan Embun'}, desc:{en:'A clear gem holds a drop of enchanted dew.',zh:'清澈宝石中封存着一滴魔法露珠。',ms:'Permata jernih menyimpan setitis embun berpesona.'} },
    { id:'willowheart-amulet', type:'necklace', grade:'rare', image:'heartseed-necklace.webp', price:205, sale:106, fee:25, dust:8, name:{en:'Willowheart Amulet',zh:'柳心护符',ms:'Azimat Hati Dedalu'}, desc:{en:'Willowwood and silver guard a pulsing seed.',zh:'柳木与白银守护着一枚脉动的种子。',ms:'Kayu dedalu dan perak melindungi benih berdenyut.'} },
    { id:'canopy-warden-plate', type:'armor', grade:'epic', image:'mossweave-armor.webp', price:520, sale:270, fee:58, dust:20, name:{en:'Canopy Warden Plate',zh:'树冠守卫板甲',ms:'Perisai Plat Pengawal Kanopi'}, desc:{en:'Ancient grove-iron plates protect the canopy guard.',zh:'古老林铁板甲，守护树冠卫士。',ms:'Plat besi rimba purba melindungi pengawal kanopi.'} },
    { id:'sunroot-greatblade', type:'weapon', grade:'epic', image:'leafsteel-sword.webp', price:590, sale:306, fee:66, dust:22, name:{en:'Sunroot Greatblade',zh:'日根巨剑',ms:'Pedang Besar Akar Suria'}, desc:{en:'A radiant two-handed blade fueled by sunroot.',zh:'由日根之力驱动的辉光双手巨剑。',ms:'Pedang dua tangan bercahaya yang dikuasakan akar suria.'} },
    { id:'starfall-loop', type:'ring', grade:'epic', image:'emerald-ring.webp', price:335, sale:174, fee:41, dust:14, name:{en:'Starfall Loop',zh:'星陨之环',ms:'Lingkaran Bintang Jatuh'}, desc:{en:'A fragment of starlight circles the emerald.',zh:'一缕星光环绕着翡翠流转。',ms:'Serpihan cahaya bintang mengelilingi zamrud.'} },
    { id:'ancient-grove-locket', type:'necklace', grade:'epic', image:'heartseed-necklace.webp', price:390, sale:202, fee:46, dust:16, name:{en:'Ancient Grove Locket',zh:'远古林地吊坠',ms:'Loket Rimba Purba'}, desc:{en:'A relic that hums with the forest’s oldest magic.',zh:'蕴含森林最古老魔力的遗物。',ms:'Relik yang bergetar dengan sihir rimba tertua.'} },
  ];
  const prompts = [
    { title:{en:'Armor · Mossweave Mantle',zh:'护甲 · 苔纹披甲',ms:'Perisai · Mantel Anyaman Lumut'}, text:{en:'Create one premium armor icon for a fantasy grove adventure: elegant moss-green leather chest armor layered with small leaves and tiny gold clasps. Isolated single item, centered, full silhouette visible, transparent background, polished hand-painted 2D game asset, crisp at small inventory size, deep emerald and forest green with warm gold accents. No text, no character, no mannequin, no background, no watermark.',zh:'为奇幻林地冒险创作一枚精致护甲图标：苔绿色皮革胸甲，点缀层叠小叶片和细小金色搭扣。单件物品，居中展示，轮廓完整，透明背景，精致手绘 2D 游戏美术风格，缩小后仍清晰；深翡翠绿与森林绿，搭配暖金色。不要文字、角色、人体模型、背景或水印。',ms:'Cipta satu ikon perisai premium untuk pengembaraan rimba fantasi: perisai dada kulit hijau lumut yang elegan, berlapis daun kecil dengan pengancing emas halus. Satu item sahaja, di tengah, siluet penuh kelihatan, latar telus, seni permainan 2D lukisan tangan yang kemas dan jelas pada saiz inventori kecil; warna zamrud dan hijau rimba dengan aksen emas hangat. Tanpa teks, watak, patung, latar atau tera air.'} },
    { title:{en:'Weapon · Leafsteel Blade',zh:'武器 · 叶钢剑',ms:'Senjata · Pedang Keluli Daun'}, text:{en:'Create one iconic enchanted short sword for a bright forest-adventure game: graceful leaf-shaped steel blade and a small emerald jewel in the hilt. Isolated single weapon, diagonal pose, full silhouette visible, transparent background, polished hand-painted 2D fantasy game asset, crisp at small UI size, silver steel, emerald grip and restrained gold details. No text, no hand, no extra objects, no background, no watermark.',zh:'为明亮的森林冒险游戏创作一把标志性的附魔短剑：优雅的叶形钢刃，剑柄上镶有一颗小翡翠。单件武器，斜向构图，轮廓完整，透明背景，精致手绘 2D 奇幻游戏美术风格，缩小后仍清晰；银色钢刃、翡翠色剑柄和克制的金色细节。不要文字、手、其他物品、背景或水印。',ms:'Cipta satu pedang pendek berpesona yang ikonik untuk permainan pengembaraan hutan yang ceria: bilah keluli berbentuk daun yang anggun dengan permata zamrud kecil pada hulunya. Satu senjata sahaja, kedudukan menyerong, siluet penuh kelihatan, latar telus, seni permainan fantasi 2D lukisan tangan yang kemas dan jelas pada saiz UI kecil; keluli perak, genggaman zamrud dan perincian emas yang sederhana. Tanpa teks, tangan, objek tambahan, latar atau tera air.'} },
    { title:{en:'Ring · Verdant Signet',zh:'戒指 · 翠绿徽戒',ms:'Cincin · Cincin Mohor Hijau'}, text:{en:'Create one magical ring for a forest adventure: an elegant antique-gold band holding a luminous green leaf-shaped gemstone. Single ring only, slight three-quarter angle, fully visible and centered, transparent background, polished hand-painted 2D fantasy game art, clear at tiny inventory scale. Subtle contained glow. No text, fingers, box, background, or watermark.',zh:'为森林冒险创作一枚魔法戒指：优雅的古金色戒圈，镶嵌发光的叶形绿宝石。仅一枚戒指，轻微三分之四视角，居中且完整可见，透明背景，精致手绘 2D 奇幻游戏美术，缩至背包小图标后仍清晰；微弱且集中的光芒。不要文字、手指、盒子、背景或水印。',ms:'Cipta satu cincin ajaib untuk pengembaraan hutan: lingkaran emas antik yang elegan dengan permata hijau bercahaya berbentuk daun. Satu cincin sahaja, sudut tiga suku sedikit, penuh dan di tengah, latar telus, seni permainan fantasi 2D lukisan tangan yang kemas dan jelas pada skala inventori kecil. Cahaya lembut dan terkawal. Tanpa teks, jari, kotak, latar atau tera air.'} },
    { title:{en:'Necklace · Heartseed Pendant',zh:'项链 · 心种吊坠',ms:'Rantai leher · Loket Benih Jantung'}, text:{en:'Create one enchanted necklace for a forest adventure: a fine dark leather cord holding a small glowing amber-green heartseed pendant in a leaf-shaped bronze setting. Arrange the loop neatly with pendant at bottom center; whole necklace visible, isolated on transparent background, polished hand-painted 2D game art, readable inventory silhouette. No person, neck, mannequin, text, background, or watermark.',zh:'为森林冒险创作一条附魔项链：深色细皮绳，悬挂一枚发光的琥珀绿心种吊坠，并以叶形青铜托座镶嵌。项链环整齐摆放，吊坠位于底部中央；整体完整可见，透明背景，精致手绘 2D 游戏美术，背包图标轮廓清晰。不要人物、脖子、人体模型、文字、背景或水印。',ms:'Cipta satu rantai leher berpesona untuk pengembaraan hutan: tali kulit gelap yang halus dengan loket benih jantung kecil bercahaya warna ambar-hijau dalam tetapan gangsa berbentuk daun. Susun gelung dengan kemas dan loket di tengah bawah; keseluruhan rantai kelihatan, latar telus, seni permainan 2D lukisan tangan yang kemas dengan siluet inventori yang jelas. Tanpa orang, leher, patung, teks, latar atau tera air.'} },
  ];
  let locale = localStorage.getItem('godot-forge-locale') || 'en';
  if (!messages[locale]) locale = 'en';
  let category = 'all';
  let grade = 'all';
  const readState = () => {
    try { const saved = JSON.parse(localStorage.getItem(storageKey)); if (saved && Number.isFinite(saved.gold) && Array.isArray(saved.inventory)) return { gold:saved.gold, dust:Number(saved.dust)||0, inventory:saved.inventory.filter(id => id === 'starter-coat' || items.some(item => item.id === id)) }; } catch {}
    return { gold:300, dust:0, inventory:['starter-coat'] };
  };
  let state = readState();
  const starter = { id:'starter-coat', type:'armor', grade:'normal', image:'mossweave-armor.webp', sale:55, fee:12, dust:3, name:{en:'Trailkeeper Coat',zh:'巡林者外套',ms:'Kot Penjaga Denai'}, desc:{en:'Your well-worn starting coat.',zh:'陪伴你启程的旧外套。',ms:'Kot lama yang menemani permulaan anda.'} };
  const byId = id => id === starter.id ? starter : items.find(item => item.id === id);
  const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const formatGold = value => `${value} 🪙`;
  function render() {
    const t = messages[locale];
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    document.querySelectorAll('[data-market]').forEach(el => { const key = el.dataset.market; if (t[key]) el.textContent = t[key]; });
    document.querySelector('.gear-tabs').setAttribute('aria-label', ({en:'Gear category',zh:'装备类别',ms:'Kategori kelengkapan'})[locale]);
    document.querySelector('.grade-tabs').setAttribute('aria-label', ({en:'Item grade',zh:'物品品质',ms:'Gred item'})[locale]);
    document.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-selected', String(button.dataset.category === category)));
    document.querySelectorAll('[data-grade]').forEach(button => button.setAttribute('aria-selected', String(button.dataset.grade === grade)));
    document.querySelector('#gold-count').textContent = state.gold;
    document.querySelector('#dust-count').textContent = state.dust;
    const available = items.filter(item => (category === 'all' || item.type === category) && (grade === 'all' || item.grade === grade));
    document.querySelector('#shop-items').innerHTML = available.map(item => {
      const owned = state.inventory.includes(item.id);
      return `<article class="gear-card rarity-${item.grade}"><div class="gear-art"><img src="https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/marketplace-system/images/${item.image}" alt="${safe(item.name[locale])}" /></div><div class="gear-card-copy"><div class="gear-labels"><span class="gear-type">${safe(t.slot[item.type])}</span><span class="rarity-badge rarity-${item.grade}">${t[item.grade]}</span></div><h3>${safe(item.name[locale])}</h3><p>${safe(item.desc[locale])}</p><div class="gear-values"><span>${formatGold(item.price)}</span><small>${t.earns} ${formatGold(item.sale)} · ${t.fee} ${formatGold(item.fee)}</small></div><button class="trade-button" data-action="buy" data-item="${item.id}" ${owned || state.gold < item.price ? 'disabled' : ''}>${owned ? t.owned : `${t.buy} · ${item.price} 🪙`}</button></div></article>`;
    }).join('');
    document.querySelector('#inventory-count').textContent = state.inventory.length;
    document.querySelector('#inventory-items').innerHTML = state.inventory.length ? state.inventory.map(id => {
      const item = byId(id); if (!item) return '';
      return `<article class="owned-card rarity-${item.grade}"><img src="https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/marketplace-system/images/${item.image}" alt="" /><div class="owned-copy"><div class="gear-labels"><span class="gear-type">${safe(t.slot[item.type])}</span><span class="rarity-badge rarity-${item.grade}">${t[item.grade]}</span></div><strong>${safe(item.name[locale])}</strong><small>${t.earns} ${formatGold(item.sale)} · ${t.fee} ${formatGold(item.fee)} → ${item.dust} ✧</small></div><div class="owned-actions"><button data-action="sell" data-item="${id}">${t.sell} · ${item.sale} 🪙</button><button class="salvage-button" data-action="salvage" data-item="${id}" ${state.gold < item.fee ? 'disabled' : ''}>${t.salvage} · ${item.fee} 🪙 → ${item.dust} ✧</button></div></article>`;
    }).join('') : `<p class="inventory-empty">${t.empty}</p>`;
    document.querySelector('#asset-prompts').innerHTML = prompts.map((prompt,index) => `<article class="prompt-card"><h3>${safe(prompt.title[locale])}</h3><textarea readonly rows="5" aria-label="${safe(prompt.title[locale])}">${safe(prompt.text[locale])}</textarea><button type="button" data-copy-prompt="${index}">${t.copy}</button></article>`).join('');
  }
  function save() { localStorage.setItem(storageKey, JSON.stringify(state)); }
  document.addEventListener('click', async event => {
    const tab = event.target.closest('[data-category]');
    if (tab) { category = tab.dataset.category; render(); return; }
    const gradeTab = event.target.closest('[data-grade]');
    if (gradeTab) { grade = gradeTab.dataset.grade; render(); return; }
    const copy = event.target.closest('[data-copy-prompt]');
    if (copy) {
      try { await navigator.clipboard.writeText(prompts[Number(copy.dataset.copyPrompt)].text[locale]); window.showToast?.(messages[locale].copied, 'success'); }
      catch { window.showToast?.(messages[locale].copyError, 'error'); }
      return;
    }
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    const t = messages[locale], itemId = button.dataset.item, action = button.dataset.action;
    if (action === 'buy') {
      const item = items.find(row => row.id === itemId);
      if (!item || state.inventory.includes(itemId)) { window.showToast?.(t.alreadyOwned, 'error'); return; }
      if (state.gold < item.price) { window.showToast?.(t.noGold, 'error'); return; }
      state.gold -= item.price; state.inventory.push(itemId); window.showToast?.(t.bought, 'success');
    } else {
      const index = state.inventory.indexOf(itemId), item = byId(itemId);
      if (index < 0 || !item) return;
      if (action === 'sell') { state.inventory.splice(index,1); state.gold += item.sale; window.showToast?.(`${t.sold} ${formatGold(item.sale)}.`, 'success'); }
      if (action === 'salvage') {
        if (state.gold < item.fee) { window.showToast?.(t.noGold, 'error'); return; }
        state.gold -= item.fee; state.dust += item.dust; state.inventory.splice(index,1); window.showToast?.(t.salvaged, 'success');
      }
    }
    save(); render();
  });
  window.addEventListener('godot-forge-module-reset', event => { if (event.detail?.slug === 'marketplace-system') { localStorage.removeItem(storageKey); state = { gold:300, dust:0, inventory:['starter-coat'] }; category = 'all'; grade = 'all'; render(); } });
  new MutationObserver(() => { const next = localStorage.getItem('godot-forge-locale') || 'en'; if (messages[next] && next !== locale) { locale = next; render(); } }).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
  render();
})();
