/**
 * Climate Data Dashboard - Data Integration & Management
 * Handles CSV data loading, processing, and dynamic rendering
 */

// ============================================
// 1. DATA MODEL & SCHEMA
// ============================================

/**
 * Company data schema mapping CSV columns to UI components
 * Format: CSV Column → { section, component, metric, transforms }
 */
const DATA_SCHEMA = {
    // Commitments & Targets
    '是否承諾淨零排放或碳中和': {
        section: 'commitments',
        component: 'node-tracker',
        metric: 'net-zero-status',
        options: ['無承諾', '承諾', '納入策略', '已達成']
    },
    '預計達成淨零排放／碳中和年份': {
        section: 'commitments',
        component: 'value-display',
        metric: 'net-zero-year',
        format: 'year'
    },
    '是否設定中期溫室氣體絕對減量目標': {
        section: 'commitments',
        component: 'node-tracker',
        metric: 'midterm-target-status',
        options: ['未設定', '已設定']
    },
    '中期減量目標年設定': {
        section: 'commitments',
        component: 'value-display',
        metric: 'midterm-target-year',
        format: 'year'
    },
    '中期溫室氣體絕對減量目標值（百分比）': {
        section: 'commitments',
        component: 'value-display',
        metric: 'midterm-reduction-percent',
        format: 'percentage'
    },
    '中期目標是否取得SBT認證': {
        section: 'commitments',
        component: 'node-tracker',
        metric: 'sbt-certification',
        options: ['未認證', '已認證']
    },
    '是否取得RE100認證': {
        section: 'commitments',
        component: 'node-tracker',
        metric: 're100-commitment',
        options: ['未加入', '已加入']
    },

    // Emissions & Disclosure
    '是否揭露2022-2024年溫室氣體排放資料': {
        section: 'emissions',
        component: 'node-tracker',
        metric: 'disclosure-status',
        options: ['未揭露', '部分', '完整']
    },
    '是否揭露各項能源使用細項': {
        section: 'emissions',
        component: 'node-tracker',
        metric: 'energy-breakdown-disclosure',
        options: ['未揭露', '已揭露']
    },
    '類別一至六（值）': {
        section: 'emissions',
        component: 'multi-value',
        metric: 'scope-reporting',
        format: 'number'
    },
    '範疇三（值）': {
        section: 'emissions',
        component: 'value-display',
        metric: 'scope3-emissions',
        format: 'number'
    },
    '是否設定範疇三減量目標': {
        section: 'emissions',
        component: 'node-tracker',
        metric: 'scope3-reduction-target',
        options: ['未設定', '已設定']
    },

    // Energy & Renewables
    '2022年度總能源使用量': {
        section: 'energy',
        component: 'chart',
        metric: 'energy-trend',
        format: 'number',
        year: 2022
    },
    '2023年度總能源使用量': {
        section: 'energy',
        component: 'chart',
        metric: 'energy-trend',
        format: 'number',
        year: 2023
    },
    '2024年度總能源使用量': {
        section: 'energy',
        component: 'chart',
        metric: 'energy-trend',
        format: 'number',
        year: 2024
    },
    '2024總用電量': {
        section: 'energy',
        component: 'value-display',
        metric: 'total-electricity-2024',
        format: 'number'
    },
    '是否設定節能目標': {
        section: 'energy',
        component: 'node-tracker',
        metric: 'energy-efficiency-target',
        options: ['未設定', '已設定']
    },
    '再生能源比例目標值（百分比）': {
        section: 'energy',
        component: 'value-display',
        metric: 're-usage-target-percent',
        format: 'percentage'
    },
    '再生能源使用佔總發電量（百分比）': {
        section: 'energy',
        component: 'value-display',
        metric: 're-actual-percent',
        format: 'percentage'
    },
    '再生能源裝置容量': {
        section: 'energy',
        component: 'value-display',
        metric: 're-capacity',
        format: 'number',
        unit: 'MW'
    },

    // Performance Metrics
    '2022年度總碳排放量': {
        section: 'performance',
        component: 'chart',
        metric: 'emissions-trend',
        format: 'number',
        year: 2022
    },
    '2023年度總碳排放量': {
        section: 'performance',
        component: 'chart',
        metric: 'emissions-trend',
        format: 'number',
        year: 2023
    },
    '2024年度總碳排放量': {
        section: 'performance',
        component: 'chart',
        metric: 'emissions-trend',
        format: 'number',
        year: 2024
    },
    '碳強度': {
        section: 'performance',
        component: 'value-display',
        metric: 'carbon-intensity',
        format: 'number'
    },
    '是否生產支持轉型至低碳經濟之產品/服務': {
        section: 'performance',
        component: 'node-tracker',
        metric: 'lowcarbon-products',
        options: ['未提供', '有提供']
    },
    '支持轉型至低碳經濟之產品/服務產生的營收占比': {
        section: 'performance',
        component: 'value-display',
        metric: 'lowcarbon-revenue-percent',
        format: 'percentage'
    },

    // Strategy & Action
    '關鍵減量策略說明': {
        section: 'strategy',
        component: 'text-description',
        metric: 'reduction-strategy'
    },
    '中期減量基準年設定': {
        section: 'strategy',
        component: 'value-display',
        metric: 'baseline-year',
        format: 'year'
    }
};

