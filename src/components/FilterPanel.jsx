import React from 'react';

export default function FilterPanel({ priceRanges, seasons, onPriceRangeChange, onSeasonChange }) {
    const priceRangeOptions = [
        { id: '500k', label: '$500K–$1M' },
        { id: '1m+', label: '$1M+' },
    ];

    const seasonOptions = [
        { id: 'jan_mar', label: 'Jan–Mar' },
        { id: 'april_june', label: 'Apr–Jun' },
        { id: 'july_sep', label: 'Jul–Sep' },
        { id: 'oct_dec', label: 'Oct–Dec' },
        { id: 'unsold', label: 'Unsold' },
    ];

    const handlePriceRangeChange = (id) => {
        const updated = priceRanges.includes(id)
            ? priceRanges.filter((p) => p !== id)
            : [...priceRanges, id];
        onPriceRangeChange(updated);
    };

    const handleSeasonChange = (id) => {
        const updated = seasons.includes(id)
            ? seasons.filter((s) => s !== id)
            : [...seasons, id];
        onSeasonChange(updated);
    };

    return (
        <div className="filter-panel">
            <h3>Filters</h3>

            <div className="filter-group">
                <h4>Price Range</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {priceRangeOptions.map((option) => (
                        <label key={option.id} style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                            <input
                                type="checkbox"
                                checked={priceRanges.includes(option.id)}
                                onChange={() => handlePriceRangeChange(option.id)}
                                style={{ marginRight: '6px' }}
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h4>Season</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {seasonOptions.map((option) => (
                        <label key={option.id} style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                            <input
                                type="checkbox"
                                checked={seasons.includes(option.id)}
                                onChange={() => handleSeasonChange(option.id)}
                                style={{ marginRight: '6px' }}
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
