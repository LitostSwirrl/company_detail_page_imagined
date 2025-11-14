# Company Climate Data Dashboard - Redesign Plan

## Overview
This document outlines the redesign strategy for the company climate data section of the "排碳大戶觀測站" dashboard, replacing the current grid layout (highlighted red box area) with a clear, category-based visualization system inspired by Netzerotracker's design patterns while using our comprehensive climate data.

---

## 1. Data Categorization Strategy

We will organize our 54+ data fields into **5 main thematic sections**, each with a distinct color scheme and icon:

### Section 1: COMMITMENTS & TARGETS (Color: Blue)
**Focus**: Company's net-zero and mid-term emission reduction commitments

#### Key Metrics to Display:
1. **Net Zero Commitment Status**
   - Field: 是否承諾淨零排放或碳中和
   - Status Options: No Commitment | Pledged | In Corporate Strategy | Achieved
   - Visual: Node tracker (4 options)

2. **Net Zero Target Year**
   - Field: 預計達成淨零排放／碳中和年份
   - Display: Direct year value (e.g., 2050)
   - Visual: Text badge or timeline marker

3. **Mid-term Reduction Target Status**
   - Field: 是否設定中期溫室氣體絕對減量目標
   - Status: Yes | No
   - Visual: Node tracker (2 options)

4. **Mid-term Target Year & Reduction %**
   - Fields: 中期減量目標年設定, 中期溫室氣體絕對減量目標值
   - Display: "2030 Target: 30% reduction from [baseline year]"
   - Visual: Text + progress bar

5. **SBT Certification**
   - Field: 中期目標是否取得SBT認證
   - Status: No | Yes (Validated)
   - Visual: Badge or node tracker

6. **RE100 Certification**
   - Field: 是否取得RE100認證
   - Status: No | Yes
   - Visual: Badge or node tracker

---

### Section 2: EMISSIONS & DISCLOSURE (Color: Purple)
**Focus**: What emissions the company reports and how comprehensively they cover Scopes 1, 2, and 3

#### Key Metrics to Display:
1. **Overall Disclosure Status**
   - Field: 是否揭露2022-2024年溫室氣體排放資料
   - Status: No Disclosure | Partial | Complete
   - Visual: Node tracker (3 options)

2. **Energy Breakdown Disclosure**
   - Field: 是否揭露各項能源使用細項
   - Status: No | Yes
   - Visual: Node tracker (2 options)

3. **Scope 1 Reporting**
   - Field: 類別一至六（值） [Available: Yes/No for each]
   - Status: Not Reported | Reported
   - Visual: Node tracker

4. **Scope 2 Reporting**
   - Field: 類別一至六（值）
   - Status: Not Reported | Reported
   - Visual: Node tracker

5. **Scope 3 Reporting & Reduction Targets**
   - Field: 範疇三（值）+ 是否設定範疇三減量目標
   - Status: Not Reported | Reported (No Target) | Reported (Target Set)
   - Visual: Node tracker (3 options)

6. **Scope 3 Reduction Actions**
   - Field: 範疇三減量目標實際作為
   - Display: Description of actions taken
   - Visual: Text description

7. **GHG Types Covered**
   - Field: [Implied from available scope data]
   - Status: CO2 Only | CO2 + Others
   - Visual: Node tracker (2 options)

---

### Section 3: ENERGY & RENEWABLES (Color: Green)
**Focus**: Company's energy consumption, efficiency improvements, and renewable energy adoption

#### Key Metrics to Display:
1. **Energy Consumption Trend**
   - Fields: 2022/2023/2024年度總能源使用量
   - Display: Line chart or trend visualization
   - Visual: Interactive chart showing 3-year trend

2. **Electricity Consumption (2024)**
   - Field: 2024總用電量
   - Display: Direct value
   - Visual: Numeric display + sparkline

3. **Energy Efficiency Targets**
   - Field: 是否設定節能目標
   - Status: No | Yes
   - Visual: Node tracker (2 options)

4. **Annual Energy Saving Rate Target**
   - Field: 年節電率目標
   - Display: Percentage target
   - Visual: Numeric display + progress indicator

5. **Energy Efficiency Improvement Rate (2022-2024)**
   - Field: 22-24能效進步率
   - Display: Percentage improvement
   - Visual: Percentage badge

6. **Renewable Energy Capacity**
   - Field: 再生能源裝置容量
   - Display: MW/kW capacity installed
   - Visual: Numeric display