// ============================================
// 2. CSV DATA LOADER
// ============================================

/**
 * Load CSV file from URL or local path
 */
class CSVLoader {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = null;
    }

    /**
     * Parse CSV content (simple implementation)
     * For production, consider using a proper CSV library
     */
    async load() {
        try {
            const response = await fetch(this.filePath);
            const csvText = await response.text();
            this.data = this.parseCSV(csvText);
            return this.data;
        } catch (error) {
            console.error('Failed to load CSV:', error);
            throw error;
        }
    }

    /**
     * Simple CSV parser
     * Handles quoted fields and escaped quotes
     */
    parseCSV(csvText) {
        const lines = csvText.split('\n');
        if (lines.length < 2) return [];

        const headers = this.parseCSVLine(lines[0]);
        const records = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            const values = this.parseCSVLine(lines[i]);
            const record = {};

            headers.forEach((header, index) => {
                record[header.trim()] = values[index]?.trim() || '';
            });

            records.push(record);
        }

        return records;
    }

    /**
     * Parse a single CSV line, handling quoted fields
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (insideQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current);
        return result;
    }
}

// ============================================
// 3. DATA FORMATTER
// ============================================

/**
 * Format data values based on type
 */
class DataFormatter {
    static format(value, format, options = {}) {
        if (!value) return '-';

        switch (format) {
            case 'number':
                return this.formatNumber(value, options);
            case 'percentage':
                return this.formatPercentage(value);
            case 'year':
                return String(value);
            case 'currency':
                return this.formatCurrency(value, options);
            default:
                return String(value);
        }
    }

    static formatNumber(value) {
        const num = parseInt(value, 10);
        if (isNaN(num)) return value;

        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString('zh-TW');
    }

    static formatPercentage(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return value;
        return (Math.round(num * 10) / 10).toFixed(1) + '%';
    }

    static formatCurrency(value, options = {}) {
        const num = parseFloat(value);
        if (isNaN(num)) return value;

        const locale = options.locale || 'zh-TW';
        const currency = options.currency || 'TWD';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(num);
    }
}

// ============================================
// 4. COMPANY DATA MODEL
// ============================================

/**
 * Represents a single company's climate data
 */
class CompanyData {
    constructor(rawData) {
        this.raw = rawData;
        this.sections = this.organizeDataBySections();
    }

    /**
     * Organize data into sections based on schema
     */
    organizeDataBySections() {
        const sections = {
            commitments: {},
            emissions: {},
            energy: {},
            performance: {},
            strategy: {}
        };

        Object.entries(DATA_SCHEMA).forEach(([csvColumn, schemaInfo]) => {
            const value = this.raw[csvColumn];
            if (!value) return;

            const section = schemaInfo.section;
            if (!sections[section]) {
                sections[section] = {};
            }

            sections[section][schemaInfo.metric] = {
                value: value,
                schema: schemaInfo,
                formatted: DataFormatter.format(value, schemaInfo.format)
            };
        });

        return sections;
    }

    /**
     * Get specific metric value
     */
    getMetric(metric) {
        for (const section of Object.values(this.sections)) {
            if (section[metric]) {
                return section[metric];
            }
        }
        return null;
    }

    /**
     * Get all metrics for a section
     */
    getSection(sectionName) {
        return this.sections[sectionName] || {};
    }
}

// ============================================
// 5. DASHBOARD RENDERER
// ============================================

/**
 * Render organized data onto the dashboard
 */
class DashboardRenderer {
    constructor(dashboardElement) {
        this.dashboard = dashboardElement;
    }

    /**
     * Render company data to dashboard
     */
    render(companyData) {
        // Update header with company info (if available)
        const companyName = companyData.raw['公司'] || 'Unknown Company';
        const header = document.querySelector('.company-name');
        if (header) {
            header.textContent = companyName;
        }

        // Render each section
        Object.entries(companyData.sections).forEach(([sectionName, metrics]) => {
            this.renderSection(sectionName, metrics);
        });

        // Reinitialize interactive components
        this.reinitializeComponents();
    }

