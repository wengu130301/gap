/* =========================================================
   GuDongPet 咕咚桌宠 · 官網腳本
   原生 JS，無框架。結構：
     1. 可變數據配置（GUDONG）
     2. 三語字典（I18N）
     3. 幾何咕咚生成器（SVG clip-path 鏤空）
     4. 渲染器（功能磁貼 / 桌面場景 / 氣泡 / 皮膚 / 日誌）
     5. 交互（語言切換 / 導航 / 視差 / 漣漪 / 觀察器）
   ========================================================= */
(function () {
  "use strict";

  /* =======================================================
     1. 可變數據配置
     全頁所有可變内容從此讀取；文案由 I18N 提供三語版本
     ======================================================= */
  const GUDONG = {
    name: "咕咚",
    nameEn: "GuDongPet",
    brand: "LaswI Studio",
    version: "v1.0.0",
    downloadUrl: "#download",
    /* 下載按鈕文案：優先讀此配置，缺語言時回落 I18N */
    downloadLabel: {
      "zh-Hans": "下载咕咚",
      "zh-Hant": "下載咕咚",
      "en": "Download GuDong"
    },
    releaseDate: "2026-11-04",
    platforms: ["macOS (Apple Silicon)", "Windows x64"],
    emails: ["3199704668@qq.com", "1828236908@qq.com"],

    /* 安装包：全部為真實產物，檔名與根目錄一致，點擊即可下載 */
    downloads: [
      { id: "mac", os: "macOS", arch: "Apple Silicon · arm64", size: "132 MB",
        file: "咕咚桌宠-1.0.0-arm64.dmg", icon: "laptop_mac" },
      { id: "win", os: "Windows", arch: "x64 · 10 / 11", size: "95 MB",
        file: "GudongPet-Setup-1.0.0.exe", icon: "desktop_windows" }
    ],

    /* 功能磁貼：tone = tonal 配色；span = 版面佔位 */
    features: [
      { id: "chat",   icon: "chat_bubble",     tone: "coral", span: "wide" },
      { id: "feed",   icon: "restaurant",      tone: "mint",  span: "" },
      { id: "walk",   icon: "directions_walk", tone: "lav",   span: "" },
      { id: "drag",   icon: "pan_tool_alt",    tone: "lemon", span: "" },
      { id: "stats",  icon: "favorite",        tone: "peach", span: "wide" },
      { id: "play",   icon: "sports_esports",  tone: "cream", span: "" },
      { id: "vision", icon: "image",           tone: "lav",   span: "" },
      { id: "tray",   icon: "dock_to_bottom",  tone: "mint",  span: "" }
    ],

    /* 桌面場景：色塊全部用數據描述
       → 日後把 mode 改為 "image" 並填 image 欄位，即可替換為真實截圖或 GIF */
    scenes: [
      {
        id: "night", mode: "geometry", span: 2, pose: "sign", bg: "#2B2430", image: null,
        elements: [
          { x: 5, y: 10, w: 52, h: 70, r: 18, color: "#3A3242" },
          { x: 7.5, y: 13.5, w: 1.6, h: 2.8, r: 50, color: "#FF8A65" },
          { x: 9.7, y: 13.5, w: 1.6, h: 2.8, r: 50, color: "#FFD54F" },
          { x: 11.9, y: 13.5, w: 1.6, h: 2.8, r: 50, color: "#81C784" },
          { x: 8, y: 22, w: 16, h: 3.4, r: 3, color: "#FF8A65" },
          { x: 8, y: 29, w: 26, h: 3.4, r: 3, color: "#81C784" },
          { x: 11, y: 36, w: 20, h: 3.4, r: 3, color: "#FFD54F" },
          { x: 8, y: 43, w: 30, h: 3.4, r: 3, color: "#B39DDB" },
          { x: 11, y: 50, w: 14, h: 3.4, r: 3, color: "#FFAB91" },
          { x: 8, y: 57, w: 24, h: 3.4, r: 3, color: "#81C784" },
          { x: 8, y: 64, w: 11, h: 3.4, r: 3, color: "#FFD54F" },
          { x: 70, y: 14, w: 8, h: 8, r: 50, color: "#FFD54F", opacity: 0.9 },
          { x: 84, y: 56, w: 6, h: 9, r: 4, color: "#FFAB91" },
          { x: 64, y: 72, w: 24, h: 3, r: 3, color: "#4A4054" }
        ],
        pet: { x: 62, y: 42, w: 20 }
      },
      {
        id: "walk", mode: "geometry", span: 1, pose: "stand", bg: "#FFF3E6", image: null,
        elements: [
          { x: 6, y: 10, w: 34, h: 50, r: 14, color: "#FFDCCB" },
          { x: 6, y: 10, w: 34, h: 7, r: 14, color: "#FFC9AE" },
          { x: 47, y: 12, w: 13, h: 15, r: 8, color: "#FFF6E5" },
          { x: 63, y: 14, w: 9, h: 11, r: 6, color: "#FFF6E5" },
          { x: 0, y: 80, w: 100, h: 20, r: 0, color: "#FFE3C4" },
          { x: 6, y: 84, w: 5, h: 12, r: 6, color: "#FF8A65" },
          { x: 14, y: 84, w: 5, h: 12, r: 6, color: "#81C784" },
          { x: 22, y: 84, w: 5, h: 12, r: 6, color: "#B39DDB" },
          { x: 74, y: 84, w: 5, h: 12, r: 6, color: "#FFD54F" },
          { x: 82, y: 84, w: 5, h: 12, r: 6, color: "#FFAB91" }
        ],
        pet: { x: 26, y: 54, w: 20, class: "sc-walker", walk: 140 }
      },
      {
        id: "drag", mode: "geometry", span: 1, pose: "stand", bg: "#EDE7F6", image: null,
        elements: [
          { x: 8, y: 14, w: 38, h: 52, r: 16, color: "#F8F4FF" },
          { x: 33, y: 64, w: 22, h: 7, r: 50, color: "#C7B8DE", opacity: 0.85 },
          { x: 12, y: 20, w: 18, h: 3, r: 3, color: "#D9CFF0" },
          { x: 12, y: 27, w: 26, h: 3, r: 3, color: "#E4DAF7" },
          { x: 72, y: 20, w: 16, h: 5, r: 50, color: "#D9CFF0", opacity: 0.7 },
          { x: 66, y: 34, w: 8, h: 8, r: 50, color: "#B39DDB", opacity: 0.6 }
        ],
        pet: { x: 41, y: 14, w: 25, rotate: -12 },
        cursor: { x: 57, y: 62, w: 8, h: 11 }
      },
      {
        id: "water", mode: "geometry", span: 1, pose: "sit", bg: "#E7F3E9", image: null,
        elements: [
          { x: 56, y: 12, w: 32, h: 28, r: 22, color: "#FFFFFF" },
          { x: 60, y: 21, w: 18, h: 3, r: 3, color: "#BCDCC0" },
          { x: 60, y: 28, w: 12, h: 3, r: 3, color: "#D3E8D6" },
          { x: 82, y: 40, w: 6, h: 8, r: 3, color: "#FFFFFF" },
          { x: 52, y: 48, w: 13, h: 18, r: 5, color: "#FFFFFF" },
          { x: 65, y: 53, w: 4, h: 8, r: 3, color: "#FFFFFF" },
          { x: 0, y: 76, w: 100, h: 7, r: 0, color: "#CFE7D3" }
        ],
        pet: { x: 24, y: 34, w: 26 }
      },
      {
        id: "sleep", mode: "geometry", span: 1, pose: "sleep", bg: "#E9E4F0", image: null,
        elements: [
          { x: 76, y: 12, w: 11, h: 11, r: 50, color: "#FFF0BE" },
          { x: 68, y: 26, w: 2, h: 2, r: 50, color: "#FFF6D6" },
          { x: 90, y: 32, w: 2.4, h: 2.4, r: 50, color: "#FFF6D6" },
          { x: 0, y: 78, w: 100, h: 8, r: 0, color: "#DCD3EA" },
          { x: 60, y: 62, w: 20, h: 4, r: 50, color: "#DCD3EA", opacity: 0.7 }
        ],
        pet: { x: 26, y: 36, w: 30 },
        text: { x: 62, y: 30, text: "Zzz", size: 15, color: "#8E7AA8", class: "sc-zzz" }
      }
    ],

    /* 咕咚的台詞（8 條），文案見 I18N.<lang>.quotes.items */
    quotes: [
      { id: "q1", tone: "coral" },
      { id: "q2", tone: "mint" },
      { id: "q3", tone: "ink" },
      { id: "q4", tone: "lemon" },
      { id: "q5", tone: "peach" },
      { id: "q6", tone: "cream" },
      { id: "q7", tone: "lav" },
      { id: "q8", tone: "coral" }
    ],

    /* 皮膚：grad 為咕咚剪影漸變，bg 為卡內視覺底色 */
    /* 狀態：grad 為咕咚剪影漸變，bg 為卡內視覺底色，pose 決定剪影姿態 */
    skins: [
      { id: "idle", pose: "stand", bg: "#FFE7DC", grad: [["0%", "#FF8A65"], ["60%", "#FFAB91"], ["100%", "#FFD1B8"]] },
      { id: "stroll", pose: "walk", bg: "#DCF0DE", grad: [["0%", "#A5D6A7"], ["55%", "#81C784"], ["100%", "#4DB6AC"]] },
      { id: "eat",  pose: "sit",  bg: "#E8E1F6", grad: [["0%", "#CE93D8"], ["55%", "#B39DDB"], ["100%", "#9575CD"]] },
      { id: "play", pose: "stand", bg: "#FFF3C4", grad: [["0%", "#FFE082"], ["50%", "#FFD54F"], ["100%", "#FFB74D"]] },
      { id: "nap",  pose: "sleep", bg: "#2F2836", grad: [["0%", "#5C5470"], ["55%", "#7E6E8C"], ["100%", "#B39DDB"]] }
    ],

    /* 更新日誌（三語） */
    changelog: [
      {
        version: "v1.0.0",
        date: "2026-11-04",
        notes: {
          "zh-Hans": [
            "macOS 与 Windows 双平台首发：132 MB DMG / 95 MB EXE",
            "透明置顶窗口，不抢焦点；macOS 走原生透明层，Windows 走 DWM 合成",
            "四条养成数值：饱食、精力、心情、亲密，久了不喂不陪会往下掉",
            "接入本机 Ollama：qwen2.5 对话、20 条上下文、流式回复、中文 TTS",
            "接星星小游戏 6 秒一局，接得多心情涨得快"
          ],
          "zh-Hant": [
            "macOS 與 Windows 雙平台首發：132 MB DMG / 95 MB EXE",
            "透明置頂視窗，不搶焦點；macOS 走原生透明層，Windows 走 DWM 合成",
            "四條養成數值：飽食、精力、心情、親密，久了不喂不陪會往下掉",
            "接入本機 Ollama：qwen2.5 對話、20 條上下文、串流回覆、中文 TTS",
            "接星星小遊戲 6 秒一局，接得多心情漲得快"
          ],
          "en": [
            "First release for macOS and Windows: 132 MB DMG / 95 MB EXE",
            "Transparent always-on-top window that never steals focus (native layer on macOS, DWM on Windows)",
            "Four stats — fullness, energy, mood, bond — all decay when you neglect it",
            "Local Ollama: qwen2.5 chat, 20 messages of context, streaming replies, Chinese TTS",
            "Six-second star-catching mini-game; the more you catch, the faster mood rises"
          ]
        }
      }
    ]
  };

  /* =======================================================
     2. 三語字典
     ======================================================= */
  const I18N = {
    "zh-Hans": {
      docTitle: "咕咚 GuDongPet v1.0.0 · 住在桌面上的小生物",
      a11y: { skip: "跳至主要内容" },
      nav: { home: "首页", features: "功能", scenes: "场景", skins: "状态", download: "下载" },
      hero: {
        kicker: "GU DONG PET · v1.0.0 · macOS / WINDOWS",
        tagline: "透明置顶、会走会吃、能陪你聊天的桌面小生物。模型跑在你自己的电脑上，不联网。"
      },
      cta: { download: "下载咕咚" },
      features: {
        kicker: "FEATURES", title: "咕咚会做什么", lead: "八件事，都是 v1.0.0 里真能用的。",
        items: {
          chat:   { title: "本地模型对话", desc: "接上本机 Ollama 的 qwen2.5，记住最近 20 条上下文，回复一个字一个字流出来，还能念出声。" },
          feed:   { title: "喂食", desc: "苹果、蛋糕、牛奶、星星糖四样，右键就能喂，饱食度掉下去得靠这个补。" },
          walk:   { title: "自由走动", desc: "自己在屏幕上溜达，撞到边就转向；被拖到新位置后，换个方向继续走。" },
          drag:   { title: "拖拽与抚摸", desc: "按住拖到任意位置，甩太猛它会晕一会儿；双击算摸它一下。" },
          stats:  { title: "四条养成数值", desc: "饱食、精力、心情、亲密各走一条曲线，长时间不喂不陪，数值自己往下掉。" },
          play:   { title: "接星星", desc: "点陪玩就开一局，6 秒内接星星，接得越多心情涨得越快。" },
          vision: { title: "看图", desc: "聊天框、右键菜单、拖进窗口，三个入口都能发图，图片在你自己机器上处理。" },
          tray:   { title: "托盘常驻", desc: "收进托盘，不占 Dock；macOS 用原生透明层，Windows 用 DWM 合成，始终贴在桌面最上层。" }
        }
      },
      scenes: {
        kicker: "DESKTOP", title: "桌面场景", lead: "五种状态机的样子，画面为几何示意。",
        items: {
          night: { title: "深夜常驻", desc: "始终置顶又不抢焦点，全屏写代码它也在角落里。", board: "v1.0" },
          walk:  { title: "桌面散步", desc: "从屏幕这头走到那头，碰到边缘自己掉头。" },
          drag:  { title: "被拎起来", desc: "拖动时整体倾斜，松手落回桌面；甩太狠会晕一会儿。" },
          water: { title: "该吃饭了", desc: "饱食度见底，右键喂一颗星星糖，它就凑过来。" },
          sleep: { title: "打盹回精力", desc: "精力见底就缩成一团睡下，睡够了再站起来继续走。" }
        }
      },
      quotes: {
        kicker: "QUOTES", title: "咕咚说", lead: "这些台词出自你本机的 qwen2.5，聊什么它接什么。",
        hint: "点击气泡，换一句话",
        items: {
          q1: "又是这个报错？", q2: "该吃饭了，右键喂我", q3: "拖轻点，我会晕", q4: "接星星吗，就 6 秒",
          q5: "这张图我看看", q6: "我跑在你电脑上，不联网", q7: "双击我，算摸我一下", q8: "困了，我先睡会儿"
        }
      },
      skins: {
        kicker: "STATES", title: "五种状态", lead: "状态机会自己切，四个数值决定它现在在干什么。",
        items: {
          idle:   { name: "待机", desc: "站在桌面角落，偶尔眨一下眼，等你有空。" },
          stroll: { name: "散步", desc: "沿着屏幕边缘走，撞边掉头，一刻不停。" },
          eat:    { name: "进食", desc: "食物飞向嘴边，吃完能补回一截饱食度。" },
          play:   { name: "陪玩", desc: "接星星那 6 秒，心情是涨得最快的。" },
          nap:    { name: "打盹", desc: "精力见底就缩起来睡，Zzz 往上飘。" }
        }
      },
      release: { kicker: "VERSION", logTitle: "更新日志", system: "macOS arm64 / Windows x64" },
      download: {
        kicker: "DOWNLOAD", title: "现在装一个",
        install: "macOS：打开 DMG，把「咕咚桌宠」拖进「应用程序」。首次打开若提示未验证的开发者，右键 → 打开。",
        system: "系统要求：macOS 11 及以上（Apple Silicon）/ Windows 10 x64 及以上。对话与看图需另装 Ollama 并拉取 qwen2.5。",
        privacy: "全部在你本机跑：模型推理、图片、存档都不上传服务器。",
        items: {
          mac: { os: "macOS", note: "Apple Silicon · arm64 · DMG" },
          win: { os: "Windows", note: "x64 · Windows 10 / 11 · EXE" }
        }
      },
      footer: { kicker: "CONTACT", note: "用着不对、或者想加点什么，写邮件给我。" }
    },

    "zh-Hant": {
      docTitle: "咕咚 GuDongPet v1.0.0 · 住在桌面上的小生物",
      a11y: { skip: "跳至主要內容" },
      nav: { home: "首頁", features: "功能", scenes: "場景", skins: "狀態", download: "下載" },
      hero: {
        kicker: "GU DONG PET · v1.0.0 · macOS / WINDOWS",
        tagline: "透明置頂、會走會吃、能陪你聊天的桌面小生物。模型跑在你自己的電腦上，不連網。"
      },
      cta: { download: "下載咕咚" },
      features: {
        kicker: "FEATURES", title: "咕咚會做什麼", lead: "八件事，都是 v1.0.0 裡真能用的。",
        items: {
          chat:   { title: "本機模型對話", desc: "接上本機 Ollama 的 qwen2.5，記住最近 20 條上下文，回覆一個字一個字流出來，還能唸出聲。" },
          feed:   { title: "餵食", desc: "蘋果、蛋糕、牛奶、星星糖四樣，右鍵就能餵，飽食度掉下去得靠這個補。" },
          walk:   { title: "自由走動", desc: "自己在螢幕上溜達，撞到邊就轉向；被拖到新位置後，換個方向繼續走。" },
          drag:   { title: "拖拽與撫摸", desc: "按住拖到任意位置，甩太猛它會暈一會兒；雙擊算摸它一下。" },
          stats:  { title: "四條養成數值", desc: "飽食、精力、心情、親密各走一條曲線，長時間不餵不陪，數值自己往下掉。" },
          play:   { title: "接星星", desc: "點陪玩就開一局，6 秒內接星星，接得越多心情漲得越快。" },
          vision: { title: "看圖", desc: "聊天框、右鍵選單、拖進視窗，三個入口都能發圖，圖片在你自己機器上處理。" },
          tray:   { title: "系統匣常駐", desc: "收進系統匣，不佔 Dock；macOS 用原生透明層，Windows 用 DWM 合成，始終貼在桌面最上層。" }
        }
      },
      scenes: {
        kicker: "DESKTOP", title: "桌面場景", lead: "五種狀態機的樣子，畫面為幾何示意。",
        items: {
          night: { title: "深夜常駐", desc: "始終置頂又不搶焦點，全螢幕寫程式它也在角落裡。", board: "v1.0" },
          walk:  { title: "桌面散步", desc: "從螢幕這頭走到那頭，碰到邊緣自己掉頭。" },
          drag:  { title: "被拎起來", desc: "拖動時整體傾斜，鬆手落回桌面；甩太狠會暈一會兒。" },
          water: { title: "該吃飯了", desc: "飽食度見底，右鍵餵一顆星星糖，它就湊過來。" },
          sleep: { title: "打盹回精力", desc: "精力見底就縮成一團睡下，睡夠了再站起來繼續走。" }
        }
      },
      quotes: {
        kicker: "QUOTES", title: "咕咚說", lead: "這些台詞出自你本機的 qwen2.5，聊什麼它接什麼。",
        hint: "點擊氣泡，換一句話",
        items: {
          q1: "又是這個報錯？", q2: "該吃飯了，右鍵餵我", q3: "拖輕點，我會暈", q4: "接星星嗎，就 6 秒",
          q5: "這張圖我看看", q6: "我跑在你電腦上，不連網", q7: "雙擊我，算摸我一下", q8: "睏了，我先睡會兒"
        }
      },
      skins: {
        kicker: "STATES", title: "五種狀態", lead: "狀態機會自己切，四個數值決定它現在在做什麼。",
        items: {
          idle:   { name: "待機", desc: "站在桌面角落，偶爾眨一下眼，等你有空。" },
          stroll: { name: "散步", desc: "沿著螢幕邊緣走，撞邊掉頭，一刻不停。" },
          eat:    { name: "進食", desc: "食物飛向嘴邊，吃完能補回一截飽食度。" },
          play:   { name: "陪玩", desc: "接星星那 6 秒，心情是漲得最快的。" },
          nap:    { name: "打盹", desc: "精力見底就縮起來睡，Zzz 往上飄。" }
        }
      },
      release: { kicker: "VERSION", logTitle: "更新日誌", system: "macOS arm64 / Windows x64" },
      download: {
        kicker: "DOWNLOAD", title: "現在裝一個",
        install: "macOS：開啟 DMG，把「咕咚桌宠」拖進「應用程式」。首次開啟若提示未驗證的開發者，右鍵 → 打開。",
        system: "系統需求：macOS 11 及以上（Apple Silicon）/ Windows 10 x64 及以上。對話與看圖需另裝 Ollama 並拉取 qwen2.5。",
        privacy: "全部在你本機跑：模型推理、圖片、存檔都不上傳伺服器。",
        items: {
          mac: { os: "macOS", note: "Apple Silicon · arm64 · DMG" },
          win: { os: "Windows", note: "x64 · Windows 10 / 11 · EXE" }
        }
      },
      footer: { kicker: "CONTACT", note: "用著不對、或者想加點什麼，寫郵件給我。" }
    },

    "en": {
      docTitle: "GuDongPet v1.0.0 · A tiny creature that lives on your desktop",
      a11y: { skip: "Skip to main content" },
      nav: { home: "Home", features: "Features", scenes: "Scenes", skins: "States", download: "Download" },
      hero: {
        kicker: "GU DONG PET · v1.0.0 · macOS / WINDOWS",
        tagline: "A transparent, always-on-top desktop creature that walks, eats, and talks with you. The model runs on your own machine — nothing is uploaded."
      },
      cta: { download: "Download GuDong" },
      features: {
        kicker: "FEATURES", title: "What GuDong does", lead: "Eight things that actually ship in v1.0.0.",
        items: {
          chat:   { title: "Local model chat", desc: "Hooks up to Ollama running qwen2.5 on your machine, keeps the last 20 messages, streams the reply word by word, and can read it aloud." },
          feed:   { title: "Feeding", desc: "Apple, cake, milk, star candy — right-click to feed. This is how you refill a dropping fullness bar." },
          walk:   { title: "Free roaming", desc: "It wanders the screen on its own and turns at the edges, then sets off in a new direction after you move it." },
          drag:   { title: "Drag & pet", desc: "Hold and drag it anywhere; whip it too hard and it gets dizzy for a moment. Double-click counts as petting." },
          stats:  { title: "Four stats", desc: "Fullness, energy, mood and bond each run their own curve — leave it alone too long and they all slide down." },
          play:   { title: "Star catching", desc: "One round is six seconds. Catch more stars and its mood climbs faster." },
          vision: { title: "Image reading", desc: "Chat box, right-click menu, or drop a file on the window — three ways in, and the image never leaves your machine." },
          tray:   { title: "Lives in the tray", desc: "Tucks into the system tray without a Dock icon; native transparency on macOS, DWM composition on Windows, always above your desktop." }
        }
      },
      scenes: {
        kicker: "DESKTOP", title: "Desktop scenes", lead: "Five states it cycles through. These are geometric sketches.",
        items: {
          night: { title: "Always on top", desc: "Topmost without stealing focus, still in the corner while you code fullscreen.", board: "v1.0" },
          walk:  { title: "Walking around", desc: "Pacing from one side of the screen to the other, turning at the edges." },
          drag:  { title: "Being picked up", desc: "Tilts while dragged, lands back on the desktop, dizzy if you swing it too fast." },
          water: { title: "Feeding time", desc: "Fullness running low — right-click a star candy and it comes over." },
          sleep: { title: "Napping", desc: "Out of energy it curls up and sleeps, then gets back up and keeps walking." }
        }
      },
      quotes: {
        kicker: "QUOTES", title: "What GuDong says", lead: "Every line comes from qwen2.5 on your own machine.",
        hint: "Tap a bubble for another line",
        items: {
          q1: "That error again?", q2: "I'm hungry — right-click to feed me", q3: "Easy on the dragging, I get dizzy",
          q4: "Star catching? Six seconds.", q5: "Let me look at that image", q6: "I run on your machine, offline",
          q7: "Double-click me, that's petting", q8: "Sleepy. Wake me later."
        }
      },
      skins: {
        kicker: "STATES", title: "Five states", lead: "The state machine switches on its own — four stats decide what it does next.",
        items: {
          idle:   { name: "Idle", desc: "Standing in a corner of the desktop, blinking once in a while." },
          stroll: { name: "Strolling", desc: "Walking the screen edges, turning whenever it hits one." },
          eat:    { name: "Eating", desc: "Food flies to its mouth; fullness climbs back up." },
          play:   { name: "Playing", desc: "Those six seconds of star catching raise mood the fastest." },
          nap:    { name: "Napping", desc: "Energy empty, curled up asleep with Zzz drifting up." }
        }
      },
      release: { kicker: "VERSION", logTitle: "Changelog", system: "macOS arm64 / Windows x64" },
      download: {
        kicker: "DOWNLOAD", title: "Get it now",
        install: "macOS: open the DMG and drag GuDongPet into Applications. If macOS blocks the unsigned build, right-click → Open. Windows: run the EXE, install location is optional.",
        system: "Requires macOS 11+ (Apple Silicon) or Windows 10 x64+. Chat and image reading need Ollama with qwen2.5 pulled.",
        privacy: "Everything runs locally: inference, images and save data never leave your computer.",
        items: {
          mac: { os: "macOS", note: "Apple Silicon · arm64 · DMG" },
          win: { os: "Windows", note: "x64 · Windows 10 / 11 · EXE" }
        }
      },
      footer: { kicker: "CONTACT", note: "Something off, or a feature you want? Send a mail." }
    }
  };

  const LANGS = ["zh-Hans", "zh-Hant", "en"];

  /* =======================================================
     3. 幾何咕咚生成器
     把咕咚拆成幾何部件；部件集合交給 SVG clipPath，
     彩虹漸變從鏤空處透出，形成「鏤空載體」效果。
     ======================================================= */
  const POSES = {
    /* 站姿 */
    stand: {
      shapes:
        '<rect x="70" y="48" width="34" height="50" rx="17"/>' +
        '<rect x="136" y="48" width="34" height="50" rx="17"/>' +
        '<rect x="58" y="80" width="124" height="140" rx="56"/>' +
        '<rect x="18" y="148" width="46" height="26" rx="13"/>' +
        '<rect x="176" y="148" width="46" height="26" rx="13"/>' +
        '<rect x="90" y="214" width="26" height="36" rx="13"/>' +
        '<rect x="124" y="214" width="26" height="36" rx="13"/>' +
        '<ellipse cx="196" cy="194" rx="16" ry="10" transform="rotate(26 196 194)"/>',
      eyes:
        '<circle class="gd-eye" cx="102" cy="138" r="9.5" fill="#2B2430"/>' +
        '<circle class="gd-eye" cx="138" cy="138" r="9.5" fill="#2B2430"/>',
      face:
        '<circle cx="80" cy="164" r="9" fill="#FFAB91" opacity=".85"/>' +
        '<circle cx="160" cy="164" r="9" fill="#FFAB91" opacity=".85"/>' +
        '<path d="M112 160 q8 9 16 0" fill="none" stroke="#2B2430" stroke-width="4" stroke-linecap="round"/>',
      extra: ""
    },
    /* 坐姿 */
    sit: {
      shapes:
        '<rect x="72" y="62" width="32" height="48" rx="16"/>' +
        '<rect x="136" y="62" width="32" height="48" rx="16"/>' +
        '<rect x="56" y="92" width="128" height="118" rx="59"/>' +
        '<rect x="22" y="148" width="42" height="24" rx="12"/>' +
        '<rect x="176" y="148" width="42" height="24" rx="12"/>' +
        '<rect x="86" y="196" width="32" height="26" rx="13"/>' +
        '<rect x="122" y="196" width="32" height="26" rx="13"/>' +
        '<ellipse cx="190" cy="190" rx="15" ry="9" transform="rotate(20 190 190)"/>',
      eyes:
        '<circle class="gd-eye" cx="102" cy="150" r="9.5" fill="#2B2430"/>' +
        '<circle class="gd-eye" cx="138" cy="150" r="9.5" fill="#2B2430"/>',
      face:
        '<circle cx="80" cy="174" r="9" fill="#FFAB91" opacity=".85"/>' +
        '<circle cx="160" cy="174" r="9" fill="#FFAB91" opacity=".85"/>' +
        '<path d="M112 172 q8 9 16 0" fill="none" stroke="#2B2430" stroke-width="4" stroke-linecap="round"/>',
      extra: ""
    },
    /* 睡姿：身體壓扁成一團圓，眼睛成閉眼線 */
    sleep: {
      shapes:
        '<circle cx="82" cy="162" r="18"/>' +
        '<circle cx="158" cy="162" r="18"/>' +
        '<ellipse cx="120" cy="202" rx="78" ry="52"/>' +
        '<ellipse cx="196" cy="214" rx="14" ry="9" transform="rotate(10 196 214)"/>',
      eyes:
        '<rect class="gd-eye" x="94" y="192" width="24" height="5" rx="2.5" fill="#2B2430" transform="rotate(-8 106 194)"/>' +
        '<rect class="gd-eye" x="122" y="192" width="24" height="5" rx="2.5" fill="#2B2430" transform="rotate(8 134 194)"/>',
      face:
        '<circle cx="86" cy="214" r="9" fill="#FFAB91" opacity=".8"/>' +
        '<circle cx="154" cy="214" r="9" fill="#FFAB91" opacity=".8"/>',
      extra: ""
    },
    /* 舉牌：雙手向上，牌子內容由 opts.boardText 注入（多語文案不硬編碼在圖形裡） */
    sign: {
      shapes:
        '<rect x="58" y="96" width="124" height="140" rx="56"/>' +
        '<rect x="26" y="84" width="24" height="62" rx="12" transform="rotate(14 38 115)"/>' +
        '<rect x="190" y="84" width="24" height="62" rx="12" transform="rotate(-14 202 115)"/>' +
        '<rect x="90" y="228" width="26" height="34" rx="13"/>' +
        '<rect x="124" y="228" width="26" height="34" rx="13"/>' +
        '<ellipse cx="196" cy="210" rx="15" ry="9" transform="rotate(22 196 210)"/>',
      eyes:
        '<circle class="gd-eye" cx="102" cy="156" r="9.5" fill="#2B2430"/>' +
        '<circle class="gd-eye" cx="138" cy="156" r="9.5" fill="#2B2430"/>',
      face:
        '<circle cx="80" cy="180" r="9" fill="#FFAB91" opacity=".85"/>' +
        '<circle cx="160" cy="180" r="9" fill="#FFAB91" opacity=".85"/>' +
        '<path d="M112 178 q8 9 16 0" fill="none" stroke="#2B2430" stroke-width="4" stroke-linecap="round"/>' +
        '<rect x="52" y="14" width="136" height="60" rx="20" fill="#FFF8E7"/>' +
        "__BOARD__",
      extra: ""
    }
  };

  const RAINBOW = [["0%", "#FF8A65"], ["34%", "#FFD54F"], ["64%", "#81C784"], ["100%", "#B39DDB"]];

  let gdSeq = 0;
  /**
   * 生成一個幾何咕咚 SVG
   * @param {string} pose  stand | sit | sleep | sign
   * @param {object} opts  { grad: stops[][], label: string, boardText: string }
   */
  function gudongSVG(pose, opts) {
    const p = POSES[pose] || POSES.stand;
    const o = opts || {};
    const stops = o.grad || RAINBOW;
    const uid = "gd" + (++gdSeq);

    const gradient = stops
      .map(function (s) {
        return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>';
      })
      .join("");

    /* 牌子內容：有文案則寫字（舉牌姿勢），否則保留兩條色塊作為抽象佔位 */
    const board = o.boardText
      ? '<text x="120" y="52" text-anchor="middle" font-size="23" font-weight="600"' +
        ' font-family="Fredoka, Noto Sans SC, Noto Sans TC, sans-serif" fill="#2B2430">' +
        String(o.boardText).replace(/[<>&]/g, function (c) {
          return { "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c];
        }) +
        "</text>"
      : '<rect x="70" y="32" width="72" height="9" rx="4.5" fill="#FF8A65"/>' +
        '<rect x="70" y="49" width="46" height="9" rx="4.5" fill="#FFAB91"/>';
    const face = String(p.face).replace("__BOARD__", board);

    return (
      '<svg class="gd-svg gd-' + pose + '" viewBox="0 0 240 300" role="img" ' +
      'aria-label="' + (o.label || "咕咚幾何剪影") + '" focusable="false">' +
        "<defs>" +
          '<linearGradient id="' + uid + '-g" x1="0" y1="0" x2="1" y2="1">' + gradient + "</linearGradient>" +
          '<clipPath id="' + uid + '-c">' + p.shapes + "</clipPath>" +
        "</defs>" +
        /* 鏤空載體：部件集合裁切出來的區域透出漸變 */
        '<g clip-path="url(#' + uid + '-c)">' +
          '<rect x="0" y="0" width="240" height="300" fill="url(#' + uid + '-g)"/>' +
        "</g>" +
        /* 五官是可辨識度的關鍵，畫在鏤空之上 */
        '<g class="gd-eyes">' + p.eyes + "</g>" +
        '<g class="gd-face">' + face + "</g>" +
      "</svg>"
    );
  }

  /* =======================================================
     4. 工具與狀態
     ======================================================= */
  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let currentLang = "zh-Hans";
  function t(path) {
    const pick = function (src) {
      return path.split(".").reduce(function (acc, k) {
        return acc && acc[k] != null ? acc[k] : undefined;
      }, src);
    };
    let v = pick(I18N[currentLang]);
    if (v === undefined) v = pick(I18N["zh-Hans"]);
    return v === undefined ? "" : v;
  }

  /* =======================================================
     5. 渲染：功能磁貼
     ======================================================= */
  function renderTiles() {
    const grid = $("#tileGrid");
    if (!grid) return;
    grid.innerHTML = GUDONG.features
      .map(function (f) {
        const item = t("features.items." + f.id) || {};
        const cls = "tile reveal" + (f.span ? " " + f.span : "");
        return (
          '<article class="' + cls + '" data-tone="' + f.tone + '" data-id="' + f.id + '">' +
            '<div class="tile-inner">' +
              '<div class="tile-face tile-front">' +
                '<span class="material-symbols-rounded tile-icon" aria-hidden="true">' + f.icon + "</span>" +
                "<div>" +
                  "<h3>" + (item.title || f.id) + "</h3>" +
                  "<p>" + GUDONG.nameEn.toUpperCase() + " · " + f.id.toUpperCase() + "</p>" +
                "</div>" +
                '<span class="tile-mini" aria-hidden="true">' + gudongSVG("sit", { grad: RAINBOW }) + "</span>" +
              "</div>" +
              '<div class="tile-face tile-back">' +
                '<span class="material-symbols-rounded tile-icon" aria-hidden="true">' + f.icon + "</span>" +
                "<p>" + (item.desc || "") + "</p>" +
              "</div>" +
            "</div>" +
          "</article>"
        );
      })
      .join("");
    observeReveal(grid);
  }

  /* =======================================================
     6. 渲染：桌面場景
     ======================================================= */
  function buildElement(el) {
    const style = [
      "left:" + el.x + "%",
      "top:" + el.y + "%",
      el.w != null ? "width:" + el.w + "%" : "",
      el.h != null ? "height:" + el.h + "%" : "",
      "background:" + (el.color || "#EEE"),
      "border-radius:" + (el.r == null ? 10 : el.r) + "px",
      el.rotate ? "transform:rotate(" + el.rotate + "deg)" : "",
      el.opacity != null ? "opacity:" + el.opacity : ""
    ].filter(Boolean).join(";");
    return '<div class="scene-el ' + (el.class || "") + '" style="' + style + '"></div>';
  }

  function renderScenes() {
    const grid = $("#sceneGrid");
    if (!grid) return;
    grid.innerHTML = GUDONG.scenes
      .map(function (sc) {
        const item = t("scenes.items." + sc.id) || {};
        const pet = sc.pet || {};

        const petStyle = [
          "left:" + pet.x + "%",
          "top:" + pet.y + "%",
          "width:" + pet.w + "%",
          "--pet-rot:" + (pet.rotate || 0) + "deg",
          pet.walk ? "--walk:" + pet.walk + "px" : ""
        ].filter(Boolean).join(";");

        const cursorHTML = sc.cursor
          ? '<div class="scene-el sc-cursor" style="left:' + sc.cursor.x + "%;top:" + sc.cursor.y +
            "%;width:" + sc.cursor.w + "%;height:" + sc.cursor.h +
            "%;background:#2B2430;border-radius:3px;" +
            'clip-path:polygon(0 0,100% 44%,52% 58%,40% 100%);"></div>'
          : "";

        const textHTML = sc.text
          ? '<div class="scene-el ' + (sc.text.class || "") + '" style="left:' + sc.text.x + "%;top:" + sc.text.y +
            "%;background:transparent;font-family:'JetBrains Mono',monospace;font-size:" + sc.text.size +
            "px;letter-spacing:.18em;color:" + sc.text.color + ';">' + sc.text.text + "</div>"
          : "";

        return (
          '<article class="scene-card reveal' + (sc.span === 2 ? " span-2" : "") + '" data-scene="' + sc.id + '">' +
            '<div class="scene-canvas" style="background:' + sc.bg + '">' +
              /* 可替換為真實截圖：mode 設為 image 並填 image 路徑 */
              (sc.mode === "image" && sc.image
                ? '<img src="' + sc.image + '" alt="" style="width:100%;height:100%;object-fit:cover">'
                : sc.elements.map(buildElement).join("")) +
              '<div class="scene-pet ' + (pet.class || "") + '" style="' + petStyle + '">' +
                gudongSVG(sc.pose, {
                  label: (item.title || "") + " · GuDong",
                  boardText: item.board || ""
                }) +
              "</div>" +
              cursorHTML +
              textHTML +
            "</div>" +
            '<div class="scene-meta">' +
              "<h3>" + (item.title || sc.id) + "</h3>" +
              "<p>" + (item.desc || "") + "</p>" +
            "</div>" +
          "</article>"
        );
      })
      .join("");
    observeReveal(grid);
  }

  /* =======================================================
     7. 渲染：對話氣泡
     ======================================================= */
  function renderBubbles() {
    const grid = $("#bubbleGrid");
    if (!grid) return;
    grid.innerHTML = GUDONG.quotes
      .map(function (q) {
        return (
          '<button class="bubble reveal" type="button" data-tone="' + q.tone + '" data-q="' + q.id + '">' +
            "<span>" + (t("quotes.items." + q.id) || "") + "</span>" +
          "</button>"
        );
      })
      .join("");
    observeReveal(grid);
  }


  /* =======================================================
     7.5 渲染：安裝包下載卡（真實檔名 / 體積）
     ======================================================= */
  function renderDownloads() {
    const wrap = $("#dlGrid");
    if (!wrap) return;
    wrap.innerHTML = GUDONG.downloads
      .map(function (d) {
        const item = t("download.items." + d.id) || {};
        return (
          '<a class="dl-card" href="' + encodeURI(d.file) + '" download>' +
            '<span class="dl-icon material-symbols-rounded" aria-hidden="true">' + d.icon + "</span>" +
            '<span class="dl-body">' +
              '<strong class="dl-os">' + (item.os || d.os) + "</strong>" +
              '<span class="dl-note mono">' + (item.note || d.arch) + "</span>" +
            "</span>" +
            '<span class="dl-size mono">' + d.size + "</span>" +
            '<span class="material-symbols-rounded dl-arrow" aria-hidden="true">download</span>' +
          "</a>"
        );
      })
      .join("");
  }

  /* =======================================================
     8. 渲染：狀態
     ======================================================= */
  function renderSkins() {
    const track = $("#skinTrack");
    if (!track) return;
    track.innerHTML = GUDONG.skins
      .map(function (sk) {
        const item = t("skins.items." + sk.id) || {};
        return (
          '<article class="skin-card reveal" data-skin="' + sk.id + '">' +
            '<div class="skin-visual" style="--skin-bg:' + sk.bg + '">' +
              gudongSVG(sk.pose || "sit", { grad: sk.grad, label: (item.name || sk.id) + " state" }) +
            "</div>" +
            "<h3>" + (item.name || sk.id) + "</h3>" +
            '<p class="skin-en">' + sk.id + "</p>" +
            '<p class="skin-desc">' + (item.desc || "") + "</p>" +
          "</article>"
        );
      })
      .join("");
    observeReveal(track);
    updateSkinButtons();
  }

  /* =======================================================
     9. 渲染：版本日誌 / 版本角標 / 郵箱
     ======================================================= */
  function renderLog() {
    const list = $("#logList");
    const pop = $("#versionPop");
    const latest = GUDONG.changelog[0];
    const notes = (latest.notes[currentLang] || latest.notes["zh-Hans"] || []).slice();

    if (list) {
      list.innerHTML = notes.map(function (n) { return "<li>" + n + "</li>"; }).join("");
    }
    if (pop) {
      pop.innerHTML =
        "<h4>" + latest.version + " · " + latest.date + "</h4>" +
        "<ul>" + notes.slice(0, 3).map(function (n) { return "<li>" + n + "</li>"; }).join("") + "</ul>";
    }
  }

  function renderMails() {
    const wrap = $("#mailList");
    if (!wrap) return;
    wrap.innerHTML = GUDONG.emails
      .map(function (mail) {
        return (
          '<a href="mailto:' + mail + '">' + mail +
            '<span class="material-symbols-rounded" aria-hidden="true">arrow_outward</span>' +
          "</a>"
        );
      })
      .join("");
  }

  /* =======================================================
     10. 綁定靜態文案與配置值
     ======================================================= */
  function applyStaticText() {
    $$("[data-i18n]").forEach(function (el) {
      const v = t(el.getAttribute("data-i18n"));
      if (v) el.textContent = v;
    });

    const binds = {
      version: GUDONG.version,
      brand: GUDONG.brand,
      releaseDate: GUDONG.releaseDate,
      platforms: GUDONG.platforms.join(" · ")
    };
    $$("[data-bind]").forEach(function (el) {
      const key = el.getAttribute("data-bind");
      if (binds[key]) el.textContent = binds[key];
    });

    const firstPkg = (GUDONG.downloads && GUDONG.downloads[0]) ? encodeURI(GUDONG.downloads[0].file) : GUDONG.downloadUrl;
    $$("#heroDownload, #mainDownload").forEach(function (a) {
      a.setAttribute("href", firstPkg);
      a.setAttribute("download", "");
      const label = (GUDONG.downloadLabel && GUDONG.downloadLabel[currentLang]) || t("cta.download");
      const span = a.querySelector("[data-i18n]");
      if (span && label) span.textContent = label;
    });

    document.title = t("docTitle") || document.title;
    document.documentElement.lang = currentLang;
  }

  /* =======================================================
     11. 語言切換
     ======================================================= */
  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = "zh-Hans";
    currentLang = lang;
    try { localStorage.setItem("gudong-lang", lang); } catch (e) { /* 私密模式忽略 */ }

    $$("#langSeg button").forEach(function (b) {
      const on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    applyStaticText();
    renderTiles();
    renderScenes();
    renderBubbles();
    renderSkins();
    renderDownloads();
    renderLog();
    startTileAutoFlip();

    document.body.classList.remove("lang-fade");
    void document.body.offsetWidth;
    document.body.classList.add("lang-fade");
  }

  /* =======================================================
     12. 磁貼自動翻面（4.5s，懸停時暫停）
     ======================================================= */
  let tileTimer = null;
  function startTileAutoFlip() {
    if (tileTimer) { clearInterval(tileTimer); tileTimer = null; }
    if (reduceMotion) return;
    tileTimer = setInterval(function () {
      const tiles = $$(".tile");
      if (!tiles.length) return;
      const free = tiles.filter(function (el) { return !el.matches(":hover"); });
      if (!free.length) return;
      const pick = free[Math.floor(Math.random() * free.length)];
      /* 任一時刻只保留一張背面，避免多張同時翻到底造成視覺噪音 */
      const wasFlipped = pick.classList.contains("is-flipped");
      tiles.forEach(function (el) { if (el !== pick) el.classList.remove("is-flipped"); });
      pick.classList.toggle("is-flipped", !wasFlipped);
    }, 4500);
  }

  /* =======================================================
     13. 氣泡點擊換台詞
     ======================================================= */
  function bindBubbles() {
    const grid = $("#bubbleGrid");
    if (!grid) return;
    grid.addEventListener("click", function (e) {
      const card = e.target.closest(".bubble");
      if (!card) return;
      const ids = GUDONG.quotes.map(function (q) { return q.id; });
      const cur = card.getAttribute("data-q");
      let next = cur;
      while (next === cur && ids.length > 1) {
        next = ids[Math.floor(Math.random() * ids.length)];
      }
      const span = card.querySelector("span");
      if (span) span.textContent = t("quotes.items." + next) || "";
      card.setAttribute("data-q", next);
      card.classList.remove("swap");
      void card.offsetWidth;
      card.classList.add("swap");
    });
  }

  /* =======================================================
     14. 皮膚橫向滾動
     ======================================================= */
  function skinStep() {
    const card = $(".skin-card");
    return card ? card.getBoundingClientRect().width + 24 : 320;
  }
  function updateSkinButtons() {
    const track = $("#skinTrack");
    const prev = $("#skinPrev");
    const next = $("#skinNext");
    if (!track || !prev || !next) return;
    const max = track.scrollWidth - track.clientWidth - 4;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  }
  function bindSkinScroll() {
    const track = $("#skinTrack");
    const prev = $("#skinPrev");
    const next = $("#skinNext");
    if (!track) return;
    if (prev) prev.addEventListener("click", function () {
      track.scrollBy({ left: -skinStep(), behavior: reduceMotion ? "auto" : "smooth" });
    });
    if (next) next.addEventListener("click", function () {
      track.scrollBy({ left: skinStep(), behavior: reduceMotion ? "auto" : "smooth" });
    });
    track.addEventListener("scroll", updateSkinButtons, { passive: true });
    window.addEventListener("resize", updateSkinButtons);
  }

  /* =======================================================
     15. 導航：滾動收合 / 移動端選單 / 當前區塊高亮
     ======================================================= */
  function bindNav() {
    const nav = $("#nav");
    const toggle = $("#navToggle");
    const links = $("#navLinks");
    if (!nav) return;

    const onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("is-compact");
      else nav.classList.remove("is-compact");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      links.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* 當前區塊高亮 */
    const navMap = { hero: "nav.home", features: "nav.features", scenes: "nav.scenes", skins: "nav.skins", download: "nav.download" };
    if (!("IntersectionObserver" in window)) return;
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$(".nav-links a").forEach(function (a) {
          a.style.color = a.getAttribute("href") === "#" + en.target.id ? "var(--ink)" : "";
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(navMap).forEach(function (id) {
      const sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  /* =======================================================
     16. 鼠標視差
     ======================================================= */
  function bindParallax() {
    if (reduceMotion) return;
    const hero = $("#hero");
    if (!hero) return;
    let raf = null, mx = 0, my = 0;

    window.addEventListener("pointermove", function (e) {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        hero.style.setProperty("--mx", mx.toFixed(3));
        hero.style.setProperty("--my", my.toFixed(3));
        raf = null;
      });
    }, { passive: true });
  }

  /* =======================================================
     17. 按鈕漣漪
     ======================================================= */
  function bindRipple() {
    if (reduceMotion) return;
    $$(".btn").forEach(function (btn) {
      btn.addEventListener("pointerdown", function (e) {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const span = document.createElement("span");
        span.className = "ripple";
        span.style.width = span.style.height = size + "px";
        span.style.left = e.clientX - rect.left - size / 2 + "px";
        span.style.top = e.clientY - rect.top - size / 2 + "px";
        btn.appendChild(span);
        setTimeout(function () { span.remove(); }, 640);
      });
    });
  }

  /* =======================================================
     18. 滾動淡入
     ======================================================= */
  let revealObserver = null;
  function observeReveal(root) {
    if (!("IntersectionObserver" in window)) return;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            revealObserver.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    }
    const scope = root || document;
    $$(".reveal:not(.is-in)", scope).forEach(function (el) { revealObserver.observe(el); });
  }

  /* =======================================================
     19. 初始化
     ======================================================= */
  function init() {
    /* 首屏大咕咚 + 下載區咕咚 */
    $$(".gudong-slot").forEach(function (slot) {
      const pose = slot.getAttribute("data-pose") || "stand";
      slot.innerHTML = gudongSVG(pose, { grad: RAINBOW, label: "咕咚 · " + pose });
    });

    renderMails();

    let lang = "zh-Hans";
    try {
      const saved = localStorage.getItem("gudong-lang");
      if (saved && LANGS.indexOf(saved) !== -1) lang = saved;
    } catch (e) { /* 忽略 */ }
    setLang(lang);

    /* 區塊標題也納入滾動淡入 */
    $$(".section-head, .release-card, .download-card, .footer > *").forEach(function (el) {
      el.classList.add("reveal");
    });
    observeReveal(document);

    bindNav();
    bindBubbles();
    bindSkinScroll();
    bindParallax();
    bindRipple();
    startTileAutoFlip();

    $$("#langSeg button").forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-lang"));
      });
    });

    const chip = $("#versionChip");
    if (chip) {
      chip.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          chip.classList.toggle("is-open");
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
