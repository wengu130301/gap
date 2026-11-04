---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 036678f504ff50ab1d8d56fc51fc50d4_ab69ff3fd81411f1a216525400248c00
    ReservedCode1: k37gLpaOhif9M/mQ7l+NBkHXKfEleOPrCJg9ggi5oa64SeJ3+jeKoTGAN0IrSVcej4lOPIAyoKL9FACGr0kthEsqJdAfYQy3qdb7EZx6vrGWkKyBcKbBa3qXGJLQcyiaJk0AjS2Oqb+9UoCYnMtpqDIiEOz0TyVa/nXKIGn4y/SkVpNKIfave+HAOEU=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 036678f504ff50ab1d8d56fc51fc50d4_ab69ff3fd81411f1a216525400248c00
    ReservedCode2: k37gLpaOhif9M/mQ7l+NBkHXKfEleOPrCJg9ggi5oa64SeJ3+jeKoTGAN0IrSVcej4lOPIAyoKL9FACGr0kthEsqJdAfYQy3qdb7EZx6vrGWkKyBcKbBa3qXGJLQcyiaJk0AjS2Oqb+9UoCYnMtpqDIiEOz0TyVa/nXKIGn4y/SkVpNKIfave+HAOEU=
---

# 咕咚 GuDongPet 官網 · 設計說明

文件結構（全部位於根目錄，引用只用純文件名）：

```
index.html   結構與九個板塊
style.css    設計 Token / 版式 / 動效 / 三檔斷點 / reduced-motion
script.js    GUDONG 配置 · 三語字典 · 幾何咕咚生成器 · 渲染與交互
logo.png     導航與首屏角落的 Logo
```

改版本號、下載連結、郵箱、功能／場景／台詞／皮膚，只動 `script.js` 頂部的 `GUDONG`，頁面不需要碰 HTML。

---

## 1. 幾何咕咚的鏤空是怎麼做的

不是「畫一隻熊」，是「先做一把模具，再往里澆顏色」。

```js
<defs>
  <linearGradient id="gd1-g">…</linearGradient>   // 彩虹漸變
  <clipPath id="gd1-c">[形狀集合]</clipPath>       // 模具：身體＋耳朵＋四隻膠囊手脚＋尾巴
</defs>
<g clip-path="url(#gd1-c)">
  <rect fill="url(#gd1-g)"/>                        // 顏色只從模具的鏤空處透出來
</g>
<g class="gd-eyes">…</g>                            // 眼睛、腮紅、嘴畫在裁切之外
<g class="gd-face">…</g>
```

- `POSES[pose].shapes` 是一串 SVG 基元（`rect` 圓角矩形、`circle`、`ellipse`、`path` 弧片），拼成**模具**；填色跟形狀解耦，所以同一個姿勢可以換 `grad` 換皮膚，不用重畫。
- 五官刻意放在 `clip-path` **外面**：鏤空的身體負責輪廓，五官負責辨識度。若把眼睛也裁進去，縮到 34px 的迷你尺寸時眼睛會被吃掉。
- 每個 SVG 用自增 `uid`（`gd1`、`gd2`…）隔離 `clipPath` / `gradient` 的 id，一張頁面 20 個實例互不污染。
- 全頁 20 個實例、四種姿勢，都出自同一套基元，差別只在**比例與朝向**：

| 姿勢 | 模具變化 | 用在哪 |
|---|---|---|
| 站 stand | 正圓身體 + 兩耳半圓 + 四條膠囊手腳 + 尾弧片 | 首屏主視覺、散步、拖拽 |
| 坐 sit | 身體壓成豎橢圓、手縮短、腳併攏 | 磁貼角落迷你圖、喝水、皮膚卡 |
| 睡 sleep | 整體壓成橫橢圓、眼睛換成兩道向下弧線、尾巴當枕頭 | 休眠場景 |
| 舉牌 sign | 身體換成大圓角矩形、雙臂上抬、頭頂一塊 136×60 的圓角牌 | 深夜場景、下載區 |

