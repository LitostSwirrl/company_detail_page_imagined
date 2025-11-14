# 排碳大戶觀測站 - 企業氣候數據儀表板

## 項目概述

這是一個專為台灣排碳大戶觀測站設計的企業氣候數據儀表板原型。該儀表板展示企業的氣候承諾、排放披露、能源轉換和績效指標，使用創新的狀態節點追蹤器設計法，靈感來自 Netzerotracker 的設計模式。

## 檔案結構

```
├── index.html          # 主要 HTML 結構（5個部分 + 所有指標）
├── styles.css          # 完整的樣式表（變量、組件、響應式設計）
├── script.js           # 互動功能（節點追蹤器、導航、展開式文本）
├── charts.js           # 圖表和數據可視化組件
├── README.md           # 本文件
├── plan.md             # 詳細的設計計畫和數據映射
└── 企業 Dashboard - UI.png  # 原始設計參考
```

## 功能特點

### 1. **5個主題部分**

- **承諾目標** (藍色 #0066CC)
  - 淨零排放狀態、目標年份、SBTi 認證、RE100 認證等

- **排放披露** (紫色 #7030A0)
  - 排放揭露狀況、範疇1/2/3、溫室氣體類型等

- **能源與再生能源** (綠色 #00B050)
  - 能源消耗趨勢、效率目標、再生能源進度等

- **績效指標** (橙色 #FF8C00)
  - 排放趨勢、碳強度、碳費影響、低碳產品占比等

- **策略與行動** (粉紅色 #E81B23)
  - 減量策略說明、能源構成、減量基準年等

### 2. **核心可視化方法：狀態節點追蹤器**

- 圓形節點代表不同狀態選項
- 活躍狀態用實心有色圓圈表示
- 非活躍選項顯示為淺灰色空心圓圈
- 支持鼠標懸停和鍵盤導航

### 3. **互動功能**

- **節點追蹤器交互**：點擊選擇不同的狀態選項
- **分類導航**：點擊分類按鈕平滑滾動到相應部分
- **展開式文本**：展開/收起策略描述和詳細信息
- **幫助提示**：懸停圖標查看詳細說明
- **年份篩選**：選擇不同年度查看數據（準備就緒）
- **下載功能**：下載企業數據（準備就緒）

### 4. **圖表與可視化**

實現了多種數據展示組件：

- **Sparkline**：緊湊的趨勢線圖（能源、排放趨勢）
- **SimpleBarChart**：簡單條形圖（營收趨勢）
- **SimplePieChart**：簡單餅圖（能源構成）
- **DataTable**：數據表格
- **ComparisonCard**：比較卡片
- **ProgressBar**：進度條
- **StatusTimeline**：狀態時間線

## 設計系統

### 顏色變量

```css
--color-section-commitments: #0066CC   /* 承諾目標 */
--color-section-emissions: #7030A0     /* 排放披露 */
--color-section-energy: #00B050        /* 能源再生 */
--color-section-performance: #FF8C00   /* 績效指標 */
--color-section-strategy: #E81B23      /* 策略行動 */
```

### 間距系統

```css
--spacing-unit: 8px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 40px
```

### 排版

- **基礎字體**：系統字體堆棧（適配不同操作系統）
- **字體大小**：12px 到 32px（多個層級）
- **行高**：1.2 到 1.75（根據用途調整）

## 使用指南

### 基本用法

1. 在瀏覽器中打開 `index.html`
2. 頁面自動加載所有腳本和樣式
3. 與節點追蹤器互動，點擊選擇狀態
4. 使用導航按鈕在部分之間滾動

### 開發和定制

#### 修改顏色

在 `styles.css` 中編輯 CSS 變量：

```css
:root {
    --color-section-commitments: #新顏色;
}
```

#### 添加新指標

1. 在 `index.html` 中的相應部分添加新的 `metric-row`
2. 使用合適的組件（`node-tracker`、`value-display` 等）
3. 樣式會自動應用

#### 添加新的圖表

在 `charts.js` 中：

1. 在 `initializeCharts()` 函數中添加新的圖表容器檢測邏輯
2. 使用提供的圖表類（`Sparkline`、`SimpleBarChart` 等）
3. 自動注入的 CSS 會處理樣式

### 響應式設計

該設計完全響應式：

- **桌面** (1200px+)：全寬佈局，並排節點追蹤器
- **平板** (768-1199px)：調整間距，堆棧節點追蹤器
- **手機** (<768px)：單列佈局，優化觸摸交互

## 組件 API

### NodeTracker

```javascript
new NodeTracker(trackerElement);
// 自動處理點擊事件並派發 'nodeSelected' 事件
```

### Sparkline

```javascript
new Sparkline(container, [值1, 值2, 值3], {
    color: '#0066CC',
    width: 300,
    height: 60,
    showPoints: true
});
```

### SimpleBarChart

```javascript
new SimpleBarChart(container, [
    { label: '標籤1', value: 100 },
    { label: '標籤2', value: 200 }
], {
    colors: ['#0066CC']
});
```

### ProgressBar

```javascript
new ProgressBar(container, 75, 100, {
    color: '#00B050',
    showLabel: true
});
```

## 開發階段

已完成：
- ✅ Phase 1: HTML 結構和基礎樣式
- ✅ Phase 2: 圖表和可視化組件
- ✅ Phase 3: 導航和交互功能

待完成：
- ⏳ Phase 4: 最終樣式和波蕩效果
- ⏳ Phase 5: 與 CSV 數據集成和動態渲染

## 數據集成（Phase 5）

### CSV 映射結構

檔案會包含映射表，將 CSV 列與 UI 組件關聯：

```javascript
{
    "是否承諾淨零排放或碳中和": {
        "section": "commitments",
        "component": "node-tracker",
        "metric": "net-zero-status"
    },
    // ... 54個欄位的映射
}
```

### 數據加載

```javascript
// 將被實現
async function loadCompanyData(companyId, year) {
    const data = await fetch(`/api/company/${companyId}/year/${year}`);
    const json = await data.json();
    renderDashboard(json);
}
```

## 無障礙性

該儀表板遵循 WCAG 2.1 AA 標準：

- ✅ 語義化 HTML
- ✅ 鍵盤導航（Tab、Enter、Space）
- ✅ 屏幕閱讀器支持（ARIA 標籤）
- ✅ 高對比度顏色
- ✅ 縮減動作偏好支持
- ✅ 高對比度模式支持

## 性能優化

- CSS 變量減少重複代碼
- 延遲加載圖表和數據
- Debounce 事件監聽器以提高滾動性能
- 最小化 DOM 操作

## 瀏覽器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移動瀏覽器（iOS Safari 14+、Chrome Mobile）

## 常見問題

### Q: 如何更新數據？
A: 在 Phase 5 中，將實現 CSV 數據加載。現在使用硬編碼的示例數據。

### Q: 可以修改節點顏色嗎？
A: 是的，在 CSS 變量中編輯 `--color-section-*` 變量。

### Q: 如何添加新部分？
A: 在 `index.html` 中複製現有的 `climate-section` 結構，更新部分ID、顏色和內容。

### Q: 是否支持多語言？
A: 目前使用繁體中文。要支持多語言，需要將文本移到 i18n 配置文件中。

## 下一步

1. **Phase 4**：應用最終樣式、動畫和拋光效果
2. **Phase 5**：與 CSV 數據源集成，實現動態數據加載
3. **增強**：添加印表支持、PDF 導出、更多交互功能

## 貢獻

如有改進建議，請編輯 `plan.md` 文件記錄更改，然後更新相應的代碼文件。

## 許可證

此項目為 GCAA 專有項目。

---

**創建日期**：2025年11月14日
**狀態**：原型開發中（Phase 3 完成）
