# 數據集成指南

## 概述

數據集成模塊 (`data.js`) 負責將 CSV 數據加載到儀表板中，並將其動態渲染到相應的 UI 組件上。

## 系統架構

```
CSV 文件
    ↓
CSVLoader (CSV 解析)
    ↓
CompanyData (數據模型)
    ↓
DashboardRenderer (DOM 更新)
    ↓
可視化儀表板
```

## 核心組件

### 1. CSVLoader

負責從文件系統或遠程服務器加載並解析 CSV 文件。

**特點**：
- ✅ 支持帶引號的字段
- ✅ 處理逃逸引號
- ✅ 忽略空行
- ✅ 自動修剪空格

**使用方式**：
```javascript
const loader = new CSVLoader('/path/to/data.csv');
const data = await loader.load(); // 返回記錄數組
```

**返回格式**：
```javascript
[
    {
        '公司': '台灣鋼鐵集團',
        '統一編號': '12345678',
        '是否承諾淨零排放或碳中和': '納入策略',
        // ... 更多欄位
    },
    // ... 更多公司
]
```

### 2. DataFormatter

處理各種數據類型的格式化和展示。

**支持的格式**：
- `number`：整數格式化（K、M 後綴）
- `percentage`：百分比格式（保留1位小數）
- `year`：年份（保持原樣）
- `currency`：貨幣格式（台幣）

**使用方式**：
```javascript
DataFormatter.format(1250000, 'number'); // "1.2M"
DataFormatter.format(25.5, 'percentage'); // "25.5%"
DataFormatter.format(2050, 'year'); // "2050"
DataFormatter.format(5420000000, 'currency'); // "NT$5,420,000,000"
```

### 3. CompanyData

表示單個公司的氣候數據，自動按部分組織。

**特點**：
- ✅ 自動將 CSV 列映射到指標
- ✅ 應用數據格式化
- ✅ 提供按部分訪問的方法

**使用方式**：
```javascript
const company = new CompanyData(rawCsvRecord);

// 獲取特定指標
const metric = company.getMetric('net-zero-status');
console.log(metric.value); // 原始值
console.log(metric.formatted); // 格式化值

// 獲取整個部分
const commitmentData = company.getSection('commitments');
```

### 4. DashboardRenderer

負責將數據渲染到 DOM 中。

**功能**：
- 更新公司名稱標題
- 填充各部分的數據
- 更新節點追蹤器狀態
- 填充值顯示
- 重新初始化交互組件

**使用方式**：
```javascript
const renderer = new DashboardRenderer(document.querySelector('.climate-dashboard'));
renderer.render(companyData); // 渲染完整公司數據
```

### 5. DataManager（主 API）

中央數據管理樞紐，協調所有其他組件。

**主要方法**：

#### `initialize()`
初始化並加載 CSV 數據。
```javascript
await dataManager.initialize();
```

#### `loadCompany(index)`
按索引加載公司。
```javascript
dataManager.loadCompany(0); // 加載第一個公司
```

#### `loadCompanyByName(name)`
按名稱加載公司。
```javascript
dataManager.loadCompanyByName('台灣鋼鐵集團');
```

#### `getCompanyNames()`
獲取所有公司名稱列表。
```javascript
const names = dataManager.getCompanyNames();
// ['公司A', '公司B', '公司C']
```

#### `exportCompanyData(format)`
導出當前公司的數據。
```javascript
const json = dataManager.exportCompanyData('json');
const csv = dataManager.exportCompanyData('csv');
```

## DATA_SCHEMA（數據映射）

`DATA_SCHEMA` 對象定義 CSV 列與 UI 組件之間的映射。

**結構**：
```javascript
'CSV列名': {
    section: '部分名稱',              // commitments, emissions, energy, performance, strategy
    component: '組件類型',             // node-tracker, value-display, chart, text-description
    metric: '指標ID',                  // 用於在 DOM 中識別
    options: ['選項1', '選項2'],        // 僅限 node-tracker
    format: '格式類型',                 // number, percentage, year, currency
    unit: '單位',                      // 可選
    year: 年份                         // 可選，用於多年數據
}
```

**示例**：
```javascript
'是否承諾淨零排放或碳中和': {
    section: 'commitments',
    component: 'node-tracker',
    metric: 'net-zero-status',
    options: ['無承諾', '承諾', '納入策略', '已達成']
}
```

## 設置步驟

### 步驟 1：準備 CSV 文件

確保 CSV 文件：
- 首行包含列標題
- 使用逗號作為分隔符
- 包含所有必需的列（見 plan.md）
- 使用 UTF-8 編碼

**示例 CSV**：
```csv
公司,統一編號,是否承諾淨零排放或碳中和,預計達成淨零排放年份,...
台灣鋼鐵集團,12345678,納入策略,2050,...
台灣煤電公司,87654321,承諾,2060,...
```

### 步驟 2：放置 CSV 文件

將 CSV 文件放在服務器的可訪問位置。建議結構：
```
project-root/
├── index.html
├── styles.css
├── script.js
├── data.js
└── data/
    ├── companies.csv
    └── descriptions.csv
```

### 步驟 3：更新 CSV 路徑

在 `data.js` 中編輯 CSV 路徑：

```javascript
// 在 initializeDataManager 函數中
const CSV_PATH = '/data/companies.csv'; // 更新此路徑
```

