/**
 * Climate Data Dashboard - Interactive Features
 * Handles node tracker interactions, category navigation, and UI enhancements
 */

// ============================================
// 1. NODE TRACKER FUNCTIONALITY
// ============================================

class NodeTracker {
    constructor(trackerElement) {
        this.tracker = trackerElement;
        this.nodes = this.tracker.querySelectorAll('.node');
        this.metric = this.tracker.dataset.metric || 'unknown';
        // Only initialize interactive features if not binary or explicitly allowed
        if (!this.tracker.classList.contains('binary-tracker') &&
            !this.tracker.classList.contains('static-tracker')) {
            // For now, all trackers are static - no interactive selection
        }
    }

    init() {
        // Interactive selection is disabled - trackers are static/display-only
    }
}

// Initialize all node trackers
function initializeNodeTrackers() {
    const trackers = document.querySelectorAll('.node-tracker');
    trackers.forEach(tracker => {
        new NodeTracker(tracker);
    });
}

// ============================================
// 2. CATEGORY NAVIGATION
// ============================================

class CategoryNavigation {
    constructor() {
        this.navItems = document.querySelectorAll('.category-nav-item');
        this.sections = document.querySelectorAll('.climate-section');
        this.scrollUpdateDisabled = false;
        this.init();
    }

    init() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Highlight active section on scroll
        window.addEventListener('scroll', () => this.updateActiveNav());
    }

    handleNavClick(e) {
        const sectionId = e.currentTarget.dataset.section;
        const section = document.getElementById(sectionId);

        if (section) {
            // Update active nav item
            this.navItems.forEach(item => item.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Disable scroll-based navigation temporarily
            this.scrollUpdateDisabled = true;

            // Scroll to section
            const headerHeight = document.querySelector('.dashboard-header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Re-enable scroll-based navigation after animation completes
            setTimeout(() => {
                this.scrollUpdateDisabled = false;
            }, 1000);
        }
    }

    updateActiveNav() {
        // Skip if disabled (during manual navigation)
        if (this.scrollUpdateDisabled) {
            return;
        }

        let currentSection = null;
        const headerHeight = document.querySelector('.dashboard-header').offsetHeight;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section;
            }
        });

        if (currentSection) {
            this.navItems.forEach(item => item.classList.remove('active'));
            const activeNav = document.querySelector(
                `.category-nav-item[data-section="${currentSection.id}"]`
            );
            if (activeNav) {
                activeNav.classList.add('active');
            }
        }
    }
}

// ============================================
// 3. EXPANDABLE TEXT DESCRIPTIONS
// ============================================

class ExpandableText {
    constructor() {
        this.expandables = document.querySelectorAll('.text-description.expandable');
        this.init();
    }

    init() {
        this.expandables.forEach(expandable => {
            const btn = expandable.querySelector('.expand-btn');
            if (btn) {
                btn.addEventListener('click', (e) => this.toggleExpand(e, expandable, btn));
            }
        });
    }

    toggleExpand(e, expandable, btn) {
        e.preventDefault();
        expandable.classList.toggle('expanded');

        if (expandable.classList.contains('expanded')) {
            btn.textContent = '收起';
        } else {
            btn.textContent = '展開全文';
        }
    }
}

// ============================================
// 4. HELP ICONS & TOOLTIPS
// ============================================

class HelpTooltip {
    constructor() {
        this.helpIcons = document.querySelectorAll('.help-icon');
        this.init();
    }

    init() {
        this.helpIcons.forEach(icon => {
            // Tooltip is already provided via title attribute
            // This class is here for future enhancements
            icon.setAttribute('role', 'tooltip');
            icon.setAttribute('aria-label', icon.getAttribute('title') || '幫助');
        });
    }
}

// ============================================
// 5. FORM CONTROLS
// ============================================

class FormControls {
    constructor() {
        this.yearFilter = document.querySelector('.year-filter');
        this.comparisonBtn = document.querySelector('.comparison-btn');
        this.downloadBtn = document.querySelector('.download-btn');
        this.init();
    }