牌子上「早點睡 / 早點睡 / Bedtime!」不是畫死在圖裡，是 `gudongSVG(pose, { boardText })` 從 `I18N` 取文案注入 `<text>`，換語言時整頁重繪一次就好。

## 2. 不用插畫、不用 3D，靠什麼顯得可愛

可愛是**比例與節奏**的問題，不是渲染精度的問題：

- **比例**：頭身比接近 1:1.2，眼睛放在身體中線偏下，腮紅貼在眼角外側——這是嬰兒圖式，比任何貼圖都直接。
- **不完美**：站姿四肢不對稱（尾巴偏右 10°），拖拽時整體旋轉 -12°，讓它看起來「有點笨」，笨才可愛。
- **微動比大動有效**：呼吸 `scale(1) → 1.03`、眨眼每 5.4 秒一次且兩眼錯開 40ms、懸停時角落迷你咕咚跳一下。這些動作幅度都在 3% 以內，但頁面因此是「活的」。
- **克制從哪裡來**：暖色（珊瑚橘／蜜桃粉／奶油白）佔版面 65%，第三色只做小面積磁貼與色塊點綴；大圓角（28–64px）統一所有容器；陰影只用三級，不疊加；沒有毛玻璃、沒有漸變光暈之外的裝飾。熱鬧由「色塊拼貼」承擔，高級由「留白與圓角一致」承擔。

## 3. 桌面場景如何組織成可替換的配置

每個場景是一份純數據，渲染器只認識基元，不認識「場景」：

```js
{
  id: "night", mode: "geometry", span: 2, pose: "sign",
  bg: "#2B2430",
  elements: [                                  // 絕對定位色塊，一次 innerHTML 渲染完
    { shape: "rect", x: 8, y: 12, w: 54, h: 56, c: "#3A3242", r: 14 },
    { shape: "bar",  x: 16, y: 24, w: 26, h: 3, c: "#FF8A65", r: 2 }   // 代碼行
  ],
  pet: { x: 62, y: 42, w: 20 },                // 咕咚的位置/大小/旋轉
  cursor: { x: 70, y: 30, w: 2.4, h: 5 },      // 可選：游標、Zzz 文字
  image: null                                  // 留給真實截圖
}
```

- `mode` 是唯一開關：`"geometry"` 走色塊拼貼，改成 `"image"` 並填 `image: "scene-night.png"`，該卡立刻變成真實截圖／GIF，其餘佈局、圓角、懸停動效全部沿用。
- 每個場景 5–8 種顏色，靠 `elements` 數組而非 CSS 選擇器堆出來，日後替換截圖時不需要改樣式表。
- 咕咚、游標、文字是三個獨立圖層（`.scene-pet` / `.sc-cursor` / `.scene-text`），替換截圖時可以整層刪掉，不會影響卡片結構。

## 4. 滑鼠視差與眼睛追隨：怎麼做、代價是什麼

```js
// 一次 mousemove → 只寫兩個 CSS 變量，不碰佈局
root.style.setProperty("--mx", dx);   // -1 ~ 1
root.style.setProperty("--my", dy);
```

- 消費者在 CSS：色塊 `translate3d(calc(var(--mx) * var(--d) * 1px), …)`（`--d` 由 `data-depth` 給，26/40/-18… 越快越遠），眼睛 `translate(calc(var(--mx) * 9px), calc(var(--my) * 7px))`，全部走 GPU 合成層，不觸發重排。
- 幅度壓得很小（眼睛最多 9px），且 `transition: transform .22s`，所以是「餘光跟著你」而不是「眼珠亂轉」。
- 代價與取捨：
  - 只有首屏綁定，滾出視口即解除，避免整頁監聽；
  - `prefers-reduced-motion: reduce` 時完全不綁定事件，視差與呼吸、眨眼、磁貼自動翻面、場景位移一起關閉，咕咚保持完整靜態可見；
  - 純 `transform` 不動 `filter` / `width`，低端機也不掉幀；沒有用 `box-shadow` 做視差，避免重繪。