7. **RE100 Certification Status**
   - Field: 是否取得RE100認證
   - Status: No | Yes
   - Visual: Badge

8. **Renewable Energy Target Status**
   - Field: 是否設定再生能源使用目標
   - Status: No | Yes
   - Visual: Node tracker (2 options)

9. **Renewable Energy Usage Target %**
   - Field: 再生能源比例目標值
   - Display: Percentage target
   - Visual: Numeric display

10. **Actual Renewable Energy Usage %**
    - Field: 再生能源使用佔總發電量
    - Display: Actual percentage achieved
    - Visual: Percentage badge + comparison to target

11. **Renewable Energy Sources**
    - Field: 再生能源使用來源
    - Options: Self-generation (自發自用) | Power Purchase Agreement (購電協議) | RE Certificates (再生能源憑證)
    - Visual: Multi-select node tracker or icon list

12. **Government RE Obligation Compliance**
    - Field: 是否達成政府用電大戶再生能源建置義務
    - Status: Not Applicable | Not Met | Met
    - Visual: Node tracker (3 options)

---

### Section 4: PERFORMANCE METRICS (Color: Orange)
**Focus**: Company's climate performance indicators and economic impact

#### Key Metrics to Display:
1. **Emissions Trend (2022-2024)**
   - Fields: 22/23/24年總碳排放量
   - Display: Line chart or trend
   - Visual: Interactive chart showing 3-year trend with annual values

2. **Carbon Intensity Trend**
   - Fields: 24/23/22碳強度
   - Display: Values for 3 years (tons CO2e per unit)
   - Visual: Line chart or comparison badges

3. **Carbon Fee Impact (Annual)**
   - Fields: 碳費基準每噸300元（萬）, 300佔淨利
   - Display: Annual carbon fee + % of net profit
   - Visual: Numeric display showing cost and % impact

4. **Low-Carbon Products/Services**
   - Field: 是否生產支持轉型至低碳經濟之產品/服務
   - Status: No | Yes
   - Visual: Node tracker (2 options)

5. **Low-Carbon Revenue Contribution**
   - Field: 支持轉型至低碳經濟之產品/服務產生的營收占比
   - Display: Percentage of total revenue
   - Visual: Percentage badge or small bar

6. **Revenue Growth**
   - Fields: 22/23/24營收
   - Display: Year-over-year revenue
   - Visual: Bar chart showing 3-year trend

---

### Section 5: STRATEGY & ACTION (Color: Pink)
**Focus**: Company's detailed climate strategies and reporting mechanisms

#### Key Metrics to Display:
1. **Key Reduction Strategies**
   - Field: 關鍵減量策略說明
   - Display: Description text
   - Visual: Text box with collapsible/expandable content

2. **Energy Use Breakdown (2024)**
   - Field: 2024年度使用的各種能源項目
   - Display: Energy types and quantities
   - Visual: Text list or small pie chart

3. **Baseline Year & Amount**
   - Fields: 中期減量基準年設定, 中期減量基準年排放量
   - Display: Baseline year + emissions amount
   - Visual: Text display with reference marker

---

## 2. Visual Design System

### 2.1 Core Visualization Method: Status Node Tracker

**Purpose**: Provide immediate visual clarity on categorical/status-based metrics

**Design Specifications**:
- **Nodes**: Circular elements (24-32px diameter)
- **States**:
  - **Selected/Active**: Solid filled circle with category color
  - **Unselected/Inactive**: Light gray (RGB: 220, 220, 220) hollow circle with subtle border
- **Spacing**: 8-12px between nodes
- **Interaction**: Subtle hover effects to show interactivity (if clickable)

**Color Palette**:
```
Section 1 (Commitments & Targets):   Blue (#0066CC)
Section 2 (Emissions & Disclosure):  Purple (#7030A0)
Section 3 (Energy & Renewables):     Green (#00B050)
Section 4 (Performance Metrics):     Orange (#FF8C00)
Section 5 (Strategy & Action):       Pink (#E81B23)
Inactive/Gray:                       Light Gray (#DCDCDC)
```

### 2.2 Component Types

1. **Node Tracker Row**
   - Question/Label (left side, 40% width)
   - Node options (right side, 60% width)
   - Height: 60px
   - Alignment: Vertical center alignment

2. **Data Value Display**
   - Direct values with unit labels
   - Year-to-year comparisons
   - Percentage badges
   - Can include inline sparklines

