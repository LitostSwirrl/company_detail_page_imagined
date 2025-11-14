/**
 * Climate Data Dashboard - Chart & Data Visualization Components
 * Implements simple trend visualizations and data displays
 */

// ============================================
// 1. CHART TYPES & UTILITIES
// ============================================

/**
 * Simple Sparkline Renderer - Creates a compact trend visualization
 */
class Sparkline {
    constructor(container, data, options = {}) {
        this.container = container;
        this.data = data;
        this.options = {
            width: options.width || 300,
            height: options.height || 60,
            color: options.color || '#0066CC',
            lineWidth: options.lineWidth || 2,
            showPoints: options.showPoints !== false,
            pointColor: options.pointColor || '#0066CC',
            pointSize: options.pointSize || 4,
            ...options
        };
        this.render();
    }

    render() {
        const svg = this.createSVG();
        this.container.innerHTML = '';
        this.container.appendChild(svg);
    }

    createSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const padding = 10; // Add padding to prevent overflow
        svg.setAttribute('viewBox', `0 0 ${this.options.width} ${this.options.height}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.width = '100%';
        svg.style.height = '100%';

        if (this.data.length < 2) return svg;

        // Calculate scale with padding
        const min = Math.min(...this.data);
        const max = Math.max(...this.data);
        const range = max - min || 1;

        // Create path for line with padding
        const chartWidth = this.options.width - (padding * 2);
        const chartHeight = this.options.height - (padding * 2);
        const points = this.data.map((value, index) => {
            const x = padding + (index / (this.data.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((value - min) / range) * chartHeight;
            return { x, y, value };
        });

        // Draw line
        const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.setAttribute('d', pathData);
        line.setAttribute('stroke', this.options.color);
        line.setAttribute('stroke-width', this.options.lineWidth);
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(line);

        // Draw points
        if (this.options.showPoints) {
            points.forEach((point, index) => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', point.x);
                circle.setAttribute('cy', point.y);
                circle.setAttribute('r', this.options.pointSize);
                circle.setAttribute('fill', this.options.pointColor);
                circle.setAttribute('opacity', index === points.length - 1 ? '1' : '0.5');
                svg.appendChild(circle);
            });
        }

        // Add gradient background
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', `sparkline-gradient-${Date.now()}`);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', this.options.color);
        stop1.setAttribute('stop-opacity', '0.2');
        gradient.appendChild(stop1);

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', this.options.color);
        stop2.setAttribute('stop-opacity', '0.01');
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);

        // Draw fill area with padding
        const lastPoint = points[points.length - 1];
        const firstPoint = points[0];
        const bottomY = this.options.height - padding;
        const fillPathData = `${pathData} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;
        const fill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        fill.setAttribute('d', fillPathData);
        fill.setAttribute('fill', `url(#sparkline-gradient-${Date.now() - 1})`);
        svg.insertBefore(fill, line);

        return svg;
    }
}

/**
 * Simple Bar Chart Renderer - Creates a horizontal bar visualization
 */
class SimpleBarChart {
    constructor(container, data, options = {}) {
        this.container = container;
        this.data = data;
        this.options = {
            height: options.height || 'auto',
            colors: options.colors || ['#0066CC', '#7030A0', '#00B050'],
            ...options
        };
        this.render();
    }

    render() {
        const html = this.createHTML();
        this.container.innerHTML = html;
    }