## 5. 多平台下載與狀態卡（v1.0.0 已落地）

- `downloadLabel` 是一個 **語言 → 文案** 的 map，`currentLang` 直接索引；加日文只需在 map 和 `I18N` 各補一個鍵。
- `platforms: ["macOS (Apple Silicon)", "Windows x64"]` 是數組，首屏、版本卡、下載區的平台標籤都從它 `join(" · ")` 出來，改一行全站生效。
- 分平台下載已實現：`GUDONG.downloads` 是 `{ id, os, arch, size, file, icon }` 的數組，`renderDownloads()` 在 `#dlGrid` 裡生成下載卡，`href` 用 `encodeURI(file)` 指向根目錄的**真實安裝包**（`咕咚桌宠-1.0.0-arm64.dmg` 132 MB / `GudongPet-Setup-1.0.0.exe` 95 MB）。首屏按鈕取 `downloads[0]`，新增平台只要往數組裡加一項，HTML 不用碰。
- 狀態卡：`GUDONG.skins[i]` 現為 `{ id, pose, bg, grad }`，`pose` 決定剪影姿態（`stand / sit / sleep / sign`，未識別時回落 `stand`），文案在 `I18N.<lang>.skins.items`。散步卡（`data-skin="stroll"`）另加了一條 `strollBob` 起伏動畫，避免與待機剪影完全相同；`prefers-reduced-motion` 下自動關閉。
- 場景的 `mode: "image"` 是預留給真實截圖的逃生口，多平台截圖可按 `image` 命名規則（`scene-night-win.png`）批量替換。

---

## 6. v1.0.0 內容校準記錄

早期文案是按概念寫的（提醒喝水、舉牌記事、整點報時、隨機換裝），與實際打包出來的應用對不上；本輪按 `dist` / `dist-win` 兩個真實安裝包與 README 的功能清單逐項改寫：

| 位置 | 改前 | 改後（可驗證） |
| --- | --- | --- |
| 版本號 | v0.1.0 | v1.0.0 |
| 功能磁貼 | 陪你寫代碼 / 提醒喝水 / 報時 / 摸魚 / 換裝 | 本地模型對話 / 喂食 / 自由走動 / 拖拽撫摸 / 四條養成數值 / 接星星 / 看圖 / 托盤常駐 |
| 場景 | 深夜寫代碼、舉牌提醒 | 深夜常駐、散步、被拎起、餵食、打盹（文案說明為幾何示意） |
| ⑥ 板塊 | 皮膚換裝（5 款配色） | 五種狀態機（待機 / 散步 / 進食 / 陪玩 / 打盹） |
| 台詞 | 通用雞湯 | 對應真實能力（右鍵餵食、拖拽會暈、6 秒接星星、本機不聯網） |
| 下載區 | 一個 `#` 空連結 | 兩張卡片，直連根目錄真實安裝包，含體積與安裝說明 |
| 系統要求 | Windows 10+ / macOS 12+ | macOS 11+（Apple Silicon）/ Windows 10 x64+；對話需 Ollama + qwen2.5 |
| 隱私 | 無 | 新增一條：模型推理、圖片、存檔全部本地 |

---

## 已驗收項

無頭 Chromium 實測（1440×900 與 375×812）：

- 控制台 0 error、0 pageerror（file:// 下的 `fetch` 限制是測試腳本自身行為，非頁面問題；改用本地 HTTP 後兩個安裝包均 200）。
- `gudongSVG` 實例 20 個、磁貼 8、場景 5、氣泡 8、狀態 5、下載卡 2，全部由配置渲染。
- 下載鏈接經 URL 編碼後可命中真實文件：DMG 138,826,101 字節、EXE 99,293,663 字節。
- 手機端 `scrollWidth === 375`，無橫向溢出；下載卡在 620px 以下自動單列。
- 三語切換（繁 / 简 / EN）全站文案即時更新，產品名、版本號 `v1.0.0`、郵箱不譯。
- 頁面不含任何 QQ 群、社群入口、群號字段與複製交互。
*（内容由AI生成，仅供参考）*
