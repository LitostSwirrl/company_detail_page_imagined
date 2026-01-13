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
        const height = 200;
        const padding = { top: 20, right: 20, bottom: 40, left: 80 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // 統一從 0 開始，使用整數刻度
        const dataMax = Math.max(...data.values);
        const minValue = 0;

        // 計算合適的最大值（四捨五入到整數）
        let maxValue;
        if (dataMax >= 1000000000) {
            // 十億級：四捨五入到億（100,000,000）
            maxValue = Math.ceil(dataMax / 100000000) * 100000000;
        } else if (dataMax >= 1000000) {
            // 百萬級：四捨五入到百萬
            maxValue = Math.ceil(dataMax / 1000000) * 1000000;
        } else if (dataMax >= 10000) {
            // 萬級：四捨五入到萬
            maxValue = Math.ceil(dataMax / 10000) * 10000;
        } else if (dataMax >= 100) {
            // 百級：四捨五入到百
            maxValue = Math.ceil(dataMax / 100) * 100;
        } else {
            // 十級：四捨五入到十
            maxValue = Math.ceil(dataMax / 10) * 10;
        }

        const valueRange = maxValue - minValue || 1;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.style.display = 'block';

        // 計算點位並保存數據值
        const pointsData = data.values.map((value, index) => {
            const x = padding.left + (chartWidth / (data.values.length - 1)) * index;
            const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            return { x, y, value, label: data.labels[index] };
        });

        // 創建 tooltip
        const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tooltip.setAttribute('id', `tooltip-${containerId}`);
        tooltip.setAttribute('opacity', '0');
        tooltip.setAttribute('pointer-events', 'none');

        const tooltipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        tooltipRect.setAttribute('fill', 'rgba(0, 0, 0, 0.8)');
        tooltipRect.setAttribute('rx', '4');
        tooltip.appendChild(tooltipRect);

        const tooltipText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tooltipText.setAttribute('fill', 'white');
        tooltipText.setAttribute('font-size', '12');
        tooltip.appendChild(tooltipText);

        svg.appendChild(tooltip);

        // 折線
        const points = pointsData.map(p => `${p.x},${p.y}`).join(' ');
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points);
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', config.color || '#0066CC');
        polyline.setAttribute('stroke-width', '2');
        svg.appendChild(polyline);

        // Y 軸標籤（顯示5個刻度，使用整數）
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

            // 格式化為整數
            let formattedValue;
            if (value < 1 && value > 0) {
                formattedValue = value.toFixed(2);
            } else {
                formattedValue = Math.round(value).toLocaleString();
            }
            label.textContent = formattedValue;
            svg.appendChild(label);
        }

        // 數據點 + hover 功能
        pointsData.forEach((point, index) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', config.color || '#0066CC');
            circle.setAttribute('style', 'cursor: pointer;');

            // Hover 事件
            circle.addEventListener('mouseenter', function () {
                // 顯示 tooltip
                const formattedValue = point.value.toLocaleString();
                const unit = config.unit || '';
                tooltipText.textContent = `${point.label}年: ${formattedValue}${unit ? ' ' + unit : ''}`;

                // 先設置位置再取得 bbox
                tooltipText.setAttribute('x', point.x);
                tooltipText.setAttribute('y', point.y - 15);
                tooltipText.setAttribute('text-anchor', 'middle');

                // 取得 bbox 後設置背景框
                setTimeout(() => {
                    const bbox = tooltipText.getBBox();
                    tooltipRect.setAttribute('x', bbox.x - 8);
                    tooltipRect.setAttribute('y', bbox.y - 4);
                    tooltipRect.setAttribute('width', bbox.width + 16);
                    tooltipRect.setAttribute('height', bbox.height + 8);
                }, 0);

                tooltip.setAttribute('opacity', '1');

                // 放大圓點
                circle.setAttribute('r', '6');
            });

            circle.addEventListener('mouseleave', function () {
                tooltip.setAttribute('opacity', '0');
                circle.setAttribute('r', '4');
            });

            svg.appendChild(circle);

            // 年份標籤
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', point.x);
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

        // 基準年 2019: 22,100,460 公噸 CO2e (100%)
        // 實際數據：
        // 2022: 19,630,736 (88.8%)
        // 2024: 18,753,412 (84.9%)
        // 計算 2019-2024 的平均年成長率
        const baselineEmissions = 22100460; // 2019
        const emission2024 = 18753412;

        // 計算 2019-2024 線性斜率（每年約減少 3.01%）
        const pct2024 = (emission2024 / baselineEmissions) * 100; // 84.87%
        const yearlyChange = (pct2024 - 100) / (2024 - 2019); // 約 -3.026% per year

        // BAU 路徑：延續 2019-2024 趨勢（完全線性）
        const years = [2019, 2022, 2024, 2030, 2040, 2050];
        const bau = years.map(year => 100 + yearlyChange * (year - 2019));

        // 目標路徑
        const target = [100, 89, 85, 75, 40, 0];

        // 計算動態 y 軸範圍（可能超過 100%）
        const allValues = [...bau, ...target];
        const maxPct = Math.max(...allValues);
        const minPct = Math.min(...allValues, 0);
        const yAxisMax = Math.ceil(maxPct / 10) * 10; // 四捨五入到 10
        const yAxisMin = Math.floor(minPct / 10) * 10;

        const width = container.offsetWidth || 800;
        const height = 350;
        const padding = { top: 40, right: 60, left: 60, bottom: 60 };
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

        //創建 tooltip
        const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tooltip.setAttribute('id', 'tooltip-reduction');
        tooltip.setAttribute('opacity', '0');
        tooltip.setAttribute('pointer-events', 'none');

        const tooltipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        tooltipRect.setAttribute('fill', 'rgba(0, 0, 0, 0.8)');
        tooltipRect.setAttribute('rx', '4');
        tooltip.appendChild(tooltipRect);

        const tooltipText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tooltipText.setAttribute('fill', 'white');
        tooltipText.setAttribute('font-size', '11');
        tooltip.appendChild(tooltipText);

        svg.appendChild(tooltip);

        // 計算路徑點（使用動態 y 軸）
        const yRange = yAxisMax - yAxisMin;
        const bauPointsData = bau.map((value, i) => {
            const x = padding.left + (chartWidth / (years.length - 1)) * i;
            const y = padding.top + chartHeight - ((value - yAxisMin) / yRange) * chartHeight;
            return { x, y, value, year: years[i] };
        });

        const targetPointsData = target.map((value, i) => {
            const x = padding.left + (chartWidth / (years.length - 1)) * i;
            const y = padding.top + chartHeight - ((value - yAxisMin) / yRange) * chartHeight;
            return { x, y, value, year: years[i] };
        });

        // 面積填充（從目標線到底部）
        const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = `M ${targetPointsData[0].x},${targetPointsData[0].y}`;
        targetPointsData.forEach(p => d += ` L ${p.x},${p.y}`);
        d += ` L ${padding.left + chartWidth},${padding.top + chartHeight}`;
        d += ` L ${padding.left},${padding.top + chartHeight} Z`;
        areaPath.setAttribute('d', d);
        areaPath.setAttribute('fill', '#b8d4a8');
        areaPath.setAttribute('opacity', '0.6');
        svg.appendChild(areaPath);

        // BAU 線（虛線）
        const bauLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        bauLine.setAttribute('points', bauPointsData.map(p => `${p.x},${p.y}`).join(' '));
        bauLine.setAttribute('fill', 'none');
        bauLine.setAttribute('stroke', '#666');
        bauLine.setAttribute('stroke-width', '2');
        bauLine.setAttribute('stroke-dasharray', '5,5');
        svg.appendChild(bauLine);

        // 目標線（實線）
        const targetLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        targetLine.setAttribute('points', targetPointsData.map(p => `${p.x},${p.y}`).join(' '));
        targetLine.setAttribute('fill', 'none');
        targetLine.setAttribute('stroke', '#2e6930');
        targetLine.setAttribute('stroke-width', '3');
        svg.appendChild(targetLine);

        // BAU 數據點 + hover
        bauPointsData.forEach(point => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', '#666');
            circle.setAttribute('style', 'cursor: pointer;');

            circle.addEventListener('mouseenter', function () {
                tooltipText.textContent = `BAU路徑 ${point.year}年: ${point.value.toFixed(1)}%`;
                positionTooltip(point.x, point.y);
                tooltip.setAttribute('opacity', '1');
                circle.setAttribute('r', '6');
            });

            circle.addEventListener('mouseleave', function () {
                tooltip.setAttribute('opacity', '0');
                circle.setAttribute('r', '4');
            });

            svg.appendChild(circle);
        });

        // 目標數據點 + hover
        targetPointsData.forEach(point => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);
            circle.setAttribute('r', '5');
            circle.setAttribute('fill', '#2e6930');
            circle.setAttribute('style', 'cursor: pointer;');

            circle.addEventListener('mouseenter', function () {
                tooltipText.textContent = `減量目標 ${point.year}年: ${point.value}%`;
                positionTooltip(point.x, point.y);
                tooltip.setAttribute('opacity', '1');
                circle.setAttribute('r', '7');
            });

            circle.addEventListener('mouseleave', function () {
                tooltip.setAttribute('opacity', '0');
                circle.setAttribute('r', '5');
            });

            svg.appendChild(circle);
        });

        function positionTooltip(x, y) {
            // 先設置位置
            tooltipText.setAttribute('x', x);
            tooltipText.setAttribute('y', y - 15);
            tooltipText.setAttribute('text-anchor', 'middle');

            // 再取得 bbox 並設置背景框
            setTimeout(() => {
                const bbox = tooltipText.getBBox();
                tooltipRect.setAttribute('x', bbox.x - 8);
                tooltipRect.setAttribute('y', bbox.y - 4);
                tooltipRect.setAttribute('width', bbox.width + 16);
                tooltipRect.setAttribute('height', bbox.height + 8);
            }, 0);
        }

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

        // Y軸標籤（動態範圍）
        const yAxisValues = [];
        for (let i = yAxisMin; i <= yAxisMax; i += 10) {
            yAxisValues.push(i);
        }

        yAxisValues.forEach(percent => {
            const y = padding.top + chartHeight - ((percent - yAxisMin) / yRange) * chartHeight;

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
            if (percent !== yAxisMin && percent !== yAxisMax) {
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
        }, { color: '#dc3545', unit: '公噸CO2e' });

        // 趨勢圖表 - 碳強度
        createLineChart('intensity-trend-chart', {
            labels: ['2022', '2023', '2024'],
            values: [0.85, 0.82, 0.78]
        }, { color: '#fd7e14', unit: 'tCO2e/百萬元' });

        // 趨勢圖表 - 用電量
        createLineChart('energy-trend-chart', {
            labels: ['2022', '2023', '2024'],
            values: [2450000000, 2465000000, 2478844444]
        }, { color: '#0d6efd', unit: 'kWh' });

        // 趨勢圖表 - 再生能源裝置量
        createLineChart('re-capacity-trend-chart', {
            labels: ['2022', '2023', '2024'],
            values: [350, 440, 529]
        }, { color: '#198754', unit: 'MW' });

        // 趨勢圖表 - 燃煤量
        createLineChart('coal-trend-chart', {
            labels: ['2022', '2023', '2024'],
            values: [15250000, 14890000, 14520000]
        }, { color: '#6c757d', unit: '公噸' });

        // 減量路徑圖
        createReductionPathway();
    }, 100);
});