    createHTML() {
        const max = Math.max(...this.data.map(d => d.value));
        let html = '<div class="simple-bar-chart">';

        this.data.forEach((item, index) => {
            const percentage = (item.value / max) * 100;
            const color = this.options.colors[index % this.options.colors.length];

            html += `
                <div class="bar-item">
                    <label class="bar-label">${item.label}</label>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${percentage}%; background-color: ${color};" title="${item.value}">
                            <span class="bar-value">${this.formatValue(item.value)}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    formatValue(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return value;
    }
}

/**
 * Simple Pie Chart Renderer - Creates a simple pie visualization
 */
class SimplePieChart {
    constructor(container, data, options = {}) {
        this.container = container;
        this.data = data;
        this.options = {
            colors: options.colors || ['#0066CC', '#7030A0', '#00B050', '#FF8C00', '#E81B23'],
            ...options
        };
        this.render();
    }

    render() {
        const svg = this.createSVG();
        this.container.innerHTML = '';
        this.container.appendChild(svg);
    }

    createSVG() {
        const size = 200;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.width = '200px';
        svg.style.height = '200px';

        const total = this.data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -90;

        this.data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;

            const slice = this.createSlice(size / 2, size / 2, size / 2 - 10, startAngle, endAngle, this.options.colors[index % this.options.colors.length]);
            svg.appendChild(slice);

            currentAngle = endAngle;
        });

        return svg;
    }

    createSlice(cx, cy, radius, startAngle, endAngle, color) {
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = cx + radius * Math.cos(startRad);
        const y1 = cy + radius * Math.sin(startRad);
        const x2 = cx + radius * Math.cos(endRad);
        const y2 = cy + radius * Math.sin(endRad);

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        path.setAttribute('d', pathData);
        path.setAttribute('fill', color);
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', '1');

        return path;
    }
}

/**
 * Data Table Renderer - Creates a simple formatted data table
 */
class DataTable {
    constructor(container, data, options = {}) {
        this.container = container;
        this.data = data;
        this.options = {
            headers: options.headers || [],
            ...options
        };
        this.render();
    }

    render() {
        const html = this.createHTML();
        this.container.innerHTML = html;
    }

    createHTML() {
        let html = '<table class="data-table"><thead><tr>';

        // Create headers
        if (this.options.headers.length > 0) {
            this.options.headers.forEach(header => {
                html += `<th>${header}</th>`;
            });
        } else if (this.data.length > 0) {
            Object.keys(this.data[0]).forEach(key => {
                html += `<th>${key}</th>`;
            });
        }

        html += '</tr></thead><tbody>';

        // Create rows
        this.data.forEach(row => {
            html += '<tr>';
            Object.values(row).forEach(value => {
                html += `<td>${value}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }
}

/**
 * Comparison Card Renderer - Creates a side-by-side comparison display
 */
class ComparisonCard {
    constructor(container, data, options = {}) {
        this.container = container;
        this.data = data;
        this.options = {
            ...options
        };
        this.render();
    }

    render() {
        const html = this.createHTML();
        this.container.innerHTML = html;
    }

    createHTML() {
        let html = '<div class="comparison-cards">';

        this.data.forEach(item => {
            const trend = item.trend || 'neutral';
            const trendIcon = {
                'up': '↑',
                'down': '↓',
                'neutral': '→'
            }[trend];

            html += `
                <div class="comparison-card ${trend}">
                    <div class="card-label">${item.label}</div>
                    <div class="card-value">${item.value}</div>
                    <div class="card-trend">${trendIcon} ${item.change || ''}</div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }
}

/**
 * Progress Bar Renderer - Creates a visual progress indicator
 */
class ProgressBar {
    constructor(container, value, max = 100, options = {}) {
        this.container = container;
        this.value = value;
        this.max = max;
        this.options = {
            color: options.color || '#00B050',
            showLabel: options.showLabel !== false,
            ...options
        };
        this.render();
    }

    render() {
        const html = this.createHTML();
        this.container.innerHTML = html;
    }

    createHTML() {
        const percentage = (this.value / this.max) * 100;
        let html = `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%; background-color: ${this.options.color};">
        `;

        if (this.options.showLabel) {
            html += `<span class="progress-label">${percentage.toFixed(1)}%</span>`;
        }

        html += `
                    </div>
                </div>
            </div>
        `;

        return html;
    }
}

/**
 * Status Timeline Renderer - Creates a visual timeline of status changes
 */
class StatusTimeline {
    constructor(container, events, options = {}) {
        this.container = container;
        this.events = events;
        this.options = {
            colors: options.colors || ['#0066CC', '#7030A0', '#00B050'],
            ...options
        };
        this.render();
    }

    render() {
        const html = this.createHTML();
        this.container.innerHTML = html;
    }

    createHTML() {
        let html = '<div class="status-timeline">';

        this.events.forEach((event, index) => {
            const color = this.options.colors[index % this.options.colors.length];

            html += `
                <div class="timeline-item">
                    <div class="timeline-marker" style="background-color: ${color};"></div>
                    <div class="timeline-content">
                        <div class="timeline-year">${event.year}</div>
                        <div class="timeline-title">${event.title}</div>
                        <div class="timeline-description">${event.description || ''}</div>
                    </div>
                </div>
            `;

            if (index < this.events.length - 1) {
                html += `<div class="timeline-connector" style="background-color: ${color};"></div>`;
            }
        });

        html += '</div>';
        return html;
    }
}

// ============================================
// 2. CHART INITIALIZATION
// ============================================

function initializeCharts() {
    // Find all chart containers and initialize them with sample data
    const containers = document.querySelectorAll('.chart-placeholder');

    containers.forEach((container) => {
        const parent = container.closest('.metric-row');
        // Get label from parent metric-row or from chart-group heading
        let label = 'Chart';
        if (parent) {
            label = parent.querySelector('.metric-label label')?.textContent || 'Chart';
        } else {
            // Try to get label from chart-group heading
            const chartGroup = container.closest('.chart-group');
            if (chartGroup) {
                const heading = chartGroup.querySelector('h3');
                label = heading?.textContent || 'Chart';
            }
        }

        // Sample data - would be replaced with real data in Phase 5
        if (label.includes('能源消耗')) {
            const data = [1250000, 1235000, 1210000];
            const sparklineContainer = document.createElement('div');
            sparklineContainer.style.height = '100px';
            container.innerHTML = '';
            container.appendChild(sparklineContainer);
            new Sparkline(sparklineContainer, data, {
                color: '#00B050',
                width: 300,
                height: 100
            });

            // Add labels
            const labels = document.createElement('div');
            labels.style.display = 'flex';
            labels.style.justifyContent = 'space-between';
            labels.style.marginTop = '8px';
            labels.innerHTML = '<span>2022<br>1,250,000</span><span>2023<br>1,235,000</span><span>2024<br>1,210,000</span>';
            labels.style.fontSize = '12px';
            labels.style.color = '#666';
            container.appendChild(labels);
        } else if (label.includes('年度排放量趨勢')) {
            const data = [18500000, 18250000, 18066406];
            const sparklineContainer = document.createElement('div');
            sparklineContainer.style.height = '100px';
            container.innerHTML = '';
            container.appendChild(sparklineContainer);
            new Sparkline(sparklineContainer, data, {
                color: '#E81B23',
                width: 300,
                height: 100
            });

            // Add labels
            const labels = document.createElement('div');
            labels.style.display = 'flex';
            labels.style.justifyContent = 'space-between';
            labels.style.marginTop = '8px';
            labels.innerHTML = '<span>2022<br>18,500,000</span><span>2023<br>18,250,000</span><span>2024<br>18,066,406</span>';
            labels.style.fontSize = '12px';
            labels.style.color = '#666';
            container.appendChild(labels);
        } else if (label.includes('營收趨勢')) {
            const data = [
                { label: '2022', value: 21765 },
                { label: '2023', value: 22240 },
                { label: '2024', value: 23150 }
            ];
            container.innerHTML = '';
            new SimpleBarChart(container, data, {
                colors: ['#0066CC']
            });
        }
    });
}

// ============================================
// 3. CHART STYLES (Dynamic CSS Injection)
// ============================================

function injectChartStyles() {
    const styles = `
        /* Simple Bar Chart */
        .simple-bar-chart {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .bar-item {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .bar-label {
            min-width: 100px;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            text-align: right;
        }

        .bar-container {
            flex: 1;
            background-color: #f5f5f5;
            height: 24px;
            border-radius: 4px;
            overflow: hidden;
        }

        .bar-fill {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 8px;
            position: relative;
        }

        .bar-value {
            font-size: 12px;
            font-weight: 600;
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* Comparison Cards */
        .comparison-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 12px;
        }

        .comparison-card {
            background-color: #f5f5f5;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #0066CC;
            text-align: center;
        }

        .comparison-card.up {
            border-left-color: #00B050;
        }

        .comparison-card.down {
            border-left-color: #E81B23;
        }

        .card-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
        }

        .card-value {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }

        .card-trend {
            font-size: 14px;
            font-weight: 600;
            color: #00B050;
        }

        .comparison-card.down .card-trend {
            color: #E81B23;
        }

        /* Progress Bar */
        .progress-container {
            width: 100%;
        }

        .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }

        .progress-fill {
            height: 100%;
            background-color: #00B050;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 20px;
        }

        .progress-label {
            font-size: 12px;
            color: white;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* Data Table */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        .data-table thead {
            background-color: #f5f5f5;
        }

        .data-table th,
        .data-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #dcdcdc;
        }

        .data-table th {
            font-weight: 600;
            color: #333;
        }

        .data-table tbody tr:hover {
            background-color: #fafafa;
        }

        /* Status Timeline */
        .status-timeline {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 20px 0;
        }

        .timeline-item {
            display: flex;
            gap: 16px;
        }

        .timeline-marker {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            margin-top: 4px;
            flex-shrink: 0;
        }

        .timeline-content {
            flex: 1;
        }

        .timeline-year {
            font-weight: bold;
            color: #333;
            font-size: 16px;
        }

        .timeline-title {
            font-weight: 600;
            color: #333;
            margin-top: 4px;
        }

        .timeline-description {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }

        .timeline-connector {
            width: 2px;
            height: 40px;
            margin-left: 7px;
            background-color: #dcdcdc;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// ============================================
// 3.5 TREND CHARTS INITIALIZATION
// ============================================

function initializeTrendCharts() {
    const years = ['2022', '2023', '2024'];

    // Energy Consumption Trend (in GJ, normalized for display)
    const energyData = [1250000, 1235000, 1210000];
    const energyChart = document.getElementById('energy-trend-chart');
    if (energyChart) {
        // Create wrapper for chart and labels
        energyChart.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '200px';

        // Add Y-axis label
        const yLabel = document.createElement('div');
        yLabel.textContent = '能源消耗 (GJ)';
        yLabel.style.position = 'absolute';
        yLabel.style.left = '0';
        yLabel.style.top = '0';
        yLabel.style.fontSize = '12px';
        yLabel.style.color = '#666';
        yLabel.style.fontWeight = '600';
        wrapper.appendChild(yLabel);

        // Add chart container
        const chartContainer = document.createElement('div');
        chartContainer.style.width = '100%';
        chartContainer.style.height = '160px';
        chartContainer.style.marginTop = '20px';
        wrapper.appendChild(chartContainer);

        new Sparkline(chartContainer, energyData, {
            color: '#00B050',
            width: 600,
            height: 160,
            showPoints: true,
            pointSize: 5
        });

        // Add X-axis labels
        const xLabels = document.createElement('div');
        xLabels.style.display = 'flex';
        xLabels.style.justifyContent = 'space-between';
        xLabels.style.marginTop = '5px';
        xLabels.style.fontSize = '12px';
        xLabels.style.color = '#666';
        years.forEach(year => {
            const label = document.createElement('span');
            label.textContent = year;
            xLabels.appendChild(label);
        });
        wrapper.appendChild(xLabels);

        energyChart.appendChild(wrapper);
    }

    // Emissions Trend (in tonnes)
    const emissionsData = [18500000, 18250000, 18066406];
    const emissionsChart = document.getElementById('emissions-trend-chart');
    if (emissionsChart) {
        emissionsChart.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '200px';

        const yLabel = document.createElement('div');
        yLabel.textContent = '溫室氣體排放 (噸 CO2e)';
        yLabel.style.position = 'absolute';
        yLabel.style.left = '0';
        yLabel.style.top = '0';
        yLabel.style.fontSize = '12px';
        yLabel.style.color = '#666';
        yLabel.style.fontWeight = '600';
        wrapper.appendChild(yLabel);

        const chartContainer = document.createElement('div');
        chartContainer.style.width = '100%';
        chartContainer.style.height = '160px';
        chartContainer.style.marginTop = '20px';
        wrapper.appendChild(chartContainer);

        new Sparkline(chartContainer, emissionsData, {
            color: '#E81B23',
            width: 600,
            height: 160,
            showPoints: true,
            pointSize: 5
        });

        const xLabels = document.createElement('div');
        xLabels.style.display = 'flex';
        xLabels.style.justifyContent = 'space-between';
        xLabels.style.marginTop = '5px';
        xLabels.style.fontSize = '12px';
        xLabels.style.color = '#666';
        years.forEach(year => {
            const label = document.createElement('span');
            label.textContent = year;
            xLabels.appendChild(label);
        });
        wrapper.appendChild(xLabels);

        emissionsChart.appendChild(wrapper);
    }

    // Carbon Intensity Trend (normalized)
    const intensityData = [0.85, 0.82, 0.78];
    const intensityChart = document.getElementById('intensity-trend-chart');
    if (intensityChart) {
        intensityChart.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '200px';

        const yLabel = document.createElement('div');
        yLabel.textContent = '碳強度 (tCO2e/百萬元)';
        yLabel.style.position = 'absolute';
        yLabel.style.left = '0';
        yLabel.style.top = '0';
        yLabel.style.fontSize = '12px';
        yLabel.style.color = '#666';
        yLabel.style.fontWeight = '600';
        wrapper.appendChild(yLabel);

        const chartContainer = document.createElement('div');
        chartContainer.style.width = '100%';
        chartContainer.style.height = '160px';
        chartContainer.style.marginTop = '20px';
        wrapper.appendChild(chartContainer);

        new Sparkline(chartContainer, intensityData, {
            color: '#FF8C00',
            width: 600,
            height: 160,
            showPoints: true,
            pointSize: 5
        });

        const xLabels = document.createElement('div');
        xLabels.style.display = 'flex';
        xLabels.style.justifyContent = 'space-between';
        xLabels.style.marginTop = '5px';
        xLabels.style.fontSize = '12px';
        xLabels.style.color = '#666';
        years.forEach(year => {
            const label = document.createElement('span');
            label.textContent = year;
            xLabels.appendChild(label);
        });
        wrapper.appendChild(xLabels);

        intensityChart.appendChild(wrapper);
    }
}

// ============================================
// 4. INITIALIZATION
// ============================================

function initializeChartComponents() {
    console.log('Initializing chart components...');
    injectChartStyles();
    initializeCharts();
    initializeTrendCharts();
    console.log('Chart components initialized!');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChartComponents);
} else {
    initializeChartComponents();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Sparkline,
        SimpleBarChart,
        SimplePieChart,
        DataTable,
        ComparisonCard,
        ProgressBar,
        StatusTimeline
    };
}