3. **Chart Visualizations**
   - Line charts for trends (3-year data)
   - Bar charts for comparisons
   - Minimal design (no unnecessary gridlines)
   - Color-coded per section

4. **Text Description Box**
   - For qualitative data (strategies, descriptions)
   - Expandable/collapsible for space efficiency
   - Max-width: 600px
   - Font: Body text, 14px

### 2.3 Section Layout

Each section follows this structure:
```
┌─────────────────────────────────────────┐
│ [Section Icon] SECTION TITLE            │ (Color bar on left)
├─────────────────────────────────────────┤
│ Metric 1 Label        ○ ○ ● ○ ○        │
│                                         │
│ Metric 2 Label        ● ○ ○            │
│                                         │
│ Metric 3 Label        [2030] [30%]      │
│                                         │
│ Metric 4: Trend Chart                   │
│ ┌─────────────────────────────────────┐ │
│ │ (Sparkline or small chart)          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Metric 5 Description                    │
│ "Key emission reduction strategy..."    │
│                                         │
└─────────────────────────────────────────┘
```

**Spacing Guidelines**:
- Section padding: 24px
- Between metric rows: 16px
- Between sections: 32px

---

## 3. Overall Page Layout

### Top-Level Structure:
```
┌──────────────────────────────────────────────────────┐
│ Company Name | Year Filter | Comparison Button       │ (Existing Header)
├──────────────────────────────────────────────────────┤
│ Annual Emissions: 18,066,406 tons | Status Badges    │ (Existing Summary)
├──────────────────────────────────────────────────────┤
│                    CLIMATE DATA DASHBOARD             │
├──────────────────────────────────────────────────────┤
│ [COMMITMENTS] [EMISSIONS] [ENERGY] [PERFORMANCE]     │ (Category Navigation)
│                [STRATEGY & ACTION]                   │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ▯ COMMITMENTS & TARGETS                            │
│  ├─ Metric 1: Status tracker                        │
│  ├─ Metric 2: Status tracker                        │
│  ├─ Metric 3: Value display                         │
│  └─ Metric 4: Status tracker                        │
│                                                       │
│  ▯ EMISSIONS & DISCLOSURE                            │
│  ├─ Metric 1: Status tracker                        │
│  ├─ Metric 2: Status tracker                        │
│  └─ Metric 3: Description                           │
│                                                       │
│  [Continue for remaining sections...]                │
│                                                       │
├──────────────────────────────────────────────────────┤
│ (Existing Radar Chart & Historical Emissions Chart)  │
├──────────────────────────────────────────────────────┤
│ (Existing Emissions Reduction Timeline)              │
└──────────────────────────────────────────────────────┘
```

