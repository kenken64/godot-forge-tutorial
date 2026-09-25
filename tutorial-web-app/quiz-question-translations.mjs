import { quizQuestionBank } from './quiz-question-bank.mjs';

const categoryNames = {
  zh: { 'Math & Vectors': '数学与向量', 'Physics & Motion': '物理与运动', 'Game Systems': '游戏系统', 'Game History': '电脑游戏史' },
  ms: { 'Math & Vectors': 'Matematik & Vektor', 'Physics & Motion': 'Fizik & Gerakan', 'Game Systems': 'Sistem Permainan', 'Game History': 'Sejarah Permainan Komputer' },
};

// Each entry is [question, four options in the English answer order, explanation].
const zh = {
  '01': ['角色以每秒 60 像素移动 0.5 秒，会移动多远？', ['30 像素', '60 像素', '120 像素', '0.5 像素'], '距离 = 速度 × 时间：60 × 0.5 = 30 像素。'],
  '02': ['速度在 2 秒内从 100 px/s 增至 160 px/s，加速度是多少？', ['30 px/s²', '60 px/s²', '130 px/s²', '320 px/s²'], '加速度 = 速度变化 ÷ 时间：(160 − 100) ÷ 2 = 30 px/s²。'],
  '03': ['如果屏幕坐标的 y 值向下增大，正的重力通常会怎样？', ['使物体向上移动', '增加向下的速度', '停止水平移动', '让时间倒流'], '正的重力会随时间增加向下的速度。'],
  '04': ['为什么要在游戏循环中使用时间差 Δt？', ['放大精灵', '让移动速度不受帧率变化影响', '移除碰撞', '避免使用数字'], '按实际经过的时间计算移动，才能减少帧率对速度的影响。'],
  '05': ['方向向量 (3, 4) 的长度是多少？', ['5', '7', '12', '25'], '使用勾股定理：√(3² + 4²) = 5。'],
  '06': ['8 帧行走动画以每秒 12 帧播放，一次循环约需多久？', ['0.33 秒', '0.67 秒', '1.5 秒', '8 秒'], '时长 = 帧数 ÷ 每秒帧数：8 ÷ 12 ≈ 0.67 秒。'],
  '07': ['为什么要把碰撞检测和碰撞处理分开？', ['改善画面', '先找出重叠，再改变位置或速度', '消除重力', '移除碰撞框'], '检测负责发现接触，处理负责决定物体如何响应。'],
  '08': ['玩家完成了 16 个教程模块中的 5 个，最接近多少百分比？', ['16%', '31%', '50%', '80%'], '5 ÷ 16 × 100 = 31.25%，约为 31%。'],
  '09': ['5 个图块各宽 16 像素，总宽度是多少？', ['21 像素', '64 像素', '80 像素', '160 像素'], '5 × 16 = 80 像素。'],
  '10': ['每秒 24 帧时，0.25 秒大约播放多少帧？', ['3', '6', '12', '24'], '24 × 0.25 = 6 帧。'],
  '11': ['玩家以 −120 px/s 移动 0.25 秒，x 坐标变化多少？', ['−30 px', '+30 px', '−480 px', '+120 px'], 'Δx = 速度 × 时间 = −120 × 0.25 = −30 px。'],
  '12': ['8 列、7 行的精灵图集共有多少格？', ['15', '49', '56', '87'], '列数 × 行数 = 8 × 7 = 56 格。'],
  '13': ['地图宽 20 个图块，每块宽 32 像素，地图有多宽？', ['52 px', '320 px', '640 px', '960 px'], '20 × 32 = 640 像素。'],
  '14': ['角色生命值为 80/100，还剩百分之多少？', ['20%', '80%', '100%', '125%'], '80 ÷ 100 × 100 = 80%。'],
  '15': ['跳跃初速度向上 300 px/s，重力以 600 px/s² 使其减速，多久到最高点？', ['0.25 秒', '0.5 秒', '1 秒', '2 秒'], '到最高点时竖直速度为零，所需时间为 300 ÷ 600 = 0.5 秒。'],
  '16': ['同一次跳跃的最高点比起跳位置高约多少？', ['25 px', '50 px', '75 px', '150 px'], '高度 = 初速度² ÷ (2 × 重力) = 300² ÷ 1200 = 75 像素。'],
  '17': ['玩家以 100 px/s 移动，并以 200 px/s² 减速，多久停下？', ['0.2 秒', '0.5 秒', '2 秒', '20 秒'], '停止时间 = 速度 ÷ 减速度 = 100 ÷ 200 = 0.5 秒。'],
  '18': ['落到实心地面时，竖直方向的碰撞处理通常应怎样做？', ['增加向下速度', '停止向下速度，并把脚放在地面上', '反转水平输入', '使重力加倍'], '地面碰撞处理要防止重叠并停止向下运动。'],
  '19': ['施加相同的力时，质量增加会使加速度怎样变化？', ['增大', '减小', '总是零', '变成负数'], '牛顿第二定律给出 a = F ÷ m；相同的力作用于更大质量时，加速度更小。'],
  '20': ['哪种更新顺序会先把重力加到速度，再移动角色？', ['v += g × Δt；y += v × Δt', 'y += g；v = 0', 'v = y × Δt；g = 0', 'y = v ÷ g'], '一种常见的半隐式更新方式是先更新速度，再用速度更新位置。'],
  '21': ['为什么碰撞模拟常使用固定时间步长？', ['移除所有碰撞', '使物理行为更加一致', '强制使用 8 位画面', '跳过输入处理'], '固定的模拟步长有助于在不同渲染帧率下保持运动和碰撞稳定。'],
  '22': ['把“跳跃”映射为动作，而非写死某个按键，有什么好处？', ['支持重新绑定按键和手柄', '使跳跃高度加倍', '完全消除延迟', '增加动画帧数'], '动作映射让键盘、手柄和自定义按键触发同一个游戏动作。'],
  '23': ['一帧游戏循环的合理顺序是什么？', ['渲染后忽略输入', '读取输入、更新状态、再渲染', '保存素材后退出', '只播放音频'], '基本游戏循环先读取输入，再推进游戏状态，最后绘制结果。'],
  '24': ['在线多人游戏中，为什么可能由服务器决定共享状态？', ['让客户端保持一致并验证操作', '完全消除网络延迟', '替换所有精灵', '禁止本地合作'], '权威服务器可以验证变更，并向玩家分发一致的状态。'],
  '25': ['两名本地玩家共用一个屏幕时，什么是必需的？', ['为每名玩家设置独立输入映射', '所有动作共用一个按键', '不使用相机', '不设碰撞规则'], '独立输入配置让每位玩家控制自己的角色。'],
  '26': ['游戏商店为什么要在扣款前验证购买？', ['避免无效或重复购买', '改变屏幕分辨率', '加快动画', '改变重力'], '应先检查价格、余额和所有权，再更新背包与货币。'],
  '27': ['视差滚动中，远处背景相对于相机通常怎样移动？', ['比前景更快', '通常比前景更慢', '只竖直移动', '完全不动'], '让远处图层移动得更慢，可以营造深度感。'],
  '28': ['为什么精灵动画各帧要使用一致的锚点？', ['避免角色明显抖动', '强制所有精灵为正方形', '移除全部透明区域', '改变帧率'], '稳定的锚点让姿势变化时角色看起来仍在同一位置。'],
  '29': ['平台游戏中，角色碰撞形状应如何匹配精灵？', ['贴合与玩法有关的身体范围，而不是透明或装饰像素', '覆盖整个屏幕', '始终只有一个像素', '每帧随机改变'], '稳定、实用的碰撞体让斗篷和特效不会破坏平台操作手感。'],
  '30': ['本教程导出的精灵坐标资料中，x = 0、y = 0 代表什么？', ['图片左上角', '图片中心', '图片右下角', '相机位置'], '导出的 JSON 使用从 PNG 左上角量起的像素坐标。'],
  '31': ['哪款早期电脑游戏于 1962 年在 MIT 的 PDP-1 上运行？', ['Spacewar!', 'Pong', 'Pac-Man', 'DOOM'], 'Steve Russell 与合作者于 1962 年在 PDP-1 上实现了 Spacewar!。'],
  '32': ['《Tennis for Two》于 1958 年在哪里展示？', ['布鲁克海文国家实验室', '雅达利总部', '任天堂京都办公室', 'MIT 的 PDP-1 实验室'], 'William Higinbotham 为布鲁克海文国家实验室的参观者制作了这款游戏。'],
  '33': ['哪位工程师制作了雅达利最初的《Pong》街机游戏？', ['Allan Alcorn', 'Shigeru Miyamoto', 'John Carmack', 'Alexey Pajitnov'], '雅达利聘请 Allan Alcorn 开发 Pong；游戏于 1972 年推出。'],
  '34': ['谁创作了 1980 年推出的《Pac-Man》？', ['Toru Iwatani', 'Steve Russell', 'Juan Linietsky', 'John Romero'], 'Toru Iwatani 创作了 Pac-Man，并于 1980 年由南梦宫在日本推出。'],
  '35': ['谁于 1984 年首次编写了《Tetris》？', ['Alexey Pajitnov', 'Allan Alcorn', 'Nolan Bushnell', 'William Higinbotham'], 'Alexey Pajitnov 于 1984 年首次编写 Tetris。'],
  '36': ['哪款 1985 年的任天堂游戏成为横向卷轴平台游戏的里程碑？', ['Super Mario Bros.', 'Quake', 'Spacewar!', 'Pong'], '宫本茂的 Super Mario Bros. 于 1985 年首次登陆 Famicom。'],
  '37': ['哪家工作室于 1993 年推出了经典第一人称射击游戏《DOOM》？', ['id Software', 'Atari', 'Namco', 'Godot Foundation'], 'John Carmack 和 John Romero 领导了 id Software 的 DOOM 开发团队。'],
  '38': ['《DOOM》的哪项设计让玩家更容易修改游戏？', ['将引擎功能与美术和游戏数据分离', '移除所有声音', '只制作一关', '禁止共享软件发行'], '将引擎与美术及其他游戏数据分离，使修改游戏更容易。'],
  '39': ['与《DOOM》相比，《Quake》的渲染技术有何突破？', ['实时真 3D 渲染', '完全没有图像', '使用模拟示波器', '只显示文字'], 'Quake 的引擎可以实时渲染真正的 3D 空间。'],
  '40': ['Godot 首次作为开源软件公开发布是哪一年？', ['2004 年', '2014 年', '2020 年', '2024 年'], 'Godot 于 2014 年 1 月宣布首次公开发布，并以 MIT 许可证开放源代码。'],
};

