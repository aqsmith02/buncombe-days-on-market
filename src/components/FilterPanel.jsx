import React from 'react';

export default function FilterPanel({ selected, onToggle, onRadiusChange, radiusValue }) {
    const datasets = [
        { value: '500k_to_1m_jan_mar.json', label: '$500K–$1M Jan–Mar' },
        { value: '500k_to_1m_april_june.json', label: '$500K–$1M April–June' },
        { value: '500k_to_1m_july_sep.json', label: '$500K–$1M July–Sep' },
        { value: '500k_to_1m_oct_dec.json', label: '$500K–$1M Oct–Dec' },
        { value: '500k_to_1m_unsold.json', label: '$500K–$1M Unsold (≥90 DOM)' },
        { value: '1m_plus_jan_mar.json', label: '$1M+ Jan–Mar' },
        { value: '1m_plus_april_june.json', label: '$1M+ April–June' },
        { value: '1m_plus_july_sep.json', label: '$1M+ July–Sep' },
        { value: '1m_plus_oct_dec.json', label: '$1M+ Oct–Dec' },
        { value: '1m_plus_unsold.json', label: '$1M+ Unsold (≥90 DOM)' },
    ];

    return (
        <div className="filter-panel">
            <h3>Data Filters</h3>

            <div className="filter-group">
                <label style={{ marginBottom: '12px', display: 'block' }}>
                    <strong>Toggle All</strong>
                    <input
                        type="checkbox"
                        checked={selected.length === datasets.length}
                        onChange={(e) => {
                            if (e.target.checked) {
                                onToggle(datasets.map((d) => d.value));
                            } else {
                                onToggle([]);
                            }
                        }}
                        style={{ marginLeft: '8px' }}
                    />
                </label>
            </div>

            <div className="filter-group">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {datasets.map((ds) => (
                        <label key={ds.value} style={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                value={ds.value}
                                checked={selected.includes(ds.value)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        onToggle([...selected, ds.value]);
                                    } else {
                                        onToggle(selected.filter((s) => s !== ds.value));
                                    }
                                }}
                                style={{ marginRight: '6px' }}
                            />
                            {ds.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h4>Radius Filter</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Enter address"
                        style={{ flex: 1, minWidth: '150px', padding: '6px' }}
                    />
                    <input
                        type="number"
                        placeholder="Radius (miles)"
                        value={radiusValue}
                        onChange={(e) => onRadiusChange(parseFloat(e.target.value) || 0)}
                        step="0.1"
                        style={{ width: '120px', padding: '6px' }}
                    />
                    <button style={{ padding: '6px 12px' }}>Apply</button>
                    <button style={{ padding: '6px 12px' }}>Clear</button>
                </div>
            </div>
        </div>
    );
}
