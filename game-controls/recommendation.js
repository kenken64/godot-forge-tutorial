(() => {
  const content = {
    en: {
      eyebrow: 'OPTIONAL HARDWARE PICK',
      title: 'Recommended mini gamepad',
      description: 'The 8BitDo Zero 2 Bluetooth Gamepad is a pocket-size mini controller for trying physical button input. Check the listing for device compatibility and current details before purchasing.',
      note: 'Amazon listing · Price and availability may vary by region.',
      link: 'VIEW ON AMAZON ↗',
    },
    zh: {
      eyebrow: '可选硬件推荐',
      title: '推荐迷你游戏手柄',
      description: '8BitDo Zero 2 蓝牙游戏手柄是一款口袋大小的迷你手柄，可用于测试实体按键输入。购买前请在商品页面确认设备兼容性和商品详情。',
      note: 'Amazon 商品页 · 价格和库存可能因地区而异。',
      link: '前往 Amazon ↗',
    },
    ms: {
      eyebrow: 'CADANGAN PERKAKAS PILIHAN',
      title: 'Cadangan pad permainan mini',
      description: 'Pad Permainan Bluetooth 8BitDo Zero 2 ialah alat kawalan mini sebesar poket untuk mencuba input butang fizikal. Semak keserasian peranti dan maklumat terkini pada halaman produk sebelum membeli.',
      note: 'Halaman Amazon · Harga dan ketersediaan mungkin berbeza mengikut rantau.',
      link: 'LIHAT DI AMAZON ↗',
    },
  };
  const link = 'https://www.amazon.com/dp/B081HML6MP?th=1';
  function render(locale) {
    const copy = content[locale] || content.en;
    document.getElementById('gamepad-recommendation-eyebrow').textContent = copy.eyebrow;
    document.getElementById('gamepad-recommendation-title').textContent = copy.title;
    document.getElementById('gamepad-recommendation-copy').textContent = copy.description;
    document.getElementById('gamepad-recommendation-note').textContent = copy.note;
    const action = document.getElementById('gamepad-buy-link');
    action.textContent = copy.link;
    action.href = link;
  }
  render(localStorage.getItem('godot-forge-locale') || 'en');
  document.addEventListener('click', event => {
    const locale = event.target.closest('[data-locale]')?.dataset.locale;
    if (locale) render(locale);
  });
})();