    /**
     * Render a single section's metrics
     */
    renderSection(sectionName, metrics) {
        const section = document.getElementById(sectionName);
        if (!section) return;

        const contentDiv = section.querySelector('.section-content');
        if (!contentDiv) return;

        // Clear existing metrics (preserve section structure)
        const rows = contentDiv.querySelectorAll('.metric-row');
        rows.forEach(row => {
            const metricName = row.querySelector('[data-metric]');
            if (!metricName) {
                row.remove();
            }
        });

        // Update existing metrics with data
        Object.entries(metrics).forEach(([metric, data]) => {
            const tracker = section.querySelector(`[data-metric="${metric}"]`);
            if (tracker) {
                this.updateMetricDisplay(tracker, data);
            }
        });
    }

    /**
     * Update a metric display with data
     */
    updateMetricDisplay(element, data) {
        const component = element.classList.contains('node-tracker') ? 'tracker' : 'value';

        if (component === 'tracker') {
            // Update node tracker
            const options = data.schema.options || [];
            const activeIndex = options.indexOf(data.value);

            const nodes = element.querySelectorAll('.node');
            nodes.forEach((node, index) => {
                node.classList.toggle('active', index === activeIndex);
            });
        } else {
            // Update value display
            const display = element.closest('.metric-row').querySelector('.value-display');
            if (display) {
                display.textContent = data.formatted;
            }
        }
    }

    /**
     * Reinitialize JavaScript components after rendering
     */
    reinitializeComponents() {
        if (typeof initializeNodeTrackers === 'function') {
            initializeNodeTrackers();
        }
        if (typeof initializeChartComponents === 'function') {
            initializeChartComponents();
        }
    }
}

// ============================================
// 6. DATA MANAGER (Main API)
// ============================================

/**
 * Central data management hub
 */
class DataManager {
    constructor(csvPath) {
        this.csvPath = csvPath;
        this.loader = new CSVLoader(csvPath);
        this.companies = [];
        this.currentCompany = null;
        this.renderer = new DashboardRenderer(document.querySelector('.climate-dashboard'));
    }

    /**
     * Initialize and load data
     */
    async initialize() {
        try {
            console.log('Loading data from:', this.csvPath);
            const data = await this.loader.load();
            this.companies = data.map(record => new CompanyData(record));
            console.log(`Loaded ${this.companies.length} companies`);
            return this.companies;
        } catch (error) {
            console.error('Failed to initialize data:', error);
            // Continue with empty state for demo
            return [];
        }
    }

    /**
     * Load specific company by index
     */
    loadCompany(index) {
        if (index < 0 || index >= this.companies.length) {
            console.error('Company index out of range');
            return null;
        }

        this.currentCompany = this.companies[index];
        this.renderer.render(this.currentCompany);
        return this.currentCompany;
    }

    /**
     * Load company by name
     */
    loadCompanyByName(name) {
        const company = this.companies.find(c => c.raw['公司'] === name);
        if (company) {
            this.currentCompany = company;
            this.renderer.render(company);
            return company;
        }
        return null;
    }

    /**
     * Get list of all company names
     */
    getCompanyNames() {
        return this.companies.map(c => c.raw['公司'] || 'Unknown');
    }

    /**
     * Export data for a specific company
     */
    exportCompanyData(format = 'json') {
        if (!this.currentCompany) {
            console.error('No company loaded');
            return null;
        }

        switch (format) {
            case 'json':
                return JSON.stringify(this.currentCompany.raw, null, 2);
            case 'csv':
                return this.convertToCSV(this.currentCompany.raw);
            default:
                return null;
        }
    }

    /**
     * Convert data to CSV format
     */
    convertToCSV(record) {
        const headers = Object.keys(record);
        const values = Object.values(record);

        const headerLine = headers.map(h => `"${h}"`).join(',');
        const valueLine = values.map(v => `"${v}"`).join(',');

        return headerLine + '\n' + valueLine;
    }
}

// ============================================
// 7. GLOBAL INITIALIZATION
// ============================================

// Create global data manager instance
let dataManager = null;

/**
 * Initialize data manager (called when DOM is ready)
 */
async function initializeDataManager() {
    // Note: Update CSV_PATH to point to actual CSV file
    const CSV_PATH = '/data/sample.csv'; // Update this path

    dataManager = new DataManager(CSV_PATH);

    try {
        await dataManager.initialize();

        // Load first company if available
        if (dataManager.companies.length > 0) {
            dataManager.loadCompany(0);
            console.log('Data manager initialized successfully');
        } else {
            console.warn('No companies loaded. Using demo mode.');
        }
    } catch (error) {
        console.error('Data manager initialization failed:', error);
    }
}

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Delay initialization slightly to allow other components to load
        setTimeout(initializeDataManager, 100);
    });
} else {
    initializeDataManager();
}

// ============================================
// 8. EXPORT FOR MODULE USAGE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CSVLoader,
        DataFormatter,
        CompanyData,
        DashboardRenderer,
        DataManager,
        initializeDataManager
    };
}