    init() {
        if (this.yearFilter) {
            this.yearFilter.addEventListener('change', (e) => this.handleYearChange(e));
        }

        if (this.comparisonBtn) {
            this.comparisonBtn.addEventListener('click', (e) => this.handleComparison(e));
        }

        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', (e) => this.handleDownload(e));
        }
    }

    handleYearChange(e) {
        const selectedYear = e.target.value;
        console.log(`Year changed to: ${selectedYear}`);
        // TODO: Implement year filter functionality
        // This would trigger data loading for the selected year
    }

    handleComparison(e) {
        e.preventDefault();
        console.log('Comparison button clicked');
        // TODO: Implement comparison functionality
        // This could open a modal to select companies for comparison
    }

    handleDownload(e) {
        e.preventDefault();
        console.log('Download button clicked');
        // TODO: Implement download functionality
        // This could export data to CSV or PDF
    }
}

// ============================================
// 6. KEYBOARD ACCESSIBILITY
// ============================================

class KeyboardAccessibility {
    constructor() {
        this.init();
    }

    init() {
        // Make nodes keyboard focusable
        const nodes = document.querySelectorAll('.node');
        nodes.forEach(node => {
            if (!node.hasAttribute('tabindex')) {
                node.setAttribute('tabindex', '0');
            }
        });

        // Close tooltip on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Handle escape key if needed
            }
        });
    }
}

// ============================================
// 7. THEME TOGGLE (Future Enhancement)
// ============================================

class ThemeToggle {
    constructor() {
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.init();
    }

    init() {
        // Respect user's system preference
        if (this.prefersDark.matches) {
            // Could implement dark mode in the future
        }

        // Listen for changes
        this.prefersDark.addEventListener('change', () => {
            // Handle theme change
        });
    }
}

// ============================================
// 8. PERFORMANCE MONITORING
// ============================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log page load time
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        });
    }
}

// ============================================
// 9. ANALYTICS & TRACKING (Placeholder)
// ============================================

class Analytics {
    constructor() {
        this.init();
    }

    init() {
        // Track interactions (placeholder for future analytics implementation)
        document.addEventListener('nodeSelected', (e) => {
            this.trackEvent('node_selected', e.detail);
        });
    }

    trackEvent(eventName, data) {
        console.log(`Analytics: ${eventName}`, data);
        // TODO: Implement analytics tracking
        // This could send data to Google Analytics, Mixpanel, etc.
    }
}

// ============================================
// 9.5 TRENDS TAB SWITCHING
// ============================================

class TrendsTabSwitcher {
    constructor() {
        this.tabs = document.querySelectorAll('.trend-tab');
        this.charts = document.querySelectorAll('.trend-chart');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTrend(e, tab));
        });
    }

    switchTrend(e, tab) {
        e.preventDefault();
        const trendId = tab.dataset.trend;

        // Update active tab
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update visible chart
        this.charts.forEach(chart => {
            chart.classList.remove('active');
            if (chart.dataset.trend === trendId) {
                chart.classList.add('active');
            }
        });
    }
}

// ============================================
// 10. INITIALIZATION
// ============================================

function initializeDashboard() {
    console.log('Initializing Climate Data Dashboard...');

    // Initialize all components
    initializeNodeTrackers();
    new CategoryNavigation();
    new ExpandableText();
    new HelpTooltip();
    new FormControls();
    new KeyboardAccessibility();
    new ThemeToggle();
    new PerformanceMonitor();
    new Analytics();
    new TrendsTabSwitcher();

    console.log('Dashboard initialization complete!');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    initializeDashboard();
}

// ============================================
// 11. UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format number with locale-specific formatting
 */
function formatNumber(num, locale = 'zh-TW') {
    return new Intl.NumberFormat(locale).format(num);
}

/**
 * Parse metric data for visualization
 */
function parseMetricValue(value, type = 'text') {
    switch (type) {
        case 'number':
            return parseInt(value, 10);
        case 'percentage':
            return parseFloat(value);
        case 'date':
            return new Date(value);
        default:
            return value;
    }
}

// ============================================
// 12. EXPORT FOR POTENTIAL MODULE USAGE
// ============================================

// For future module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NodeTracker,
        CategoryNavigation,
        ExpandableText,
        HelpTooltip,
        FormControls,
        KeyboardAccessibility,
        debounce,
        formatNumber,
        parseMetricValue
    };
}
