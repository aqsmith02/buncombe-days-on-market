// Statistical helper functions

export function mean(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function percentile(arr, p) {
    if (arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    return lower === upper
        ? sorted[lower]
        : sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

export function stdDev(arr) {
    if (arr.length === 0) return 0;
    const avg = mean(arr);
    const squareDiffs = arr.map((val) => Math.pow(val - avg, 2));
    return Math.sqrt(mean(squareDiffs));
}

export function mad(arr) {
    if (arr.length === 0) return null;
    const median = percentile(arr, 50);
    const absoluteDeviations = arr.map((x) => Math.abs(x - median));
    return percentile(absoluteDeviations, 50);
}

export function calculateStats(doms) {
    if (doms.length === 0) {
        return {
            count: 0,
            min: 0,
            max: 0,
            mean: 0,
            p25: 0,
            p50: 0,
            p75: 0,
            p90: 0,
            stdDev: 0,
            mad: 0,
        };
    }

    return {
        count: doms.length,
        min: Math.min(...doms),
        max: Math.max(...doms),
        mean: mean(doms).toFixed(1),
        p25: percentile(doms, 25).toFixed(1),
        p50: percentile(doms, 50).toFixed(1),
        p75: percentile(doms, 75).toFixed(1),
        p90: percentile(doms, 90).toFixed(1),
        stdDev: stdDev(doms).toFixed(1),
        mad: mad(doms).toFixed(1),
    };
}

export function getQuartileColor(dom, doms) {
    if (doms.length === 0) return '#999';
    const q1 = percentile(doms, 25);
    const q2 = percentile(doms, 50);
    const q3 = percentile(doms, 75);

    if (dom <= q1) return '#2ecc71'; // green - fast
    if (dom <= q2) return '#f1c40f'; // yellow
    if (dom <= q3) return '#e67e22'; // orange
    return '#e74c3c'; // red - slow
}

export function getDOMBins() {
    return {
        labels: ['0-10 days', '11-20 days', '21-30 days', '31+ days'],
        ranges: [
            [0, 10],
            [11, 20],
            [21, 30],
            [31, Infinity],
        ],
        colors: ['#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'],
    };
}

export function getDOMDistribution(doms) {
    if (doms.length === 0) {
        return [
            { name: 'Q1 (0-25%)', value: 0, color: '#2ecc71' },
            { name: 'Q2 (25-50%)', value: 0, color: '#f1c40f' },
            { name: 'Q3 (50-75%)', value: 0, color: '#e67e22' },
            { name: 'Q4 (75-100%)', value: 0, color: '#e74c3c' },
        ];
    }

    const q1 = percentile(doms, 25);
    const q2 = percentile(doms, 50);
    const q3 = percentile(doms, 75);

    return getDOMDistributionWithQuartiles(doms, q1, q2, q3);
}

export function getDOMDistributionWithQuartiles(doms, q1, q2, q3) {
    if (doms.length === 0) {
        return [
            { name: `Q1 (0-25%, ≤${q1.toFixed(0)}d)`, value: 0, color: '#2ecc71' },
            { name: `Q2 (25-50%, ≤${q2.toFixed(0)}d)`, value: 0, color: '#f1c40f' },
            { name: `Q3 (50-75%, ≤${q3.toFixed(0)}d)`, value: 0, color: '#e67e22' },
            { name: `Q4 (75-100%, >${q3.toFixed(0)}d)`, value: 0, color: '#e74c3c' },
        ];
    }

    const counts = [0, 0, 0, 0];

    doms.forEach((dom) => {
        if (dom <= q1) counts[0]++;
        else if (dom <= q2) counts[1]++;
        else if (dom <= q3) counts[2]++;
        else counts[3]++;
    });

    return [
        { name: `Q1 (0-25%, ≤${q1.toFixed(0)}d)`, value: counts[0], color: '#2ecc71' },
        { name: `Q2 (25-50%, ≤${q2.toFixed(0)}d)`, value: counts[1], color: '#f1c40f' },
        { name: `Q3 (50-75%, ≤${q3.toFixed(0)}d)`, value: counts[2], color: '#e67e22' },
        { name: `Q4 (75-100%, >${q3.toFixed(0)}d)`, value: counts[3], color: '#e74c3c' },
    ];
}

export function getHistogramData(doms) {
    if (doms.length === 0) return [];

    const bins = {};
    const binSize = 10;

    doms.forEach((dom) => {
        const binKey = Math.floor(dom / binSize) * binSize;
        bins[binKey] = (bins[binKey] || 0) + 1;
    });

    return Object.entries(bins)
        .map(([key, count]) => ({
            range: `${key}-${parseInt(key) + binSize}`,
            count: count,
            dom: parseInt(key),
        }))
        .sort((a, b) => a.dom - b.dom);
}