### Navigation Approach:
- **Option A (Tab Navigation)**: Category buttons at top - clicking scrolls to that section
- **Option B (Sticky Navigation)**: Side navigation bar with category links
- **Recommendation**: Option A (matches Netzerotracker's horizontal nav approach)

---

## 4. Data Mapping & Structure

### CSV Column to UI Component Mapping:

| CSV Column | Section | Component Type | Display Logic |
|-----------|---------|-----------------|----------------|
| 統一編號 | N/A | Company ID (internal) | Hidden/For reference |
| 是否承諾淨零排放或碳中和 | Commitments | Node Tracker | [No] [Pledged] [In Strategy] [Achieved] |
| 預計達成淨零排放年份 | Commitments | Value Display | "2050" with badge |
| 是否設定中期絕對減量目標 | Commitments | Node Tracker | [No] [Yes] |
| 中期減量目標年設定 | Commitments | Value Display | Year (e.g., 2030) |
| 中期溫室氣體絕對減量目標值 | Commitments | Value Display + Chart | Percentage with baseline reference |
| 中期目標是否取得SBT認證 | Commitments | Badge/Node | [No] [Yes] |
| 是否取得RE100認證 | Energy & Renewables | Badge/Node | [No] [Yes] |
| 是否揭露2022-2024溫室氣體排放資料 | Emissions | Node Tracker | [No] [Partial] [Complete] |
| 類別一至六（值） | Emissions | Node Tracker + Value | Individual status per scope + value display |
| 範疇三（值）+目標 | Emissions | Node Tracker + Value | [Not Reported] [Reported - No Target] [Reported - Target Set] |
| 2022/2023/2024年度總能源使用量 | Energy | Chart | Line chart with 3-year trend |
| 2024總用電量 | Energy | Value Display | Numeric with unit |
| 是否設定節能目標 | Energy | Node Tracker | [No] [Yes] |
| 年節電率目標 | Energy | Value Display | Percentage |
| 22-24能效進步率 | Energy | Value Display | Percentage improvement |
| 再生能源裝置容量 | Energy | Value Display | MW/capacity |
| 再生能源比例目標值 | Energy | Value Display | Percentage target |
| 再生能源使用佔總發電量 | Energy | Value Display + Comparison | Actual % vs target % |
| 再生能源使用來源 | Energy | Multi-select Node | Icons/checkmarks for: Self | PPA | Certificates |
| 22/23/24年總碳排放量 | Performance | Chart | Line chart with 3-year trend |
| 24/23/22碳強度 | Performance | Value Display | Multiple years displayed |
| 碳費基準每噸300元 & 占淨利 | Performance | Value Display | Cost + % of profit |
| 是否生產低碳經濟轉型產品/服務 | Performance | Node Tracker | [No] [Yes] |
| 低碳產品營收占比 | Performance | Value Display | Percentage of revenue |
| 22/23/24營收 | Performance | Chart | Bar chart 3-year |
| 關鍵減量策略說明 | Strategy | Text Box | Expandable description |
| 2024年度使用的各種能源項目 | Strategy | List/Breakdown | Energy types listed |

---

## 5. Design Features & Interactions

### 5.1 Information Hierarchy
- **Primary**: Status at a glance (node tracker)
- **Secondary**: Specific values, years, percentages
- **Tertiary**: Detailed descriptions, strategies

### 5.2 Progressive Disclosure
- Main section headers show summary status
- Expand sections to see detailed metrics
- Hover over metrics to reveal explanatory tooltips/help icons

### 5.3 Responsive Considerations
- **Desktop (1200px+)**: Full horizontal layout with node trackers side-by-side
- **Tablet (768-1199px)**: Stacked node trackers with adjusted spacing
- **Mobile (< 768px)**: Single column layout, node trackers may wrap

### 5.4 Accessibility
- Color-blind friendly palette (avoid red-green only)
- High contrast for node states (filled vs outline)
- ARIA labels for each node tracker section
- Help text/tooltips for complex metrics

---

## 6. Prototype Development Phases

### Phase 1: Foundation
- [ ] Create HTML structure for all 5 sections
- [ ] Define CSS variables for colors, spacing, typography
- [ ] Build reusable node tracker component
- [ ] Build basic section layouts

### Phase 2: Visualization Components
- [ ] Implement chart components (line charts, bar charts)
- [ ] Create data value display components
- [ ] Build text description boxes
- [ ] Add hover/interaction states

### Phase 3: Navigation & Interactivity
- [ ] Add category navigation/tab functionality
- [ ] Implement smooth scrolling to sections
- [ ] Add expand/collapse for descriptions
- [ ] Add tooltips/help icons

### Phase 4: Styling & Polish
- [ ] Apply final color scheme consistently
- [ ] Ensure responsive design works
- [ ] Add animations/transitions
- [ ] Test accessibility features

### Phase 5: Data Integration
- [ ] Connect with CSV data source
- [ ] Implement dynamic rendering
- [ ] Add year/filter functionality
- [ ] Performance optimization

---

## 7. Key Design Principles

1. **Clarity First**: Status at a glance, details on demand
2. **Color Consistency**: Same color represents same category throughout
3. **Minimalism**: Remove chart clutter, use clean lines
4. **Progression**: Guide user through story: Commitments → Emissions → Energy → Performance → Strategy
5. **Accessibility**: High contrast, color-blind safe, semantic HTML
6. **Responsive**: Works on all device sizes

---

## 8. Success Criteria

- [ ] All 54+ data fields have a designated visualization
- [ ] Users can understand company status in < 10 seconds per section
- [ ] Node tracker system provides clearer status indication than current grid
- [ ] Design is consistent with Netzerotracker's approach but uses our data structure
- [ ] Responsive design works on desktop, tablet, mobile
- [ ] WCAG 2.1 AA accessibility standards met

---

## Notes for Next Steps

This plan.md serves as the blueprint for development. Once approved/edited:
1. Update this plan.md with any changes
2. Use this as reference while building the prototype HTML/CSS
3. Create component library for reusable elements
4. Implement with mock data first, then integrate CSV data

---

**Created**: November 14, 2025
**Status**: Ready for Review & Editing
