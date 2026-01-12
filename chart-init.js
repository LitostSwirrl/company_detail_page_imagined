/**
 * 簡單圖表初始化腳本
 * 實現趨勢圖表和減量路徑圖的渲染
 */

document.addEventListener('DOMContentLoaded', function () {
    // 簡單的SVG折線圖渲染函數
    function createLineChart(containerId, data, config) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        const width = container.offsetWidth || 300;
        const height = 200; // 固定高度確保SVG渲染
        const padding = { top: 20, right: 20, bottom: 40, left: 80 }; // 增加 left padding
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // 改進 y 軸範圍計算：從0開始或使用合理範圍避免誇大變化
        const dataMax = Math.max(...data.values);
        const dataMin = Math.min(...data.values);
        const dataRange = dataMax - dataMin;

        // 如果數據變化小於平均值的20%，從0開始以避免誇大變化
        const dataAvg = data.values.reduce((a, b) => a + b, 0) / data.values.length;
        const shouldStartFromZero = dataRange < dataAvg * 0.2;

        const minValue = shouldStartFromZero ? 0 : dataMin;
        const maxValue = dataMax;
        const valueRange = maxValue - minValue || 1;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.style.display = 'block';

        // 計算點位
        const points = data.values.map((value, index) => {
            const x = padding.left + (chartWidth / (data.values.length - 1)) * index;
            const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            return `${x},${y}`;
        }).join(' ');

        // 折線
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points);
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', config.color || '#0066CC');
        polyline.setAttribute('stroke-width', '2');
        svg.appendChild(polyline);

        // Y 軸標籤（顯示5個刻度）
        const yAxisSteps = 5;
        for (let i = 0; i <= yAxisSteps; i++) {
            const value = minValue + (valueRange / yAxisSteps) * i;
            const y = padding.top + chartHeight - (i / yAxisSteps) * chartHeight;

            // Y 軸刻度線
            const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tick.setAttribute('x1', padding.left - 5);
            tick.setAttribute('y1', y);
            tick.setAttribute('x2', padding.left);
            tick.setAttribute('y2', y);
            tick.setAttribute('stroke', '#999');
            tick.setAttribute('stroke-width', '1');
            svg.appendChild(tick);

            // Y 軸標籤文字
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', padding.left - 10);
            label.setAttribute('y', y + 4);
            label.setAttribute('text-anchor', 'end');
            label.setAttribute('font-size', '10');
            label.setAttribute('fill', '#666');

            // 智能格式化：小數顯示2位，大數字用千位分隔符
            let formattedValue;
            if (value < 1 && value > 0) {
                formattedValue = value.toFixed(2);
            } else if (value < 100) {
                formattedValue = value.toFixed(1);
            } else {
                formattedValue = Math.round(value).toLocaleString();
            }
            label.textContent = formattedValue;
            svg.appendChild(label);
        }

        // 數據點
        data.values.forEach((value, index) => {
            const x = padding.left + (chartWidth / (data.values.length - 1)) * index;
            const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', config.color || '#0066CC');
            svg.appendChild(circle);

            // 年份標籤
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', height - 10);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', '#666');
            text.textContent = data.labels[index];
            svg.appendChild(text);
        });

        container.innerHTML = '';
        container.appendChild(svg);
        console.log(`Chart ${containerId} rendered successfully`);
    }

    // 創建減量路徑面積圖（參考圖片風格）
    function createReductionPathway() {
        const container = document.getElementById('reduction-pathway-chart');
        if (!container) return;

        // 基準年 2019: 22,100,460
        // 2030 目標: 減25% = 16,575,345
        // 2050 目標: 淨零 = 0
        const years = [2019, 2022, 2024, 2030, 2040, 2050];
        const bau = [100, 100, 100, 100, 100, 100]; // BAU假設維持2019-2024水平（無減量措施）
        const target = [100, 89, 85, 75, 40, 0]; // 實際減量目標（2019基準年為100%）

        const width = container.offsetWidth || 800;
        const height = 300;
        const padding = { top: 40, right: 60, left: 60, bottom: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.style.background = '#f9f9f9';

        // 標題
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', width / 2);
        title.setAttribute('y', 25);
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-size', '16');
        title.setAttribute('font-weight', 'bold');
        title.setAttribute('fill', '#333');
        title.textContent = '企業溫室氣體年排放量趨勢與減量目標';
        svg.appendChild(title);

        // 計算路徑點（Y軸縮放改為 /100 確保100%正確顯示）
        const bauPoints = bau.map((value, i) => {
            const x = padding.left + (chartWidth / (years.length - 1)) * i;
            const y = padding.top + chartHeight - (value / 100) * chartHeight; // 改為 /100
            return `${x},${y}`;
        }).join(' ');

        const targetPoints = target.map((value, i) => {
            const x = padding.left + (chartWidth / (years.length - 1)) * i;
            const y = padding.top + chartHeight - (value / 100) * chartHeight; // 改為 /100
            return [x, y];
        });

        // 面積填充（從BAU到目標線之間）
        const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = `M ${targetPoints[0][0]},${targetPoints[0][1]}`;
        targetPoints.forEach(([x, y]) => d += ` L ${x},${y}`);
        d += ` L ${padding.left + chartWidth},${padding.top + chartHeight}`;
        d += ` L ${padding.left},${padding.top + chartHeight} Z`;
        areaPath.setAttribute('d', d);
        areaPath.setAttribute('fill', '#b8d4a8');
        areaPath.setAttribute('opacity', '0.6');
        svg.appendChild(areaPath);

        // BAU 線（虛線）
        const bauLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        bauLine.setAttribute('points', bauPoints);
        bauLine.setAttribute('fill', 'none');
        bauLine.setAttribute('stroke', '#666');
        bauLine.setAttribute('stroke-width', '2');
        bauLine.setAttribute('stroke-dasharray', '5,5');
        svg.appendChild(bauLine);

        // 目標線（實線）
        const targetLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        targetLine.setAttribute('points', targetPoints.map(p => p.join(',')).join(' '));
        targetLine.setAttribute('fill', 'none');
        targetLine.setAttribute('stroke', '#2e6930');
        targetLine.setAttribute('stroke-width', '3');
        svg.appendChild(targetLine);

        // X軸標籤
        years.forEach((year, i) => {
            const x = padding.left + (chartWidth / (years.length - 1)) * i;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', height - 20);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', '#333');
            text.textContent = year;
            svg.appendChild(text);
        });

        // Y軸標籤（百分比 - 10% 間隔）
        const yAxisValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        yAxisValues.forEach(percent => {
            const y = padding.top + chartHeight - (percent / 100) * chartHeight;

            // 刻度線
            const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tick.setAttribute('x1', padding.left - 5);
            tick.setAttribute('y1', y);
            tick.setAttribute('x2', padding.left);
            tick.setAttribute('y2', y);
            tick.setAttribute('stroke', '#999');
            tick.setAttribute('stroke-width', '1');
            svg.appendChild(tick);

            // 百分比文字
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', padding.left - 10);
            text.setAttribute('y', y + 4);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('font-size', '11');
            text.setAttribute('fill', '#666');
            text.textContent = `${percent}%`;
            svg.appendChild(text);

            // 網格線（淡色）
            if (percent > 0 && percent < 100) {
                const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                gridLine.setAttribute('x1', padding.left);
                gridLine.setAttribute('y1', y);
                gridLine.setAttribute('x2', padding.left + chartWidth);
                gridLine.setAttribute('y2', y);
                gridLine.setAttribute('stroke', '#e0e0e0');
                gridLine.setAttribute('stroke-width', '1');
                gridLine.setAttribute('stroke-dasharray', '2,2');
                svg.appendChild(gridLine);
            }
        });

        // 圖例
        const legendY = height - 15;
        // BAU
        const bauLegendLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        bauLegendLine.setAttribute('x1', width - 180);
        bauLegendLine.setAttribute('y1', legendY);
        bauLegendLine.setAttribute('x2', width - 150);
        bauLegendLine.setAttribute('y2', legendY);
        bauLegendLine.setAttribute('stroke', '#666');
        bauLegendLine.setAttribute('stroke-width', '2');
        bauLegendLine.setAttribute('stroke-dasharray', '5,5');
        svg.appendChild(bauLegendLine);

        const bauText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        bauText.setAttribute('x', width - 145);
        bauText.setAttribute('y', legendY + 4);
        bauText.setAttribute('font-size', '11');
        bauText.setAttribute('fill', '#333');
        bauText.textContent = 'BAU';
        svg.appendChild(bauText);

        // 減量目標
        const targetLegendLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        targetLegendLine.setAttribute('x1', width - 110);
        targetLegendLine.setAttribute('y1', legendY);
        targetLegendLine.setAttribute('x2', width - 80);
        targetLegendLine.setAttribute('y2', legendY);
        targetLegendLine.setAttribute('stroke', '#2e6930');
        targetLegendLine.setAttribute('stroke-width', '2');
        svg.appendChild(targetLegendLine);

        const targetText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        targetText.setAttribute('x', width - 75);
        targetText.setAttribute('y', legendY + 4);
        targetText.setAttribute('font-size', '11');
        targetText.setAttribute('fill', '#333');
        targetText.textContent = '減量目標';
        svg.appendChild(targetText);

        container.innerHTML = '';
        container.appendChild(svg);
    }

    // 初始化所有圖表
    setTimeout(() => {
        // 趨勢圖表 - 碳排放量
        createLineChart('emissions-trend-chart', {
            labels: ['2022', '2023', '2024'],
            values: [19630736, 18066406, 18753412]
        }, { color: '#dc3545' });

        // 趨勢圖表 - 碳強度
        createLineChart('intensity-trend-chart', {
            labels: ['2022', '2023', '2024'],
            values: [0.85, 0.82, 0.78]
        }, { color: '#fd7e14' });

        // 趨勢圖表 - 用電量
        createLineChart('energy-trend-chart', {
            labels: ['2022', '2023', '2024'],
            values: [2450000000, 2465000000, 2478844444]
        }, { color: '#0d6efd' });

        // 趨勢圖表 - 再生能源裝置量
        createLineChart('re-capacity-trend-chart', {
            labels: ['2022', '2023', '2024'],
            values: [350, 440, 529]
        }, { color: '#198754' });

        // 趨勢圖表 - 燃煤量
        createLineChart('coal-trend-chart', {
            labels: ['2022', '2023', '2024'],
            values: [15250000, 14890000, 14520000]
        }, { color: '#6c757d' });

        // 減量路徑圖
        createReductionPathway();
    }, 100);
});