const ms = {
  '01': ['Watak bergerak pada 60 piksel sesaat selama 0.5 saat. Berapa jauh ia bergerak?', ['30 piksel', '60 piksel', '120 piksel', '0.5 piksel'], 'Jarak = halaju × masa: 60 × 0.5 = 30 piksel.'],
  '02': ['Halaju meningkat daripada 100 px/s kepada 160 px/s dalam 2 saat. Berapakah pecutannya?', ['30 px/s²', '60 px/s²', '130 px/s²', '320 px/s²'], 'Pecutan = perubahan halaju ÷ masa: (160 − 100) ÷ 2 = 30 px/s².'],
  '03': ['Jika nilai y pada skrin bertambah ke bawah, apakah kesan graviti positif?', ['Menggerakkan objek ke atas', 'Menambah halaju ke bawah', 'Menghentikan gerakan mendatar', 'Membalikkan masa'], 'Graviti positif menambah halaju ke bawah dari semasa ke semasa.'],
  '04': ['Mengapa gunakan sela masa Δt dalam gelung permainan?', ['Membesarkan sprite', 'Mengekalkan gerakan yang konsisten pada kadar bingkai berbeza', 'Membuang perlanggaran', 'Mengelakkan nombor'], 'Gerakan dikira menggunakan masa sebenar yang berlalu supaya kelajuan kurang bergantung pada kadar bingkai.'],
  '05': ['Berapakah panjang vektor arah (3, 4)?', ['5', '7', '12', '25'], 'Gunakan teorem Pythagoras: √(3² + 4²) = 5.'],
  '06': ['Animasi berjalan 8 bingkai dimainkan pada 12 bingkai sesaat. Berapa lama satu kitaran?', ['0.33 saat', '0.67 saat', '1.5 saat', '8 saat'], 'Tempoh = bilangan bingkai ÷ FPS: 8 ÷ 12 ≈ 0.67 saat.'],
  '07': ['Mengapa pengesanan dan penyelesaian perlanggaran dipisahkan?', ['Mencantikkan grafik', 'Kesan pertindihan dahulu, kemudian ubah kedudukan atau halaju', 'Menghapuskan graviti', 'Membuang kotak perlanggaran'], 'Pengesanan mencari sentuhan; penyelesaian menentukan tindak balas objek.'],
  '08': ['Pemain melengkapkan 5 daripada 16 modul. Berapakah peratus yang paling hampir?', ['16%', '31%', '50%', '80%'], '5 ÷ 16 × 100 = 31.25%, dibundarkan kepada 31%.'],
  '09': ['Lima jubin masing-masing selebar 16 piksel. Berapakah jumlah lebarnya?', ['21 piksel', '64 piksel', '80 piksel', '160 piksel'], '5 × 16 = 80 piksel.'],
  '10': ['Pada 24 bingkai sesaat, kira-kira berapa bingkai dimainkan dalam 0.25 saat?', ['3', '6', '12', '24'], '24 × 0.25 = 6 bingkai.'],
  '11': ['Pemain bergerak pada −120 px/s selama 0.25 saat. Berapakah perubahan x?', ['−30 px', '+30 px', '−480 px', '+120 px'], 'Δx = halaju × masa = −120 × 0.25 = −30 px.'],
  '12': ['Berapa sel terdapat dalam atlas sprite 8 lajur dan 7 baris?', ['15', '49', '56', '87'], 'Lajur × baris = 8 × 7 = 56 sel.'],
  '13': ['Peta mempunyai 20 jubin selebar 32 piksel setiap satu. Berapakah lebar peta?', ['52 px', '320 px', '640 px', '960 px'], '20 × 32 = 640 piksel.'],
  '14': ['Watak mempunyai 80 kesihatan daripada 100. Berapa peratus yang tinggal?', ['20%', '80%', '100%', '125%'], '80 ÷ 100 × 100 = 80%.'],
  '15': ['Lompatan bermula pada 300 px/s ke atas dan graviti memperlahankannya sebanyak 600 px/s². Bilakah titik tertinggi?', ['0.25 saat', '0.5 saat', '1 saat', '2 saat'], 'Masa untuk halaju menegak menjadi sifar ialah 300 ÷ 600 = 0.5 saat.'],
  '16': ['Untuk lompatan yang sama, kira-kira berapa tinggi titik tertinggi dari tempat mula?', ['25 px', '50 px', '75 px', '150 px'], 'Ketinggian = halaju awal² ÷ (2 × graviti) = 300² ÷ 1200 = 75 piksel.'],
  '17': ['Pemain pada 100 px/s memperlahankan gerakan pada 200 px/s². Berapa lama hingga berhenti?', ['0.2 saat', '0.5 saat', '2 saat', '20 saat'], 'Masa berhenti = kelajuan ÷ nyahpecutan = 100 ÷ 200 = 0.5 saat.'],
  '18': ['Apabila mendarat di lantai pepejal, apakah tindak balas perlanggaran menegak yang biasa?', ['Menambah kelajuan ke bawah', 'Menghentikan halaju ke bawah dan meletakkan kaki di lantai', 'Membalikkan input mendatar', 'Menggandakan graviti'], 'Penyelesaian perlanggaran lantai mengelakkan pertindihan dan menghentikan gerakan ke bawah.'],
  '19': ['Dengan daya yang sama, apakah yang berlaku kepada pecutan apabila jisim bertambah?', ['Bertambah', 'Berkurang', 'Sentiasa sifar', 'Menjadi negatif'], 'Hukum kedua Newton memberi a = F ÷ m; jisim lebih besar menghasilkan pecutan lebih kecil bagi daya yang sama.'],
  '20': ['Kemas kini yang mana mengenakan graviti pada halaju sebelum menggerakkan watak?', ['v += g × Δt; y += v × Δt', 'y += g; v = 0', 'v = y × Δt; g = 0', 'y = v ÷ g'], 'Langkah separa tersirat yang biasa mengemas kini halaju dahulu, kemudian kedudukan.'],
  '21': ['Mengapa gunakan langkah masa tetap untuk simulasi perlanggaran?', ['Membuang semua perlanggaran', 'Menjadikan fizik lebih konsisten', 'Memaksa grafik 8-bit', 'Melangkau input'], 'Langkah simulasi yang tetap membantu menstabilkan gerakan dan perlanggaran pada kadar paparan berbeza.'],
  '22': ['Apakah manfaat memetakan Lompat sebagai tindakan dan bukan mengunci satu kekunci?', ['Menyokong pemetaan semula dan pad permainan', 'Menggandakan tinggi lompatan', 'Menghapuskan semua lengah', 'Menambah bingkai animasi'], 'Pemetaan tindakan membolehkan papan kekunci, pad permainan dan kawalan tersuai mencetuskan tindakan yang sama.'],
  '23': ['Apakah urutan yang sesuai bagi satu bingkai gelung permainan?', ['Papar, kemudian abaikan input', 'Baca input, kemas kini keadaan, kemudian papar', 'Simpan aset, kemudian keluar', 'Mainkan audio sahaja'], 'Gelung asas membaca input, mengemas kini keadaan permainan, kemudian memaparkan hasilnya.'],
  '24': ['Dalam permainan berbilang pemain dalam talian, mengapa pelayan mungkin mengawal keadaan bersama?', ['Menyelaraskan klien dan mengesahkan tindakan', 'Menghapuskan semua lengah rangkaian', 'Menggantikan semua sprite', 'Menghalang kerjasama setempat'], 'Pelayan berautoriti mengesahkan perubahan dan mengedarkan keadaan yang konsisten kepada pemain.'],
  '25': ['Apakah yang penting apabila dua pemain setempat berkongsi satu skrin?', ['Pemetaan input berasingan bagi setiap pemain', 'Satu butang untuk semua tindakan', 'Tiada kamera', 'Tiada peraturan perlanggaran'], 'Profil input berasingan membolehkan setiap pemain mengawal watak sendiri.'],
  '26': ['Mengapa kedai permainan perlu mengesahkan pembelian sebelum menolak mata wang?', ['Mengelakkan pembelian tidak sah atau berganda', 'Menukar resolusi skrin', 'Mempercepat animasi', 'Mengubah graviti'], 'Semak harga, baki dan pemilikan sebelum mengemas kini inventori dan mata wang.'],
  '27': ['Dalam tatalan paralaks, bagaimana lapisan latar jauh biasanya bergerak berbanding kamera?', ['Lebih laju daripada latar depan', 'Biasanya lebih perlahan daripada latar depan', 'Menegak sahaja', 'Tidak bergerak langsung'], 'Lapisan jauh yang bergerak lebih perlahan mewujudkan ilusi kedalaman.'],
  '28': ['Mengapa titik sauh perlu konsisten antara bingkai sprite?', ['Mengelakkan watak kelihatan bergegar', 'Memaksa semua sprite berbentuk segi empat sama', 'Membuang semua ketelusan', 'Mengubah kadar bingkai'], 'Titik sauh yang tetap mengekalkan kedudukan watak apabila posenya berubah.'],
  '29': ['Bagaimana bentuk perlanggaran platformer patut berkaitan dengan sprite watak?', ['Padan dengan badan yang penting untuk permainan, bukan setiap piksel hiasan atau lutsinar', 'Menutup seluruh skrin', 'Sentiasa satu piksel', 'Berubah secara rawak setiap bingkai'], 'Bentuk perlanggaran yang stabil menjadikan permainan boleh dijangka walaupun seni mempunyai jubah atau kesan.'],
  '30': ['Dalam metadata sprite tutorial ini, apakah maksud x = 0, y = 0?', ['Penjuru kiri atas imej', 'Pusat imej', 'Penjuru kanan bawah imej', 'Kedudukan kamera'], 'JSON yang dieksport menggunakan koordinat piksel dari penjuru kiri atas PNG.'],
  '31': ['Permainan komputer awal manakah berjalan pada PDP-1 di MIT pada 1962?', ['Spacewar!', 'Pong', 'Pac-Man', 'DOOM'], 'Steve Russell dan rakan-rakan merealisasikan Spacewar! pada PDP-1 pada tahun 1962.'],
  '32': ['Di manakah Tennis for Two dipamerkan pada 1958?', ['Makmal Kebangsaan Brookhaven', 'Ibu pejabat Atari', 'Pejabat Nintendo di Kyoto', 'Makmal PDP-1 MIT'], 'William Higinbotham membinanya untuk pelawat Makmal Kebangsaan Brookhaven.'],
  '33': ['Jurutera manakah membina permainan arked Pong asal Atari?', ['Allan Alcorn', 'Shigeru Miyamoto', 'John Carmack', 'Alexey Pajitnov'], 'Atari mengambil Allan Alcorn untuk membina Pong, yang dikeluarkan pada 1972.'],
  '34': ['Siapakah pencipta Pac-Man yang dikeluarkan pada 1980?', ['Toru Iwatani', 'Steve Russell', 'Juan Linietsky', 'John Romero'], 'Toru Iwatani mencipta Pac-Man, yang dikeluarkan oleh Namco di Jepun pada 1980.'],
  '35': ['Siapakah yang mula-mula memprogram Tetris pada 1984?', ['Alexey Pajitnov', 'Allan Alcorn', 'Nolan Bushnell', 'William Higinbotham'], 'Alexey Pajitnov mula-mula memprogram Tetris pada 1984.'],
  '36': ['Permainan Nintendo 1985 manakah menjadi mercu tanda platformer tatal sisi?', ['Super Mario Bros.', 'Quake', 'Spacewar!', 'Pong'], 'Super Mario Bros. oleh Shigeru Miyamoto mula muncul pada Famicom pada 1985.'],
  '37': ['Studio manakah mengeluarkan permainan penembak orang pertama DOOM pada 1993?', ['id Software', 'Atari', 'Namco', 'Godot Foundation'], 'John Carmack dan John Romero mengetuai pasukan DOOM di id Software.'],
  '38': ['Pilihan reka bentuk DOOM yang manakah memudahkan pemain mengubah suai permainan?', ['Memisahkan fungsi enjin daripada seni dan data permainan', 'Membuang semua bunyi', 'Menggunakan satu tahap sahaja', 'Melarang edaran perisian kongsi'], 'Memisahkan enjin daripada seni dan data lain memudahkan pengubahsuaian permainan.'],
  '39': ['Apakah kemajuan paparan Quake berbanding DOOM?', ['Paparan 3D sebenar dalam masa nyata', 'Tiada grafik langsung', 'Osiloskop analog', 'Aksara teks sahaja'], 'Enjin Quake memaparkan ruang 3D sebenar dalam masa nyata.'],
  '40': ['Pada tahun berapakah Godot mula dikeluarkan kepada umum sebagai perisian sumber terbuka?', ['2004', '2014', '2020', '2024'], 'Keluaran awam pertama Godot dan pembukaan kod sumber berlesen MIT diumumkan pada Januari 2014.'],
};

function build(locale, entries) {
  return Object.fromEntries(quizQuestionBank.map(item => {
    const key = item.id.slice(-2);
    const values = entries[key];
    if (!values || values[1].length !== item.options.length) throw new Error(`Missing or invalid ${locale} quiz translation: ${item.id}`);
    return [item.id, { category: categoryNames[locale][item.category], question: values[0], options: values[1], explanation: values[2] }];
  }));
}

export const quizQuestionTranslations = { zh: build('zh', zh), ms: build('ms', ms) };