### 步驟 4：更新 DATA_SCHEMA（如需要）

如果 CSV 列名或結構不同，在 `data.js` 開頭編輯 `DATA_SCHEMA`：

```javascript
const DATA_SCHEMA = {
    '您的列名': {
        section: 'commitments',
        component: 'node-tracker',
        metric: 'unique-metric-id',
        // ... 其他配置
    },
    // ... 更多列
};
```

## 數據流示例

### 加載單個公司

```javascript
// 初始化
await dataManager.initialize(); // 加載所有公司

// 加載特定公司
const company = dataManager.loadCompany(0);

// 數據已自動渲染到 DOM
// 節點追蹤器已更新
// 值顯示已填充
// 圖表已刷新
```

### 切換公司

```javascript
// 獲取公司列表
const companies = dataManager.getCompanyNames();

// 根據用戶選擇加載
const selectedCompanyName = 'Taiwan Steel Group';
dataManager.loadCompanyByName(selectedCompanyName);

// 儀表板自動更新
```

### 導出數據

```javascript
// 導出為 JSON
const jsonData = dataManager.exportCompanyData('json');
console.log(jsonData);

// 導出為 CSV
const csvData = dataManager.exportCompanyData('csv');
// 可以保存到文件或發送到服務器
```

## 集成年份篩選

要支持多年數據選擇：

```javascript
// 在 script.js 的 handleYearChange 函數中添加：

handleYearChange(e) {
    const selectedYear = e.target.value;
    // 假設您有一個函數來加載特定年份的數據
    dataManager.loadCompanyYear(selectedYear);
}
```

## 高級用法

### 自定義格式化

添加新的格式類型：

```javascript
// 在 DataFormatter 中
static customFormat(value) {
    // 自定義邏輯
    return formattedValue;
}

// 在 DATA_SCHEMA 中使用
format: 'custom'
```

### 條件渲染

在 DashboardRenderer 中添加條件邏輯：

```javascript
// 例如：如果某值存在則顯示特殊標籤
if (data.value === '是') {
    element.classList.add('certified');
}
```

### 數據驗證

在加載前驗證數據：

```javascript
// 在 DataManager.initialize 中
validateRecord(record) {
    if (!record['公司']) {
        console.warn('Missing company name');
        return false;
    }
    return true;
}
```

## 錯誤處理

### CSV 加載失敗

```javascript
try {
    await dataManager.initialize();
} catch (error) {
    console.error('Failed to load CSV:', error);
    // 顯示回退 UI 或使用示例數據
}
```

### 缺少列

如果 CSV 缺少某些列，系統將：
- 顯示 `-` 代替缺失值
- 在控制台記錄警告
- 繼續工作而不會中斷

### 無效的數據類型

格式化器會：
- 嘗試轉換值
- 如果轉換失敗，返回原始值
- 不會拋出錯誤

## 性能考慮

### 大型數據集

對於大量公司（>1000）：
1. 實現分頁加載
2. 使用虛擬滾動
3. 緩存已加載的公司

### 優化示例

```javascript
// 實現簡單的緩存
class DataManager {
    constructor(csvPath) {
        // ... 現有代碼
        this.cache = {};
    }

    loadCompany(index) {
        if (this.cache[index]) {
            return this.cache[index];
        }
        // ... 加載邏輯
        this.cache[index] = this.currentCompany;
    }
}
```

## 測試

### 創建測試 CSV

```csv
公司,統一編號,是否承諾淨零排放或碳中和,預計達成淨零排放年份,是否設定中期溫室氣體絕對減量目標,中期減量目標年設定,中期溫室氣體絕對減量目標值（百分比）
測試公司,99999999,納入策略,2050,已設定,2030,30
```

### 測試步驟

1. 保存上述 CSV 為 `test.csv`
2. 在 `data.js` 中設置路徑為 `/test.csv`
3. 打開儀表板
4. 檢查控制台中是否有加載消息
5. 驗證數據是否正確顯示

## 故障排除

### 數據不顯示

**症狀**：儀表板仍然顯示示例數據

**解決方案**：
1. 檢查瀏覽器控制台中的錯誤
2. 驗證 CSV 路徑正確
3. 確認 CSV 文件可訪問（無 CORS 錯誤）
4. 檢查 CSV 格式（正確的列標題）

### 格式不正確

**症狀**：數字未正確格式化

**解決方案**：
1. 在 DATA_SCHEMA 中驗證格式類型
2. 檢查 CSV 中的數據類型
3. 查看 DataFormatter 中的轉換邏輯

### 缺失數據

**症狀**：某些欄位顯示 `-`

**解決方案**：
1. 驗證 CSV 包含該列
2. 檢查列名是否與 DATA_SCHEMA 匹配
3. 確認數據行不為空

## 下一步

1. **後端 API 集成**：用來自服務器的動態數據替換 CSV
2. **實時更新**：實現 WebSocket 連接以實時數據推送
3. **數據版本控制**：跟蹤數據隨時間的變化
4. **高級分析**：添加比較和趨勢分析功能

## 更多資源

- **plan.md**：完整的數據映射表
- **FEATURES.md**：UI 組件詳解
- **README.md**：項目概述
- **data.js**：源代碼文檔

---

**最後更新**：2025年11月14日
